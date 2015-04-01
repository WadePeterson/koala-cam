var React = require('react');
var $ = require('jquery');
var HighlightStore = require('../stores/HighlightStore');
var ActionCreator = require('../utils/ActionCreator');
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
                    <Video ref="activeVideo" {...this.state.videoControlSettings} />
                </div>
            </div>
        );
    },

    createHighlight() {
        ActionCreator.createHighlight();
    }
});