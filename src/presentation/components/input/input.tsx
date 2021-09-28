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
  const { state, setState } = useContext(Context)
  const error = state[`${props.name}Error`]
  const getStatus = (): string => {
    return '🔴';
  }
  const getTitle = (): string => {
    return error
  }

  const handleChange = (event: React.FocusEvent<HTMLInputElement>): void => {
    setState({
      ...state,
      [event.target.name]: event.target.value
    })
  }

  return (
    <div className={Styles.inputWrap}>
      <input {...props} data-testid={props.name} onChange={handleChange} />
      <span data-testid={`${props.name}-status`} title={getTitle()} className={Styles.status}>{getStatus()}</span>
    </div>
  )
}

export default Input