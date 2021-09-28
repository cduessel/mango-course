import React, {useContext} from "react"
import Spinner from "../spinner/spinner"
import Styles from "./form-status-styles.scss"
import Context from "../../contexts/form/form-context"


const FormStatus: React.FC = () => {
  const {isLoading, errorMessage } = useContext(Context)
  return (
    <div className={Styles.errorWrap} data-testid="error-wrap" >
      { isLoading && <Spinner className={Styles.spinner} />}
      {errorMessage &&  <span className={Styles.error}>{errorMessage}</span>}
    </div>
  )
}

export default FormStatus