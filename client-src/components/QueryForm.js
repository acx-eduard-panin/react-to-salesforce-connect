const React = require('react');

const QueryForm = module.exports = React.createClass({
	getInitialState: function () {
		return { query: 'SELECT Id, Name FROM Account LIMIT 10' };
	},
	handleSubmit: function (e) {
		e.preventDefault();
		const query = this.state.query.trim();
		if (!query) {
			return;
		}
		this.props.onExecuteQuery({ query: query });
	},
	handleQueryChange: function (e) {
		this.setState({ query: e.target.value });
	},
	render: function () {
		return (
			<form className="slds-form--stacked slds-m-bottom--xx-large" onSubmit={this.handleSubmit}>
				<div className="slds-form-element">
					<label className="slds-form-element__label slds-text-heading--medium" htmlFor="soqlQuery">
						<abbr className="slds-required" title="required">*</abbr> Query
					</label>
					<div className="slds-form-element__control">
						<textarea id="soqlQuery" className="slds-textarea" placeholder="Enter a SOQL query"
								  value={this.state.query} onChange={this.handleQueryChange} required></textarea>
					</div>
				</div>
				<div className="slds-form-element slds-clearfix">
					<div className="slds-float--right">
						<button className="slds-button slds-button--brand" type="submit"
								disabled={!this.state.query.trim()}>
							Execute
						</button>
					</div>
				</div>
			</form>
		);
	}
});
