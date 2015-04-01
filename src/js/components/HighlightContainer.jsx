var _ = require('lodash');
var React = require('react');

module.exports = React.createClass({
    propTypes: {
        highlights: React.PropTypes.array.isRequired
    },

    render() {
        var thumbs = _.map(this.props.highlights, (highlight) => {
            return <div>{highlight}</div>;
        });

        return <div>{thumbs}</div>;
    }
});
