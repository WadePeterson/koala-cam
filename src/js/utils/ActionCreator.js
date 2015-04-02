var $ = require('jquery');
var ActionTypes = require('./ActionTypes');
var Dispatcher = require('../utils/Dispatcher');

module.exports = {
    changeActiveHighlight(highlight) {
        Dispatcher.handleViewAction({
            type: ActionTypes.CHANGE_ACTIVE_HIGHLIGHT,
            highlight: highlight
        });
    },

    changePlaybackRate(playbackRate) {
        Dispatcher.handleViewAction({
            type: ActionTypes.CHANGE_PLAYBACK_RATE,
            playbackRate: playbackRate
        });
    },

    createHighlight() {
        $.ajax('highlight', {
            method: 'PUT'
        }).done(highlight => {
            Dispatcher.handleServerAction({
                type: ActionTypes.NEW_HIGHLIGHT_RECEIVED,
                highlight: highlight
            });
        });
    },

    deleteHighlight(highlight) {
        $.ajax('highlight/' + highlight.id, {
            method: 'DELETE'
        });
        Dispatcher.handleViewAction({
            type: ActionTypes.DELETE_HIGHLIGHT,
            highlight: highlight
        });
    },

    loadHighlights() {
        $.ajax('highlights', {
            method: 'GET'
        }).done(highlights => {
            Dispatcher.handleServerAction({
                type: ActionTypes.HIGHLIGHTS_RECEIVED,
                highlights: highlights
            });
        });
    },

    toggleHotness(highlight) {
        $.ajax('highlight/' + highlight.id, {
            method: 'POST',
            data: {
                hot: !highlight.isHot
            }
        });
        Dispatcher.handleViewAction({
            type: ActionTypes.TOGGLE_HIGHLIGHT_HOTNESS,
            highlight: highlight
        });
    }
};