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
    console.log('punch '+ contador);
    contador++;
    //console.log(JSON.stringify(args.punchRequests[0]));
    if (args.punchRequests[0].additionalData[0].fieldName == 'IDMARCA'){
        idmarca =args.punchRequests[0].additionalData[0].fieldValue;
    }

    badgeGroup = args.punchRequests[0].extendedPunchInfo.badgeInfo.badgeGroup;
    badgeId = args.punchRequests[0].extendedPunchInfo.badgeInfo.badgeId;
    badgeType = args.punchRequests[0].extendedPunchInfo.badgeInfo.badgeType.badge_id_type;
    timeStamp = args.punchRequests[0].isoTimestamp;
    payCode = args.punchRequests[0].payCode;
    transType = args.punchRequests[0].transType.dcd_transaction_type;

    console.log(idmarca,badgeGroup,badgeId,badgeType,timeStamp,payCode,transType);

    //con.connect(function(err) {
  //if (err) throw err;
  //console.log("Connected!");
  var sql = "INSERT INTO marcajes (badgeid,badgetype,timestamp,paycode,transtype) VALUES ?";
  var values = [
    [badgeId,badgeType,timeStamp,payCode,transType],
  ];
  con.query(sql, [values], function (err, result) {
    if (err) throw err;
    console.log("Number of records inserted: " + result.affectedRows);
  });
//});
    
    let salida = { 
    operationSuccessful: true,
    resultCode: 0, 
    resultDescription: null,
    result: {
    	assignmentId: {
    		id: 2313581012
    	},
    	isoTimestamp: '2021-01-27T16:14:31Z',
    	swipeResult: {
    		swipe_process_result: 'SUCCESS'
    	},
    	transType: {
    		dcd_transaction_type: 'SWIPE_OUT'
    	}
    }
};
 

    var result = [];
    //for(var i=0; i<splitted_msg.length; i++){
      result.push(salida);
    //}
    return {
        return: result
        }
}

var contador = 1;
var http = require('http');
var soap = require('soap');
var bodyParser = require('body-parser');
var express = require('express');
var xml = require('fs').readFileSync('E2G_externalClockPunch.wsdl', 'utf8');
var mysql = require('mysql');

var con = mysql.createConnection({
  host: "theacpinnovacion.com",
  user: "root",
  password: "123456",
  database: "marcas",
  insecureAuth : true
});

//http server example
var server = http.createServer(function(request,response) {
    response.end('404: Not Found: ' + request.url);
});
server.listen(8002);

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
