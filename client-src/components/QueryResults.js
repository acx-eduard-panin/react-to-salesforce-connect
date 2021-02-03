const React = require('react');

const QueryResults = module.exports = React.createClass({
	render: function () {
		return (
			<div>
				{this.props.result == null ? null :
					<div>
						<p className="slds-form-element__label  slds-text-heading--medium">Results</p>
						<div className="slds-box slds-theme--shade">
							<pre>{this.props.result}</pre>
						</div>
					</div>
				}
			</div>
		);
	}
});
