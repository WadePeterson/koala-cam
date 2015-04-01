var React = require('react');

module.exports = React.createClass({
    displayName: 'Video',

    propTypes: {
        playbackRate: React.PropTypes.number.isRequired,
        src: React.PropTypes.string.isRequired
    },

    componentDidMount(){
        this.updateVideoSettings();
    },

    componentDidUpdate() {
        this.updateVideoSettings();
    },

    render() {
        return <video ref="videoPlayer" controls autoPlay="true" src={this.props.src}></video>;
    },

    updateVideoSettings() {
        var video = React.findDOMNode(this.refs.videoPlayer);

        if (video) {
            video.playbackRate = this.props.playbackRate;
        }
    }
});
