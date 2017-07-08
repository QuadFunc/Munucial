// var showdown  = require('showdown'),
//     converter = new showdown.Converter(),
//     text      = 'Hello\n\n I\'m Andrew',
//     html      = converter.makeHtml(text);
//console.log(html);
var jsesc = require('jsesc');
var json = require('jsonfile2');
var markdown = require( "markdown" ).markdown;
// This...
//var file = json.read('./test.json');
var express = require('express');
var app = express();

// Is equivilent to this...
//var file = new json.File('../test/test.json');
//file.readSync();
//file.
var data;
var file;
file = json.read('../data/data.json');
function updatedata(data, value, type) {
	if (type) {
		file = json.read('./test.json');
	}
	data.update(function(err, save) {
		this.set(data, value);
		save();
	});
}
// updatedata("post.test", html, true);
//updatedata('page.hello', 'blah', true);
function deletedata(data, type) {
	if (type) {
		file = json.read('./test.json');
	}
	file.del(data);
}
//deletedata('page.hello', true)
function covertmd(text) {
	return markdown.toHTML(text);
}
//convertmd("###hi");
function escapechar(text) {
	return jsesc(text);
};
//var custom = require('./design.js');
//console.log();

// app.get('/', function(req, res) {
// 	res.send(markdown.toHTML('### hello\n* I\'m Andrew'));
// 	console.log(markdown.toHTML('### hello\n* I\'m Andrew'));
// })
// app.listen(8088);
// var url = require('url');
// var jsonParser = require('body-parser').json;

// app.use(jsonParser());

// app.post('/convert', function(req, res) {
// 	var i = req.body;
// 	var txt = jsesc(i.md);
// 	res.json({hi:req.body.md});
// });
// app.listen(8088);
var express = require('express');
var bodyParser = require('body-parser');
var app     = express();
var jsonfile = require('jsonfile');
var data = jsonfile.readFileSync("./test.json");

//Note that in version 4 of express, express.bodyParser() was
//deprecated in favor of a separate 'body-parser' module.
app.use(bodyParser.urlencoded({ extended: true })); 

//app.use(express.bodyParser());

app.post('/convert', function(req, res) {
  res.send(markdown.toHTML(req.body.md));
});
app.get('/form', function(req, res) {
	res.send("<form action=\"http://localhost:8080/convert\" method=\"post\" id=\"mdform\"><input type=\"submit\"><textarea name=\"md\" form=\"mdform\">Enter text here...</textarea></form>");
});
app.get('/data', function(req, res) {
	file = json.read('./test.json');
	file.update(function(err, save) {
		this.set(data.post, "what?");
		save();
	});
	res.json(data);
})


app.listen(8080, function() {
  console.log('Server running at http://127.0.0.1:8080/');
});
