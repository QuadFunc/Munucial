var minify = require('minify');
var fs = require('fs');
var filename = "index.js";
var minifyfilename = "index.min.js";

minify(filename, 'stream', function(error, stream) {
    var streamWrite = fs.createWriteStream(minifyfilename);
    
    if (error)
        console.error(error.message);
    else
        stream.pipe(streamWrite);
});
