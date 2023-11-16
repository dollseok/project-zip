import React from "react"
import styled, { css } from "styled-components"

interface ImageProps {
  $backgroundImage? :boolean
  $logoImage? : boolean
  $wordImage? : boolean
  $blackDownloadIcon? : boolean
  $whiteDownloadIcon? : boolean
  src? : string
}

const StyledImage = styled.div<ImageProps>`
background-size: cover;
background-repeat: no-repeat;
background-position: center center;

${(props) => 
  props.$logoImage &&
  css`
    z-index: 10;
    width: 70px;
    height: 60px;
    background-image: url(${process.env.PUBLIC_URL}/image/logo.png);
    margin-bottom: 5rem;
  `
}
${(props) => 
  props.$logoImage &&
  css`
    z-index: 10;
    width: 70px;
    height: 60px;
    background-image: url(${process.env.PUBLIC_URL}/image/logo.png);
    margin-bottom: 6rem;
  `
}
${(props) => 
  props.$wordImage &&
  css`
    z-index: 10;
    width: 200px;
    height: 160px;
    background-image: url(${process.env.PUBLIC_URL}/image/word.png);
    margin-bottom: 6rem;
  `
}

  ${(props) => 
    props.$backgroundImage &&
    
    css`
      background-color: white;
      width: 100vw;
      height: 100vh;
      position: fixed;
      top: 0;
      left: 0;
      z-index: 0;

      @media only screen and (min-width: 1025px) {
        background-image: url(${process.env.PUBLIC_URL}/image/background.png);
      }
    `
  }

  ${(props) => 
    props.$blackDownloadIcon && 
    css`
      z-index: 20;
      background-image: url(${process.env.PUBLIC_URL}/image/blackDownloadIcon.png);
      width: 20px;
      height: 20px;
      margin-right: 6px;
    `
  }
  ${(props) => 
    props.$whiteDownloadIcon && 
    css`
      z-index: 20;
      background-image: url(${process.env.PUBLIC_URL}/image/whiteDownloadIcon.png);
      width: 20px;
      height: 20px;
      margin-right: 10px;
    `
  }
`

const Image = (props: ImageProps) => {
  return <StyledImage {...props}></StyledImage>
}

export default Image