import React from "react";
import styled from "styled-components";
import Jumbotron from "react-bootstrap/Jumbotron";
import Button from "react-bootstrap/Button";
import Image from "react-bootstrap/Image";
import Container from "react-bootstrap/Container";

const IntroJumbotron = styled(Jumbotron)`
  background: #f9f8fd;
`;

const IntroContainer = styled(Container)`
  display: flex;
  flex-flow: column-reverse;
  align-items: center;

  @media (min-width: 992px) {
    & {
      flex-flow: row;
    }
  }
`;

const IntroImage = styled(Image)`
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
    width: 500px;
  }
`;

const CreditsText = styled.p`
  color: #9e9ea7;

  & a {
    color: #9e9ea7;
  }
`;
export default function Introduction() {
  return (
    <IntroJumbotron fluid>
      <IntroContainer className="d-flex align-items-center text-center text-lg-left">
        <div id="text-container">
          <h1 className="display-4 font-weight-bold">
          The distinguished decentralized platform for cross-border transfers
          </h1>
          <p className="lead font-weight-normal">
            XBORDER enables international money transfer through the use of decentralized Chainlink oracles providing data for Ethereum smart contracts.
          </p>
          <Button variant="primary" size="lg" role="button" href="/login">
            Sign up
          </Button>
        </div>
        <div id="image-container" className="ml-md-5">
          <IntroImage
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
      </IntroContainer>
    </IntroJumbotron>
  );
}
