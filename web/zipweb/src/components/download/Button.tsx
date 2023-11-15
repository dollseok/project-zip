import styled, {css} from 'styled-components'

interface ButtonProps {
  children?: React.ReactNode
  onClick?: () => void
  href?: string
  download? : boolean
  $responsiveButton? : boolean

}

const StyledButton = styled.a<ButtonProps>`
  z-index: 10;

  ${(props) => 
    props.$responsiveButton &&
    css`
      background-color: black;
      color: white;
      width: 140px;
      height: 40px;
      border-radius: 10px;
      font-size: 20px;
      line-height: 40px;
      text-decoration: none;
  
    @media only screen and (min-width: 1025px) {
      background-color: white;
      color: black;
      }
      
    `
  }
`

const Button = (props: ButtonProps) => {

  return <StyledButton {...props}>{props.children}</StyledButton>
}

export default Button