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

    createHighlight() {
        $.ajax('savehighlight', {
            method: 'POST'
        }).done(highlight => {
            Dispatcher.handleServerAction({
                type: ActionTypes.NEW_HIGHLIGHT_RECEIVED,
                highlight: highlight
            });
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