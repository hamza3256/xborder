

# XBORDER P2P Ethereum to Fiat via Paypal

## Problem

The problem of having peer-to-peer Ethereum to Fiat exchanges is that there is no enforced trust, the crypto seller could receive the fiat and choose not to pay the buyer or vice versa the buyer could receive the crypto and choose not to pay the seller. There are solutions to this problem but they come in centralized forms which would require trusting a third party and having to provide identification.Certain countries would have cryptocurrencies banned and therefore no access to centralized exchanges but those countries would still have access to payment services such as Paypal.

## Solution

The solution was to use smart contracts that can interact with real world data through the use of ChainLink. The use of ChainLink allows the contract to be able to confirm whether or not a paypal invoice has been paid. Multiple ChainLink nodes can be used to increase decentralization and therefore the security of the validations.

This solution involves a seller matching with a buyer, creating a Paypal invoice for an agreed amount of Ethereum and locking up the Ethereum in a smart contract. This Ethereum is then unlocked when the invoice is paid, the smart contract uses Chainlink Oracles to confirm that the invoice has been paid. The contract can confirm with multiple Oracles making it more decentralized and therefore more secure. If the Invoice is paid then the Buyer can withdraw their funds, if the Invoice isn't paid within a day the Seller can take withdraw their funds.

## Procedure

- Users wanting to sell or buy Ethereum would first go to www.reddit.com/r/XBORDER/ and make arrangements with other users, this is 	done as the current website doesn't cater for listings.

- After an arrangement has been made the seller creates a paypal invoice with an agreed amount to be paid.
- The seller then navigates to to www.XBORDER.io where they would create a new contract with the needed details such as the buyers 	address, invoice ID, Ethereum to deposit and the selected ChainLink Nodes/Job IDs.
- Once the contract is deployed the seller must fund the deployed contract with LINK so that once the buyer pays the invoice either 	the seller or the buyer can run the confirmations on the contract to release the Ethereum funds.
- Once it has been confirmed to be paid by the contract the buyer can withdraw their funds and either the seller or buyer can 	       withdraw unused LINK.

## Some Notes

- A Seller should select up to 3 nodes for cost efficient and secure confirmations, the more nodes chosen the more secure it is but it costs more in terms of LINK and Ethereum to run the confirmations.
- If the Buyer doesn't pay the invoice then after a day of deployment and running the confirmations can the Seller get his Ethereum back.

## How it Works

In this section we will give you more details in terms of how the contract works.

### The Adapter

The Adapter uses a custom API that parses the paypal link together with the invoice ID to retrieve the true/false boolean determining if the invoice was paid or not. This is triggered by the ChainLink Node which in turn is called by the Smart Contract.

### The Smart Contracts
The factory contract produces all the XBORDER agreements containing the funds and all the ChainLink functionality to do the transfers and confirmations.

### Future Work
Multi-Token Handling
Listings like a proper exchange

