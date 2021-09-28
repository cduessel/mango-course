import React, { useState } from 'react';
import Styles from './login-styles.scss';
import { HeaderLogin, Input, Footer, FormStatus } from '../../components';
import Context from '../../contexts/form/form-context'

const Login: React.FC = () => {
  const [state] = useState({
    isLoading: false,
  });
  const [errorState] = useState({
    email: 'Campo obrigatório',
    password: 'Campo obrigatório',
    main: '',
  });

  return (
    <div className={Styles.login}>
      <HeaderLogin />
      <Context.Provider value={{state, errorState}}>
        <form className={Styles.form}>
          <h2>Login</h2>
          <Input type="email" name="email" placeholder="Insira seu melhor e-mail" />
          <Input type="password" name="password" placeholder="Digite sua senha" />
          <button data-testid="submit" className={Styles.submit} type="submit" disabled >Entrar</button>
          <span className={Styles.link}> Criar Conta</span>
          <FormStatus />
        </form>
      </Context.Provider>
      <Footer />
    </div>
  )
}

export default Login
