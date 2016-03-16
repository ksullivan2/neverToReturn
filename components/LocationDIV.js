var React = require('react');
var PlayerPiece = require('./PlayerPiece')


var LocationDIV = React.createClass({
  render: function () {
    return (
      <div className="cardDIV">
        {this.props.players.map(function(eachPlayer){
        	return <PlayerPiece player={eachPlayer.player} key={eachPlayer.playerkey}/>
        })}
        <img src={this.props.card.imgSRC} className="card"/>
      </div>
    )
  }
});

module.exports = LocationDIV;


