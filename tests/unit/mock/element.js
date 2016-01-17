function element(name) 
{
    this.tagName = (name) ? name : "";
    this.value = "";
    this.child = [];
}

var o = element.prototype;

o.appendChild = function (node) 
{
    this.child.push(node);
};

o.submit = function ()
{

};

module = module.exports = element;
