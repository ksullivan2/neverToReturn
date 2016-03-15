var React = require('react');



var PlayerDIV = React.createClass({
  render: function () {
    return (
      <div  className="PlayerDIV" >
        {this.props.name}
      </div>
    )
  }
});

module.exports = PlayerDIV;


