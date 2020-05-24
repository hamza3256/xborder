const CoinbasePro = require("coinbase-pro");

require('dotenv').config();
// const apiURI = 'https://api.pro.coinbase.com';
// const key = process.env.COINBASE_PRO_KEY;
// const secret = process.env.COINBASE_PRO_SECRET;
// const passphrase = process.env.COINBASE_PRO_PASSPHRASE;

const apiURI = 'https://api-public.sandbox.pro.coinbase.com';
const key = process.env.SANDBOX_COINBASE_PRO_KEY;
const secret = process.env.SANDBOX_COINBASE_PRO_SECRET;
const passphrase = process.env.SANDBOX_COINBASE_PRO_PASSPHRASE;



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
	var client = new CoinbasePro.AuthenticatedClient(
		key,
		secret,
		passphrase,
		apiURI
	);
	//var date = new Date(); var timestamp = date. getTime();
	const endpoint = input.data.endpoint;
	const symbol = input.data.symbol || "ETHUSDT";
	const asset = input.data.asset || "BNB";
	const depositParamsUSD = input.data.depositParamsUSD;
	const sellParams = input.data.sellParams;
	switch (endpoint.toLowerCase()) {
		case "getaccounts":
            client.getCoinbaseAccounts().then(result => {
					resolveSuccess(input.id, result, callback);
				}).catch(error => {
					resolveError(input.id, error, callback);
				});
		break;
		case "getpaymentmethods":
			client.getPaymentMethods().then(result => {
				resolveSuccess(input.id, result, callback);
				}).catch(error => {
					resolveError(input.id, error, callback);
				});
		break;
		case "deposit":
			const depositParamsUSD = {
				amount: '1.00',
				currency: 'USD',
				coinbase_account_id: '6d001a91-f03b-5e04-8f83-adf665517093', // USD Coinbase Account ID
			  };
			  client.deposit(depositParamsUSD).then(result => {
				resolveSuccess(input.id, result, callback);
				}).catch(error => {
					resolveError(input.id, error, callback);
				});
		break;
		case "sell":
			
			  client.sell({sellParams: sellParams}).then(result => {
				resolveSuccess(input.id, result, callback);
				}).catch(error => {
					resolveError(input.id, error, callback);
				});
		break;



            // client.getAccounts().then(result => {
			// 	resolveSuccess(input.id, result, callback);
			// }).catch(error => {
			// 	resolveError(input.id, error, callback);
			// });
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