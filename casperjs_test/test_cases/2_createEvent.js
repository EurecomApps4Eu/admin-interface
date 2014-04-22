casper.test.begin('Create Event', 2, function suite(test) {

  casper.start("http://127.0.0.1:9000/#/events", function() {

    // Click "add new event"
    this.click('h2 .btn-primary');

    // Expect to see event form
    this.waitUntilVisible('#startDate', function then() {
      test.assertVisible('#startDate', 'Event form opened');
    });
  });

  casper.then(function() {
    // Fill the form
    this.sendKeys('form [name="title"]', 'Test event from Casperjs');
    this.click('form [type="submit"]');
  });

  casper.thenOpen('http://127.0.0.1:9000/#/events', function() {
    // Expect to see the new event
    test.assertSelectorHasText('table td', 'Test event from Casperjs');
  });

  casper.run(function() {
    test.done();
  });

});
