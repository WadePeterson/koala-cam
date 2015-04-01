var _ = require('lodash');
var React = require('react');

module.exports = React.createClass({
    propTypes: {
        highlights: React.PropTypes.array.isRequired,
        onHighlightClick: React.PropTypes.func.isRequired
    },

    render() {
        var thumbs = _.map(this.props.highlights, (highlight) => {
            return (
                <div>
                    <img src={'highlights/thumbnail-' + highlight + '.jpg'} onClick={() => this.props.onHighlightClick(highlight)} />
                </div>
            );
        });

        return <div className="highlight-container">{thumbs}</div>;
    }
});
