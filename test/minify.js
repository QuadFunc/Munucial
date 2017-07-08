var minify = require('minify');
var fs = require('fs');
var filename = "test.json";
var minifyfilename = "test.min.json";

minify(filename, 'stream', function(error, stream) {
    var streamWrite = fs.createWriteStream(minifyfilename);
    
    if (error)
        console.error(error.message);
    else
        stream.pipe(streamWrite);
});
