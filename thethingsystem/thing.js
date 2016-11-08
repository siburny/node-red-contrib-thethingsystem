module.exports = function (RED) {
  function StewardThingNodePerform(config) {
    RED.nodes.createNode(this, config);

    var node = this;
    node.server = RED.nodes.getNode(config.server)
    node.thing = config.thing;
    node.name = config.name;

    this.on('input', function(msg) {
      if(!!node.server && !!node.server.connected) {
        console.log(node);
        node.server.steward.performDevice(node.thing, msg.payload, {}, function() { });
        if(msg.payload === 'on') {
          node.status({fill: 'green', shape: 'dot', text: 'ON'});
        } else if(msg.payload === 'off') {
          node.status({fill: 'red', shape: 'dot', text: 'OFF'});
        }
      }
    });
  }
  RED.nodes.registerType('thing', StewardThingNodePerform);

  function StewardThingNodeObserve(config) {
    RED.nodes.createNode(this, config);

    var node = this;
    node.server = RED.nodes.getNode(config.server)
    node.thing = config.thing;
    node.name = config.name;

    this.on('input', function(msg) {
      if(!!node.server && !!node.server.connected) {
        console.log(node);
        node.server.steward.performDevice(node.thing, msg.payload, {}, function() { });
        if(msg.payload === 'on') {
          node.status({fill: 'green', shape: 'dot', text: 'ON'});
        } else if(msg.payload === 'off') {
          node.status({fill: 'red', shape: 'dot', text: 'OFF'});
        }
      }
    });
  }
  RED.nodes.registerType('thing', StewardThingNodePerform);
}