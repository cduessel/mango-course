import {RequiredFieldValidation} from '../'
import { ValidationBuilder } from "./validation-builder"

describe('ValidationBuilder', () => {
  test('should return RequiredFieldValidation', () => {
    const validations = ValidationBuilder.field('any_field').required().build()
    expect(validations).toEqual([new RequiredFieldValidation('any_field')])
  })
  
})
