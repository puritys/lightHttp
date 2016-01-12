var php = require('phplike/module');
var Handlebars = require('handlebars');
var yaml = require('yamljs');
var destDir = __dirname + '/../../dest';

Handlebars.registerHelper('include', function (file, data) {
    var source = php.file_get_contents(__dirname + '/../templates/' + file + ".hb.html");
    return composeHtml(source, data.data.root);
});

function gen(file, lang) {
    var filePath, source, dataFile, json = {}, pageDataFile;
    pageDataFile = __dirname + '/../data/pages/' + file + '.yml';
    filePath = __dirname + '/../templates/page.hb.html';
    source = php.file_get_contents(filePath);
    dataFile = __dirname + '/../data/' + lang + '.yml';
    var data = php.file_get_contents(dataFile);
    data = yaml.parse(data);
    data.include = {"main": file};

//    var pageData = php.file_get_contents(pageDataFile);
//    pageData = yaml.parse(pageData);
//    data = php.array_merge(data, pageData);
    convertMenu(data, file);
    return composeHtml(source, data);
}

function composeHtml(content, data) {
    var template = Handlebars.compile(content);
    var result = template(data);
    return result;
}

function convertMenu(data, file) {

    for (var i in data.menu.list) data.menu.list[i].isActive = false;
    switch (file) {
        case 'index':
            data.menu.list[1].isActive = true;
            break;
        case 'browser':
            data.menu.list[2].isActive = true;
            break;
    }
}

var pages = ["index", "browser"];
var langs = ["en", "tw"];
var html, destFile;

for (var key in langs) {
    for (var p in pages) {
        html = gen(pages[p], langs[key]);
        destFile = destDir + "/" +langs[key]+ "/" + pages[p] + '.html';
        php.file_put_contents(destFile, html);
    }
}
