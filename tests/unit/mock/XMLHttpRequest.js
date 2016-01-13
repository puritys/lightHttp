
function XMLHttpRequest()
{
    this.responseText = "";
    this.readyState = 0;
    this.options = {
        "headers": {}
    };
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

o.setRequestHeader = function(key, value)
{
    this.options.headers[key] = value;
}

o.send = function (data)
{
    this.options.postData = data;
    this.readyState = 4;
    this.responseText = this.options;
    this.onreadystatechange();
}

global.XMLHttpRequest = XMLHttpRequest;
window.XMLHttpRequest = XMLHttpRequest;
