var React = require('react');

var ActionCreator = require('../utils/ActionCreator');
var Button = require('react-bootstrap').Button;
var HighlightContainer = require('./HighlightContainer.jsx');
var HighlightStore = require('../stores/HighlightStore');
var PlaybackRateControl = require('./PlaybackRateControl.jsx');
var Video = require('./Video.jsx');

function getStateFromStore() {
    return {
        highlights: HighlightStore.getAllHighlights(),
        videoControlSettings: HighlightStore.getVideoControlSettings()
    };
}

module.exports = React.createClass({
    displayName: 'Page',

    getInitialState() {
        return getStateFromStore();
    },

    componentDidMount(){
        HighlightStore.addChangeListener(this._onChange);
        ActionCreator.loadHighlights();
    },

    componentWillUnmount(){
        HighlightStore.removeChangeListener(this._onChange);
    },

    _onChange(){
        this.setState(getStateFromStore());
    },

    render() {
        return (
            <div>
                <Button autoFocus="true" bsStyle="success" bsSize="large" className="save-highlight-button" onClick={this.createHighlight} onMouseOver={this.onCaptureButtonMouseOver}>Capture Highlight!</Button>
                <div className="video-content-container">
                    <div className="video-container">
                        <PlaybackRateControl playbackRate={this.state.videoControlSettings.playbackRate} onPlaybackRateChange={this.onPlaybackRateChange} />
                        <Video {...this.state.videoControlSettings} />
                    </div>
                    <HighlightContainer highlights={this.state.highlights} onHighlightSelect={this.changeActiveHighlight} onHighlightTitleChange={this.updateTitle} onDeleteClick={this.deleteHighlight} onHotClick={this.toggleHotness} />
                </div>
            </div>
        );
    },

    createHighlight() {
        ActionCreator.createHighlight();
    },

    changeActiveHighlight(highlight) {
        ActionCreator.changeActiveHighlight(highlight);
    },

    deleteHighlight(highlight) {
        ActionCreator.deleteHighlight(highlight);
    },

    onCaptureButtonMouseOver(event) {
        event.target.focus();
    },

    onPlaybackRateChange(playbackRate) {
        ActionCreator.changePlaybackRate(playbackRate);
    },

    toggleHotness(highlight) {
        ActionCreator.toggleHotness(highlight);
    },

    updateTitle(highlight, newTitle) {
        ActionCreator.updateHighlightTitle(highlight, newTitle);
    }
});