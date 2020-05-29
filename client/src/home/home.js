import React, { Component } from 'react';
import styled from "styled-components";
import Button from "react-bootstrap/Button";
import Jumbotron from "react-bootstrap/Jumbotron";
import { Link } from "react-router-dom";
import Container from "react-bootstrap/Container";
import Image from "react-bootstrap/Image";

//import '../App.css';
import MainNav from './MainNav'
import {SocialMediaIconsReact} from 'social-media-icons-react';


const MainJumbotron = styled(Jumbotron)`
background: #f9f8fd;
`;

const MainContainer = styled(Container)`
display: flex;
flex-flow: column-reverse;
align-items: center;

@media (min-width: 992px) {
  & {
    flex-flow: row;
  }
}
`;

const MainImage = styled(Image)`
@media (max-width: 576px) {
  max-width: 100%;
}
@media (min-width: 576px) {
  width: 400px;
}
@media (min-width: 768px) {
  width: 450px;
}
@media (min-width: 1200px) {
  width: 100%;
}
`;

const CreditsText = styled.p`
color: #9e9ea7;

& a {
  color: #9e9ea7;
}
`;



export default function Home() {
  
  return (
    
   


<section >

    <Section1/>

  <Section3/>
  <Section4/>
  <Section2/>

  <Section6/>
  <DevSection/>
  <Section5/>
</section>

);
}




class Section1 extends Component {

render() {


return (
<MainJumbotron fluid>
      <MainContainer className="d-flex align-items-center text-center text-lg-left">
        <div id="text-container">
          <h1 className="display-4 font-weight-bold">
          The distinguished decentralized platform for cross-border transfers
          </h1>
          <p className="lead font-weight-normal">
            XBORDER enables international money transfer through the use of decentralized Chainlink oracles providing data for Ethereum smart contracts.
          </p>
          <Button variant="primary" size="lg" role="button" href="/login">
            Connect using Metamask
          </Button>
        </div>
        <div id="image-container" className="ml-md-5">
          <MainImage
            src="https://chain.link/assets/images/payments-api-diagram-e6ec6879.png"
            alt="diagram"
          />
          <CreditsText className="text-center text-lg-right my-3">
            Source{" "}
            <a href="https://chain.link/" target="_blank" rel="noopener noreferrer" >
              <u>Chainlink</u>
            </a>
          </CreditsText>
        </div>
      </MainContainer>
    </MainJumbotron>
);
}

}

class Section2 extends Component {

render() {


return (
<section className="container">
    <br/>
    <br/>
<div className="content has-text-centered"><h1>Benefits of XBORDER</h1></div>
<div className="columns features">
    <div className="column is-4">
        <div className="card is-shady">
            <div className="card-image has-text-centered">
            </div>
            <div className="card-content">
                <div className="content">
                    <h4>Secure Payments</h4>
                    <p>
                        Money transfer using Ether will make remittance payment safer than ever. Unlike normal normal remittance payments,
                        payments are held in escrow using an Ethereum smart contract.
                        <br/><br/>
                        
                        Funds from transactions are released when the system is absolutely sure it can make the transactions.
                        
                    </p>
                </div>
            </div>
        </div>
    </div>
    <div className="column is-4">
        <div className="card is-shady">
            <div className="card-image has-text-centered">
            </div>
            <div className="card-content">
                <div className="content">
                    <h4>No bank account need</h4>
                    <p>
                    Another key obstacle to the payment of remittances via formal banking channels is that the recipient needs to have a banking account to receive the payment. <br/><br/>
                    
                    The unfortunate reality is that the vast majority of people receiving the money do not have bank accounts. Even if they do, many live in rural areas and have to travel long distances to get to the nearest bank branch to collect their money.  As a result, many remittances are made using informal channels.
                    <br/><br/>
                    </p>
                </div>
            </div>
        </div>
    </div>
    <div className="column is-4">
        <div className="card is-shady">
            <div className="card-image has-text-centered">
            </div>
            <div className="card-content">
                <div className="content">
                    <h4>Maximum security with minimised costs</h4>
                    <p>
                    Exclusion of third parties reduces cost of processing payment and turnaround time for settlement (TAT), also eliminating the risk of discrepancies in record keeping. This is because the decentralised ledger, a feature of Blockchain inherited by smart contracts, holds irreversible and distributed record of every transaction available for all peers to see—enabling real time security<br/><br/>
                        <br/><br/>
                    </p>
                    
                </div>
            </div>
        </div>
    </div>
</div>
<br/>
</section>
);
}

}


class Section3 extends Component {

render() {


return (
<div className="hero-body">
<div className="container has-text-centered">
    <div className="columns is-vcentered is-centered">
        <div className="column is-7">
        <h1 className="title is-3">
                About XBORDER
            </h1>
            <h2 className="subtitle is-5">
            </h2>
            <p>XBORDER is the world's first cross-border payment processor built on Ethereum smart contracts.
            This application leverage blockchain technology to minimise cost of international money transfer whilst providing highest security standards.
            </p>
        </div>
        
    </div>
</div>
</div>
);
}

}


class Section4 extends Component {

render() {


return (
<div className="hero-body">
<div className="container has-text-centered">
    <div className="columns is-vcentered is-centered">
    <div className="column is-7">
    <h1 className="title is-2">Intuitive dashboard</h1>
  
    <figure  className="ml-md-5">
                <img width="100%" src="https://chain.link/assets/images/sub-hero-chainlink-diagram-3fb7d8e9.png" alt=""/>
            </figure><br/>
            <p>  XBORDER is designed to be simple and intuitive for users familar with traditional payment processors, such as Paypal and Stripe. 
        Currently we support ETH payments, and stablecoin payments are coming soon.<br/><br/>
        You can also test sending and receiving of payments on the Ropsten testnet.
       </p>
        <br/>
            <p className="buttons is-centered">
            <Link to="/login"><p className="button is-info is-outlined">
    View Dashboard
  </p></Link>
  
  </p>
 
  <p className="is-size-7">Login with <a href="https://chrome.google.com/webstore/detail/metamask/nkbihfbeogaeaoehlefnkodbefgpgknn" target="_blank">metamask</a> to view the dashboard. No signup required.</p>


            
    </div>
    </div>
</div>
</div>
);
}

}

class Section5 extends Component {

render() {


return (
<div className="hero-body bg-lb">
<div className="container has-text-centered">
<h1 className="title is-3">
    Contact Us
</h1>
<p>Feel free to reach out if you have any questions, feedback or suggestion. Reach us on my social media: </p>
            <br/>
            <p className="buttons is-centered">
<SocialMediaIconsReact icon={"reddit"} size={44} roundness={30} url="https://www.reddit.com/r/XBORDER"/>
<SocialMediaIconsReact icon="twitter" size={44} roundness={30}  url="https://twitter.com/XBORDER5"/>
<SocialMediaIconsReact icon="mail" size={44} roundness={30}  url="mailto:xborderofficial@gmail.com"/>
<SocialMediaIconsReact icon="linkedin" size={44} roundness={30} url="https://www.linkedin.com/in/-muhammadhamza"/>
<SocialMediaIconsReact icon="github" size={44} roundness={30} url="https://github.com/hamza3256"/>
        
            </p>
<br/>
<b>Email</b><br/> xborderofficial@gmail.com
<br/>
<br/>
<b>Reddit</b><br/>
https://www.reddit.com/r/XBORDER
<br/>
<br/>
<b>Twitter</b><br/>
https://twitter.com/XBORDER5
<br/><br/>

            
</div>
</div>
);
}

}


class DevSection extends Component {

render() {


return (
<div className="hero-body">
<div className="container has-text-centered">
<h1 className="title is-3">
    Developers Section
</h1>
<p>View our open sourced smart contracts and technical documents.</p>
<br/>
<p><b>XBORDER Profile</b><br/><a href="https://rinkeby.etherscan.io/address/0xbB5A380E585155592Ff33dF4c50E9ff9921dC4df">Rinkeby </a>| <a href="https://ropsten.etherscan.io/address/0xebEc2EAf1325bCbd0Df07cdeae57aE00bD3C6728" target="_blank">Ropsten</a></p><br/>
</div>


</div>
);
}

}

class Section6 extends Component {

render() {


  return (
    <div className="hero-body bg-lb">
    <div className="container has-text-centered">
        <div className="columns is-centered">
            <div className="column is-7">
            <h1 className="title is-3">
        How XBORDER Works
    </h1>
    <p>
       
      
       XBORDER initally set out to be a platform which enables cross-border payment transfers from any fiat currency, converting to Ether then transferring those Ethers to receiver's wallet. The received Ethers are then converted into a different fiat currency corresponding to the receiver.<br/><br/>
        

        The transaction involves holding Ethers in escrow in the Ethereum smart contract. 
        When the necessary checks are performed to ensure that the Ethers can be converted without any problems, the Ethers are release onto the subsequent part of the operation. 
        The Receiver also has the ability to refund the buyer.
        <br/><br/>
        If a dispute occurs, the transaction immediately stops and Ethers are held at the current place of where the error occurred. 
        For further information on how this application works, please visit our <Link to="/login">info page</Link>.
    </p>
            </div>
        </div>

        
        <br/>
        <img src="https://hackernoon.com/photos/81XqUPpcXvVvRMiScfSezcRqKy33-572349p" width="800"/>
    
                <br/>
               
    </div>
</div>
);
}

}
  