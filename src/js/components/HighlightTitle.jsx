var React = require('react');
var Input = require('react-bootstrap').Input;
var SuggestionPopup = require('./SuggestionPopup.jsx');

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
        var availableItems = ['@Jonathan', '#toolking', '#grandma', '#jerk'];
        var searchText = this.getSearchText();

        var content = this.state.inEditMode ? [
            searchText && _.contains(['#', '@'], searchText[0]) && <SuggestionPopup searchText={this.getSearchText()} availableItems={availableItems} onItemSelect={this.onSuggestionSelect} />,
            <Input standalone className="highlight-title-editor" ref="input" autoFocus="true" type="text" value={this.state.title} onBlur={this.onEditorBlur} onChange={this.onEditorChange} onKeyUp={this.onKeyUp} />
        ] : <div className="highlight-title" onClick={this.onTitleClick}>{this.parseTitle()}</div>;

        return <div className="highlight-title-container">{content}</div>
    },

    getIndexOfCurrentWord() {
        var inputDom = this.refs.input && this.refs.input.getInputDOMNode();
        if (inputDom) {
            var count = 0;
            return _.findIndex(inputDom.value.split(' '), word => {
                count += word.length + 1;
                return count >= inputDom.selectionStart;
            });
        }
        return -1;
    },

    getSearchText() {
        var inputDom = this.refs.input && this.refs.input.getInputDOMNode();
        if (inputDom) {
            var count = 0;
            return _.find(inputDom.value.split(' '), word => {
                count += word.length + 1;
                return count >= inputDom.selectionStart;
            });
        }
        return null;
    },

    onEditorBlur(event) {
        //this.props.onTitleChange(event.target.value);
        //this.setState({ inEditMode: false });
    },

    onEditorChange(event) {
        this.setState({ title: event.target.value });
    },

    onKeyUp(event) {
        if(event.keyCode === 13) {
            this.onEditorBlur(event);
        }
    },

    onSuggestionSelect(selectedText) {
        var inputDom = this.refs.input.getInputDOMNode();
        var words = inputDom.value.split(' ');
        words[this.getIndexOfCurrentWord()] = selectedText;
        inputDom.value = words.join(' ') + ' ';
        inputDom.selectionStart = inputDom.value.length;
        inputDom.focus();
    },

    onTitleClick() {
        this.setState({ inEditMode: true });
    },

    parseTitle() {
        return this.state.title.split(' ').map(function(word, index, words) {
            return <span className={{ '#': 'highlight-tag', '@': 'highlight-owner'}[word[0]]}>{word + (index === words.length - 1 ? '' : ' ')}</span>;
        });
    }
});

