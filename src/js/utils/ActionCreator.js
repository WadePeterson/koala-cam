var $ = require('jquery');
var ActionTypes = require('./ActionTypes');
var Dispatcher = require('../utils/Dispatcher');

module.exports = {
    createHighlight() {
        $.ajax('savehighlight', {
            method: 'POST'
        }).done(url => {
            Dispatcher.handleServerAction({
                type: ActionTypes.NEW_HIGHLIGHT_RECEIVED,
                highlight: url
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