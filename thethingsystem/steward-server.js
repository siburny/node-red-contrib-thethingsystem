module.exports = function (RED) {
  var ClientAPI = require('taas-client');
  var when = require('when');
  var steward;

  function StewardServerNode(n) {
    RED.nodes.createNode(this, n);

    var node = this;

    node.host = n.host;
    node.connected = false;

    function connect() {
      setTimeout(function () {
        steward = node.steward = new ClientAPI.ClientAPI({
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
          RED.log.info('Steward is connected.');
        }).on('close', function (channel) {
          RED.log.info('Steward closed connection.');
          connect();
        }).on('error', function (err, channel) {
          RED.log.info('Steward errored out: ' + err.message);
          connect();
        });

        node.on('close', function () {
          node.connected = false;
          node.steward.close();
          delete node.steward;
        });
      }, 10);
    }

    connect();
  }

  RED.nodes.registerType('steward-server', StewardServerNode);

  RED.httpAdmin.get("/stewardListDevices", RED.auth.needsPermission("steward-server.write"), function (req, res) {
    if (steward && steward.readyP) {
      steward.listDevice('', {}, function (data) {
        if (data) {
          res.json(data);
        } else {
          res.sendStatus(404);
        }
      });
    } else {
      res.sendStatus(403);
    }
  });
}