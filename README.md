
[[light-http NPM] (https://www.npmjs.com/package/light-http)]


Light-http is a very light library it could easily make a http & https request, also support asynchronous and synchonrous at the same time.

Let's try it !


## How to install light http 
npm install -g light-http

## Example 

### Asynchronous 


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

### Synchronous

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



### Make a Raw HTTP request
<pre>
var http = require('light-http');
var host = "www.google.com.tw";
var port = 80;
var path = "/";
var cookie = 'SID=; HSID=; SSID=jjj; APISID=;';
var msg = [
"GET " + path + " HTTP/1.1",
"host: " + host,
"cookie: " + cookie,
"\r\n"].join("\r\n");

http.rawRequest(host, port, msg)
.then(function (resp) {
    console.log(resp);
});

//http.rawRequest(host, port, msg, function (resp) {
//    console.log(resp);
//});

</pre>

### Make a Raw HTTPS request

You have two ways to indicate this library to use https protocol

1. Set the port to be "443:ssl".
2. Add https:// before the value of host.

<pre>
var http = require('light-http');
var host = "www.google.com.tw";
var url = "https://" + host;
var port = 443; // or port = "443:ssl"
var path = "/";
var cookie = 'SID=; HSID=; SSID=jjj; APISID=;';
var msg = [
"GET " + path + " HTTP/1.1",
"host: " + host,
"cookie: " + cookie,
"\r\n"].join("\r\n");

http.rawRequest(url, port, msg)
.then(function (resp) {
    console.log(resp);
});
</pre>


HTTP Request Error Handling
----------------------------
<pre>
{ [Error: connect ENETUNREACH] code: 'ENETUNREACH', errno: 'ENETUNREACH', syscall: 'connect' }
</pre>


Using lightHttp library on browser
=================================

lightHttp library try to make the code be simplest.


AJAX (GET)
----------

<pre>
<script src="lib.js"></script>
<script src="lightHttp.js"></script>
<script>
obj.ajax("test.html", {"count": 20}, function (content) {
    console.log(content);
});
</script>


</pre>

AJAX (POST)
----------

<pre>
<script src="lib.js"></script>
<script src="lightHttp.js"></script>
<script>
obj.ajaxPost("test.php", {"count": 20}, function (content) {
    console.log(content);
});
</script>


</pre>

