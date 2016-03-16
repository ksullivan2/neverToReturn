var React = require('react');


var PlayerPiece = React.createClass({
  render: function () {
  	var border = ""
  	var textColor = "black"
    if (this.props.active){
      border = "2px solid black"
      textColor = "white"
    }

  	var pieceStyle = {backgroundColor: this.props.player.color, border: border, color: textColor};
    
    return (
      <div className="playerPiece" style={pieceStyle}>
      	<p>{this.props.player.name}</p>
      </div>
    )
  }
});

module.exports = PlayerPiece;


