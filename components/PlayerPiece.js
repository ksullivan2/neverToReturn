var React = require('react');


var PlayerPiece = React.createClass({
  render: function () {
  	var border = '';
  	var textColor = "black";

    if (this.props.active){
    	border = "2px solid black";
    	textColor = "white";
    }

  	var pieceStyle = {background: "radial-gradient("+this.props.player.color+" 0%, hsla(0, 100%, 20%, 0) 100%) 0 0",
  						border: border,
  						color: textColor};
    
    return (
      <div className="playerPiece" style={pieceStyle}>
      	<p>{this.props.player.name}</p>
      </div>
    )
  }
});

module.exports = PlayerPiece;


