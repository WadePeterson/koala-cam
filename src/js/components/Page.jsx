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
                <div className="controls">
                    <Button className="highlight" onClick={this.createHighlight}>Capture Highlight!</Button>
                    <PlaybackRateControl playbackRate={this.state.videoControlSettings.playbackRate} onPlaybackRateChange={this.onPlaybackRateChange} />
                </div>
                <div className="video-container">
                    <Video {...this.state.videoControlSettings} />
                    <HighlightContainer highlights={this.state.highlights} onHighlightClick={this.changeActiveHighlight}/>
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

    onPlaybackRateChange(playbackRate) {
        ActionCreator.changePlaybackRate(playbackRate);
    }
});