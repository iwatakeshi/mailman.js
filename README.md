mailman.js
==========

[![Greenkeeper badge](https://badges.greenkeeper.io/iwatakeshi/mailman.js.svg)](https://greenkeeper.io/)

A small Javascript library that sends emails using [Mandrill](http://www.mandrillapp.com)'s email service.

##Usage
###In the browser
```html
<script src="mailman.min.js"></script>
<script src="//code.jquery.com/jquery-1.11.0.min.js"></script>
```

###In Node.js
```npm
npm install mailman.js
```
``` javascript
var mailman = require('mailman.js');
/*note: if that gives you errors try:
var mailman = require('.bin/mailman.js');
*/
```
##Example: Ping Pong
```javascript
//create a request
var request = {
    //mailman uses dot notation to access the url of your desired api call
    api:"users.ping",
    //the data to be sent
    data:{
        key:"your mandrill key here"
    },
    //enable debug to see tech savvy stuff in the console
    debug:true
}
//pass in the request to mailman and make the request
mailman(request).request();
//since request() supports "deferred"
//you can get the response like so:
mailman(request).request().done(function(response){
    //do something with response
});
```

##Example: Send Emails
```javascript
//create a request
var request = {
    //set the api
    api: "messages.send",
    data: {
        message:{
            html:"<p>Example HTML content</p>",
            text:"Example text content",
            subject:"example subject",
            from_email: "example@example.com",
            from_name: "Example Name",
            //note that this is an array, therefore you can send
            //to multiple recipients
            to:[{
                email: "example@example.com",
                name:"Example",
                type: "to"
    }]
 }
}

//pass the request and make the request
mailman(request).request();
```

##Making Requests
Visit the Mandrill's [documentation](https://mandrillapp.com/api/docs/index.JSON.html).
They have examples with the proper JSON format. Requests shown in the examples are following
the format.

##Available API Call Category
* Users
* Messages
* Tags
* Rejects
* Whitelists
* Senders
* Urls
* Templates
* Webhooks
* Subaccounts
* Inbound
* Exports
* Ips
* Metadata

##Tested API
* Users
* Messages
    * send

