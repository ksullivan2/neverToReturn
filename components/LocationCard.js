var React = require('react');

// props are:
// 	card: TerrainCard

var LocationCard = React.createClass({
  render: function () {
    return (
      <div  className="terrainCard">
        <img src={this.props.card.imgSRC} className="terrainCardImage"/>
      </div>
      )
  }
});

module.exports = LocationCard;


