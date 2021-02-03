const React = require('react');
const QueryForm = require('./QueryForm.js');
const QueryResults = require('./QueryResults.js');
const LoginPanel = require('./LoginPanel.js');
const NavBar = require('./NavBar.js');
const AccountForm = require('./AccountForm.js');

const App = module.exports = React.createClass({
	getInitialState: function () {
		return { user: null };
	},

	componentDidMount: function () {
		fetch('/auth/userInfo', {
			method: 'get',
			headers: { Accept: 'application/json', 'Content-Type': 'application/json' }
		})
			.then((response) => {
				if (response.ok) {
					response.json().then((json) => {
						this.setState({ user: json });
					});
				} else {
					console.error('Failed to retrieve logged user.', JSON.stringify(response));
				}
			});
	},

	handleAccountSave: function (data) {
		// Send SOQL query to server
		console.log(data);
		const queryUrl = '/data/create/Account';
		fetch(queryUrl, {
			headers: { Accept: 'application/json', 'Content-Type': 'application/json' },
			cache: 'no-store',
			method: 'POST',
			body: JSON.stringify({ Name: data.name })
		})
			.then((response) => {
				response.json().then((json) => {
					if (response.ok) {
						this.setState({ result: JSON.stringify(json, null, 2) });
					} else {
						this.setState({ result: 'Failed to retrieve query result.' });
					}
				});
			});
	},

	handleQueryExecution: function (data) {
		// Send SOQL query to server
		const queryUrl = 'data/query?q=' + encodeURI(data.query);
		fetch(queryUrl, { headers: { Accept: 'application/json' }, cache: 'no-store' })
			.then((response) => {
				response.json().then((json) => {
					if (response.ok) {
						this.setState({ result: JSON.stringify(json, null, 2) });
					} else {
						this.setState({ result: 'Failed to retrieve query result.' });
					}
				});
			});
	},

	render: function () {
		return (
			<div>
				<NavBar user={this.state.user}/>
				{this.state.user == null ? <LoginPanel/> :
					<div className="slds-m-around--xx-large">
						<AccountForm onSave={this.handleAccountSave}/>
						<QueryForm onExecuteQuery={this.handleQueryExecution}/>
						<QueryResults result={this.state.result}/>
					</div>
				}
			</div>
		);
	}
});
