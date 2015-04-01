var React = require('react');
var $ = require('jquery');

module.exports = React.createClass({
    displayName: 'Page',

    render: function() {
        return (
            <div>
                <button className="highlight" onclick={this.saveHighlight}>Save Highlight</button>
            </div>
        );
    },

    saveHighlight: function() {
        $.ajax('savehighlight', {
            method: 'POST'
        }).done(function (url) {
            var video = document.getElementsByTagName('video')[0];
            video.src = url;
        });
    }
});