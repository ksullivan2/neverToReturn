var React = require('react');
var PlayerPiece = require('./PlayerPiece')




var NeckCanvas = React.createClass({
  



  render: function () {
    

    var canvasStyle = {margin: 'auto', 
                    width: '100%', 
                    height: '100%',
                    border: "2px solid red",
                    position: "absolute"};
    
    return (
      <div style={canvasStyle}>
      	{this.props.players.map(function(eachPlayer){
            return <PlayerPiece player={eachPlayer} 
                                key={eachPlayer.key} 
                                active={eachPlayer.active}/>
          })}
      </div>
    )
  }
});

module.exports = NeckCanvas;


