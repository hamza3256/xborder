const assert = require("chai").assert;
const createRequest = require("../index.js").createRequest;

describe("createRequest", () => {
	const jobID = "278c97ffadb54a5bbb93cfec5f7b5503";

	context("when using no endpoint", () => {
		const req = {
			id: jobID,
			data: {}
		};

		it("returns the ping status to the node", (done) => {
			createRequest(req, (statusCode, data) => {
				assert.equal(statusCode, 200);
				assert.equal(data.jobRunID, jobID);
				assert.isTrue(data.data);
				console.log(JSON.stringify(data, null, 1));
				done();
			});
		});
	});

	context("when using the time endpoint", () => {
		const req = {
			id: jobID,
			data: {
				endpoint: "time"
			}
		};

		it("returns the ping status to the node", (done) => {
			createRequest(req, (statusCode, data) => {
				assert.equal(statusCode, 200);
				assert.equal(data.jobRunID, jobID);
				assert.isNumber(data.data);
				console.log(JSON.stringify(data, null, 1));
				done();
			});
		});
	});

	context("when using the avgPrice endpoint", () => {
		const req = {
			id: jobID,
			data: {
				symbol: "BTCUSDT",
				endpoint: "avgPrice"
			}
		};

		it("returns the ping status to the node", (done) => {
			createRequest(req, (statusCode, data) => {
				assert.equal(statusCode, 200);
				assert.equal(data.jobRunID, jobID);
				assert.isNotEmpty(data.data);
				console.log(JSON.stringify(data, null, 1));
				done();
			});
		});
	});

	context("fetching account info", () => {
		const req = {
			id: jobID,
			data: {
				endpoint: "accountInfo"
			}
		};

		it("returns client's account info", (done) => {
			createRequest(req, (statusCode, data) => {
				assert.equal(statusCode, 200);
				assert.equal(data.jobRunID, jobID);
				console.log(JSON.stringify(data, null, 1));
				done();
			});
		});
	});

	context("fetching deposit address", () => {
		const req = {
			id: jobID,
			data: {
				asset: "ETH",
				endpoint: "depositAddress"
			}
		};

		it("returns client's deposit address", (done) => {
			createRequest(req, (statusCode, data) => {
				assert.equal(statusCode, 200);
				assert.equal(data.jobRunID, jobID);
				console.log(JSON.stringify(data, null, 1));
				done();
			});
		});
	});

	context("checking system status", () => {
		const req = {
			id: jobID,
			data: {
				endpoint: "systemStatus"
			}
		};

		it("returns current system status", (done) => {
			createRequest(req, (statusCode, data) => {
				assert.equal(statusCode, 200);
				assert.equal(data.jobRunID, jobID);
				console.log(JSON.stringify(data, null, 1));
				done();
			});
		});
	});




	// context("when using the exchangeInfo endpoint", () => {
	// 	const req = {
	// 		id: jobID,
	// 		data: {
	// 			endpoint: "exchangeInfo"
	// 		}
	// 	};

	// 	it("returns the ping status to the node", (done) => {
	// 		createRequest(req, (statusCode, data) => {
	// 			assert.equal(statusCode, 200);
	// 			assert.equal(data.jobRunID, jobID);
	// 			assert.isNotEmpty(data.data);

	// 			//console.log(JSON.stringify(data, null, 1));
	// 			var d2 = data;
	// 			for (var key in d2) {
	// 				if (d2.hasOwnProperty(key)) {
	// 					console.log(d2[key]);
	// 				}
	// 			}

	// 			// var fs = require('fs');
	// 			// fs.writeFile("test.txt", d2, function(err) {
	// 			// if (err) {
	// 			// 	console.log(err);
	// 			// 	}
	// 			// });
	// 		});
	// 	});
	// });
});