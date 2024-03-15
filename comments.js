// Create web server and listen on port 8080
// Description: This is a simple web server that listens on port 8080 and serves a simple HTML page. The server also listens for POST requests and logs the data to the console.

// Load the http module to create an http server.
var http = require('http');
var fs = require('fs');
var path = require('path');
var url = require('url');
var comments = [];

// Configure our HTTP server to respond with Hello World to all requests.
var server = http.createServer(function (request, response) {
  var uri = url.parse(request.url).pathname;
  var filename = path.join(process.cwd(), uri);

  if (request.method === 'POST') {
    var body = '';
    request.on('data', function(chunk) {
      body += chunk;
    });

    request.on('end', function() {
      var data = JSON.parse(body);
      comments.push(data);
      response.writeHead(200, {'Content-Type': 'text/plain'});
      response.end('Comment added');
    });
  } else {
    fs.exists(filename, function(exists) {
      if (!exists) {
        response.writeHead(404, {'Content-Type': 'text/plain'});
        response.write('404 Not Found\n');
        response.end();
        return;
      }

      if (fs.statSync(filename).isDirectory()) filename += '/index.html';

      fs.readFile(filename, 'binary', function(err, file) {
        if (err) {
          response.writeHead(500, {'Content-Type': 'text/plain'});
          response.write(err + '\n');
          response.end();
          return;
        }

        response.writeHead(200);
        response.write(file, 'binary');
        response.end();
      });
    });
  }
});

// Listen on port 8080
server.listen(8080);
console.log('Server running at http://
