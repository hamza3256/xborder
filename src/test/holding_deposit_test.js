const HoldingDeposit = artifacts.require("HoldingDeposit");
const HoldingDepositFactory = artifacts.require("HoldingDepositFactory");

contract("HoldingDepositFactory", accounts => {

	let hd_factory;
	let hd;
	let hd_address;

	beforeEach(async () => {
		hd_factory = await HoldingDepositFactory.new();

		let session_id_hash = "0xdc345837d24517858368a28c2022936404ae5a64e78dcac16331108d53eeca9c";
		let result = await hd_factory.open_check_hold_deposit(session_id_hash);

		hd_address = result.logs[0].args.check_hold_deposit_contract;
		hd = await HoldingDeposit.at(hd_address);
	});

	describe("check_hold Deposit Factory", () => {

		it("deploys a check_hold deposit contract", async () => {
			assert.ok(hd_factory.contract.options.address);
			assert.ok(hd.contract.options.address);
		});

		it('emits an event when the check_hold contract is deployed', () => {
			hd_factory.getPastEvents('check_hold_deposit_created', (err, events) => {
				assert.notEqual(0, events.length, "No check_hold_deposit_created events were found");
			});
		});

		it('sets the caller of open_check_hold deposit to be the payer on the check_hold contract', async () => {
			let participants = await hd.get_participants();
			assert.equal(participants[0], accounts[0], "The payer was not properly set");
		});

		it('creates a mapping entry for the newly created check_hold contract under a session id',
			async () => {
			let session_id_hash = "0xdc345837d24517858368a28c2022936404ae5a64e78dcac16331108d53eeca9c";
			let result = await hd_factory.get_check_hold_deposit_contract(session_id_hash);
			assert.equal(result, hd.contract.options.address);
		});
	});


	describe("check_hold Deposit", () => {

		describe("Constructor", () => {
			it("Sets the payer, status and opens the check_hold", async () => {
				let participants = await hd.get_participants();
				let payer = participants[0];
				assert.equal(payer, accounts[0]);

				let payer_curr_status = await hd.get_payer_curr_status();
				assert.equal(payer_curr_status, true);

				let open = await hd.is_open();
				assert.equal(open, true);
			});
		});

		describe("Depositing deposit_amount", () => {
			it("sets up the payee, their deposit and status in the check_hold contract",
				async () => {

				let tx = await hd.deposit_amount({
					from: accounts[1],
					value: web3.utils.toWei('1', 'ether')
				});

				let participants = await hd.get_participants();
				assert.equal(participants[1], accounts[1]);

				let payee_curr_status = await hd.get_payee_curr_status();
				assert.equal(payee_curr_status, true);

				let deposit = await hd.get_deposit_amount();
				assert.equal(Number(deposit), Number(web3.utils.toWei('1', 'ether')));
			});

			it("prevents the payer from depositing into their own check_hold", async () => {
				try {
					await hd.deposit_amount({
						from: accounts[0],
						value: 10
					});
				}
				catch (err) {
					assert.include(err.message, "revert");
				}
			});

			it("emits an event when the deposit is complete", async () => {
				let tx = await hd.deposit_amount({
					from: accounts[1],
					value: 10
				});
				assert.equal("deposit_amount_deposited", tx.logs[0].event);
			});
		});


		describe("Updating status", () => {

			it("lets the payee chec_curr their status, refunding them the deposit", async () => {
				let tx = await hd.deposit_amount({
					from: accounts[1],
					value: web3.utils.toWei('5', 'ether')
				});

				let pre_balance = Number(await web3.eth.getBalance(accounts[1]));

				let tx2 = await hd.check_curr_status(false, {
					from: accounts[1]
				});

				let post_balance = Number(await web3.eth.getBalance(accounts[1]));

				let deposit = Number(await hd.get_deposit_amount());
				assert.equal(deposit, 0);
				assert.isAbove(post_balance, pre_balance);
			});

			it("emits an event when the status is chec_currd", async () => {
				let tx = await hd.check_curr_status(false, {
					from: accounts[0]
				});

				assert.equal("curr_status_checkd", tx.logs[0].event);
			});
		});


		describe("Handles a Complete check_hold Deposit from start to finish", () => {
			it("forfeits deposit", async () => {
				// payee deposits deposit_amount
				let tx1 = await hd.deposit_amount({
					from: accounts[1],
					value: web3.utils.toWei('5', 'ether')
				});

				let deposit_refund_checker_1 = await hd.is_refund_checker();
				assert.equal(true, deposit_refund_checker_1);

				// payer chec_currs deposit status
				let tx3 = await hd.chec_curr_deposit_curr_status(false, {
					from: accounts[0]
				});

				let deposit_refund_checker_2 = await hd.is_refund_checker();
				assert.equal(false, deposit_refund_checker_2);
				assert.equal("deposit_curr_status_checkd", tx3.logs[0].event);

				let pre_payer_balance = Number(await web3.eth.getBalance(accounts[0]));

				// payee chec_currs their status
				let tx4 = await hd.check_curr_status(false, {
					from: accounts[1]
				});

				let post_payer_balance = Number(await web3.eth.getBalance(accounts[0]));
				assert.isAbove(post_payer_balance, pre_payer_balance);

				let deposit = await hd.get_deposit_amount();
				assert.equal(0, deposit);
			});

			it("redeposit_amount deposit", async () => {
				// payee deposits deposit_amount
				let tx1 = await hd.deposit_amount({
					from: accounts[1],
					value: web3.utils.toWei('5', 'ether')
				});

				let pre_payee_balance = Number(await web3.eth.getBalance(accounts[1]));

				// payee chec_currs their status
				let tx4 = await hd.check_curr_status(false, {
					from: accounts[1]
				});

				let post_payee_balance = Number(await web3.eth.getBalance(accounts[1]));
				assert.isAbove(post_payee_balance, pre_payee_balance);

				let deposit = await hd.get_deposit_amount();
				assert.equal(0, deposit);
			});
		});
	});
});
