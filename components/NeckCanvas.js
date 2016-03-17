var React = require('react');
var PlayerPiece = require('./PlayerPiece')


var playerList = [];

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
    

  createPlayerPiecesList: function(players){
    for (var i = 0; i < players.length; i++) {
      var active = false;
      if (players[i].name == this.props.activePlayer){
        active = true;
      }
      playerList.push({player:players[i], active:active})
    }

  },



  render: function () {
    this.createPlayerPiecesList(this.props.players)

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
                                active={each.active}/>
          })}
      </div>
    )
  }
});

module.exports = NeckCanvas;


