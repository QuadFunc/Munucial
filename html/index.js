var http = require('http');
var url = require('url');
var fs = require('fs');
var jsonfile = require('jsonfile');
var dataerrcall = {html:"js", js:"css", css:"none"};
var urldataarray = {path:"n/a", extension:"n/a", place:"n/a"};
var pathdataarray = {path:"", levels:0};
var timeunitarray = ["year", "month", "day", "hour", "minute", "second"];
var timedataarray = [null];
var timestampvar = new Date();
var tmpdata;
var tmpchar = "";
var tmpnum = 0;
var tmparray = {};
var settings;
var data;
var alertsetting = {type:"", text:"", deny:"true"};
//node js can't excute PHP codes

http.createServer(function (req, res) {
    //var fullUrl = req.protocol + '://' + req.get('host') + req.originalUrl;
    //va requrl = req.get('host') + req.originalUrl;
    var q = url.parse(req.url, true);
    var urlslug = q.pathname;
    readdata();
    //readsettings();
    //console.log(urlslug);
    //console.log(urlslug.substr(urlslug.length-1, 1));
    //writeheader();
	console.log("str "+ urlslug.substr(urlslug.length-1, 1));
    if (urlslug.substr(urlslug.length-1, 1) != "/") {
        console.log("start");
        res.writeHead(301, {'Location': urlslug+"/"});
        return res.end();
    }
    //addslash(q.pathname);
    pathdata(q.pathname);
    //console.log(pathdataarray["1"]);
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
        
        urlcontent();
    }
    function urlcontent() {
        //();
		
        var contentid = pathdataarray["1"];
        var contentname = data.path[contentid];
        var content;
	console.log(data.post[contentname]);
        if (data.post[contentname] != undefined) {
            content = data.post[contentname]["content"];
		console.log(content);
            if (content != undefined) {
            	writeheader();
                //res.writeHead(200, {'Content-Type': 'text/html'});
                res.write(content);
                res.end();
            } else {
                content = data.post[contentname]["contentpath"];
				content = "."+content;
				console.log(content);
                fs.readFile(content, function(err, data) {
                    if (err) {
                       return console.log("err");
                    }
                    writeheader();
                    //res.writeHead(200, {'Content-Type': 'text/html'});
                    res.write(data);
                    res.end();
                })
            }
        } else {
	    urlex("html");
		}
    }
    function urlex(filetype, slug) {
        if (slug == undefined) {
            slug = "";
        }
        if (filetype == "none") {
        	urldata(q.pathname, "");
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
            var mime = null;
            if (urldataarray.extension == "js") {
            	mime = "javascript";
            } else {
            	mime = urldataarray.extension;
            };
            res.writeHead(200);
            //res.write("<pre>");
            res.write(data);
            //res.write("</pre>");
            
            return res.end();
            });
        } else {
        	urldata(q.pathname, filetype);
            if (slug != "") {
                var filename = "." + slug + filetype;
            } else {
                var filename = "." + urlslug.substr(0, urlslug.length-1) + "." + filetype;
            }
            fs.readFile(filename, function(err, data) {
                if (err) {
					return urlex(dataerrcall[filetype]);
                }  
                var mime = null;
            	if (urldataarray.extension == "js") {
            		mime = "javascript";
            	} else {
            		mime = urldataarray.extension;
            		console.log("ok");
            	};
            	res.writeHead(200, {'Content-Type': 'text/'+mime});
                //res.write("<pre>");
                res.write(data);
                //res.write("</pre>");
                
                return res.end();
            });
        }
    }

    var fileex = "";
    function urldata(path, fileexlocal) {
        if (fileexlocal != "") {
            fileex = fileexlocal;
        }
	path = path.substr(0, path.length-1);
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
        console.log("path: "+urldataarray["path"]+" extension: "+urldataarray["extension"]+" place: "+urldataarray["place"]);
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
    function modifysetting() {
        if (pathdataarray["1"] == "/setting") {
            res.writeHead(200, {'Content-Type': 'text/html'});
            res.write("<!DOCTYPE HTML><html><head></head><body>"); //write header
            res.write("setting"); //setting
            res.write("</body></html>"); //write footer
        }
    }
    //undex erveloping
    function pushalert(type, text, deny) {
        if (deny == undefined) {
            deny == true;
        }
    }
    function writeheader() {
        //res.writeHead(200, {'Content-Type': 'text/html'});
        res.write("<!DOCTYPE HTML><html><head>");
		res.write(data.global.header.meta);
        function rpheader(type) {
            for (i=0; i<data.global.header[type].length; i++) {
                if (type == "css") {
                    res.write("<link href=\""+data.global.header[type][i]+"\" rel=\"stylesheet\">");
                } else {
                    res.write("<script src=\""+data.global.header[type][i]+"\"></script>");
                }
            }
        }
        rpheader("css");
        rpheader("js");
        res.write("</head><body>");
    }
    function writefooter() {
        function rpheader() {
            for (i=0; i<data.global.header["footer"].length; i++) {
                res.write("<script src=\""+data.global.header["footer"][i]+"\"></script>");
            }
            res.write("</body></html>")
        }
    }
    function updatetimestamp(type, name) {
        
    }
    
    function readdata() {
        var file = './data/data.json';
        data = jsonfile.readFileSync(file);
    }
    function readsettings() {
        var file = './data/settings.json';
        settings = jsonfile.readFileSync(file);
    }
    function timedecode(path) {
        var tmpdata = 0;
        var tmpnum = 0;
        //console.log("hi");
        for (i=1; i<100; i++) {
            //console.log("start");
            //console.log(path.substr(i, 1));
               if (path.substr(i, 1) == "Z") {
                    //console.log("stop");
                    break;
                }
                //having error when reading with only one level eg. /setting
                if (path.substr(i, 1) == "-" || path.substr(i, 1) == ":" || path.substr(i, 1) == "T" || path.substr(i, 1) == ".") {
                    tmpnum++;
                    //console.log(tmpnum);
                    if (tmpnum != 1) {
                        timedataarray.push(path.substr(tmpdata+1, i-tmpdata-1)); 
                        tmpdata = tmpdata+timedataarray[tmpnum].length+1;   
                    } else {
                        timedataarray.push(path.substr(tmpdata, i-tmpdata));
                        tmpdata = tmpdata+timedataarray[tmpnum].length;
                    }
                }
        }
        timedataarray.shift();
        console.log(timedataarray);
        for (i=0; i<timedataarray.length; i++) {
            console.log(timeunitarray[i]+" "+timedataarray[i]);
        }
    }
    function writerespond(towrite, needreturn) {
        if (needreturn == undefined) {
            needreturn = true;
        }
        res.writeHead(200, {'Content-Type': 'text/html'});
        res.write(towrite);
        if (needreturn) {
            return res.end();
        } else {
            res.end();
        }
    }
	function urlpredata() {
		if (pathdataarray["1"] == "/pre") {
			
		}
}).listen(3000);
/*
http.createServer(function (req, res) {
    var fullUrl = req.protocol + '://' + req.get('host') + req.originalUrl;
var requrl = req.get('host') + req.originalUrl;
    res.writeHead(301, {'Location' : 'https://' + requrl})
    res.end();
}).listen(118)
*/
