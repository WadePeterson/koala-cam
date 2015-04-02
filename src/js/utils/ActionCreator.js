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
        updateMetadata(highlight, { isHot: !highlight.metadata.isHot });
    },

    updateHighlightTitle(highlight, newTitle) {
        updateMetadata(highlight, { title: newTitle });
    }
};

function updateMetadata(highlight, metadataChanges) {
    var newMetadata = _.merge({}, highlight.metadata, metadataChanges);
    $.ajax('highlight/' + highlight.id, {
        method: 'POST',
        contentType: 'application/json; charset=UTF-8',
        data: JSON.stringify({
            metadata: newMetadata
        })
    });
    Dispatcher.handleViewAction({
        type: ActionTypes.UPDATE_HIGHLIGHT_METADATA,
        highlight: highlight,
        newMetadata: newMetadata
    });
}