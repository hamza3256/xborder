const Binance = require("binance-api-node").default
require('dotenv').config()

const resolveSuccess = (id, result, callback) => {
	callback(200, {
		jobRunID: id,
		data: result,
		statusCode: 200
	});
};

const resolveError = (id, error, callback) => {
	console.log("Error:", error)
	callback(500, {
		jobRunID: id,
		status: "errored",
		error: error.message,
		statusCode: 500
	});
};

const createRequest = (input, callback) => {
	const client = Binance({
		apiKey: process.env.BINANCE_API_KEY,
		apiSecret: process.env.BINANCE_SECRET_KEY
	});
	var date = new Date(); var timestamp = date. getTime();
	const endpoint = input.data.endpoint || "ping";
	const symbol = input.data.symbol || "ETHUSDT";
	const asset = input.data.asset || "BNB";
	switch (endpoint.toLowerCase()) {
		case "ping":
			client.ping().then(result => {
				resolveSuccess(input.id, result, callback);
			}).catch(error => {
				resolveError(input.id, error, callback);
			});
		break;
		case "time":
			client.time().then(result => {
				resolveSuccess(input.id, result, callback)
			}).catch(error => {
				resolveError(input.id, error, callback);
			});
		break;
		case "avgprice":
			client.avgPrice({symbol: symbol}).then(result => {
				resolveSuccess(input.id, result, callback)
			}).catch(error => {
				resolveError(input.id, error, callback);
			});
		break;
		case "exchangeinfo":
			client.exchangeInfo().then(result => {
				resolveSuccess(input.id, result, callback)
			}).catch(error => {
				resolveError(input.id, error, callback);
			});
		break;
		case "accountinfo":
			client.accountInfo().then(result => {
				resolveSuccess(input.id, result, callback)
			}).catch(error => {
				resolveError(input.id, error, callback);
			});
		break;
		case "depositaddress":
			client.depositAddress({asset: asset, timestamp: timestamp}).then(result => {
				resolveSuccess(input.id, result, callback)
			}).catch(error => {
				resolveError(input.id, error, callback);
			});
		break;
		case "systemstatus":
			client.systemStatus().then(result => {
				resolveSuccess(input.id, result, callback)
			}).catch(error => {
				resolveError(input.id, error, callback);
			});
		break;
		default:
			break;
	}
};

exports.gcpservice = (req, res) => {
	createRequest(req.body, (statusCode, data) => {
		res.status(statusCode).send(data);
	});
};

exports.handler = (event, context, callback) => {
	createRequest(event, (statusCode, data) => {
		callback(null, data);
	});
};

exports.handlerv2 = (event, context, callback) => {
	createRequest(JSON.parse(event.body), (statusCode, data) => {
		callback(null, {
			statusCode: statusCode,
			body: JSON.stringify(data),
			isBase64Encoded: false
		});
	});
};

module.exports.createRequest = createRequest;