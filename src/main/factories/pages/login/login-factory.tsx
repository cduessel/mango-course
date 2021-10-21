import React from "react"
import {Login} from '../../../../presentation/pages'
import { ValidationComposite } from '../../../../validation/validators/'
import {ValidationBuilder} from '../../../../validation/validators/builder/validation-builder'
import {makeRemoteAuthentication} from '../../usecases/authentication/remote-authentication-factory'

export const makeLogin: React.FC = () => {
  const validationComposite = new ValidationComposite([
    ...ValidationBuilder.field('email').required().email().build(),
    ...ValidationBuilder.field('password').required().min(5).build()
  ])
  return (
    <Login authentication={makeRemoteAuthentication()} validation={validationComposite} />
  )
}