var element = require('./element.js');

function document() 
{
    this.files = [];
    this.body = new element();
}
document.prototype = element.prototype;

var o = document.prototype;
o.files = [];

o.createElement = function (name) 
{
    var elm = new element();
    elm.tagName = name;
    return elm;
};

global.document = new document();
