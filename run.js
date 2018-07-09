var casper = require('casper').create(),
    t, address;
// 打开页面
t = Date.now();
address = casper.cli.get(0)?casper.cli.get(0):'http://www.shangbiao.com/';
casper.start(address);

casper.then(function() {
    this.capture('run_'+Date.now()+'.jpg');
    console.log('Url: ' + address);
    
    t = Date.now() - t;
    console.log('Loading time ' + t + ' msec');
});

casper.run();