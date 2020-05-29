import React, { Component } from 'react';
import '../App.css';
import { Link } from "react-router-dom";


class Page404 extends Component {

  render() {


    return (
        <section className="hero is-fullheight is-default is-bold">
        <div className="hero-head">
            <nav className="navbar">
                <div className="container">
                    <div className="navbar-brand">
                        <p className="navbar-item">
            XBORDER
          </p>
                       
                    </div>
                  
                </div>
            </nav>
        </div>  
 
        <div className="hero-body">
        <div className="container has-text-centered">
            <div className="columns is-vcentered">
                <div className="column is-5">
                    <figure className="image">
                        <img src="https://i1.wp.com/saedx.com/blog/wp-content/uploads/2019/01/saedx-blog-featured-70.jpg?zoom=1.25&fit=1200%2C500&ssl=1" alt="Description"/>
                    </figure>
                </div>
               
            </div>
        </div>
    </div>
      
    </section>
        
    );
  }
}

export default Page404;
