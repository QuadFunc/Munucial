}).listen(8080);

http.createServer(function (req, res) {
    var fullUrl = req.protocol + '://' + req.get('host') + req.originalUrl;
var requrl = req.get('host') + req.originalUrl;
    res.writeHead(301, {'Location' : 'https://' + requrl})
    res.end();
}).listen(118)

