var React = require('react');
var Input = require('react-bootstrap').Input;

module.exports = React.createClass({
    propTypes: {
        title: React.PropTypes.string.isRequired,
        onTitleChange: React.PropTypes.func.isRequired
    },

    componentWillReceiveProps(newProps) {
        this.setState({ title: newProps.title });
    },

    componentDidUpdate(prevProps, prevState) {
        if(!prevState.inEditMode && this.refs.input) {
            this.refs.input.getInputDOMNode().select();
        }
    },

    getInitialState() {
        return {
            title: this.props.title,
            inEditMode: false
        };
    },

    render() {
        return this.state.inEditMode ? (
            <Input standalone className="highlight-title-editor" ref="input" autoFocus="true" type="text" value={this.state.title} onBlur={this.onEditorBlur} onChange={this.onEditorChange} onKeyUp={this.onKeyUp} />
        ) : (
            <div className="highlight-title" onClick={this.onTitleClick}>{this.state.title}</div>
        );
    },

    onEditorBlur(event) {
        this.props.onTitleChange(event.target.value);
        this.setState({ inEditMode: false });
    },

    onEditorChange(event) {
        this.setState({ title: event.target.value });
    },

    onKeyUp(event) {
        if(event.keyCode === 13) {
            this.onEditorBlur(event);
        }
    },

    onTitleClick() {
        this.setState({ inEditMode: true });
    }
});

