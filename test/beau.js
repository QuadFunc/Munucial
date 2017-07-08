var beautify = require('js-beautify').js_beautify,
    fs = require('fs');
var json = require('jsonfile2');
var filepath = "./test.json";
 
fs.readFile(filepath, 'utf8', function (err, data) {
    if (err) {
        throw err;
    }
    var data = (beautify(data, { indent_size: 2 }));
	var file = json.read(filepath);
	file.update(function(err, save) {
		this.set('', data);
		save();
	});
});
