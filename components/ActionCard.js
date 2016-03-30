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
		socket.emit("Action Card", {userName: userName, card: card})
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


