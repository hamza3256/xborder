import React, { Component } from 'react';

import getmeta from '../assets/getmeta.png'


class getMetamask extends Component {
  

  render() {

    

    return (
      
       <a href="https://chrome.google.com/webstore/detail/metamask/nkbihfbeogaeaoehlefnkodbefgpgknn"> <img className="img-responsive" src={getmeta} alt="logo"/></a>
    );
  }
}

export default getMetamask;
