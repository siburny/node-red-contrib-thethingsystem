module.exports = function (RED) {
  function StewardThingNodePerform(config) {
    RED.nodes.createNode(this, config);

    var node = this;
    node.server = RED.nodes.getNode(config.server)
    node.thing = config.thing;
    node.name = config.name;

    this.on('input', function (msg) {
      if (!!node.server && !!node.server.connected) {
        console.log(node);
        node.server.steward.performDevice(node.thing, msg.payload, {}, function () { });
        if (msg.payload === 'on') {
          node.status({ fill: 'green', shape: 'dot', text: 'ON' });
        } else if (msg.payload === 'off') {
          node.status({ fill: 'red', shape: 'dot', text: 'OFF' });
        }
      }
    });
  }
  RED.nodes.registerType('thing-perform', StewardThingNodePerform);

  function StewardThingNodeObserve(config) {
    RED.nodes.createNode(this, config);

    var node = this;
    node.server = RED.nodes.getNode(config.server)
    node.thing = config.thing;
    node.name = config.name;

    if (!!node.server) {
      node.server.steward.removeAllListeners('actor');
      node.server.steward.on('actor', function (entry) {
        entry.payload = entry.status;
        node.send(entry);
      });
    }
  }
  RED.nodes.registerType('thing-event', StewardThingNodeObserve);

  function StewardThingNodeStatus(config) {
    RED.nodes.createNode(this, config);

    var node = this;
    node.server = RED.nodes.getNode(config.server)
    node.thing = config.thing;

    node.on('input', function (msg) {
      if (!!node.server && node.server.connected) {
        var id = null;
        if (!!msg && !!msg.whoami) {
          id = msg.whoami.replace('device/', '');
        } else {
          id = node.thing;
        }
        if (!!id) {
          node.server.steward.listDevice(id, {}, function (data) {
            id = 'device/' + id;
            if (!!data && !!data.result && !!data.result.devices && !!data.result.devices[id]) {
              var send = data.result.devices[id];
              send.whoami = send.whoami;
              send.payload = send.status;
              node.send([send]);
            }
          });
        }
      }
    });
  }
  RED.nodes.registerType('thing-status', StewardThingNodeStatus);
}