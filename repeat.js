var casper = require('casper').create();
// 打开页面

i=1000100;
casper.start().repeat(1000,function(){
    casper.open('https://www.marksmile.com/co_'+i+'.html');
    casper.then(function() {
        this.capture('hello_'+i+'.jpg');
        console.log('https://www.marksmile.com/co_'+i+'.html');
    });
    i++;
})

casper.run();