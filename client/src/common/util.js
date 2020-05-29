import Web3 from 'web3';
import constants from '../common/constant.js'
import React, { Component } from 'react';

const status = ['Funds In Escrow', 'Funds Released', 'Refunded', 'Awaiting Resolution']
const web3 = new Web3(window.ethereum);


class StatusButton extends Component {
    render(){
    return (
        <button>{this.props.text}</button>
    );
  }
}

const util = {
    returnTxMap: (id,transact) => {  
        
        return {
            id: parseInt(id),
            buyer: transact[0],
            Receiver: transact[1],
            escrow: transact[2],
            fee: transact[3]/(10**18),
            value: transact[4]/(10**18),
            status: status[parseInt(transact[5])],
            notes: transact[6]
        }
    },

    sortTx: txs => {
        return txs.sort((a,b) => a.id - b.id)
    },

    txTemplate: () => {
        return{
        id: '',
        buyer: '',
        Receiver: '',
        escrow: '',
        fee: '',
        value: '',
        status: '',
        notes: ''
    }
    },

    status: () => {
        return status
    },

    statusButton: (size, type, icon) => {
        return(
        <StatusButton text='aaa'/>
        )
    }
}

export default util;
