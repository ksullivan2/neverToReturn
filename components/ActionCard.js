var React = require('react');
var ReactMotion = require('react-motion');
var Motion = ReactMotion.Motion;
var spring = ReactMotion.spring;
var socket = io();

// props are:
//   card: ActionCard
//	offset: int 
// handleMouseOver: function
// userName: ""


var ActionCard = React.createClass({


	handleMouseOver: function(){
		this.props.handleMouseOver(this.props.card.name)
	},

	handleClick: function(){
		console.log("clicked ", this.props.card.name)
		socket.emit("Action Card Pressed", {userName: this.props.userName, card: this.props.card})
	},


  render: function () {
  	var self = this;

    return (
    	<Motion defaultStyle={{left: 0}} 
              style={{left: spring(self.props.offset)}}>
            {function(interpolatingStyle){
            	return(
			      <div  className="actionCard" style={{left: interpolatingStyle.left+"%"}} 
			      		onMouseOver={self.handleMouseOver} onClick={self.handleClick}>
			        <img src={self.props.card.imgSRC} className="actionCardImage"/>
			      </div>

            		)

            }}

		</Motion>
    )
  }
});

module.exports = ActionCard;


