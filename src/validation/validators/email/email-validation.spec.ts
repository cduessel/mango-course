import { InvalidFieldError } from "../../errors"
import { EmailValidation } from "./email-validation"
 
describe('EmailValidation', () => {
  test('should return error if email os invalid', () => {
    const sut = new EmailValidation('email')
    const error = sut.validate('')
    expect(error).toEqual(new InvalidFieldError())
  })
  
})
