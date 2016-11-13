module.exports = function (RED) {
  function StewardThingNodeStatusCheck(config) {
    RED.nodes.createNode(this, config);

    var node = this;
    node.if = config.if;
    node.then = config.then;
    node.else = config.else;

    node.on('input', function (msg) {
      if (msg.payload == node.if) {
        node.send([{ payload: node.then }, null]);
      }
      else {
        node.send([null, { payload: node.else }]);
      }
    });
  }
  RED.nodes.registerType('status-check', StewardThingNodeStatusCheck);
}