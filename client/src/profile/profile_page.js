import React, { Component } from 'react';
import '../App.css';

import Header from '../common/header.js'
import Web3 from 'web3';
import constants from '../common/constant.js'
import util from '../common/util.js'
class ProfilePage extends Component {

    
    constructor(props){
        super(props)
        this.state = {
          address: '',
          name: '',
          info: '',

          totalSentComplete: 0,
          totalSentEth: 0,
          
          totalSentInEscrow: 0,          
          totalSentInEscrowEth: 0,          
          
          totalTransfersEth: 0,          
          totalTransfersComplete: 0,   

          totalTransfersInEscrow: 0,          
          totalTransfersInEscrowEth: 0,

          customerLedgerLength: 0,
          customerLedger: [],

          merchantLedgerLength: 0,
          merchantLedger: []
        }
       
    }

    componentDidMount(){
      var url_string = window.location.href;
      var url = new URL(url_string);
      const address = url.searchParams.get("address");


      //const address = this.props.match.params.address
      this.setState({
        address: address
      })
      if (window.ethereum) {
          const web3 = new Web3(window.ethereum);
          try { 
             window.ethereum.enable().then(() => {
                 // User has allowed account access to DApp...
                 const contract = web3.eth.contract(constants.abi).at(constants.address)
                 const profile_contract = web3.eth.contract(constants.profile_abi).at(constants.profile_address)
                
                this.setState({
                  contract: contract,
                  profile_contract: profile_contract
                })

                //Load transact history

                
                this.loadProfileInfo()


            //Get length of customer ledger
            contract.getCustomerLedgerLength.call(address, (error, result) => {
              this.setState({customerLedgerLength: parseInt(result)});
              
            //Loop through customer ledger from the end of list, get individual transaction id
            for (let i = 0; i < this.state.customerLedgerLength; i++){
              contract.CustomerLedger.call(address,i, (error, id) => {

                //For individual transaction id, get the transaction from TransactionLedger
                contract.getTransaction.call(id, (error, result) => {

                  const transact = util.returnTxMap(id,result)
                  let newLedger = this.state.customerLedger;
                  newLedger.push(transact);
                  
                  this.setState({customerLedger: newLedger})

                  //After loading the final transact
                  if (newLedger.length === this.state.customerLedgerLength){
                   //Compute the totals
                   let sum_transacted_eth = 0
                   let sum_transacted_transact = 0
                   let sum_in_escrow_eth = 0
                   let sum_in_escrow_transact = 0
                    for (let i = 0; i < this.state.customerLedgerLength; i++){

                      //If transact in escrow and incomplete
                      if (this.state.customerLedger[i]["status"] === util.status()[0] ||
                          this.state.customerLedger[i]["status"] === util.status()[3])
                      {
                          sum_in_escrow_transact++
                          sum_in_escrow_eth += this.state.customerLedger[i]["value"]
                      }

                      else{
                        sum_transacted_transact++
                        sum_transacted_eth += this.state.customerLedger[i]["value"]
                      }
                    }

                  this.setState({
                    totalSentEth: sum_transacted_eth,
                    totalSentComplete: sum_transacted_transact,

                    totalSentInEscrowEth: sum_in_escrow_eth,
                    totalSentInEscrow: sum_in_escrow_transact
                  })

                  }
                })
              })
            }
            });

            //Get length of merchant ledger
            contract.getMerchantLedgerLength.call(address, (error, result) => {
              //console.log(`merchant ledger length ${result}`)
              this.setState({merchantLedgerLength: parseInt(result)});
            //Loop through merchant ledger from the end of list, get individual transaction id
            for (let i = 0; i < this.state.merchantLedgerLength; i++){
              contract.MerchantLedger.call(address,i, (error, id) => {
                //console.log(id)

                //For individual transaction id, get the transaction from TransactionLedger
                contract.getTransaction.call(id, (error, result) => {
                  const transact = util.returnTxMap(id,result)
                  //console.log(transact);
                  let newLedger = this.state.merchantLedger;
                  newLedger.push(transact);

                  this.setState({merchantLedger: newLedger})
                  //After loading the final transact
                  if (newLedger.length === this.state.merchantLedgerLength){
                    //Compute the totals
                    let sum_transacted_eth = 0
                    let sum_transacted_transact = 0
                    let sum_in_escrow_eth = 0
                    let sum_in_escrow_transact = 0
                      for (let i = 0; i < this.state.merchantLedgerLength; i++){
  
                        //If transact in escrow and incomplete
                        if (this.state.merchantLedger[i]["status"] === util.status()[0] ||
                            this.state.merchantLedger[i]["status"] === util.status()[3])
                        {
                            sum_in_escrow_transact++
                            sum_in_escrow_eth += this.state.merchantLedger[i]["value"]
                        }
  
                        else{
                          sum_transacted_transact++
                          sum_transacted_eth += this.state.merchantLedger[i]["value"]
                        }
                      }
  
                    this.setState({
                      totalTransfersEth: sum_transacted_eth,
                      totalTransfersComplete: sum_transacted_transact,
  
                      totalTransfersInEscrowEth: sum_in_escrow_eth,
                      totalTransfersInEscrow: sum_in_escrow_transact
                    })
  
                    }
                })
              })
            }
            });

          
             });
             
          } catch(e) {
             // User has denied account access to DApp...
          }
       }
  
       else {
          window.location.href = "/login";
       }
  }

  loadProfileInfo(){
//Load profile info
this.state.profile_contract.getProfileLength.call(this.state.address, (error, result) => {
  //console.log(`Length of profile info ${result}`);
  if (parseInt(result) === 0)
    {
      this.setState({
      name: '',
      info: ''})
    }
  
  else {
  //Then load profile info. Get last profile from array 
  this.state.profile_contract.ProfileDB.call(this.state.address, (result - 1), (error, result) => {
    this.setState({
      name: result[0],
      info: result[1]
    })
  })
  }
  })
  }

  render() {
    let username = this.state.name;
    let info = this.state.info
   
    return (
      <div>
        <Header/>
        
      <section className="section">
      <div className="container" style={{width:790}}>
      <a className="has-text-left" onClick={() => window.history.back()}>&larr; Back</a>
      </div>
      
      <br/>

      <div className="container box" style={{width:800}}>
      
     
        <p className="has-text-centered is-size-3">{username}'s profile</p>
        <p className="has-text-centered">Joined 20/2/2019</p>
        <br/>
        <p className="has-text-centered">{info}</p>
        <hr></hr>
        <p className="has-text-centered">Lifetime transactions</p>
        <div className="columns">

        <div className="column has-text-left">
       
        <b>SenderHistory</b>
        <p>Total ETH spent: {this.state.totalSentEth} ETH</p>
        <p>Transactions Completed: {this.state.totalSentComplete}</p>

        </div>
        <div className="column is-narrow"><br/>
         
          </div>
        <div className="column has-text-right"> 
       
        <b>Receiver History</b>
        <p>Total ETH received: {this.state.totalTransfersEth} ETH</p>
        <p>Transactions Completed: {this.state.totalTransfersComplete}</p>
        </div>
        </div>

        <hr/>
        <p className="has-text-centered">Current in escrow transactions</p>

        <div className="columns">

        <div className="column has-text-left">
       
        <b>Buyer</b>
        <p>Amount unreleased: {this.state.totalSentInEscrowEth} ETH</p>
        <p>Transactions In Escrow: {this.state.totalSentInEscrow}</p>
        
        </div>
        <div className="column is-narrow"><br/>
         
        </div>
        <div className="column has-text-right"> 
       
        <b>Receiver</b>
        <p>Amount receivable: {this.state.totalTransfersInEscrowEth} ETH</p>
        <p>Transactions in Escrow: {this.state.totalTransfersInEscrow}</p>
        </div>
        </div>

        </div>        
        </section>
      
        </div>
        
    );
  }
}

export default ProfilePage;

