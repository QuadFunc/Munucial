'use strict'

var express = require('express');
var app = express();
var jsonpharser = require('body-parser').json;
var jsonfile = require('jsonfile');
var data;
// read data.json
function readdata() {
    var file = './data/data.json';
    data = jsonfile.readFileSync(file);
}
readdata();
app.use(jsonpharser());
app.get('/api/v1/posts', function(req, res) {
    res.json(data.post);
})
app.listen(8080);