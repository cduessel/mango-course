import React from "react";
import faker from 'faker'
import { render, RenderResult, fireEvent, cleanup } from '@testing-library/react';
import Login from './login'
import {Authentication, AuthenticationParams} from '../../../domain/usecases/authentication'
import {AccountModel} from '../../../domain/models/account-models'
import {mockAccountModel} from '../../../domain/test'
import {ValidationStub, AuthenticationSpy} from "../../test"

type SutTypes = {
  sut: RenderResult,
  authenticationSpy: AuthenticationSpy
}

type SutParams = {
  validationError: string
}

const makeSut = (params?: SutParams): SutTypes => {
  const validationStub = new ValidationStub()
  const authenticationSpy = new AuthenticationSpy()
  validationStub.errorMessage = params?.validationError

  const sut = render(<Login validation={validationStub} authentication={authenticationSpy} />)

  return {
    sut,
    authenticationSpy
  }
}

const simulateValidSubmit = (sut: RenderResult, password = faker.internet.password(), email = faker.internet.email()): void => {
  simulatePasswordField(sut, password)
  simulateEmailField(sut, email)
  const submitButton = sut.getByTestId('submit')
  fireEvent.click(submitButton)
}

const simulateEmailField = (sut: RenderResult, email = faker.internet.email()): void => {
  const emailInput = sut.getByTestId('email')
  fireEvent.input(emailInput, {target: {value: email}})
}

const simulatePasswordField = (sut: RenderResult, password = faker.internet.password()): void => {
  const passwordInput = sut.getByTestId('password')
  fireEvent.input(passwordInput, {target: {value: password}})
}

const simulateStatusForField = (sut: RenderResult, fieldName: string, validationError?: string): void => {
  const fieldStatus = sut.getByTestId(`${fieldName}-status`)
  expect(fieldStatus.title).toBe(validationError || 'Tudo certo')
  expect(fieldStatus.textContent).toBe(validationError ? '🔴' : '🟢')
}


describe('<Login />', () => {
  afterEach(cleanup)

  test('should start with initial state', () => {
    const validationError = faker.random.words()
    const {sut} = makeSut({validationError})
    const errorWrap = sut.getByTestId('error-wrap')
    expect(errorWrap.childElementCount).toBe(0)
    const submitButton = sut.getByTestId('submit') as HTMLButtonElement
    expect(submitButton.disabled).toBe(true)
    const emailStatus = sut.getByTestId('email-status')
    expect(emailStatus.title).toBe(validationError)
    expect(emailStatus.textContent).toBe('🔴')
    const passwordStatus = sut.getByTestId('password-status')
    expect(passwordStatus.title).toBe(validationError)
    expect(passwordStatus.textContent).toBe('🔴')
  })
  
  test('should show error if email Validation fails', () => {
    const validationError = faker.random.words()
    const {sut} = makeSut({validationError})
    simulateEmailField(sut)
    simulateStatusForField(sut, 'email', validationError)
  })

  test('should show error if password Validation fails', () => {
    const validationError = faker.random.words()
    const {sut} = makeSut({validationError})
    simulatePasswordField(sut)
    simulateStatusForField(sut, 'password', validationError)
  })

  test('should show valid email state if Validation succeeds', () => {
    const {sut} = makeSut()
    simulateEmailField(sut)
    simulateStatusForField(sut, 'email')
  })
  test('should show valid password state if Validation succeeds', () => {
    const {sut} = makeSut()
    simulatePasswordField(sut)
    simulateStatusForField(sut, 'password')
  })

  test('should enable submit button when Validation succeeds', () => {
    const {sut} = makeSut()
    simulatePasswordField(sut)
    simulateEmailField(sut)
    const submitButton = sut.getByTestId('submit') as HTMLButtonElement
    expect(submitButton.disabled).toBe(false)
  })

  test('should show the spinner when submited', () => {
    const {sut} = makeSut()
    simulateValidSubmit(sut)
    const spinner = sut.getByTestId('spinner')
    expect(spinner).toBeTruthy()
  })

  test('should call Authentication with correct values', () => {
    const {sut, authenticationSpy} = makeSut()
    const password = faker.internet.password()
    const email = faker.internet.email()
    simulateValidSubmit(sut, password, email)
    expect(authenticationSpy.params).toEqual({
      email,
      password
    })
  })

  test('should call Authentication only once', () => {
    const {sut, authenticationSpy} = makeSut()
    simulateValidSubmit(sut)
    simulateValidSubmit(sut)
    expect(authenticationSpy.callsCount).toBe(1)
  })

  test('should not call Authentication if form is invalid', () => {
    const validationError = faker.random.words()
    const {sut, authenticationSpy} = makeSut({validationError})
    simulateEmailField(sut)
    fireEvent.submit(sut.getByTestId('form'))
    expect(authenticationSpy.callsCount).toBe(0)
  })
})
