casper.userAgent('casperjs');

casper.start().viewport(1366, 768);

casper.options.waitTimeout = 5000; // 5 seconds

casper.test.on('fail', function() {
  console.log("FAIL");
  casper.capture("fail.png");
  casper.exit(1);
});
