var beep = require('beepbeep');
const request = require('request');
const cron = require("node-cron");

//api id 4a9abbed
// api key 9b0da01d94cdf04407330878f53d9a6f

//curl -X GET --header 'Accept: application/json' 
// --header 'X-VO-Api-Id: 4a9abbed' --header 'X-VO-Api-Key: 9b0da01d94cdf04407330878f53d9a6f' 
// 'https://api.victorops.com/api-public/v1/incidents'

console.log("ESTOY FUNCIONANDO");

cron.schedule("5 * * * *", function() {
	console.log("una vuelta!");
    var options = {
	  url: 'https://api.victorops.com/api-public/v1/incidents',
	  headers: {
		'Accept': 'application/json',
		'X-VO-Api-Id': '4a9abbed',
		'X-VO-Api-Key': '9b0da01d94cdf04407330878f53d9a6f'
	  }
	};
	function result_ack(error, response, body) {
	  if (!error && response.statusCode == 200) {
		console.log(body);
	  }
	}
	function result(error, response, body) {
	  if (!error && response.statusCode == 200) {
		var data = JSON.parse(body);
		for(var i = 0;i<data.incidents.length;i++)
		{
			console.log(data.incidents[i].currentPhase);
			if(data.incidents[i].currentPhase != 'ACKED' && data.incidents[i].currentPhase != 'RESOLVED'){
				beep(4);
				console.log(data.incidents[i]);
				console.log(data.incidents[i].incidentNumber);
				// ACK
				var options_ack_txt = '{ "userName": "emilse", "incidentNumber": ['+data.incidents[i].incidentNumber+'], "message": "" }';
				var options_ack = {
				  url: 'https://api.victorops.com/api-public/v1/incidents/ack',
				  headers: {
					'Accept': 'application/json',
					'X-VO-Api-Id': '4a9abbed',
					'X-VO-Api-Key': '9b0da01d94cdf04407330878f53d9a6f'
				  },
				  body: options_ack_txt
				};
				console.log(options_ack);
				request(options_ack, result_ack);
			}
		}
	  }
	}
	request(options, result);
});