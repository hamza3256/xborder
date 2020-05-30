import React, { Component } from 'react';
import '../App.css';
import Web3 from 'web3';
import constants from '../common/constant.js'
import { Link } from "react-router-dom";
import {Spinner} from '@blueprintjs/core'

import Header from '../common/header.js'

class SetProfile extends Component {


  render() {

    return (
      <div>
        <Header/>
        <br/>
        <div className="container" style={{width:800}}>
        <h1 className="is-size-3 has-text-centered">Setup XBORDER Profile</h1>
        </div>
        <br/>
        <InitializeProfile/>
        <br/>
        
        <br/>
        <div className="has-text-centered">
          <Link to="/dashboard"><p className="button is-primary">Back to Dashboard</p></Link><br/><br/>
        </div>
       
        </div>
        
    );
  }
}

export default SetProfile;

class InitializeProfile extends Component {
  constructor(props){
    super(props)
    this.state = {
        address: '',
        loading: false
    }
}

  componentDidMount(){
    if (window.ethereum) {
        const web3 = new Web3(window.ethereum);
        try { 
           window.ethereum.enable().then(() => {
               // User has allowed account access to DApp...
              const contract = web3.eth.contract(constants.profile_abi).at(constants.profile_address)
              const profile_contract = web3.eth.contract(constants.profile_abi).at(constants.profile_address)
              
              this.setState({
                address: web3.eth.accounts[0],
                contract: contract,
                profile_contract: profile_contract
              })
              setInterval(() => {
                if (web3.eth.accounts[0] !== this.state.address) {
                    window.location.reload()
                }
              }, 100);
           });
           
        } catch(e) {
           // User has denied account access to DApp...
        }
     }

     else {
       //window.location.href = "/login";
        this.props.history.push('/login')

     }
}

  SetProfile () {
    const name = document.getElementById('nameinput').value
    const info = document.getElementById('infoinput').value
    
    this.setState({loading: true})

    this.state.profile_contract.SetProfile.sendTransaction(
      name,
      info,
      {
        from: this.state.address, 
        gas: 350000,
      gasPrice: 80000000000
      },
      (error, result) => {
          console.log("result" + result)
          console.log("error" + error)
        window.web3.eth.getTransaction(result, (error, result) => {
          if (result) {
            console.log("result" + result)
            console.log("error" + error)
            // this.setState({
            //   name: name,
            //   info: info
            // })
             window.location.href =  `/profile?address=${this.state.address}`;
          } 
        }
        );
        
      }
    )
    
    }


  


    render() {
      
      return (
        <div>
         
          <div className="container box" style={{width:800}}>
          <div className="has-text-centered">
          
          <b>Setup</b>
          </div>
          <br/>
          <p>Add name and information to your XBORDER profile for customers and receiver to identify you.</p>
          <br/>
          <div className="field is-horizontal">
    <div className="field-label is-normal">
      <label className="label">Your address</label>
    </div>
    <div className="field-body">
      <div className="field">
        <p className="control">
          <input className="input is-static" type="email" value={this.state.address} readOnly/>
        </p>
      </div>
    </div>
  </div>
          <div className="field is-horizontal">
    <div className="field-label is-normal">
      <label className="label">Name</label>
    </div>
    <div className="field-body">
      <div className="field">
        <p className="control">
          <input className="input" type="text" placeholder="*Required" id="nameinput"></input>
        </p>
      </div>
    </div>
  </div>
  
  <div className="field is-horizontal">
    <div className="field-label is-normal">
      <label className="label">Info</label>
    </div>
    <div className="field-body">
      <div className="field">
        <p className="control">
        <textarea className="textarea"
        id="infoinput"
        placeholder="Optional. Place contact information here, such as a link to your forum profile or bio."></textarea>
        </p>
      </div>
    </div>
  </div>
  
          <br/>
          <div className="has-text-centered">
          <button className="button is-primary" onClick={() => this.SetProfile()}>Update Profile</button>
          </div>

          </div>
          
          </div>
          
      );
    }
  }
  

    
  