var keyMirror = require('keymirror');

module.exports = keyMirror({
    // client actions
    CHANGE_ACTIVE_HIGHLIGHT: null,
    CHANGE_PLAYBACK_RATE: null,

    // server actions
    NEW_HIGHLIGHT_RECEIVED: null,
    HIGHLIGHTS_RECEIVED: null
});