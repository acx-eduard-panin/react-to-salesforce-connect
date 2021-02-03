const React = require('react');

const NavBar = module.exports = React.createClass({
	logout: function () {
		window.location = '/auth/logout';
	},
	render: function () {
		return (
			<div className="slds-page-header" role="banner">
				<div className="slds-grid">
					{/* Banner */}
					<div className="slds-col slds-has-flexi-truncate">
						<div className="slds-media slds-media--center slds-no-space slds-grow">
							<div className="slds-media__body">
								<p className="slds-page-header__title slds-truncate slds-align-middle"
								   title="Salesforce React Integration">Salesforce React Integration</p>
								<p className="slds-text-body--small page-header__info">
									A sample integration project between Force.com and a React application
								</p>
							</div>
						</div>
					</div>

					{
						/*  Logged user name */
						this.props.user == null ? null :
							<div className="slds-col--padded slds-no-flex slds-grid slds-align-middle">
								{this.props.user.display_name}
							</div>
					}

					{
						/*   Logout button */
						this.props.user == null ? null :
							<div className="slds-col slds-no-flex slds-grid">
								<button onClick={this.logout} className="slds-button slds-button--neutral">
									Log out
								</button>
							</div>
					}

				</div>
			</div>
		);
	}
});
