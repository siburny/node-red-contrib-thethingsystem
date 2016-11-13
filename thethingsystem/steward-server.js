module.exports = function (RED) {
  var ClientAPI = require('taas-client');
  var when = require('when');

  function StewardServerNode(n) {
    RED.nodes.createNode(this, n);

    var node = this;

    node.host = n.host;
    node.connected = false;

    node.steward = new ClientAPI.ClientAPI({
      steward: { name: node.host },
      logger: {
        error: function (msg, props) { }
        , warning: function (msg, props) { }
        , notice: function (msg, props) { }
        , info: function (msg, props) { }
        , debug: function (msg, props) { }
      }
    }).on('ready', function (channel, data) {
      if (channel !== 'management') return;
      node.connected = true;
    }).on('close', function (channel) {
    }).on('error', function (err, channel) {
    });

    node.on('close', function() {
      node.connected = false;
      node.steward.close();
      delete node.steward;
    });
  }

  RED.nodes.registerType('steward-server', StewardServerNode);
}