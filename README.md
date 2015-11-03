
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

lightHttp library also support any browser in the world to quickly and easily make a ajax, pjax, jsonp.


AJAX (GET)
----------

<pre>
&lt;html>
&lt;script src="lightHttp.min.js"></script>
&lt;script>
var obj = new window.lightHttp();
obj.ajax("test.html", {"count": 20}, function (content) {
    console.log(content);
});
&lt;/script>
&lt;/html>
</pre>

AJAX (POST)
----------

<pre>
&lt;html>
&lt;script src="lightHttp.min.js"></script>
&lt;script>
var obj = new window.lightHttp();
obj.ajaxPost("test.php", {"count": 20}, function (content) {
    console.log(content);
});
&lt;/script>
&lt;/html>
</pre>

JSONP
------
<pre>
&lt;html>
&lt;script src="lightHttp.min.js"></script>
&lt;script>
var obj = new window.lightHttp();
obj.jsonp("testJsonp.php", {"test":1}, function (resp) {
    console.log(resp);
});

&lt;/script>
&lt;/html>
</pre>



