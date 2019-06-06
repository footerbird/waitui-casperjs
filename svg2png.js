var casper = require('casper').create(),
    t, address;
// 打开页面
t = Date.now();
address = casper.cli.get(0)?casper.cli.get(0):'svg.html';
casper.start(address);

casper.then(function() {
    this.evaluate(function() {
        document.body.bgColor = 'white';
    });
    this.capture('svg_'+Date.now()+'.jpg');
    console.log('Url: ' + address);
    
    t = Date.now() - t;
    console.log('Loading time ' + t + ' msec');
});

casper.run();