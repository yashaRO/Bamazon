var http = require ('http')

var PORT = 7000

function handleRequest(request, response) {
response.end('it works! I looked up ' + request.url)
}

var server = http.createServer(handleRequest)

server.listen(PORT, function() {
  console.log('server is listening on localhost:%s', PORT);
})