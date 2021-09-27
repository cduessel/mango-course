import React from 'react';
import Styles from './login-styles.scss';
import Spinner from '../../components/spinner/spinner';
import HeaderLogin from '../../components/header-login/header-login';
import Footer from '../../components/footer/footer';
import Input from '../../components/input/input';
import FormStatus from '../../components/form-status/form-status';

const Login: React.FC = () => {
  return (
    <div className={Styles.login}>
      <HeaderLogin />
      <form className={Styles.form}>
        <h2>Login</h2>
        <Input type="email" name="email" placeholder="Insira seu melhor e-mail" />
        <Input type="password" name="password" placeholder="Digite sua senha" />
        <button className={Styles.submit} type="submit">Entrar</button>
        <span className={Styles.link}> Criar Conta</span>
        <FormStatus />
      </form>
      <Footer />
    </div>
  )
}

export default Login
