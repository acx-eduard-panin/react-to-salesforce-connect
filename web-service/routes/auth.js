const { Router } = require('express');
const router = Router();
const jsforce = require('jsforce');
const authUtil = require('../services/auth-util');


const oauth2 = new jsforce.OAuth2({
	loginUrl: process.env.domain,
	clientId: process.env.consumerKey,
	clientSecret: process.env.consumerSecret,
	redirectUri: process.env.callbackUrl
});

/**
 * @swagger
 * /auth/login:
 *   post:
 *     summary: Redirect to Salesforce login/authorization page
 *     tags:
 *       - auth
 *     produces:
 *       - application/json
 *     responses:
 *       200:
 *         description: Success!
 */
router.get('/login', function (request, response) {
	response.redirect(oauth2.getAuthorizationUrl({ scope: 'api' }));
});

/**
 * @swagger
 * /auth/callback:
 *   post:
 *     summary: Login callback endpoint (only called by Salesforce)
 *     tags:
 *       - auth
 *     produces:
 *       - application/json
 *     responses:
 *       200:
 *         description: Success!
 */
router.get('/callback', function (request, response) {
	if (!request.query.code) {
		const {error_description} = request.query;
		response.status(500).send(`Failed to get authorization code from server callback. Details: ${error_description}`);
		return;
	}

	const conn = new jsforce.Connection({
		oauth2: oauth2,
		version: process.env.apiVersion
	});
	conn.authorize(request.query.code, function (error, userInfo) {
		if (error) {
			console.log('Salesforce authorization error: ' + JSON.stringify(error));
			response.status(500).json(error);
			return;
		}

		// Store oauth session data in server (never expose it directly to client)
		request.session.sfdcAuth = {
			instanceUrl: conn.instanceUrl,
			accessToken: conn.accessToken
		};
		// Redirect to app main page
		return response.redirect('/index.html');
	});
});

/**
 * @swagger
 * /auth/userInfo:
 *   post:
 *     summary: Endpoint for retrieving currently connected user
 *     tags:
 *       - auth
 *     produces:
 *       - application/json
 *     responses:
 *       200:
 *         description: Success!
 */
router.get('/userInfo', function(request, response) {
	const session = authUtil.getSession(request, response);
	if (session == null) {
		return;
	}

	// Request session info from Salesforce
	const conn = authUtil.resumeSalesforceConnection(session);
	conn.identity(function(error, res) {
		response.send(res);
	});
});

/**
 * @swagger
 * /auth/logout:
 *   post:
 *     summary: Logout endpoint
 *     tags:
 *       - auth
 *     produces:
 *       - application/json
 *     responses:
 *       200:
 *         description: Success!
 */
router.get('/logout', function(request, response) {
	const session = authUtil.getSession(request, response);
	if (session == null) return;

	// Revoke OAuth token
	const conn = authUtil.resumeSalesforceConnection(session);
	conn.logout(function(error) {
		if (error) {
			console.error('Salesforce OAuth revoke error: ' + JSON.stringify(error));
			response.status(500).json(error);
			return;
		}

		// Destroy server-side session
		session.destroy(function(error) {
			if (error) {
				console.error('Salesforce session destruction error: ' + JSON.stringify(error));
			}
		});

		// Redirect to app main page
		return response.redirect('/index.html');
	});
});



module.exports = router;
