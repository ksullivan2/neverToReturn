var React = require('react');
var ReactMotion = require('react-motion');
var Motion = ReactMotion.Motion;
var spring = ReactMotion.spring;


var PlayerPiece = React.createClass({
  
    //<Motion defaultStyle={{x: 0}} style={{x: spring(10)}}>
    //{interpolatingStyle => <div style={interpolatingStyle} />}
    //</Motion>

    



  render: function () {
    var self = this;

  	var border = '';
  	var textColor = "black";

    if (this.props.active){
    	border = "2px solid black";
    	textColor = "white";
    }

  	

    
    return (

      <Motion defaultStyle={{left: 0}} style={{left: spring(100)}}>
        {function(interpolatingStyle){
          return(
            <div className="playerPieceBox">
              <div className="playerPiece" 
                    style={{background: "radial-gradient("+self.props.player.color+" 0%, hsla(0, 100%, 20%, 0) 100%) 0 0",
                            border: border,
                            color: textColor,
                            left: interpolatingStyle.left,
                            bottom: self.props.coords.bottom,
                            width: self.props.diameter,
                            height: self.props.diameter}}>
              	<p>{self.props.player.name}</p>
              </div>
            </div>
          )
        }} 
      </Motion>
    )
  }
});

module.exports = PlayerPiece;


