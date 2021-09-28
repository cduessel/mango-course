import React, {useContext} from "react"
import Spinner from "../spinner/spinner"
import Styles from "./form-status-styles.scss"
import Context from "../../contexts/form/form-context"


const FormStatus: React.FC = () => {
  const { state, errorState } = useContext(Context)
  const {isLoading } = state
  const { main } = errorState
  return (
    <div className={Styles.errorWrap} data-testid="error-wrap" >
      { isLoading && <Spinner className={Styles.spinner} />}
      {main &&  <span className={Styles.error}>{main}</span>}
    </div>
  )
}

export default FormStatus