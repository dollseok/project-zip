import React from "react"
import styled, { css } from "styled-components"

interface BoxProps {
  children? : React.ReactNode
}

const StyledBox = styled.div<BoxProps>`
  z-index: 5;
  text-align: left;
  width: 50vw;
  height: 40vh;
`


const Box = (props: BoxProps) => {
  return <StyledBox {...props}>{props.children}</StyledBox>
}

export default Box