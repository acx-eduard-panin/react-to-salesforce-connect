const jsforce = require('jsforce');

module.exports = {
	getSession(request, response) {
		const session = request.session;
		if (!session.sfdcAuth) {
			response.status(401).send('No active session');
			return null;
		}
		return session;
	},
	resumeSalesforceConnection(session) {
		return new jsforce.Connection({
			instanceUrl: session.sfdcAuth.instanceUrl,
			accessToken: session.sfdcAuth.accessToken,
			version: process.env.apiVersion
		});
	}
}
