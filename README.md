

* npm install -g light-http


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







HTTP Request Eerror
-------------------
<pre>
{ [Error: connect ENETUNREACH] code: 'ENETUNREACH', errno: 'ENETUNREACH', syscall: 'connect' }
</pre>
