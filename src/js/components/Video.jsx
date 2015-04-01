var React = require('react');

module.exports = React.createClass({
    displayName: 'Video',

    propTypes: {
        playbackSpeed: React.PropTypes.number.isRequired,
        src: React.PropTypes.string.isRequired
    },

    render() {
        return this.props.src ? (
            <video controls autoPlay="true" src={this.props.src} playbackSpeed={this.props.playbackSpeed}></video>
        ) : <div>No highlight yet!</div>;
    }
});
