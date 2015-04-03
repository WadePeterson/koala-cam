var _ = require('lodash');
var React = require('react');
var ReactBootstrap = require('react-bootstrap');
var ListGroup = ReactBootstrap.ListGroup;
var ListGroupItem = ReactBootstrap.ListGroupItem;

module.exports = React.createClass({
    propTypes: {
        searchText: React.PropTypes.string.isRequired,
        availableItems: React.PropTypes.array.isRequired,
        onItemSelect: React.PropTypes.func.isRequired
    },

    render() {
        return (
            <ListGroup className="suggestion-popup">
                {this.getMatchingItems()}
            </ListGroup>
        );
    },

    getMatchingItems() {
        return _(this.props.availableItems)
            .filter(item => _.contains(item.toLowerCase(), this.props.searchText.toLowerCase()))
            .map(item => {
                return <ListGroupItem onClick={() => this.props.onItemSelect(item)}>{item}</ListGroupItem>; // bold and stuff later
            }).value();
    }
});
