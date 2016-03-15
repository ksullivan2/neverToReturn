var React = require('react');

var ChatDIV = require('./ChatDIV');

var OpponentsDIV = React.createClass({
  render: function () {
    return (
      <div  className="layoutDIV" id='OpponentsDIV'>
        OpponentsDIV
        <ChatDIV />
      </div>
    )
  }
});

module.exports = OpponentsDIV;


