var React = require('react');
var PlayerPiece = require('./PlayerPiece')


//props are:
//  players: {playerName: Player}
//   neck: [Location]
//   activePlayer: Player

var NeckCanvas = React.createClass({
  getInitialState: function(){
    return(
      {canvas_x: 0,
      canvas_y: 0,
      canvas_height: 0,
      canvas_width: 0}
    )
  },

  componentDidMount: function(){
    this.calculateCanvas();
    window.addEventListener("resize", this.calculateCanvas);
  },

  calculateCanvas: function(){
    var neckLocation = document.getElementById("NeckDIV").getBoundingClientRect();

    this.setState({
      canvas_x: neckLocation.left,
      canvas_y: neckLocation.top,
      canvas_height: neckLocation.bottom - neckLocation.top,
      canvas_width: neckLocation.right - neckLocation.left
    })
  },
    
  calculatePlayerAttributes: function(player){
    var cardWidth = this.state.canvas_width/7;
    var left = player.location * cardWidth;
    var bottom = 0;

    var diameter = cardWidth/2;

    //offset the player's coords by their position in the playersOnLocation index
    var offset = this.props.neck[player.location].playersOnLocation.indexOf(player.name) * diameter/2;
   

    return {coords: {left: left+offset, bottom:bottom}, diameter: diameter}

  },

  createPlayerPiecesList: function(players){
    var playerList = [];

    for (var i in players) {
      var active = false;
      if (players[i].name == this.props.activePlayer.name){
        active = true;
      }
      var playerAttributes = this.calculatePlayerAttributes(players[i]);
      playerList.push({player:players[i], active:active, 
        coords: playerAttributes.coords, diameter: playerAttributes.diameter})
    }
    return playerList;
  },



  render: function () {
    var playerList = this.createPlayerPiecesList(this.props.players)


    var canvasStyle = {margin: 'auto', 
                    width: '100%', 
                    height: '100%',
                    border: "2px solid red",
                    position: "absolute"};
    


    return (
      <div style={canvasStyle}>
      	{playerList.map(function(each){
            return <PlayerPiece player={each.player} 
                                key={each.player.name + "s piece"} 
                                active={each.active}
                                coords={each.coords}
                                diameter={each.diameter}/>
          })}
      </div>
    )
  }
});

module.exports = NeckCanvas;


