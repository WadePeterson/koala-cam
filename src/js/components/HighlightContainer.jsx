var _ = require('lodash');
var Button = require('react-bootstrap').Button;
var React = require('react');

module.exports = React.createClass({
    propTypes: {
        highlights: React.PropTypes.array.isRequired,
        onHighlightClick: React.PropTypes.func.isRequired,
        onHighlightDeleteClick: React.PropTypes.func.isRequired
    },

    render() {
        var thumbs = _.map(this.props.highlights, (highlight) => {
            return (
                <div className="thumbnail-container">
                    <img src={'highlights/thumbnail-' + highlight + '.jpg'} onClick={() => this.props.onHighlightClick(highlight)} />
                    <Button className="delete glyphicon glyphicon-trash" bsSize="large" onClick={() => this.props.onHighlightDeleteClick(highlight)}></Button>
                </div>
            );
        });

        return <div className="highlight-container">{thumbs}</div>;
    }
});
