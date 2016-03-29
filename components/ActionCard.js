var React = require('react');
var ReactMotion = require('react-motion');
var Motion = ReactMotion.Motion;
var spring = ReactMotion.spring;

// props are:
//   card: ActionCard
//	offset: int (index in player's hand)


var ActionCard = React.createClass({
	// componentDidMount: function(){
	// 	window.addEventListener("mouseover", this.handleMouseOver);

	// },

	handleMouseOver: function(){
		this.props.handleMouseOver(this.props.card.name)
	},


  render: function () {
  	var self = this;

    return (
    	<Motion defaultStyle={{left: 0}} 
              style={{left: spring(self.props.offset)}}>
            {function(interpolatingStyle){
            	return(
			      <div  className="actionCard" style={{left: interpolatingStyle.left+"%"}} onMouseOver={self.handleMouseOver}>
			        <img src={self.props.card.imgSRC} className="actionCardImage"/>
			      </div>

            		)

            }}





		</Motion>
    )
  }
});

module.exports = ActionCard;


