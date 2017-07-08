var http = require('http');
var url = require('url');
var fs = require('fs');
var dataerrcall = {html:"js", js:"css", css:"none"};
var urldataarray = {path:"n/a", extension:"n/a", place:"n/a"};
var pathdataarray = {path:"", levels:0};
var tmpdata;
var tmpchar = "";
var tmpnum = 0;
var globaldata;
var setting = {};
//node js can't excute PHP codes

http.createServer(function (req, res) {
    //var fullUrl = req.protocol + '://' + req.get('host') + req.originalUrl;
    //var requrl = req.get('host') + req.originalUrl;
    var q = url.parse(req.url, true);
    var urlslug = q.pathname;
    //console.log(urlslug);
    //console.log(urlslug.substr(urlslug.length-1, 1));
    if (urlslug.substr(urlslug.length-1, 1) != "/") {
        //console.log("start");
        res.writeHead(301, {'Location': q.pathname+"/"});
        return res.end();   
        //res.end();
    }
    //addslash(q.pathname);
    pathdata(q.pathname);
    console.log(pathdataarray["1"]);
    if (pathdataarray["1"] == "/setting") {
        pathdata(q.pathname);
        res.write("you're in setting");
        res.end();
    } else if (q.pathname == "/") {
        fs.readFile("./index.html", function(err, data) {
            if (err) {
                res.writeHead(404);
                return res.end("404 not found");
            };
            res.writeHead(200, {'Content-Type': 'text/html'});
            res.write(data);
            return res.end();
        });
    } else {
        urlex("html");
    }
    function urlex(filetype, slug) {
        if (slug == undefined) {
            slug = "";
        }
        if (filetype == "none") {
            if (slug != "") {
                var filename = "." + slug;
            } else {
                var filename = "." + urlslug.substr(0, urlslug.length-1);
            }
            fs.readFile(filename, function(err, data) {
            if (err) {
		        res.writeHead(404)
                res.write("The path" + q.pathname + "is not found <br />");
                return res.end("404 not found");
            };  
            res.writeHead(200, {'Content-Type': 'text/html'});
            //res.write("<pre>");
            res.write(data);
            //res.write("</pre>");
            urldata(q.pathname, "");
            return res.end();
            });
        } else {
            if (slug != "") {
                var filename = "." + slug + filetype;
            } else {
                var filename = "." + urlslug.substr(0, urlslug.length-1) + "." + filetype;
            }
            fs.readFile(filename, function(err, data) {
            if (err) {
		        return urlex(dataerrcall[filetype]);
            }  
            res.writeHead(200, {'Content-Type': 'text/html'});
            //res.write("<pre>");
            res.write(data);
            //res.write("</pre>");
            urldata(q.pathname, filetype);
            return res.end();
            });
        }
    }

    var fileex = "";
    function urldata(path, fileexlocal) {
        if (fileexlocal != "") {
            fileex = fileexlocal;
        }
        urldataarray["path"] = path;
        //get extension
        if (fileex != "") {
            urldataarray["extension"] = fileex;
        } else {
            tmpdata = path.length;
            for (i=0; i<999; i++) {
                tmpnum = tmpdata-i;
                if (path.substr(tmpnum, 1) == ".") {
                    tmpnum = i;
                    break;
                }
            }
            urldataarray["extension"] = path.substr(tmpdata-tmpnum+1, tmpdata+1-tmpdata+tmpnum-1);
        }
        
        //get place (local or external)
        if (path.substr(0, 6) == "http://" || path.substr(0, 7) == "https://"|| path.substr(0,1) == "//") {
            urldataarray["place"] = "external";
        } else {
            urldataarray["place"] = "local";
        }
        urldataarray["path"] = urldataarray["path"]
        //res.write("path: "+urldataarray["path"]+" extension: "+urldataarray["extension"]+" place: "+urldataarray["place"]);
    }
    function pathdata(path) {
        tmpdata = 0;
        tmpnum = 0;
        //console.log("hi");
        for (i=1; i<50; i++) {
            //console.log("start");
            //console.log(path.substr(i, 1));
               if (path.substr(i, 1) == ".") {
                    //console.log("stop");
                    break;
                }
                //having error when reading with only one level eg. /setting
                if (path.substr(i, 1) == "/") {
                    tmpnum++;
                    //console.log(tmpnum);
                    pathdataarray[tmpnum] = path.substr(tmpdata, i-tmpdata);
                    //console.log(pathdataarray[tmpnum]);
                    tmpdata = tmpdata+pathdataarray[tmpnum].length;
                    pathdataarray["levels"]++;
                }
        }
        pathdataarray["path"] = path;
        //console.log(pathdataarray["1"]);
    }
    function settingdata() {
        //今天要做的是設定UI
        fs.readFile('template.js', function(err, data){
            if (err) {
                console.log("error");
            }
            globaldata = data;
        })
        tmpdata = tmpdata+"modifysetting()";
        fs.writeFile('index.js', tmpdata,  function(err) {
            if (err) {
            return console.error(err);
            }
        });
    }
    function modifysetting(settingdata) {
        for (i=1; i<10; i++) {
            console.log(i);
            setting = settingdata;
        }
    }

