Apps4EU javascript plugin
=========================

This is a javascript plugin that can be used to embed Apps4EU events on any website.


Installation instructions
-------------------------

The system consists of three components, each having their own repository:

* Admin-interface: https://github.com/EurecomApps4Eu/admin-interface
    * This is the interface that event organizers use to create new events and to get the embed code for embedding the event on their own website.
* REST-interface: https://github.com/EurecomApps4Eu/rest-interface
    * This interface provides a RESTful service for events and applications.
* Event-website: https://github.com/EurecomApps4Eu/event-website
    * This repository contains the code that is embedded on the event organizer's own website. It will fetch the event and application information from the REST-interface, and then display the information directly on the event organizers webpage.

The three different components can be installed on differenct computers, if needed. REST-interface requires Node.js and MongoDB to be installed, whereas Admin-interface and Event-website produces static files (when running the build task) that can be hosted on any web server.


Installing and configuring the REST-interface
----------------------------------------------

1. Clone the repository
2. Install dependencies by running the command "npm install"
3. Configure the system by editing "config.js"-file
4. Start the service by running "node app.js {PORT}", and replace {PORT} with the port you want to run the application in (typically port 80 for HTTP)


Installing and configuring the Admin-interface
----------------------------------------------

1. Clone the repository
2. Install Node dependencies by running the command "npm install"
3. Install Bower dependencies by running the command "bower install" (if bower is not installed run "npm install bower -g")
4. Configure the system by editing file "app/scripts/app.js". Look for appSettings-part in the file.
5. Build the system with command "grunt build" (if grunt is not installed, run "npm install grunt -g"). This will produce static HTML/CSS/JS-files that can be hosted on any web server.


Installing and configuring the Event-website
--------------------------------------------

1. Clone the repository
2. Install Node dependencies by running the command "npm install"
3. Install Bower dependencies by running the command "bower install" (if bower is not installed run "npm install bower -g")
4. Configure the system by editing file "config.js"
5. Build static HTML/CSS/JS-files by running "grunt all"
