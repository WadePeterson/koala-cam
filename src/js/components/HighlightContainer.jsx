var _ = require('lodash');
var Button = require('react-bootstrap').Button;
var React = require('react');

module.exports = React.createClass({
    propTypes: {
        highlights: React.PropTypes.array.isRequired,
        onHighlightSelect: React.PropTypes.func.isRequired,
        onDeleteClick: React.PropTypes.func.isRequired
    },

    render() {
        var thumbs = _.map(this.props.highlights, (highlight) => {
            var hotClasses = "hot glyphicon glyphicon-fire" + (highlight.metadata.isHot ? ' active' : '');
            return (
                <div className="thumbnail-container">
                    <img src={highlight.thumbnailUrl} onClick={() => this.props.onHighlightSelect(highlight)} />
                    <Button className={hotClasses} bsSize="large" onClick={() => this.props.onHotClick(highlight)}></Button>
                    { highlight.metadata.isHot ? null : <Button className="delete glyphicon glyphicon-trash" bsSize="large" onClick={() => this.props.onDeleteClick(highlight)}></Button> }
                    <div className="highlight-title">{highlight.metadata.title}</div>
                </div>
            );
        });

        return <div className="highlight-container">{thumbs}</div>;
    }
});
