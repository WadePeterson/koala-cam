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
        return _.clone(_highlights).sort();
    },

    getVideoControlSettings() {
        return _.clone(_videoControlSettings);
    }
});

HighlightStore.dispatchToken = Dispatcher.register(payload => {
    var action = payload.action;

    switch(action.type) {
        case ActionTypes.NEW_HIGHLIGHT_RECEIVED:
            _videoControlSettings.src = action.highlight;
            _highlights.push(action.highlight);
            break;
        case ActionTypes.HIGHLIGHTS_RECEIVED:
            // TODO: If highlights become more than just URLs, then this needs to be smarter
            _highlights = _.union(_highlights, action.highlights);
            break;
    }

    HighlightStore.emitChange();
});

module.exports = HighlightStore;



