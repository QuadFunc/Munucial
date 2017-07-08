'use strict'

var express = require('express');
var app = express();
var url = require('url');
var pathdataarray = {};
var urldataarray = {};
var responsearray = {};
var jsonfile = require('jsonfile');
var fs = require('fs');
var dataerrcall = {html:"js", js:"css", css:"none"};
var async = require('async');
var jsonParser = require('body-parser').json;

// markdown and json db update
var jsesc = require('jsesc');
var json = require('jsonfile2');
var markdown = require( "markdown" ).markdown;

// read data.json
function readdata() {
    var file = './data/data.json';
    data = jsonfile.readFileSync(file);
}
readdata();

// api part

app.use(jsonParser());

// using url /api/v1/*

// get all post
app.get('/api/v1/posts', function(req, res) {
    res.json(data);
})

// end api part


/* function list

readdata() : read data.json
pathdata(path) : return data of the requesting path

end*/

app.get('/*', (req, res) => {
    //res.send("URL: "+req.url);
    var q = url.parse(req.url, true);
    var urlslug = q.pathname;

    


    // add trailing slash
    /*if (urlslug.substr(urlslug.length-1, 1) != "/") {
        console.log("start");
        res.writeHead(301, {'Location': urlslug+"/"});
        return res.end();
    }*/



    // get path data
    pathdataarray = pathdatabasic(q.pathname);
    function pathdatabasic(path) {
        tmpdata = 0;
        tmpnum = 0;
        var pathlocdata = {}
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
                    pathlocdata[tmpnum] = path.substr(tmpdata, i-tmpdata);
                    //console.log(pathlocdata[tmpnum]);
                    tmpdata = tmpdata+pathlocdata[tmpnum].length;
                    pathlocdata["levels"]++;
                }
        }
        pathlocdata["path"] = path;
        return pathlocdata;
    }


    // read index.html for home page
    if (q.pathname == "/") {
        fs.readFile("./index.html", function(err, data) {
            
            if (err) {
                //res.writeHead(404);
                //return res.end("404 not found");
            };
            res.writeHead(200, {'Content-Type': 'text/html'});
            res.write(data);
            res.end();
        });
    } else {
        servedatastart();
    }

    //server logic
    function servedatastart() {
        
        if (urlcontentbasic(urlslug) != "err") {
            responsearray["data"] = urlcontentbasic(urlslug);
        } else {
            // call fallback function
            console.log("urlex");
            urlex("none", urlslug);
        }
        console.log("hello world!");
        cuswriteheader();
        includescript();
        writefooter()
        res.end();   
    }

    


    // function urlcontent
    function urlcontentbasic(path) {
        //();
		
        //var contentid = pathdataarray["1"];
        var contentname = data.path[path];
        var content;
	    //console.log(data.post[contentname]);
        if (data.post[contentname] != undefined) {
            content = data.post[contentname]["content"];
		    //console.log(content);
            if (content != undefined) {
            	//writeheader();
                responsearray["status"] = 200;
                //res.writeHead(200, {'Content-Type': 'text/html'});
                return content;
                //res.end();
            } else {
                content = data.post[contentname]["contentpath"];
				content = "."+content;
				///console.log(content);
                fs.readFile(content, function(err, data) {
                    if (err) {
                       return console.log("err");
                    }
                    responsearray["status"] = 200;
                    //res.writeHead(200, {'Content-Type': 'text/html'});
                    return data;
                    //res.end();
                })
            }
        } else {
            return "err";
		}
    }

    // basic function for reading extension-less URL
    function urlexbasic(filetype, slug) {
        var returnarray = {status:null,contenttype:null,data:null,message:undefined};
        if (slug == undefined) {
            slug = "";
        }
        
        if (filetype == "none") {
            var filename;
            console.log("path: "+pathdataarray["1"]);
            if (pathdataarray["1"] == "/pre") {
                console.log("substr");
                filename = urlslug.substr(4, urlslug.length-5);
                console.log("1: "+filename);
            }
        	urldata(q.pathname, "");
            console.log("slug: "+ slug+" filename: "+ filename);
            if (slug != "" || filename != undefined) {
                console.log("what?")
                if (filename != undefined) {
                    filename = "." + filename;
                } else {
                    filename = "." + slug;
                }
                console.log("2: "+filename);
            } else {
                filename = "." + urlslug.substr(0, urlslug.length-1);
            }
            console.log("filename: "+ filename);
            fs.readFile(filename.substr(0, filename.length-1), function(err, data) {
                console.log("readfile");
                if (err) {
                    //returnarray["err"] = true;
                    console.log("404 error");
                    returnarray["status"] = 404;
                };
                var mime = null;
                if (urldataarray.extension == "js") {
            	    mime = "javascript";
                } else {
            	    mime = urldataarray.extension;
                };
            
                /*if (pathdataarray["1"] == "/pre") {
                    returnarray["status"] = 200;
                    returnarray["contenttype"] = 'text/plain';
				    ///res.writeHead(200, {'contenttype': 'text/plain'});
                    console.log("--------need pre");
                    //res.write("<code>");
                    returnarray["data"] = data;
                    //res.write("</code>");
                    //return res.end();
                } else if (pathdataarray["1"] == "/data") {
                    returnarray["status"] = 403;
                    returnarray["message"]
                    //return res.end("403 Forbidden");
                } else {*/
                    console.log("hey running");
                    returnarray["status"] = 200;
                    returnarray["contenttype"] = 'text/'+mime;
				    //res.writeHead(200, {'contenttype': 'text/'+mime});
                    returnarray["data"] = data;
                //}
                console.log("instatus: "+returnarray["status"]);
                //return returnarray;
                //return res.end();
            });
        } else {
        	urldata(q.pathname, filetype);
            var filename;
            if (pathdataarray["1"] == "/pre") {
                console.log("substr");
                filename = urlslug.substr(4, urlslug.length-5);
                console.log("11: "+filename);
            }
            console.log("2slug: "+ slug+" filename: "+ filename);
            if (slug != "" || filename != undefined) {
                if (filename != "") {
                filename = "." + filename +"."+ filetype;
                } else {
                    filename = "." + slug +"."+ filetype;
                }
                console.log("22: "+filename);
                }
                //filename = "." + slug + filetype;
            else {
                filename = "." + urlslug.substr(0, urlslug.length-1) + "." + filetype;
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
            	
                if (pathdataarray["1"] == "/pre") {
                    returnarray["status"] = 200;
                    returnarray["contenttype"] = 'text/plain';
                    //res.writeHead(200, {'contenttype': 'text/plain'});
                    //res.write("<pre><code>");
                    returnarray["data"] = data;
                    //res.write("</code></pre>");
                } else {
                    returnarray["status"] = 200;
                    returnarray["contenttype"] = 'text/'+mime;
                    //res.writeHead(200, {'contenttype': 'text/'+mime});
                    console.log("pure data");
                    returnarray["data"] = data;
                }
                
                //return res.end();
            });
        }
        console.log("------------"+returnarray["status"]);
        return returnarray;
    }
    // a use of urldatabasic function
    /*function urlex(filetypeex, slugex) {
        var returnarray = urldatabasic(filetypeex, slugex);
        //write header
        if (returnarray["status"] == 200) {
            res.sendStatus(200)
            res.set('Content-Type', returnarray["content-type"]);
        } else {
            if (returnarray["message"] != undefined) {
                res.status(returnarray["status"]).send(returnarray["message"]);
            } else {
                res.sendStatus(returnarray["status"]);
            }
        }
        //write body
        res.send(returnarray["data"]);
        if (returnarray["err"]) {
            res.sendStatus(404);
        }
    }*/
    function urlex(filetypeex, slugex) {
        //console.log(urlexbasic(filetypeex, slugex));
        var returnarray = urlexbasic(filetypeex, slugex);
        console.log("return: "+returnarray.status);
        responsearray["status"] = returnarray["status"];
        
        responsearray["contenttype"] = returnarray["contenttype"]
        responsearray["message"] = returnarray["message"];
        responsearray["data"] = returnarray["data"];
    }

    // return the whole path and extension both local or external
    
    function urldatabasic(path, fileexlocal) {
        var fileex = "";
        var returnarray = {};
        if (fileexlocal != "") {
            fileex = fileexlocal;
        }
	    path = path.substr(0, path.length-1);
        returnarray["path"] = path;
        //get extension
        if (fileex != "") {
            returnarray["extension"] = fileex;
        } else {
            tmpdata = path.length;
            for (i=0; i<999; i++) {
                tmpnum = tmpdata-i;
                if (path.substr(tmpnum, 1) == ".") {
                    tmpnum = i;
                    break;
                }
            }
            returnarray["extension"] = path.substr(tmpdata-tmpnum+1, tmpdata+1-tmpdata+tmpnum-1);
        }
        
        //get place (local or external)
        if (path.substr(0, 6) == "http://" || path.substr(0, 7) == "https://"|| path.substr(0,1) == "//") {
            returnarray["place"] = "external";
        } else {
            returnarray["place"] = "local";
        }
        returnarray["path"] = returnarray["path"]
        return returnarray;
        //console.log("path: "+returnarray["path"]+" extension: "+returnarray["extension"]+" place: "+returnarray["place"]);
    }
    // sample of using urldatabasic function
    function urldata(path, fileexlocal) {
        urldataarray = urldatabasic(path, fileexlocal);
        console.log("urldata: "+urldataarray);
    }

    // writing response header
    function cuswriteheader() {
        console.log(responsearray["status"]);

        if (responsearray["status"] == 200) {
            res.writeHead(200);
        } else {
            res.writeHead(responsearray["status"]);
            if (responsearray["message"] != undefined) {
                //res.end(responsearray["message"]);
            } else {
                //res.end();
            }
        }
        //res.writeHead(200);
        
    }

    // include js and css script
    function includescript() {
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

    //include js in footer
    function writefooter() {
        function rpfooter() {
            for (i=0; i<data.global.footer["js"].length; i++) {
                res.write("<script src=\""+data.global.footer.js[i]+"\"></script>");
            }
        }
        rpfooter();
        res.write("</body></html>");
    }

    //response data
    function writebody() {
        res.write(responsearray["data"]);
    }
    
});

app.listen(3000);