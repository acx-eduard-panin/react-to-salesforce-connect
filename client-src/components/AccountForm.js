const React = require('react');

const QueryForm = module.exports = React.createClass({
	getInitialState: function () {
		return { name: 'Demo Account' };
	},
	handleSubmit: function (e) {
		e.preventDefault();
		const name = this.state.name.trim();
		if (!name) {
			return;
		}
		this.props.onSave({ name });
	},
	handleNameChange: function (e) {
		this.setState({ name: e.target.value });
	},
	render: function () {
		return (
			<form className="slds-form--stacked slds-m-bottom--xx-large slds-card" onSubmit={this.handleSubmit}>
				<div className="slds-form-element">
					<div className="slds-form-element slds-p-horizontal--medium slds-p-vertical--small">
						<label className="slds-form-element__label" htmlFor="text-input-id-1">
							<abbr className="slds-required" title="required">* </abbr>Name
						</label>
						<div className="slds-form-element__control">
							<input type="text" id="account-name" placeholder="Placeholder Text" required
								   className="slds-input" onChange={this.handleNameChange}/>
						</div>
					</div>
				</div>
				<div className="slds-form-element slds-clearfix slds-p-around--medium">
					<div className="slds-float--right">
						<button className="slds-button slds-button--brand" type="submit"
								disabled={!this.state.name.trim()}>
							Save
						</button>
					</div>
				</div>
			</form>
		);
	}
});
