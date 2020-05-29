import React, { Component } from 'react';
import ButtonGroup from "react-bootstrap/ButtonGroup";
import Container from "react-bootstrap/Container";
import Image from "react-bootstrap/Image";
import styled from "styled-components";
import Navbar from "react-bootstrap/Navbar";
import Nav from "react-bootstrap/Nav";
import Button from "react-bootstrap/Button";
import '../App.css';

const HomeContainer = styled(Navbar)`
box-shadow: inset 0px -1px 0px #f3f3f4;
background: #002C73;
height: 60px ;
color: #6e6d7a ;
position: sticky ;

@media (max-width: 992px) {
  & {
    position: static;
    height: 60px ;
  }
}


`;

const Logo = styled(Image)`
width: 12rem ;
height: auto;
`;

export default function MainNav() {

    return (


<HomeContainer expand="lg" >
<Container>
  <Navbar.Brand className="mr-auto" href="/">
    <Logo src={require("../assets/cover.png")} alt="logo"/>
  </Navbar.Brand>
  <Nav >
    <ButtonGroup
      className="d-none d-lg-block d-xl-block ml-3 "
      variant="primary"
    >
      <Button href="/">Home</Button>
      <Button href="/info">Info</Button>
      <Button href="/login">Connect</Button>
    </ButtonGroup>
    
  </Nav>
</Container>
</HomeContainer>

    )
}