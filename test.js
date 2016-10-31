var ClientAPI = require('taas-client');

var steward = new ClientAPI.ClientAPI({
  steward: { name: '127.0.0.1' }
})
  .on('open', function (channel, loginP) {
    console.log('console');
  }).on('ready', function (channel, data) {
    // when the management channel is ready, it's time to get to work!
    if (channel !== 'management') return;
    console.log('ready');

    this.listDevice('', {}, function (done) {
      console.log(done);
      steward.performDevice(5, "off", {}, function () {
        steward.performDevice(5, "on", {}, function () {
        });
      });
    });

  }).on('close', function (channel) {
    console.log('close');
  }).on('error', function (err, channel) {
    console.log('error');
  });