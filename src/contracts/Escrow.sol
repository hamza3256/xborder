pragma solidity 0.4.24;

contract EscrowFactory {

	// State
	mapping(bytes32 => address) escrow_contracts;

	// Events
	event escrow_activated(bytes32 session_id_hash, address escrow_contract);

	// Behaviour
	function open_escrow(bytes32 _no_transfer_hash, bytes32 _session_id_hash)
	public
	{
		address escrow = address(new Escrow(_no_transfer_hash, msg.sender, _session_id_hash));
		escrow_contracts[_session_id_hash] = escrow;

		emit escrow_activated(_session_id_hash, escrow);
	}

	function get_escrow(bytes32 _session_id_hash)
	public view
	returns (address)
	{
		return escrow_contracts[_session_id_hash];
	}
}

contract Escrow {


	bool open = false;
	bool locked = false;
	bool cancelled = false;

	bytes32 no_transfer_hash;
	bytes32 session_id_hash;
	bytes32 no_id_hash;

	// State
	address payee;
	address payer;
	address private oracle_escrow;
	uint deposit_amount;

	bool payee_transfer_check = false;
	bool payer_transfer_check = false;
	bool payee_no_id_check = false;
	bool payer_no_id_check = false;


	// Events
	event payee_deposit_complete();
	event no_transfer_requested();
	event deposit_amount_payout();
	event escrow_deactivated();
	event escrow_cancelled(address requester);
	event commit_no_transfer();
	event release_check_hold_deposit();


	// Constructor
	constructor(bytes32 _no_transfer_hash, address  _payer, bytes32 _session_id_hash)
	public
	{
		// Setup the payer
		payer = _payer;
		no_transfer_hash = _no_transfer_hash;
		session_id_hash = _session_id_hash;
		payer_transfer_check = true;
		oracle_escrow = 0x8a23c7C42333ed6be5a68c24031cd7A737fbcBE8;
		open = true;
	}


	// Modifiers
	modifier openEscrow() {
		require(open, "The escrow is deactivated.");
		_;
	}

	modifier notcancelled() {
		require(!cancelled, "The escrow was cancelled.");
		_;
	}




		// Handle no transfer response
	function no_transfer_response(bytes32 _no_id_hash)
	public openEscrow
	{
		require(msg.sender == oracle_escrow, "Authorization unsuccessful");
		no_id_hash = _no_id_hash;
	}

	
		// Handle no transfer request
	function request_no_transfer()
	public openEscrow
	{
		require(msg.sender == payer, "Only the payer can request a no transfer.");
		emit no_transfer_requested();
	}


		// Handle payee and payer responses to no transfer completion
	function no_id_check(bytes32 _no_id_hash, bool _curr_status)
	public openEscrow
	{
		require(msg.sender == payer || msg.sender == payee);
		require(_no_id_hash == no_id_hash, "no id hash mismatch");

		if (msg.sender == payer) {
			payer_no_id_check = _curr_status;
		}
		else if (msg.sender == payee) {
			payee_no_id_check = _curr_status;
		}

		if (payee_no_id_check && payer_no_id_check) {
			emit commit_no_transfer();
			payout_deposit_amount();
		}
	}

	// Behaviour

		// Handle deposits
	function deposit(bytes32 _no_transfer_hash)
	public  openEscrow
	{
		require(msg.sender != payer);
		require(locked == false, "Sorry the escrow is now locked");
		require(_no_transfer_hash == no_transfer_hash, "Sorry that is an invalid no transfer hash");

		locked = true;

		payee = msg.sender;
		deposit_amount = msg.value;
		payee_transfer_check = true;

		emit payee_deposit_complete();
	}


		// Handle payoutment of deposit_amount and closing of escrow
	function payout_deposit_amount()
	private openEscrow
	{
		require(payee_no_id_check == true && payer_no_id_check == true,
				  "Need both parties to agree before any deposit_amount are payout.");

		uint amount = deposit_amount;
		deposit_amount = 0;
		payer.transfer(amount);

		emit deposit_amount_payout();
		emit release_check_hold_deposit();

		open = false;
		emit escrow_deactivated();
	}

		// Handle requests to leave the session
	function cancel_escrow()
	public openEscrow notcancelled
	{
		require(msg.sender == payer || msg.sender == payee);

		// Release deposit_amount back to payee
		uint amount = deposit_amount;
		deposit_amount = 0;
		payee.transfer(amount);

		cancelled = true;
		emit escrow_cancelled(msg.sender);

		open = false;
		emit escrow_deactivated();
	}

	// Getters
	function get_participants()
	public view
	returns (address, address)
	{
		return (payer, payee);
	}

		function is_deposit_locked()
	public view
	returns (bool)
	{
		return locked;
	}

	function is_open()
	public view
	returns (bool)
	{
		return open;
	}

}
