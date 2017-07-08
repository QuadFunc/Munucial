/* variable list

pathdataarray : a object of data of the path browser requesting
urlslug : client requesting URL
urldataarray : a object of the request variable (path)


end*/



/* function list

readdata() : read data.json
pathdatabasic(path) : return data of the requesting path
urlcontentbasic() : return
urldatabasic(filetype, slug) : serve the file the slug request and force the top level filetype
cuswriteheader() : writing response header

end*/

/* return array
status : 403, 404, 200
content-type : string of content-type like text/plain
data : data request
message : 403 Forbidden, 404 not found

*/

/*responsearray
status
content-type
message
data

*/