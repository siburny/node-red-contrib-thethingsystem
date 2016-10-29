module.exports = function(RED) {
    function StewardThingNode(n) {
        RED.nodes.createNode(this, n);
        console.log(n);
        this.host = n.host;
    }
    RED.nodes.registerType('thing', StewardThingNode);
}