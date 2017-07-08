var fs = require('fs');
var async = require('async');
function hellohello(callbackfunc) {
    fs.readFile("./data/settings.json",'utf8', callbackfunc);
}
async.waterfall([
    function (callback) {
        console.log("1");
        callback();
    },
    function (callback) {
        hellohello(callback);
        //console.log("2");
    },
    function (arg1, callback) {
        console.log("3");
        callback(null, arg1)
    }
], function(err, data) {
    if (err) {
        console.log("err");
    }
    console.log(data);
});