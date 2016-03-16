var React = require('react');


var PlayerPiece = React.createClass({
  render: function () {
  	var pieceStyle = {backgroundColor: this.props.player.color};
    
    return (
      <div className="playerPiece" style={pieceStyle}>
      	<p>{this.props.player.name}</p>
      </div>
    )
  }
});

module.exports = PlayerPiece;


