const assert = require("chai").assert;
const createRequest = require("../index.js").createRequest;

describe("createRequest", () => {
	const jobID = "278c97ffadb54a5bbb93cfec5f7b5503";
	const depositParamsUSD = {
		amount: '1.00',
		currency: 'USD',
		coinbase_account_id: '6e5b46db-1109-56b0-b56e-ce4ca367f408', // USD Coinbase Account ID
	  };
	  const sellParams = {
		price: '110.00', // USD
		size: '1', // BTC
		product_id: 'BTC-USD',
	  };
	context("should retrieve coinbase pro accounts", () => {
		const req = {
			id: jobID,
			data: {
                endpoint: "getAccounts"
            }
		};

		it("returns all coinbase accounts", (done) => {
			createRequest(req, (statusCode, data) => {
				assert.equal(statusCode, 200);
				assert.equal(data.jobRunID, jobID);
				assert.isNotEmpty(data.data);
				console.log(JSON.stringify(data, null, 1));
				done();
			});
		});
	});

	context("should retrieve all available payment methods", () => {
		const req = {
			id: jobID,
			data: {
                endpoint: "getPaymentMethods"
            }
		};

		it("returns payment methods", (done) => {
			createRequest(req, (statusCode, data) => {
				assert.equal(statusCode, 200);
				assert.equal(data.jobRunID, jobID);
				assert.isNotEmpty(data.data);
				console.log(JSON.stringify(data, null, 1));
				done();
			});
		});
	});

	context("should deposit to your Exchange GBP account from your Coinbase GBP account.", () => {
		const req = {
			id: jobID,
			data: {
				deposit: depositParamsUSD,
                endpoint: "deposit"
            }
		};

		it("returns deposit result", (done) => {
			createRequest(req, (statusCode, data) => {
				assert.equal(statusCode, 200);
				assert.equal(data.jobRunID, jobID);
				assert.isNotEmpty(data.data);
				console.log(JSON.stringify(data, null, 1));
				done();
			});
		});
	});

	context("should sell", () => {
		const req = {
			id: jobID,
			data: {
				sellParams: sellParams,
                endpoint: "placeOrder"
            }
		};

		it("returns sell result", (done) => {
			createRequest(req, (statusCode, data) => {
				assert.equal(statusCode, 200);
				assert.equal(data.jobRunID, jobID);
				assert.isNotEmpty(data.data);
				console.log(JSON.stringify(data, null, 1));
				done();
			});
		});
	});
});