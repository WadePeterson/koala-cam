var React = require('react');
var Button = require('react-bootstrap').Button;

module.exports = React.createClass({
    propTypes: {
        playbackRate: React.PropTypes.number.isRequired,
        onPlaybackRateChange: React.PropTypes.func.isRequired
    },

    componentDidMount(){
        this.updateVideoSettings();
    },

    componentDidUpdate() {
        this.updateVideoSettings();
    },

    render() {
        return (
            <div className="playback-rate-control">
                <label>
                    <div>Speed</div>
                    <input type="range" min="0.1" max="2.0" step="0.1" value={this.props.playbackRate} onChange={this.onChange} />
                </label>
                <span>{Math.round(this.props.playbackRate * 100)}%</span>
            </div>
        );
    },

    updateVideoSettings() {
        var video = React.findDOMNode(this.refs.videoPlayer);

        if (video) {
            video.playbackRate = this.props.playbackRate;
        }
    },

    onChange(event) {
        this.props.onPlaybackRateChange(+event.target.value);
    }
});
