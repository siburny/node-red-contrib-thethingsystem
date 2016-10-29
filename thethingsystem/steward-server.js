module.exports = function(RED) {
    function StewardServerNode(n) {
        RED.nodes.createNode(this, n);
        this.host = n.host;
    }
    RED.nodes.registerType('steward-server', StewardServerNode);
}