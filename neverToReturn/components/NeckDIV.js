var React = require('react');

var CardDIV = require('./CardDIV');

var NeckDIV = React.createClass({
  render: function () {
    return (
      <div  className="layoutDIV" id='NeckDIV'>
        NeckDIV
        <div id="allCardsDIV" className="layoutDIV">
        	<CardDIV />
        </div>
      </div>
    )
  }
});

module.exports = NeckDIV;


