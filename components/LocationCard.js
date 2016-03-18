var React = require('react');



var LocationCard = React.createClass({
  render: function () {
    return (<img src={this.props.card.imgSRC} className="card"/>)
  }
});

module.exports = LocationCard;


