var _ = require('lodash');
var Button = require('react-bootstrap').Button;
var HighlightTitle = require('./HighlightTitle.jsx');
var React = require('react/addons');
var ReactCSSTransitionGroup = React.addons.CSSTransitionGroup;

module.exports = React.createClass({
    propTypes: {
        highlights: React.PropTypes.array.isRequired,
        onHighlightSelect: React.PropTypes.func.isRequired,
        onHighlightTitleChange: React.PropTypes.func.isRequired,
        onDeleteClick: React.PropTypes.func.isRequired
    },

    render() {
        var thumbs = _.map(this.props.highlights, (highlight) => {
            var hotClasses = "hot glyphicon glyphicon-fire" + (highlight.metadata.isHot ? ' active' : '');
            return (
                <div className="thumbnail-container" key={highlight.id}>
                    <img src={highlight.thumbnailUrl} onClick={() => this.props.onHighlightSelect(highlight)} />
                    <Button className={hotClasses} bsSize="large" onClick={() => this.props.onHotClick(highlight)}></Button>
                    { highlight.metadata.isHot ? null : <Button className="delete glyphicon glyphicon-trash" bsSize="large" onClick={() => this.props.onDeleteClick(highlight)}></Button> }
                    <HighlightTitle title={highlight.metadata.title} onTitleChange={(newTitle) => this.props.onHighlightTitleChange(highlight, newTitle)} />
                </div>
            );
        });

        return (
            <div className="highlight-container">
                <ReactCSSTransitionGroup transitionName="highlight">
                    {thumbs}
                </ReactCSSTransitionGroup>
            </div>);
    }
});
