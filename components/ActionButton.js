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
    console.log(this.props.text+" button clicked by ",this.props.userName)
      socket.emit("action button pressed", {buttonText: this.props.text.toString(), userName: this.props.userName});
    
  },



  render: function () {

    return (
      <button onClick={this.handleClick} className="actionButton" >
      	{this.props.text}
      </button>
    )
  }
});

module.exports = ActionButton;


