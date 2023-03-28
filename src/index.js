var http = require('http'); // importing built http module

//create a server object:
http.createServer(function (req, res) {
  res.write('Hello from chankya uni!'); //write a response to the client
  res.end(); //end the response
}).listen(3000);

// http packahges are non use friendly
// so there is a need of framework like     