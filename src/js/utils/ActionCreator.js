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
            method: 'POST'
        }).done(highlight => {
            Dispatcher.handleServerAction({
                type: ActionTypes.NEW_HIGHLIGHT_RECEIVED,
                highlight: highlight
            });
        });
    },

    deleteHighlight(highlight) {
        $.ajax('highlight/' + highlight, {
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
    }
};