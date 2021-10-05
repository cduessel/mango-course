import { RequiredFieldError } from "../errors"
import { RequiredFieldValidation } from "./required-field-validation"
 import faker from 'faker'

describe('RequiredFieldValidation', () => {
  test('should return error if field is empty', () => {
    const sut = new RequiredFieldValidation('email')
    const error = sut.validate('')
    expect(error).toEqual(new RequiredFieldError)
  })

  test('should return if field is not empty', () => {
    const sut = new RequiredFieldValidation('email')
    const error = sut.validate(faker.internet.email())
    expect(error).toBeFalsy()
  })
})
