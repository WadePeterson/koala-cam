var _ = require('lodash');
var ActionTypes = require('../utils/ActionTypes');
var Dispatcher = require('../utils/Dispatcher');
var StoreCreator = require('../utils/StoreCreator');

var _highlights = [];
var _videoControlSettings = {
    panX: 0,
    panY: 0,
    playbackRate: 0.5,
    src: 'koala-fight.mp4',
    zoom: 1.0
};

var HighlightStore = StoreCreator.create({
    getAllHighlights() {
        return _.clone(_highlights);
    },

    getVideoControlSettings() {
        return _.clone(_videoControlSettings);
    }
});

HighlightStore.dispatchToken = Dispatcher.register(payload => {
    var action = payload.action;

    switch(action.type) {
        case ActionTypes.CHANGE_ACTIVE_HIGHLIGHT:
            _videoControlSettings.src = action.highlight.videoUrl;
            break;
        case ActionTypes.CHANGE_PLAYBACK_RATE:
            _videoControlSettings.playbackRate = action.playbackRate;
            break;
        case ActionTypes.DELETE_HIGHLIGHT:
            _highlights = _.filter(_highlights, highlight => action.highlight !== highlight);
            break;
        case ActionTypes.NEW_HIGHLIGHT_RECEIVED:
            _videoControlSettings.src = action.highlight.videoUrl;
            _highlights.unshift(action.highlight);
            break;
        case ActionTypes.UPDATE_HIGHLIGHT_METADATA:
            _.find(_highlights, highlight => highlight.id === action.highlight.id).metadata = action.newMetadata;
            break;
        case ActionTypes.HIGHLIGHTS_RECEIVED:
            _highlights = action.highlights;
            break;
    }

    HighlightStore.emitChange();
});

module.exports = HighlightStore;



