#!/usr/bin/env node

/**
 * Created by Ernest on 1/24/2016.
 */
var http = require("http"),
    url = require("url"),
    path = require("path"),
    fs = require("fs"),
    mime = require("mime"),
    port = process.argv[2] || 8888,
    dirPath = process.argv[3] || process.cwd();


http.createServer(function(request, response) {

    var uri = url.parse(request.url).pathname
        , filename = path.join(dirPath, uri);

    fs.exists(filename, function(exists) {
        if(!exists) {
            response.writeHead(404, {"Content-Type": "text/plain"});
            response.write("404 Not Found\n");
            response.end();
            return;
        }

        if (fs.statSync(filename).isDirectory()) filename += '/index.html';

        fs.readFile(filename, "binary", function(err, file) {
            if(err) {
                response.writeHead(500, {"Content-Type": "text/plain"});
                response.write(err + "\n");
                response.end();
                return;
            }

            response.writeHead(200,  {"Content-Type": mime.lookup(filename)});
            response.write(file, "binary");
            response.end();
        });
    });
}).listen(parseInt(port, 10));

console.log("Ernest server running at\n  => http://localhost:" + port + " " +
    "for "+ dirPath + " "+
    "/\nCTRL + C to shutdown");
