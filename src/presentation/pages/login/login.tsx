import React, { useState, useEffect } from 'react';
import Styles from './login-styles.scss';
import { HeaderLogin, Input, Footer, FormStatus } from '../../components';
import Context from '../../contexts/form/form-context'
import { Validation } from '../../protocols/validation';
import { Authentication } from '../../../domain/usecases'

type Props = {
  validation: Validation,
  authentication: Authentication
}

const Login: React.FC<Props> = ({ validation, authentication }: Props) => {
  const [state, setState] = useState({
    isLoading: false,
    email: '',
    password: '',
    emailError: '',
    passwordError: '',
    mainError: '',
  });

  useEffect(() => {
    setState({
      ...state,
      emailError: validation.validate('email', state.email),
      passwordError: validation.validate('password', state.password)
    })
  }, [state.email, state.password])

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>): Promise<void> => {
    event.preventDefault()
    if(state.isLoading){
      return
    }
    setState({
      ...state,
      isLoading: true
    })
    await authentication.auth({
      email: state.email,
      password: state.password
    })
  }

  return (
    <div className={Styles.login}>
      <HeaderLogin />
      <Context.Provider value={{state, setState}}>
        <form className={Styles.form} onSubmit={handleSubmit}>
          <h2>Login</h2>
          <Input type="email" name="email" placeholder="Insira seu melhor e-mail" />
          <Input type="password" name="password" placeholder="Digite sua senha" />
          <button data-testid="submit" className={Styles.submit} type="submit" disabled={!!state.emailError || !!state.passwordError} >Entrar</button>
          <span className={Styles.link}> Criar Conta</span>
          <FormStatus />
        </form>
      </Context.Provider>
      <Footer />
    </div>
  )
}

export default Login
