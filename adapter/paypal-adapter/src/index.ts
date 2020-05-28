import * as paypal from "paypal-rest-sdk";
import BigNumber from "bignumber.js"
import EthCrypto, { Encrypted } from "eth-crypto"
//import {IPFS} from "ipfs-http-client"
const IPFS = require("ipfs-http-client")
const fetch = require('node-fetch')

require('dotenv').config()


class Response {
    jobRunID: string;
    statusCode: number;
    status?: string;
    data?: any;
    error?: any;
}

export class JobRequest {
    id: string;
    data: Request;
}

export class Request {
    method?: string;
}

export class GetRequest extends Request {
    payout_id: string;
    type?: string;
}

export class SendRequest extends Request {
    amount: string;
    receiver: string;
    currency?: string;
    recipient_type?: string;
    note?: string;
    sender_item_id?: string;
    email_subject?: string;
    email_message?: string
}

export class GetPayoutRequest extends Request {
    payout_id: string
    type?: string
}

export class SendPayoutRequest extends Request {
    amount: string
    receiver: string
    currency?: string
    recipient_type?: string
    note?: string
    sender_item_id?: string
    email_subject?: string
    email_message?: string
}

export class NewMakerRequest extends Request {
    public_account: string
    maker_id: any
    crypto: string
    fiat: string
    reserve_amount: string
    destination: string
    api_creds_ipfs_hash: string
}

export class PaypalApiCredentials {
    id: string
    sec: string
}

export class Maker extends NewMakerRequest {
    api_creds: PaypalApiCredentials
}

export class BuyCryptoOrderRequest extends Request {
    buyer_address: string
    order_id: string
    order_amount: string
    crypto: string
    fiat: string
}

export class BuyCryptoOrderPayedRequest extends Request {
    order_id: string
    maker_id: string
    price: string
    buyer_address: string
    payout_id: string // TODO: should be sent encrypted
}

export class SellCryptoOrderRequest extends Request {
    seller_address: string
    order_amount: string // crypto amount in wei
    crypto: string
    fiat: string
    destination_ipfs_hash: string
}

const {
    CLIENT_ID,      // Paypal API id
    CLIENT_SECRET,  // Paypal API secret
    PRIVATE_KEY,    // A dapters EthCrypto key for decrypting sent data
    STAGE,          // Deployment
  } = process.env

const isTest = STAGE === 'test'

const loggingOn = !isTest

const log = (msg: string) => {
  if (loggingOn === true) { console.log(msg) }
}
const logError = (msg: any) => {
  if (loggingOn === true) { console.error(msg) }
}

const privateKey = PRIVATE_KEY as string

const decryptBuffer = (buf: Buffer): Promise<string> => {
    const encryptedRec: Encrypted = JSON.parse(buf.toString())
    return EthCrypto.decryptWithPrivateKey(
      privateKey,
      encryptedRec,
    )
  }

const makers: any = {}

const ipfs = IPFS('ipfs.infura.io', '5001', {protocol: 'https'})


const ipfsGet = (hash: any): Buffer => ipfs.get(hash).then(
    (ipfsRsp: { content: any; }[]) => ipfsRsp[0].content,
  )


const ipfsGetAndDecrypt = async (hash: string): Promise<string> => {
    const buf: Buffer = await ipfsGet(hash)
    return decryptBuffer(buf)
  }

paypal.configure({
    "mode": process.env.MODE || "sandbox",
    "client_id": process.env.CLIENT_ID,
    "client_secret": process.env.CLIENT_SECRET
});
const paypalConfigureWithClient = (clientId: string, clientSecret: string) =>
  paypal.configure({
    mode: 'sandbox',
    client_id: clientId,
    client_secret: clientSecret,
  })

const paypalConfigure = (maker?: Maker) => {
    if (maker) {
      paypalConfigureWithClient(maker.api_creds.id, maker.api_creds.sec)
    } else {
      paypalConfigureWithClient(CLIENT_ID, CLIENT_SECRET)
    }
  }


const ethInWei = new BigNumber('10e18')

const sendPayout = async (data: SendPayoutRequest, maker?: Maker) => {
    paypalConfigure(maker)
  
    return new Promise((resolve, reject) => {
      if (!('amount' in data) || !('receiver' in data)) {
        return reject({ statusCode: 400, data: 'missing required parameters' })
      }
  
      const sender_batch_id = Math.random()
        .toString(36)
        .substring(9)
  
      const payoutItem = {
        sender_batch_header: {
          sender_batch_id,
          email_subject: data.email_subject || '',
          email_message: data.email_message || '',
        },
        items: [
          {
            recipient_type: data.recipient_type || 'EMAIL',
            amount: {
              value: data.amount,
              currency: data.currency || 'GBP',
            },
            receiver: data.receiver,
            note: data.note || '',
            sender_item_id: data.sender_item_id || '',
          },
        ],
      }
  
      paypal.payout.create(payoutItem, true, (error: any, payout: any) => {
        if (error) {
          return reject({ statusCode: error.httpStatusCode, data: error })
        }
        return resolve({ statusCode: payout.httpStatusCode, data: payout })
      })
    })
  }

const getPayout = async (data: GetRequest) => {
    return new Promise(((resolve, reject) => {
        if (!('payout_id' in data))
            return reject({ statusCode: 400, data: "missing required parameters" });

        let type = data.type || "batch";
        let request;
        switch (type.toLowerCase()) {
            case "item":
                request = paypal.payoutItem;
                break;
            case "batch":
                request = paypal.payout;
                break;
            default:
                return reject({ statusCode: 400, data: "invalid method" });
        }

        request.get(data.payout_id, (error: any, payout: any) => {
            if (error) return reject({ statusCode: error.httpStatusCode, data: error });
            return resolve({ statusCode: payout.httpStatusCode, data: payout });
        })
    }))
};

const newMaker = async (data: NewMakerRequest) =>
  new Promise(async (resolve, reject) => {
    const apiCredsStr = await ipfsGetAndDecrypt(data.api_creds_ipfs_hash)
    const apiCreds = JSON.parse(apiCredsStr)

    const maker: Maker = {...data, api_creds: apiCreds}
    log(`Adding maker: ${JSON.stringify(maker, null, 2)}`)
    makers[maker.maker_id] = maker

    return resolve({ statusCode: 201, data: {maker_id: data.maker_id} })
  })

  const buyCryptoOrder = async (data: BuyCryptoOrderRequest) =>
  new Promise((resolve, reject) => {
    // pick the first Maker off the list
    // TODO: implement a queue and choose in rotation
    const makerId = Object.keys(makers)[0]
    const maker: Maker = makers[makerId]

    // TODO: check liquidity of selected maker to cover the order

    // TODO: grab the price from an aggregated feed
    // (poss this should be requested from the contract ...?)
    const price = '123.45'

    return resolve({
      statusCode: 201,
      data: {
        maker_id: maker.maker_id,
        destination: maker.destination,
        price,
      },
    })
  })

/**
 * Buy orders require 2 steps from the taker. This is the second step.
 * After a taker has payed a selected maker the fiat over the Paypal network,
 * this function will be called to check the payment and return if the payment
 * is seen. The smart contract will release the crypto if it is.
 *
 * @param data {BuyCryptoOrderPayedRequest} Record containing the payout_id of
 *             the fiat payment.
 */
const buyCryptoOrderPayed = async (data: BuyCryptoOrderPayedRequest) => {
  return new Promise(async (resolve, reject) => {
    // the maker pre selected to fill the order
    const maker: Maker = makers[data.maker_id]

    // TODO: verify the payout_id and payment amount
    // data.payout_id

    // TODO: set only if payment verified
    const result = true

    return resolve({
      statusCode: 200,
      data: {
        result,
        order_id: data.order_id,
      },
    })
  })
}

/**
 * Executes the fiat part of a Sell crypto order. A seller transfers their
 * crypto to the FiatGateway smart contract. Then ChainLink calls this function
 * to select a Maker and transfer the fiat to the sellers Paypal account. The
 * result is returned to the smart contract. If success the crypto is sent to
 * the Maker.
 *
 * @param data {SellCryptoOrderRequest} Record containing the sell details
 */
const sellCryptoOrder = (data: SellCryptoOrderRequest) =>
  new Promise(async (resolve, reject) => {
    // pick the first Maker off the list
    // TODO: implement a queue and choose in rotation
    const makerId = Object.keys(makers)[0]
    const maker: Maker = makers[makerId]

    // decrypt the takers paypal destination
    const destination = await ipfsGetAndDecrypt(data.destination_ipfs_hash)
    log(`taker destination decrypted: ${destination}`)

    // TODO: grab the price from an aggregated feed Oracle and have it passed
    // to the contract then passed to the adapter to complete the order.
    // then the price source is transparent on chain

    // For now fetch it directly ... :
    const rspObj = await fetch(
      'https://min-api.cryptocompare.com/data/price?fsym=ETH&tsyms=GBP',
    ).then((rsp: { json: () => any; }) => rsp.json())
    const price = new BigNumber(rspObj.GBP)

    // Calculate the fiat amount
    const cryptoAmount: BigNumber =
      new BigNumber(data.order_amount).div(ethInWei)
    const fiatAmount: BigNumber = cryptoAmount.times(price)

    // TODO: subtract the fee
    // const fee = ....

    // Payout to the seller
    const sendPayoutRequest = ({
      method: 'sendPayout',
      amount: fiatAmount.toString(),
      currency: data.fiat,
      receiver: data.destination_ipfs_hash,
    } as SendPayoutRequest)

    const rsp: any = await sendPayout(sendPayoutRequest, maker)

    if (rsp.statusCode === 201) {
      log(`sellCryptoOrder: payout succeeded with id: ${rsp.data.result}`)
      return resolve({
        statusCode: 201,
        data: {
          maker_id: makerId,
        },
      })
    } else {
      logError(
        `sellCryptoOrder: payout failed with error: ` +
        `${JSON.stringify(rsp.data)} and status code: ${rsp.statusCode}`,
      )
      return reject({
        statusCode: rsp.statusCode,
        data: {
          // how does the node convert this ..?
          maker_id: undefined,
        },
      })
    }
  })


export const createRequest = async (input: JobRequest) => {
    return new Promise((resolve, reject) => {
        const data = input.data;
        const method = process.env.API_METHOD || data.method || "";

        const handlePayoutResponse = (response: any) => {
            log(
            `${method} response: ${JSON.stringify(response, null, 2)}`,
              )
            response.data.result =
              response.data.batch_header.payout_batch_id || ''
            return resolve(response)
          }
      
          const handleResponse = (response: any) => {
            log(
            `${method} response: ${JSON.stringify(response, null, 2)}`,
              )
            return resolve(response)
          }

        switch (method.toLowerCase()) {
            case "sendpayout":
                sendPayout(<SendRequest>data)
                    .then((response: any) => {
                        response.data.result = response.data.batch_header.payout_batch_id || "";
                        return resolve(response);
                    }).catch(reject);
                break;
            case "getpayout":
                getPayout(<GetRequest>data)
                    .then((response: any) => {
                        response.data.result = response.data.batch_header.payout_batch_id || "";
                        return resolve(response);
                    }).catch(reject);
                break;

            case 'newmaker':
                newMaker(data as NewMakerRequest)
                .then(handleResponse)
                .catch(reject)
                break

            case 'buycryptoorder':
                buyCryptoOrder(data as BuyCryptoOrderRequest)
                .then(handleResponse)
                .catch(reject)
                break

            case 'buycryptoorderpayed':
                buyCryptoOrderPayed(data as BuyCryptoOrderPayedRequest)
                .then(handleResponse)
                .catch(reject)
                break

            case 'sellcryptoorder':
                sellCryptoOrder(data as SellCryptoOrderRequest)
                .then(handleResponse)
                .catch(reject)
                break
            default:
                return reject({ statusCode: 400, data: "Invalid method" })
        }
    })
};

export const requestWrapper = async (req: JobRequest): Promise<Response> => {
    return new Promise<Response>(resolve => {
        let response = <Response>{ jobRunID: req.id || "" };
        createRequest(req).then(({ statusCode, data }) => {
            response.status = "success";
            response.data = data;
            response.statusCode = statusCode;
            resolve(response)
        }).catch(({ statusCode, data }) => {
            response.status = "errored";
            response.error = data;
            response.statusCode = statusCode;
            resolve(response)
        });
    });
};



// createRequest() wrapper for GCP
export const gcpservice = async (req: any = {}, res: any): Promise<any> => {
    let response = await requestWrapper(<JobRequest>req.body);
    res.status(response.statusCode).send(response);
};

// createRequest() wrapper for AWS Lambda
export const handler = async (
    event: JobRequest,
    context: any = {},
    callback: { (error: any, result: any): void }): Promise<any> => {
    callback(null, await requestWrapper(event));
};
