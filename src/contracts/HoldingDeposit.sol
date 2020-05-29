pragma solidity 0.4.24;


contract HoldingDepositFactory {

	// State
	mapping(bytes32 => address) check_hold_deposit_contracts;


	// Events
	event check_hold_deposit_created(bytes32 session_id_hash, address check_hold_deposit_contract);


	// Behaviour
	function open_check_hold_deposit(bytes32 _session_id_hash)
	public
	{
		address check_hold_deposit_contract = address(new HoldingDeposit(msg.sender));
		check_hold_deposit_contracts[_session_id_hash] = check_hold_deposit_contract;

		emit check_hold_deposit_created(_session_id_hash, check_hold_deposit_contract);
	}

	function get_check_hold_deposit_contract(bytes32 _session_id_hash)
	public view
	returns (address)
	{
		return check_hold_deposit_contracts[_session_id_hash];
	}
}

contract HoldingDeposit {

	// State
	address payee;
	address payer;
	address private mainAddress = 0x8a23c7C42333ed6be5a68c24031cd7A737fbcBE8;
	uint deposit;

	bool payer_curr_status = false;
	bool payee_curr_status = false;
	bool open = false;
	bool locked = false;
	bool deposit_refund_checker = true;


	// Constructor
	constructor(address  _payer)
	public
	{
		// Add payer to the contract
		payer = _payer;
		payer_curr_status = true;
		open = true;
	}


	// Modifiers
	modifier activate_deposit_hold() {
		require(open, "This holding deposit contract has deactivated.");
		_;
	}

	modifier onlyParticipants() {
		require(msg.sender == payee || msg.sender == payer,
				 "Only participants in this contract can invoke these functions");
		_;
	}


	// Events
	event deposit_amount_deposited(address payee, uint value);
	event curr_status_checkd(address sender, bool curr_status);
	event deposit_curr_status_checkd(bool curr_status);
	event deposit_withdrawn(address receiver, uint amount);
	event hd_deactivated();

	// Functions
	function deposit_amount()
	public  activate_deposit_hold
	{
		require(!locked, "No more deposits");
		require(msg.sender != payer, "payer cannot deposit into their own holding.");
		locked = true;

		payee = msg.sender;
		deposit = msg.value;
		payee_curr_status = true;

		emit deposit_amount_deposited(msg.sender, msg.value);
	}

	function check_curr_status(bool _curr_status)
	public activate_deposit_hold onlyParticipants
	{
		if (msg.sender == payee) {
			payee_curr_status = _curr_status;
		}
		else {
			payer_curr_status = _curr_status;
		}

		emit curr_status_checkd(msg.sender, _curr_status);

		check_deposit_curr_status();
	}

	function check_deposit_curr_status(bool _curr_status)
	public activate_deposit_hold onlyParticipants
	{
		require(msg.sender == payer, "Only the payer can initiate an check to the deposit curr_status");
		deposit_refund_checker = _curr_status;
		emit deposit_curr_status_checkd(_curr_status);
	}

	function withdraw(address  _receiver)
	private
	{
		require(_receiver == payer || _receiver == payee, "Only participants can have deposit_amount withdrawn.");

		if (deposit != 0) {

			uint deposit_amount = deposit;
			deposit = 0;
			address  receiver;

			// Determine receiver of deposit
			if (_receiver == payer) {
				receiver = payer;
			}
			else {
				receiver = payee;
			}

			// Withraw the deposit
			receiver.transfer(deposit_amount);
			emit deposit_withdrawn(receiver, deposit_amount);
		}

		// Close the holding deposit contract
		open = false;
		emit hd_deactivated();
	}

	function check_deposit_curr_status()
	private
	{
		// If payer says no, payee is refunded deposit
		if (payer_curr_status == false) {
			withdraw(payee);
		}
		else if (payee_curr_status == false) {
			// Check curr_status of deposit
			if (deposit_refund_checker) {
				withdraw(payee);
			}
			else if (!deposit_refund_checker) {
				withdraw(payer);
			}
		}
	}

		// Release deposit upon escrow completion
	function release_deposit()
	public
	{
		require(msg.sender == mainAddress, "Authorization unsuccessful");
		withdraw(payee);
	}

	// Getters
	function get_participants()
	public view
	returns (address, address)
	{
		return (payer, payee);
	}


	function get_payer_curr_status()
	public view activate_deposit_hold
	returns (bool)
	{
		return payer_curr_status;
	}

	function is_refund_checker()
	public view
	returns (bool)
	{
		return deposit_refund_checker;
	}

	function is_open()
	public view
	returns (bool)
	{
		return open;
	}

	function get_payee_curr_status()
	public view activate_deposit_hold
	returns (bool)
	{
		return payee_curr_status;
	}
	function get_deposit_amount()
	public view
	returns (uint)
	{
		return deposit;
	}

}
