var React = require('react');
var ReactMotion = require('react-motion');
var Motion = ReactMotion.Motion;
var spring = ReactMotion.spring;

// props are:
//   card: ActionCard
//	offset: {left: int, rotation: int}


var ActionCard = React.createClass({
	// componentDidMount: function(){
	// 	window.addEventListener("mouseover", this.handleMouseOver);

	// },

	handleMouseOver: function(){
		console.log(this.props.card.name)
		this.props.handleMouseOver(this.props.card.name)
	},


  render: function () {
  	var self = this;

    return (
    	<Motion defaultStyle={{left: 0, rotation:0}} 
              style={{left: spring(self.props.offset.left), rotation: spring(self.props.offset.rotation)}}>
            {function(interpolatingStyle){
            	return(
			      <div  className="actionCard" style={{left: interpolatingStyle.left+"%", 
			      transform: "rotate("+interpolatingStyle.rotation+"deg)"}} onMouseOver={self.handleMouseOver}>
			        <img src={self.props.card.imgSRC} className="cardImage"/>
			      </div>

            		)

            }}





		</Motion>
    )
  }
});

module.exports = ActionCard;


