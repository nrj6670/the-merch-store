import React from "react";
import styled from "styled-components";

const Loading = () => {
  return <LoadingCircle></LoadingCircle>;
};

const LoadingCircle = styled.div`
  margin-left: 50%;
  transform: translateX(-20%);
  &:after {
    content: "";
    width: 16px;
    height: 16px;
    display: inline-block;
    border: 5px solid transparent;
    border-top-color: #13c5f1;
    border-radius: 50%;
    animation: spinner 1s linear infinite;
  }

  @keyframes spinner {
    from {
      transform: rotate(0turn);
    }
    to {
      transform: rotate(1turn);
    }
  }
`;

export default Loading;
