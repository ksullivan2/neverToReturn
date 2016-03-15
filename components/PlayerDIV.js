var React = require('react');

var ChatDIV = require('./ChatDIV');

var PlayerDIV = React.createClass({
  render: function () {
    return (
      <div  className="layoutDIV" id='PlayerDIV'>
        PlayerDIV
        <ChatDIV />
      </div>
    )
  }
});

module.exports = PlayerDIV;


