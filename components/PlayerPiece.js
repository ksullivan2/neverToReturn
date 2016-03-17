var React = require('react');
var ReactMotion = require('react-motion');

var spring = ReactMotion.spring;
var Motion = ReactMotion.Motion;



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
      <Motion defaultStyle={{x:0}} style={{x: spring(360)}}>
        {function(val) {
          return (
            <div className="playerPiece" style={pieceStyle}>
          	 <p>{val.x}</p>
            </div>
          )
        }}
      </Motion>
    )
  }
});

module.exports = PlayerPiece;


