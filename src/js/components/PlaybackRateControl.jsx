var React = require('react');

module.exports = React.createClass({
    propTypes: {
        playbackRate: React.PropTypes.number.isRequired,
        onPlaybackRateChange: React.PropTypes.func.isRequired
    },

    render() {
        return (
            <div className="playback-rate-control" onMouseOut={this.onMouseOut}>
                <label>
                    <div>Speed: {Math.round(this.props.playbackRate * 100)}%</div>
                    <input ref="input" type="range" min="0.1" max="2.0" step="0.1" value={this.props.playbackRate} onChange={this.onChange} />
                </label>
            </div>
        );
    },

    onChange(event) {
        this.props.onPlaybackRateChange(+event.target.value);
    },

    onMouseOut(event) {
        this.refs.input.blur();
    }
});
