import React, {memo} from "react"
import Styles from "./header-login-styles.scss"
import Logo from '../logo/logo';

const HeaderLogin: React.FC = () => {
  return (
    <header className={Styles.header}>
      <Logo />
      <h1>Enquete do Mango React Course</h1>
    </header>
  )
}

export default memo(HeaderLogin)