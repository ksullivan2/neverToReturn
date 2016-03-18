var React = require('react');
var ReactMotion = require('react-motion');
var Motion = ReactMotion.Motion;
var spring = ReactMotion.spring;


var PlayerPiece = React.createClass({
  
    //<Motion defaultStyle={{x: 0}} style={{x: spring(10)}}>
    //{interpolatingStyle => <div style={interpolatingStyle} />}
    //</Motion>


  render: function () {
  	var border = '';
  	var textColor = "black";

    if (this.props.active){
    	border = "2px solid black";
    	textColor = "white";
    }

  	var pieceStyle = {background: "radial-gradient("+this.props.player.color+" 0%, hsla(0, 100%, 20%, 0) 100%) 0 0",
  						border: border,
  						color: textColor,
              left: this.props.coords.left,
              bottom: this.props.coords.bottom,
              width: this.props.diameter,
              height: this.props.diameter};
    
    return (
      <Motion defaultStyle={{x: 0}} style={{x: spring(10)}}>
        {function(value){
          return(
            <div className="playerPieceBox">
              <div className="playerPiece" style={pieceStyle}>
              	<p>{value}</p>
              </div>
            </div>
          )
        }} 
      </Motion>
    )
  }
});

module.exports = PlayerPiece;


