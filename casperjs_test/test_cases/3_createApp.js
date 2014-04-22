casper.test.begin('Create App', 2, function suite(test) {

  casper.start("http://127.0.0.1:9000/#/apps", function() {

    // Click "add new event"
    this.click('h2 .btn-primary');

    // Expect to see event form
    this.waitUntilVisible('#status1', function then() {
      test.assertVisible('#status1', 'App form opened');
    });
  });

  casper.then(function() {
    // Fill the form
    this.sendKeys('form [name="title"]', 'Test app from Casperjs');
    this.click('form [type="submit"]');
  });

  casper.thenOpen('http://127.0.0.1:9000/#/apps', function() {
    // Expect to see the new event
    test.assertSelectorHasText('table td', 'Test app from Casperjs');
  });

  casper.run(function() {
    test.done();
  });

});
