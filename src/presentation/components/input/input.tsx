import React from "react"
// import { InputHTMLAttributes, ReactNode } from 'react'
import Styles from "./input-styles.scss"

// export type InputProps = {
//   type?: string; 
//   name?: string;
//   placeholder?: string
//   children?: ReactNode,
// } & InputHTMLAttributes<HTMLInputElement>

type Props = React.DetailedHTMLProps<React.InputHTMLAttributes<HTMLInputElement>, HTMLInputElement>

const Input: React.FC<Props> = ({
  // type = 'text',
  // name,
  // placeholder,
  // children,
  ...props
}: Props) => {
  return (
    <div className={Styles.inputWrap}>
      <input {...props} />
      <span className={Styles.status}>🔴</span>
    </div>
  )
}

export default Input