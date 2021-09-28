import React, {useContext} from "react"
// import { InputHTMLAttributes, ReactNode } from 'react'
import Styles from "./input-styles.scss"
import Context from "../../contexts/form/form-context"

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
  const { errorState } = useContext(Context)
  const error = errorState[props.name]
  const getStatus = (): string => {
    return '🔴';
  }
  const getTitle = (): string => {
    return error
  }

  return (
    <div className={Styles.inputWrap}>
      <input {...props} />
      <span data-testid={`${props.name}-status`} title={getTitle()} className={Styles.status}>{getStatus()}</span>
    </div>
  )
}

export default Input