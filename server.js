var E2G_externalClockPunch = {
    E2G_externalClockPunch: {
        MyPort: {
            E2G_externalClockPunchRequest: function(args) {
                console.log("llamada")
                return {
                    name: args.name
                };
            },

            // This is how to define an asynchronous function with a callback.
            MyAsyncFunction: function(args, callback) {
                // do some work
                console.log("async")
                callback({
                    name: args.name
                });
            },

            // This is how to define an asynchronous function with a Promise.
            MyPromiseFunction: function(args) {
                return new Promise((resolve) => {
                  // do some work
                  console.log("promise")
                  resolve({
                    name: args.name
                  });
                });
            },

            // This is how to receive incoming headers
            HeadersAwareFunction: function(args, cb, headers) {
                return {
                    name: headers.Token
                };
            },

            // You can also inspect the original `req`
            reallyDetailedFunction: function(args, cb, headers, req) {
                console.log('SOAP `reallyDetailedFunction` request from ' + req.connection.remoteAddress);
                return {
                    name: headers.Token
                };
            }
        } 
    }
};

// the service
var serviceObject = {
    E2G_externalClockPunch: {
        E2G_externalClockPunchHttpsSoap11Endpoint: {
              E2G_externalClockPunch: splitter_function
        },
        E2G_externalClockPunchHttpSoap11Endpoint: {
              E2G_externalClockPunch: splitter_function
        },
        E2G_externalClockPunchHttpEndpoint: {
              E2G_externalClockPunch: splitter_function
        },
        E2G_externalClockPunchHttpSoap12Endpoint: {
              E2G_externalClockPunch: splitter_function
        },
        E2G_externalClockPunchHttpsSoap12Endpoint: {
            E2G_externalClockPunch: splitter_function
        },
        E2G_externalClockPunchHttpsEndpoint: {
            E2G_externalClockPunch: splitter_function
        },
        E2G_externalClockPunchHttpEndpoint: {
            E2G_externalClockPunch: splitter_function
        }
      }
  };

  // the splitter function, used by the service
function splitter_function(args) {
    console.log('splitter_function');
    console.log(JSON.stringify(args));
    var splitter = args.splitter;
    var splitted_msg = args.message.split(splitter);
    var result = [];
    for(var i=0; i<splitted_msg.length; i++){
      result.push(splitted_msg[i]);
    }
    return {
        result: result
        }
}

var http = require('http');
var soap = require('soap');
var bodyParser = require('body-parser');
var express = require('express');
var xml = require('fs').readFileSync('E2G_externalClockPunch.wsdl', 'utf8');

//http server example
var server = http.createServer(function(request,response) {
    response.end('404: Not Found: ' + request.url);
});

server.listen(8000);
soap.listen(server, '/wsdl', serviceObject, xml, function(){
  console.log('server initialized');
});

//express server example
var app = express();
//body parser middleware are supported (optional)
app.use(bodyParser.raw({type: function(){return true;}, limit: '5mb'}));
app.listen(8001, function(){
    //Note: /wsdl route will be handled by soap module
    //and all other routes & middleware will continue to work
    soap.listen(app, '/wsdl', serviceObject, xml, function(){
      console.log('server initialized');
    });
});