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
      socket.emit(this.props.text.toString(), {userName: this.props.userName});
    
  },



  render: function () {
    var buttonStyle = {margin: 'auto', 
                    width: '100px', 
                    height: '50px'};
    
    return (
      <button onClick={this.handleClick} className="actionButton" style={buttonStyle}>
      	{this.props.text}
      </button>
    )
  }
});

module.exports = ActionButton;


