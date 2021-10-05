import { InvalidFieldError } from "../../errors"
import { MinLengthValidation } from "./min-length-validation"
import faker from 'faker'

const makeSut = (minLength: number): MinLengthValidation => new MinLengthValidation(faker.database.column(), minLength)

describe('MinLengthValidation', () => {
  test('should return error if value length is invalid', () => {
    const sut = makeSut(5)
    const error = sut.validate(faker.random.alphaNumeric(4))
    expect(error).toEqual(new InvalidFieldError())
  })

  test('should return false if value length is valid', () => {
    const sut = makeSut(5)
    const error = sut.validate(faker.random.alphaNumeric(5))
    expect(error).toBeFalsy()
  })
 
})
