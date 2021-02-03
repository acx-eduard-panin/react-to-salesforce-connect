const React = require('react');

const LoginPanel = module.exports = React.createClass({
	login: function () {
		window.location = '/auth/login';
	},
	render: function () {
		return (
			<div className="slds-modal slds-fade-in-open">
				<div className="slds-modal__container">
					<div className="slds-box slds-theme--shade">
						<p className="slds-text-heading--medium slds-m-bottom--medium slds-text-align_center">
							Login with Salesforce account
						</p>
						<div className="slds-align--absolute-center">
							<button onClick={this.login} className="slds-button slds-button--brand">
								Log in
							</button>
						</div>
					</div>
				</div>
			</div>
		);
	}
});
