
[[light-http NPM] (https://www.npmjs.com/package/light-http)]


Light-http is a very light library it could easily make a http & https request, also support asynchrous and synchrous at the same time.

Let's try it !


## How to install light http 
npm install -g light-http

## Example 

Asynchronous
-----------------

<pre>
var client = require('light-http');
var header = {"user-agent": "Mozilla/5.0 xx"};
var url = "https://www.google.com.tw";

// Method GET
client.request('get', url, {"key":"value"}, header, function(response) {
    xxx
});

// Method POST
client.request('post', url, {"key":"value"}, header, function(response) {
    xxx
});

</pre>

Synchronous
-----------------

<pre>
var client = require('light-http');
var header = {"user-agent": "Mozilla/5.0 xx"};
var url = "https://www.google.com.tw";

// Method GET
client.request('get', url, {"key":"value"}, header)
.then(function(response) {
    xxx
});

// Method POST
client.request('post', url, {"key":"value"}, header)
.then(function(response) {
    xxx
});

</pre>







HTTP Request Error Handling
----------------------------
<pre>
{ [Error: connect ENETUNREACH] code: 'ENETUNREACH', errno: 'ENETUNREACH', syscall: 'connect' }
</pre>
