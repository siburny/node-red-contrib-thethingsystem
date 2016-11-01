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
      console.log('close');
    }).on('error', function (err, channel) {
      console.log('error');
    });

    console.log("Reg!");
    RED.httpAdmin.get('/steward/devices', function (req, res) {
      if (!node.connected || !node.steward)
        return [];

      node.steward.listDevice('', { depth: 'all' }, function (data) {
        if (!!data && !!data.result && !!data.result.devices) {
          res.json(data.result.devices);
        } else {
          res.json([]);
        }
      });
    });

    node.on('close', function() {
      node.connected = false;
      delete node.steward;
    });
  }

  RED.nodes.registerType('steward-server', StewardServerNode);
}