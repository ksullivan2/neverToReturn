var React = require('react');
var ActionButton = React.createClass({
  componentDidMount: function(){
    
  },

  handleClick: function(){
      console.log(this.props.text);
      this.props.socket.emit(this.props.text.toString());
    
  },



  render: function () {
    var display = "none";
  
    if (this.props.display){
      display = "inline-block"
    }

    var buttonStyle = {margin: 'auto', 
                    width: '100px', 
                    height: '50px',
                    display: display};
    
    return (
      <button onClick={this.handleClick} className="actionButton" style={buttonStyle}>
      	{this.props.text}
      </button>
    )
  }
});

module.exports = ActionButton;


