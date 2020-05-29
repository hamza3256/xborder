import React from "react";
import ReactDOM from "react-dom";
import App from "./App";

import { Provider } from "react-redux";
import * as serviceWorker from "./serviceWorker";
import registerServiceWorker from './registerServiceWorker';
//import "./utilities/theme.scss";

import { GlobalStyle } from "./utilities/GlobalStyle";

ReactDOM.render(
  <React.StrictMode>
    
      <GlobalStyle />
      <App />
    
  </React.StrictMode>,
  document.getElementById("root")
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
//serviceWorker.unregister();

registerServiceWorker();