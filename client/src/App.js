import React, {Component} from "react";
import { BrowserRouter, Switch, Route } from "react-router-dom";
import './App.css';

//import Login from "./pages/Login";
import Dashboard from './dashboard/body.js'

import TransactionDetails  from './transaction/tx_details'
import Home from './home/home';
import MainNav from './home/MainNav'
import Info from './pages/info';
import Login from './getstarted/login';


import CreateInvoice from './transaction/create_invoice';
import 'bulma'
import SendPayment from './transaction/send_payment';
import SendPaymentConfirm from './transaction/send_payment_confirm';
import ProfilePage from './profile/profile_page';
import SetProfile from './dashboard/set_profile';
import Page404 from './common/404';
import getMetamask from 'pages/getmetamask'

class App extends Component {
  handleAddress = (address) => {
    this.setState({address: address});
  }
  render() {
  return (
   

    <BrowserRouter>
       
       <MainNav/>

      <Switch>
      
     
      <Route path="/" exact component={Home} />

       
      <Route path="/dashboard" exact component={Dashboard} />
  
      <Route path="/info" exact component={Info} />
  
      <Route path="/login" exact component={Login} />
  
      <Route path="/activity/transaction/:type/:id" exact component={TransactionDetails} />
  
      <Route path="/activity/create_invoice/:address" exact component={CreateInvoice} />
      <Route path="/activity/send_payment" exact component={SendPayment} />
      <Route path="/activity/send_payment/:address/:currency/:amount" exact component={SendPayment} />
      <Route path="/activity/confirm_payment" exact component={SendPaymentConfirm} />
      <Route path="/activity/set_profile" exact component={SetProfile} />
  
      <Route path="/profile" exact component={ProfilePage} />

      <Route path="/getMetamask" exact component={getMetamask} />
      
      <Route component={Page404} />
  
      </Switch>
    </BrowserRouter>
  );
  }
}

export default App;