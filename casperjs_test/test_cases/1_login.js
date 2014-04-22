casper.test.begin('Login', 3, function suite(test) {

  casper.start("http://127.0.0.1:9000/#/events", function() {

    // If we are already logged in => log out
    this.click('.userinfo button');

    // Wait for being redirected to login page
    this.waitForSelector('#loginForm');

    // Check that we were redirected to login page
    test.assertExists('#loginForm', "Redirected to login page");

    // Log in with invalid credentials
    this.sendKeys('#loginForm [type="email"]', 'alexistroberg@gmail.com');
    this.sendKeys('#loginForm [type="password"]', 'tes');
    this.click('#loginForm [type="submit"]');

    this.waitUntilVisible('#loginForm .alert-danger', function then() {
      test.assertVisible('#loginForm .alert-danger', 'Wrong credentials message should be visible');
    });
  });

  casper.then(function() {

    // Login with proper credentials
    this.sendKeys('#loginForm [type="password"]', 't');
    this.click('#loginForm [type="submit"]');

    // Ensure that we are logged in
    this.waitUntilVisible('.userinfo', function then() {
      test.assertVisible('.userinfo', "Login successfull");
    });
  });

  casper.run(function() {
    test.done();
  });

});
