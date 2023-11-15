import React from "react"
import styled, { css } from "styled-components"



interface TextProps {
  children? : React.ReactNode
}

const StyledText = styled.p<TextProps>`
  font-family: 'webfontBlack';
  font-size: 2.5rem;
  color: black;
  z-index: 10;
  margin: 10px;

  @media only screen and (min-width: 1025px) {
    font-size: 3rem;
    color: white;
    margin-bottom: 3rem;
    font-family: 'webfont';
  }
`


const Text = (props: TextProps) => {
  return <StyledText {...props}>{props.children}</StyledText>
}

export default Text