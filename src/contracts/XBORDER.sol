pragma solidity 0.4.24;
pragma experimental ABIEncoderV2;

import "./v0.4/ChainlinkClient.sol";
import "./v0.4/vendor/Ownable.sol";

contract XBORDER is ChainlinkClient{

    //Set the payment as one Oracle time the amount of link the contract has I Believe?
    uint256 constant private ORACLE_PAYMENT = 1 * LINK;
    bool public released;
    uint8 public trueCount;
    uint8 public falseCount;
    
    //These must all be set on creation
    string public invoiceID;
    address public payerAddress;
    address public payeeAddress;
    uint256 public amount;
    uint256 public deploymentTime;

    event successNodeResponse(
        bool success
    );
//["892be77a8e7c4b4f988ed7e53d07229a","892be77a8e7c4b4f988ed7e53d07229a","892be77a8e7c4b4f988ed7e53d07229a"]
//["0x0D31C381c84d94292C07ec03D6FeE0c1bD6e15c1","0x0D31C381c84d94292C07ec03D6FeE0c1bD6e15c1","0x0D31C381c84d94292C07ec03D6FeE0c1bD6e15c1"]
    //Arrays 1:1 of Oracales and the corresponding Jobs IDs in those oracles
    string[] public jobIds;
    address[] public oracles;
    constructor(
        
        string _invoiceID,
        address  _payerAddress,
        address  _payeeAddress,
        uint256  _amount,
        string[] _jobIds,
        address[] _oracles
        
    )public payable{
        deploymentTime = block.timestamp;
        trueCount = 0;
        falseCount = 0;
        released = false;
        invoiceID = _invoiceID;
        payerAddress = _payerAddress;
        payeeAddress = _payeeAddress;
        amount = _amount;
        jobIds = _jobIds;
        oracles = _oracles;
        setPublicChainlinkToken();
    }
    
    function getjobIdsLength() public constant returns(uint) {
        return jobIds.length;
    }
    
    function getoraclesLength() public constant returns(uint) {
        return oracles.length;
    }
    
    
    //modifier to only allow payees to access functions
    modifier payeepayerContract(){
        require(address(this) == msg.sender || payerAddress == msg.sender || payeeAddress == msg.sender,"Unauthorised , must be payee or payer");
        _;
    }

    //Might Encounter ORACLE_PAYMENT problems with more than one oracle
    //Needs more testing
    function requestConfirmations()
    public
    payeepayerContract
    {
        //Reset them to 0 to be able to safely re-run the oracles
        trueCount = 0;
        falseCount = 0;
        
        //Loop to iterate through all the responses from different nodes
        for(uint i = 0; i < oracles.length; i++){
            Chainlink.Request memory req = buildChainlinkRequest(stringToBytes32(jobIds[i]), this, this.fulfillNodeRequest.selector);
            req.add("invoice_id", invoiceID);
            sendChainlinkRequestTo(oracles[i], req, ORACLE_PAYMENT);
        }

    }

    //This should fulfill the node request
    function fulfillNodeRequest(bytes32 _requestId, bool paid)
    public
    recordChainlinkFulfillment(_requestId)
    {
        //emit NodeRequestFulfilled(_requestId, _output);
        //Append to these to calculate if the deposit_amount should be released 0.2704
        if(paid == true) {
            //Invoice Paid
            trueCount += 1;
        }else if (paid == false){
            //Invoice Not Paid Yet
            falseCount += 1;
        }
        if(trueCount > falseCount){
            released = true;
        }
        emit successNodeResponse(released);
    }

    //This isnt really needed
    function getChainlinkToken() public view returns (address) {
        return chainlinkTokenAddress();
    }

    //Withdraw ETH from contract
    //Checks on who can withdraw should only be accessible by payee and payer
    //If enough time has passed payer can withdraw the eth 
    //If the checks pass then the payee can withdraw the eth 
    //Maybe modifications that the payer can send the ETH to the payee.
    function withdrawETH() public payeepayerContract {
        if(msg.sender == payerAddress && deploymentTime <= block.timestamp + 1 days && (trueCount != 0 || falseCount != 0)){
            if(released == false){
                //If a day has passed then the payer can take back his ETH
                address(msg.sender).transfer(amount);
                amount = 0;
            }
        }else if (msg.sender == payeeAddress && released == true){
            //Withdraw the ETH from the contract
            address(msg.sender).transfer(amount);
            amount = 0;
        }else{
            //Do Nothing cause you do not have access to this contract
        }
    }

    //Withdraw Link from contract
    function withdrawLink() public payeepayerContract{
        LinkTokenInterface link = LinkTokenInterface(chainlinkTokenAddress());
        require(link.transfer(msg.sender, link.balanceOf(address(this))), "Unable to transfer");
    }

    function stringToBytes32(string memory source) private pure returns (bytes32 result) {
        bytes memory tempEmptyStringTest = bytes(source);
        if (tempEmptyStringTest.length == 0) {
          return 0x0;
        }
        //Or this
        assembly{
          result := mload(add(source, 32))
        }
    }
}


//XBORDERFactory, Produces the XBORDER agreements between users.
contract XBORDERFactory{
    mapping (address => address[]) public XBORDERAddressespayer;
    mapping (address => address[]) public XBORDERAddressespayee;
    
    //address public XBORDERAddress;
    event contractDeployed(
        address XBORDERAddress
    );
    
    //Need to figure out parameters
    //Link, Address To, ETH amount, Lock that amount of ETH
    //Specify the chainlink node and job too
    function createXBORDER(
    
        string _invoiceID,
        address  _payeeAddress,
        string[] _jobIds,
        address[] _oracles
        
    ) public payable{
        //Probably need more requirement checks
        require(msg.value > 0,"No Negative Values are allowed");
        
        address XBORDERAddress = (new XBORDER).value(address(this).balance)(
             _invoiceID,
            msg.sender,
            _payeeAddress,
            msg.value,
            _jobIds,
            _oracles
        );
        
        //If it didn't fail Lock that much into a balance
        XBORDERAddressespayer[msg.sender].push(XBORDERAddress);
        XBORDERAddressespayee[_payeeAddress].push(XBORDERAddress);
    
        //Emit an event here\
        emit contractDeployed(XBORDERAddress);
    }
    
    function getXBORDERAddressespayer() public constant returns(uint) {
        return XBORDERAddressespayer[msg.sender].length;
    }
    
    function getXBORDERAddressespayee() public constant returns(uint) {
      return XBORDERAddressespayee[msg.sender].length;
    }
}
