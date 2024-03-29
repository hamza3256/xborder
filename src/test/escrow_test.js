const Escrow = artifacts.require("Escrow");
const EscrowFactory = artifacts.require("EscrowFactory");

contract("EscrowFactory", accounts => {

	let escrow_factory;
	let escrow_contract;
	let escrow_contract_address;

	beforeEach(async () => {
		escrow_factory = await EscrowFactory.new();

		let session_id_hash = "0xdc345837d24517858368a28c2022936404ae5a64e78dcac16331108d53eeca9c";
		let result = await escrow_factory.open_escrow(session_id_hash, session_id_hash);

		escrow_contract_address = result.logs[0].args.escrow_contract;
		escrow_contract = await Escrow.at(escrow_contract_address);
	});


	// Escrow factory tests
	describe('Escrow Factory', () => {

		it('deploys an escrow contract', () => {
			assert.ok(escrow_factory.contract.options.address);
			assert.ok(escrow_contract.contract.options.address);
		});

		it('emits an event when the escrow contract is deployed', () => {
			escrow_factory.getPastEvents('escrow_activated', (err, events) => {
				assert.notEqual(0, events.length, "No escrow_activated events were found");
			});
		});

		it('sets the caller of open_escrow to be the payer on the escrow contract', async () => {
			let participants = await escrow_contract.get_participants();
			assert.equal(participants[0], accounts[0], "The payer was not properly set");
		});

		it('creates a mapping entry for the newly created escrow under a session id',
			async () => {
			let session_id_hash = "0xdc345837d24517858368a28c2022936404ae5a64e78dcac16331108d53eeca9c";
			let result = await escrow_factory.get_escrow(session_id_hash);
			assert.equal(result, escrow_contract.contract.options.address);
		});
	});


	// Escrow tests
	describe("Escrow", () => {

		it('should allow a payee to deposit deposit_amount', async () => {
			let no_transfer_hash = "0xdc345837d24517858368a28c2022936404ae5a64e78dcac16331108d53eeca9c";
			const escrow_contract = await Escrow.deployed();
			let tx = await escrow_contract.deposit(no_transfer_hash, {
				from: accounts[1],
				value: web3.utils.toWei('5', 'ether')
			});
			console.log(tx.logs[0].event);
			assert.equal("payee_deposit_complete", tx.logs[0].event);

			let participants = await escrow_contract.get_participants();
			assert.equal(participants[1], accounts[1]);
		});

		it('should prevent the payer from depositing deposit_amount', async () => {
			try {
				let no_transfer_hash = "0xdc345837d24517858368a28c2022936404ae5a64e78dcac16331108d53eeca9c";
				let result = await escrow_contract.deposit(no_transfer_hash, {
					from: accounts[0],
					value: web3.utils.toWei('10', 'ether')
				});
				assert.fail('should have thrown before');
			}
			catch (err) {
				assert.include(err.message, "revert", "The error msg should contain 'revert'");
			}
		});

		it('should prevent the payee from depositing twice', async () => {
			let no_transfer_hash = "0xdc345837d24517858368a28c2022936404ae5a64e78dcac16331108d53eeca9c";
			let tx1 = await escrow_contract.deposit(no_transfer_hash, {
				from: accounts[1],
				value: web3.utils.toWei('5', 'ether')
			});

			try {
				let tx2 = await escrow_contract.deposit(no_transfer_hash, {
					from: accounts[1],
					value: web3.utils.toWei('7', 'ether')
				});
				assert.fail('should have thrown before');
			}
			catch (err) {
				assert.include(err.message,
					"Sorry the escrow is now locked.", "There error msg doesn't contain the require() error message");

			}
		});

		it('should emit an event when a no transfer is requested', async () => {
			let tx = await escrow_contract.request_no_transfer({
				from: accounts[0]
			});
			assert.equal("no_transfer_requested", tx.logs[0].event);
		});

		it('should prevent anyone but the payer from requesting a no transfer',
			async () => {

				try {
					let tx = await escrow_contract.request_no_transfer({
						from: accounts[1]
					});
				}
				catch (err) {
					assert.include(err.message, "Only the payer can request a no transfer.",
						"The error msg doesn't contain the require() error message");
				}
		});
	});
});
