
function XMLHttpRequest()
{
    this.responseText = "";
    this.readyState = 0;
    this.options = {};
}

var o = XMLHttpRequest.prototype;
o.timeout = 100;
o.onreadystatechange = null;
o.readyState = 0;
o.responseText = "";
o.options = {};

o.open = function (type, url)
{
    this.options.type = type;
    this.options.url = url;
}

o.send = function (data)
{
    this.postData = data;
    this.readyState = 4;
    this.responseText = this.options;
    this.onreadystatechange();
}

global.XMLHttpRequest = XMLHttpRequest;
window.XMLHttpRequest = XMLHttpRequest;
