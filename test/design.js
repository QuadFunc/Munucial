var json = require('jsonfile2');
var markdown = require( "markdown" ).markdown;
// This...
//var file = json.read('./test.json');

// Is equivilent to this...
//var file = new json.File('../test/test.json');
//file.readSync();
//file.
var data;
var file;
function updatedata(data, value, type) {
	
	if (type) {
		file = json.read('./test.json');
	}
	file.update(function(err, save) {
		this.set(data, value);
		save();
	});
}
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
}
//escapechar(data);

//update/add post

//updatedata("post.hello",escapechar(convertmd("###hi##h2")), true);
