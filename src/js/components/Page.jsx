var React = require('react');
var ActionCreator = require('../utils/ActionCreator');
var HighlightContainer = require('./HighlightContainer.jsx');
var HighlightStore = require('../stores/HighlightStore');
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
                <div>
                    <button className="highlight" onClick={this.createHighlight}>Capture Highlight!</button>
                </div>
                <div>
                    <Video {...this.state.videoControlSettings} />
                </div>
                <HighlightContainer highlights={this.state.highlights} />
            </div>
        );
    },

    createHighlight() {
        ActionCreator.createHighlight();
    }
});