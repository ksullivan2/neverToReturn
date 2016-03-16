var React = require('react');
var PlayerPiece = require('./PlayerPiece')


var LocationDIV = React.createClass({
  render: function () {
  	var imgKey = this.props.name + "img";
    
    return (
      <div className="cardDIV">
        {this.props.players.map(function(eachPlayer){
        	return <PlayerPiece player={eachPlayer.player} key={eachPlayer.playerkey} active={eachPlayer.active}/>
        })}
        
        <img src={this.props.card.imgSRC} className="card" key={imgKey}/>
      </div>
    )
  }
});

module.exports = LocationDIV;


