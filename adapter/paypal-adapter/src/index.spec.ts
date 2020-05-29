import {GetRequest, JobRequest, Request, requestWrapper, SendRequest} from './index';
import {assert} from 'chai';
import 'mocha';
const IPFS = require('ipfs-http-client')
import soliditySha3 from 'web3-utils'
import EthCrypto, {Encrypted} from 'eth-crypto'
var Wallet = require('ethereumjs-wallet');
var EthUtil = require('ethereumjs-util');
var path = require('path')

// Get a wallet instance from a private key
const privateKeyBuffer = EthUtil.toBuffer(process.env.PRIVATE_KEY);
const wallet = Wallet.fromPrivateKey(privateKeyBuffer);

// Get a public key
const publicKey = wallet.getPublicKey();  



const pubKey = Uint8Array.from(publicKey);
//console.log(pubKey)
const fromHexString = (hexString: string) =>
  new Uint8Array(hexString.match(/.{1,2}/g).map((byte: string) => parseInt(byte, 16)));


//const pubKey = fromHexString(publicKey)                                                                                                                                                                                                                                                   


import {
    BuyCryptoOrderPayedRequest,
    BuyCryptoOrderRequest,
    NewMakerRequest,
    SellCryptoOrderRequest,
    SendPayoutRequest,
  } from './index'
import { order } from 'paypal-rest-sdk';

require('dotenv').config()

const jobID = '278c97ffadb54a5bbb93cfec5f7b5503'
const payoutDestination = 'sb-taiki1615866@personal.example.com'

const {
    CLIENT_ID,
    CLIENT_SECRET,
   // PUBLIC_KEY: ADAPTER_PUBLIC_KEY,
  } = process.env

  //console.dir(ADAPTER_PUBLIC_KEY);

//const ADAPTER_PUBLIC_KEY = pubKey


var Web3Utils = require('web3-utils');

const baseReq = {
    id: jobID,
    data: {} as Request,
  } as JobRequest

const sendPayoutRequest = ({
    method: 'sendPayout',
    amount: '10',
    currency: 'USD',
    receiver: payoutDestination,
  } as SendPayoutRequest)
  
  const newMakerRequest = (
    makerPublicAddress: any,
    credsIpfsHash: any,
  ): NewMakerRequest => {
    return {
      method: 'newMaker',
      public_account: makerPublicAddress,
      maker_id: Web3Utils.soliditySha3(makerPublicAddress, 'USD', 'ETH'),
      fiat: 'USD',
      crypto: 'ETH',
      reserve_amount: '250',
      destination: 'sb-taiki1615866@personal.example.com',
      api_creds_ipfs_hash: credsIpfsHash,
    }
  }

  //var pubKey = new bitcore.PublicKey.fromPrivateKey(process.env.PRIVATE_KEY);

  //const ADAPTER_PUBLIC_KEY2 = Uint8Array.from(ADAPTER_PUBLIC_KEY)
  
/***********************************************************
 * Routine to setup api creds for a single maker on IPFS.
 * Store the IPFS hash in apiCredsIpfsHash for test usage.
 **********************************************************/

let apiCredsIpfsHash: any
let destinationIpfsHash: any

// Maker account
const makerIdentity = EthCrypto.createIdentity()

// setup IPFS for storing encrypred creds
const ipfs = IPFS('ipfs.infura.io', '5001', {protocol: 'https'})

const apiCreds = {
  id: CLIENT_ID,
  sec: CLIENT_SECRET,
}

const pubKeyFromPriv = EthCrypto.publicKeyByPrivateKey(process.env.PRIVATE_KEY)

console.log(pubKeyFromPriv)

const encryptAndStoreOnIpfs = async (dataStr: string) => {
  // encrypt the data with the adapters public key
  const encrypted: Encrypted = await EthCrypto.encryptWithPublicKey(
    pubKeyFromPriv as string,
    dataStr
  )
  // publish the encrypted creds to ipfs and save the hash
  const encryptedBuf = Buffer.from(JSON.stringify(encrypted), 'utf8')
  console.log(`adding encrypted file to ipfs`)
  return (await ipfs.add(encryptedBuf)).path
}

const setupApiCredsOnIpfs = async () => {
  apiCredsIpfsHash = await encryptAndStoreOnIpfs(JSON.stringify(apiCreds))
  console.log(`got creds ipfs hash: ${apiCredsIpfsHash}`)
}

const setupDestinationOnIpfs = async () => {
  destinationIpfsHash = await encryptAndStoreOnIpfs(payoutDestination)
  console.log(`got destination ipfs hash: ${destinationIpfsHash}`)
}

before(async function() {
  this.timeout(15000)
  await Promise.all([
    setupApiCredsOnIpfs(),
    setupDestinationOnIpfs(),
  ])
})

describe('create request', () => {
    context('requests data', () => {
        const jobID = "278c97ffadb54a5bbb93cfec5f7b5503";
        const req = <JobRequest>{
            id: jobID,
            data: <Request>{}
        };
        const timeout = 10000;

        it('should fail on invalid method', (done) => {
            // Notice method not set.
            requestWrapper(req).then((response) => {
                assert.equal(response.statusCode, 400, "status code");
                assert.equal(response.jobRunID, jobID, "job id");
                assert.isUndefined(response.data, "response data");
                done();
            }).catch((error)=> {
                assert.isNotOk(error,'Promise error');
            });
        });

        let payoutId = "5UXD2E8A7EBQJ";

        it('should send payment/payout', (done) => {
            req.data = <SendRequest>{
                method: "sendPayout",
                amount: process.env.TEST_AMOUNT || 10,
                currency: process.env.TEST_CURRENCY || "USD",
                receiver: process.env.TEST_RECEIVER || "your-buyer@example.com"
            };
            requestWrapper(req).then((response) => {
                assert.equal(response.statusCode, 201, "status code");
                assert.equal(response.jobRunID, jobID, "job id");
                assert.isNotEmpty(response.data, "response data");
                assert.isNotEmpty(response.data.result, "payout id");
                payoutId = response.data.batch_header.payout_batch_id;
                console.log(JSON.stringify(response.data, null, 1))
                done();
            }).catch((error)=> {
                assert.isNotOk(error,'Promise error');
            });
        }).timeout(timeout);

        it('should get payout details', (done) => {
            req.data = <GetRequest>{
                method: "getPayout",
                payout_id: process.env.TEST_PAYOUT_ID || payoutId
            };
            requestWrapper(req).then((response) => {
                assert.equal(response.statusCode, 200, "status code");
                assert.equal(response.jobRunID, jobID, "job id");
                assert.isNotEmpty(response.data, "response data");
                assert.isNotEmpty(response.data.result, "payout id");
                console.log(JSON.stringify(response.data, null, 1));
                done();
            }).catch((error)=> {
                assert.isNotOk(error,'Promise error');
            });
        }).timeout(timeout);

        it('should get payout details using ENV variable', (done) => {
            process.env.API_METHOD = "getPayout";
            req.data = <Request>{
                method: "sendPayout",
                payout_id: process.env.TEST_PAYOUT_ID || payoutId
            };
            requestWrapper(req).then((response) => {
                assert.equal(response.statusCode, 200, "status code");
                assert.equal(response.jobRunID, jobID, "job id");
                assert.isNotEmpty(response.data, "response data");
                assert.isNotEmpty(response.data.result, "payout id");
                console.log(JSON.stringify(response.data, null, 1));
                done();
            }).catch((error)=> {
                assert.isNotOk(error,'Promise error');
            });
        }).timeout(timeout);

        it('should fail sendPayout with missing amount', (done) => {
            req.data = <SendRequest>{
                method: "sendPayout",
                receiver: "sb-taiki1615866@personal.example.com"
            };
            requestWrapper(req).then((response) => {
                assert.equal(response.statusCode, 400, "status code");
                assert.equal(response.jobRunID, jobID, "job id");
                assert.isUndefined(response.data, "response data");
                done();
            }).catch((error)=> {
                assert.isNotOk(error,'Promise error');
            });
        }).timeout(timeout);

        it('should fail sendPayout with missing receiver', (done) => {
            req.data = <Request>{
                method: "sendPayout",
                amount: 10
            };
            requestWrapper(req).then((response) => {
                assert.equal(response.statusCode, 400, "status code");
                assert.equal(response.jobRunID, jobID, "job id");
                assert.isUndefined(response.data, "response data");
                done();
            }).catch((error)=> {
                assert.isNotOk(error,'Promise error');
            });
        }).timeout(timeout);

        it('should fail getPayout with missing payout id', (done) => {
            req.data = <GetRequest>{
                method: "getPayout"
            };
            requestWrapper(req).then((response) => {
                assert.equal(response.statusCode, 400, "status code");
                assert.equal(response.jobRunID, jobID, "job id");
                assert.isUndefined(response.data, "response data");
                done();
            }).catch((error)=> {
                assert.isNotOk(error,'Promise error');
            });
        }).timeout(timeout);})})


describe('#newMaker', function() {
    // enough time for ipfs get
    const timeout = 15000;
  
    it('should add new maker', async function() {
        const req = {
          ...baseReq,
          data: newMakerRequest(makerIdentity.address, apiCredsIpfsHash),
        }
        console.log(req.data.maker_id)
        requestWrapper(req).then((rsp) => {
            //assert.equal(rsp.statusCode, 201, 'status code')
            assert.equal(rsp.jobRunID, jobID, 'job id')
            assert.equal(rsp.data.maker_id, req.data.maker_id, 'maker id')
            assert.isNotEmpty(rsp.data)
            console.log(JSON.stringify(rsp.data, null, 1));
        }).catch((error) => {
            assert.isNotOk(error,'Promise error');
        });
      }).timeout(timeout);  
  })

  
  
//   describe.skip('#buy', function() {
//     // enough time for ipfs get
//     this.timeout(15000)
  
//     it('handles full cycle for a buy crypto order', async function() {
//       // Create a new maker
//       const maker = EthCrypto.createIdentity()
//       const makerReq = {
//         ...baseReq,
//         data: newMakerRequest(maker.address, apiCredsIpfsHash),
//       }
//       const newMakerRsp = await requestWrapper(makerReq)
//       assert.equal(newMakerRsp.statusCode, 201, 'status code')
  
//       // Create a buy order from a buyer
//       const buyer = EthCrypto.createIdentity()
//       const buyCryptoOrderReq = {
//         ...baseReq,
//         data: {
//           method: 'buyCryptoOrder',
//           buyer_address: buyer.address,
//           order_id: '0x12345',
//           order_amount: '50',
//           fiat: 'USD',
//           crypto: 'ETH',
//         } as BuyCryptoOrderRequest,
//       }
  
//       const orderRsp = await requestWrapper(buyCryptoOrderReq)
  
//       assert.equal(orderRsp.statusCode, 201, 'status code')
//       assert.equal(
//         orderRsp.data.maker_id,
//         makerReq.data.maker_id,
//         'maker id',
//       )
//       assert.equal(
//         orderRsp.data.destination,
//         makerReq.data.destination,
//         'maker destination address',
//       )
//       assert.equal(orderRsp.data.price, '123.45', 'price for buy')
  
//       // Tell the adapter that the order has been payed
//       // The adapter will check the payment then fill the order
//       const buyCryptoOrderPayedReq = {
//         ...baseReq,
//         data: {
//           method: 'buyCryptoOrderPayed',
//           order_id: buyCryptoOrderReq.data.order_id,
//           maker_id: orderRsp.data.destination,
//           payout_id: 'buyer@wantcrypto.com',
//           price: orderRsp.data.price,
//         } as BuyCryptoOrderPayedRequest,
//       }
  
//       const payedRsp = await requestWrapper(buyCryptoOrderPayedReq)
  
//       assert.equal(orderRsp.statusCode, 200, 'status code')
//       assert.equal(orderRsp.data.maker_id, 200, '')
//     })
//   })
  
//   describe.only('#sellCryptoOrder', function() {
//     // enough time for ipfs get plus paypal calls
//     this.timeout(15000)
  
//     it('handles full cycle for a sell crypto order', async function() {
//       // Create a new maker
//       const maker = EthCrypto.createIdentity()
//       const makerReq = {
//         ...baseReq,
//         data: newMakerRequest(maker.address, apiCredsIpfsHash),
//       }
//       const newMakerRsp = await requestWrapper(makerReq)
//       assert.equal(newMakerRsp.statusCode, 201, 'status code')
  
//       // Create a sell order from a seller
//       const seller = EthCrypto.createIdentity()
//       const sellCryptoOrderReq = {
//         ...baseReq,
//         data: {
//           method: 'sellCryptoOrder',
//           seller_address: seller.address,
//           order_amount: '50',
//           crypto: 'ETH',
//           fiat: 'USD',
//           destination_ipfs_hash: destinationIpfsHash,
//         } as SellCryptoOrderRequest,
//       }
  
//       const orderRsp = await requestWrapper(sellCryptoOrderReq)
  
//       assert.equal(orderRsp.statusCode, 201, 'status code')
//       assert.equal(
//         orderRsp.data.maker_id,
//         makerReq.data.maker_id,
//         'maker id',
//       )
//     })
//   })
