import React from "react";
import styled from "styled-components";

const Base = ({
  title = "My title",
  description = "My description",
  children,
}) => {
  return (
    <StyledBase>
      <h1>{title}</h1>
      <h2>{description}</h2>
    </StyledBase>
  );
};

const StyledBase = styled.div`
  min-height: 90vh;
  width: 90%;
  margin: auto;
  color: gray;
`;

export default Base;
