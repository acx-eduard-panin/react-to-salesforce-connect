const { Router } = require('express');
const router = Router();
const authUtil = require('../services/auth-util');

/**
 * @swagger
 * /data/query:
 *   get:
 *     summary: Get Data from SF
 *     tags:
 *       - record
 *     produces:
 *       - application/json
 *     responses:
 *       200:
 *         description: SF Data
 */
router.get('/query', function (request, response) {
	const session = authUtil.getSession(request, response);
	if (!session) {
		return;
	}

	const query = request.query.q;
	if (!query) {
		response.status(400).send('Missing query parameter.');
		return;
	}

	const conn = authUtil.resumeSalesforceConnection(session);
	conn.query(query, function (error, result) {
		if (error) {
			console.error('Salesforce data API error: ' + JSON.stringify(error));
			response.status(500).json(error);
			return;
		} else {
			response.send(result);
			return;
		}
	});
});

/**
 * @swagger
 * /data/create/{objectType}:
 *   get:
 *     summary: Get Data from SF
 *     tags:
 *       - record
 *     produces:
 *       - application/json
 *     responses:
 *       200:
 *         description: SF Data
 */
router.post('/create/:objectType', function (request, response) {
	const session = authUtil.getSession(request, response);
	if (!session) {
		return;
	}

	const { params, body } = request;
	if (!params.objectType || !body) {
		response.status(400).send('Missing parameters.');
		return;
	}

	const conn = authUtil.resumeSalesforceConnection(session);
	conn.sobject(params.objectType).create(body, function(err, ret) {
		if (err || !ret.success) { return console.error(err, ret); }
		console.log("Created record id : " + ret.id);
		response.status(200).json(ret);
	});
});

module.exports = router;
