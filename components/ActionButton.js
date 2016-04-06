var React = require('react');
var socket = io();

// props are:
//   text: ""
//   display: bool
//   userName: ""

var ActionButton = React.createClass({
  componentDidMount: function(){
    
  },

  handleClick: function(){
    console.log(this.props.action.buttonText+" button clicked by ",this.props.userName)
      socket.emit("action button pressed", {buttonText: this.props.action.buttonText, userName: this.props.userName});
    
  },



  render: function () {

    return (
      <button onClick={this.handleClick} className="actionButton" >
      	{this.props.action.buttonText}
      </button>
    )
  }
});

module.exports = ActionButton;


