var React = require('react');
var PlayerPiece = require('./PlayerPiece')


var LocationDIV = React.createClass({
  render: function () {
    return (
      <div className="cardDIV">
        <img src={this.props.card.imgSRC} className="card"/>
      </div>
    )
  }
});

module.exports = LocationDIV;


