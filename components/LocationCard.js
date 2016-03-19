var React = require('react');

// props are:
// 	card: TerrainCard

var LocationCard = React.createClass({
  render: function () {
    return (
      <div  className="terrainCard">
        <img src={this.props.card.imgSRC} className="cardImage"/>
      </div>
      )
  }
});

module.exports = LocationCard;


