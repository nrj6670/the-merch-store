import React from "react";
import styled from "styled-components";

//social handle icon
import GitHubIcon from "../images/icons/github_icon.ico";

const Footer = () => {
  return (
    <StyledFooter>
      <div className="footer-container">
        <div className="footer-text">
          <p>Created by Neeraj Shakure &copy; 2021</p>
          <p>Email: nrj6670@gmail.com</p>
        </div>
        <div className="footer-social">
          <a href="https://github.com/nrj6670">
            <img src={GitHubIcon} alt="" />
          </a>
        </div>
      </div>
    </StyledFooter>
  );
};

const StyledFooter = styled.div`
  min-height: 10vh;
  background-color: #7fcec5;
  background-image: linear-gradient(315deg, #7fcec5 0%, #14557b 74%);
  color: white;
  padding: 1rem 0rem;
  margin-top: 1rem;

  .footer-container {
    display: flex;
    font-size: 1.2rem;
    width: 90%;
    margin: auto;
    flex-wrap: wrap;
    justify-content: space-between;
    align-items: center;

    .footer-text {
      flex: 1 1 20rem;
      p {
        padding: 1rem 0rem;
      }
    }
    .footer-social {
      flex: 1 1 20rem;
      display: flex;
      justify-content: center;
      align-items: center;
      padding: 1rem 0rem;
      a img {
        width: 4rem;
        height: 4rem;
      }
    }
  }
`;

export default Footer;
