
function FormData() 
{
    this.files = [];
}

var o = FormData.prototype;
o.files = [];

o.append = function (field, inputFile, content) 
{
    this.files.push({
        field: field,
        inputFile: inputFile,
        content: content
    });
};

global.FormData = FormData;
