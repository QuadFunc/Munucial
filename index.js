var Feed = require('rss-to-json');
var express = require('express');
var app = express();
var jsonParser = require('body-parser').json;
var rssparser = require('xml2json');
var rssjson;

app.use(jsonParser());

app.post('/api/v1/rss/json', function(req, res) {
	if (req.body.rssurl != undefined) {
		var rssurl = req.body.rssurl;
		Feed.load(rssurl, function(err, rss) {
			rssjson = rss;
		}
	} else {
		var rssdata = req.body.rssdata;
		rssjson = rssparser.toJson(rssdata);
    }
	res.json(rssjson);
}
