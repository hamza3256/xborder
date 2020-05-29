import React, { Component } from 'react';
import '../App.css';
import { Link } from "react-router-dom";
import {SocialMediaIconsReact} from 'social-media-icons-react';


class Fees extends Component {

  render() {


    return (
        <div>
        <section class="hero is-info">
            <div class="hero-body">
                <div class="container">
                    <h1 class="title">
                    More information
                    </h1>
                    <h2 class="subtitle">
                    How XBORDER was intended to work
                    </h2>
                </div>
            </div>
            
            
    </section>
    <div class="content container" style={{width:800}}>
    <br/>
    <h1>Main idea</h1>
    <p>This project began with the intention of implementing smart contracts which would have enabled peer-to-peer fiat transfers outside the current jurisdiction of the smart contract caller. The transaction was planned to involve series of processes that includes Fiat-Ether conversion, peer-to-peer Ether transfers, subsequently converting the received Ether into receiver’s fiat currency. This decentralized application makes the use of Ethereum blockchain.</p>

    <h1>The inevitable issue of smart contracts</h1>
    <p>upon further researching of the several ways this project would be implemented and having undergone several trial-and-errors. Several drawbacks of smart contracts were discovered— for each apropos features that were being implemented. The major issue with the project was discovering the fact that smart contracts cannot directly interact with external data outside the blockchain. This reemphasized how immutable smart contracts really are.</p>

    <h1>Current and future work</h1>
    <p>external adapters were implemented that would operate on Chainlink’s node operators. These external adapters will acts as the 'bridge' between smart contracts and the external world thus enabling the XBORDER's true intention. Each node job is verified by series of decentralized oracles provided by Chainlink. These oracles provide the same security as a smart contract.</p>
    
    <h1></h1>
    
    <h4>To get in touch use the following social media platforms.</h4>
    
    <p className="buttons is-centered">
<SocialMediaIconsReact icon={"reddit"} size={44} roundness={30} url="https://www.reddit.com/r/XBORDER"/>
<SocialMediaIconsReact icon="twitter" size={44} roundness={30}  url="https://twitter.com/XBORDER5"/>
<SocialMediaIconsReact icon="mail" size={44} roundness={30}  url="mailto:xborderofficial@gmail.com"/>
<SocialMediaIconsReact icon="linkedin" size={44} roundness={30} url="https://www.linkedin.com/in/-muhammadhamza"/>
<SocialMediaIconsReact icon="github" size={44} roundness={30} url="https://github.com/hamza3256"/>
        
            </p>

    </div>
    <br/>
    
   
    </div>
    );
  }
}

export default Fees;
