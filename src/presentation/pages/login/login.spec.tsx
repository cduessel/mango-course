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
    const emailInput = sut.getByTestId('email')
    const email = faker.internet.email()
    fireEvent.input(emailInput, {target: {value: email}})
    const emailStatus = sut.getByTestId('email-status')
    expect(emailStatus.title).toBe(validationError)
    expect(emailStatus.textContent).toBe('🔴')
  })

  test('should show error if password Validation fails', () => {
    const validationError = faker.random.words()
    const {sut} = makeSut({validationError})
    const passwordInput = sut.getByTestId('password')
    const password = faker.internet.password()
    fireEvent.input(passwordInput, {target: {value: password}})
    const passwordStatus = sut.getByTestId('password-status')
    expect(passwordStatus.title).toBe(validationError)
    expect(passwordStatus.textContent).toBe('🔴')
  })

  test('should show valid email state if Validation succeeds', () => {
    const {sut} = makeSut()
    const emailInput = sut.getByTestId('email')
    const email = faker.internet.email()
    fireEvent.input(emailInput, {target: {value: email}})
    const emailStatus = sut.getByTestId('email-status')
    expect(emailStatus.title).toBe('Tudo certo')
    expect(emailStatus.textContent).toBe('🟢')
  })
  test('should show valid password state if Validation succeeds', () => {
    const {sut} = makeSut()
    const passwordInput = sut.getByTestId('password')
    const password = faker.internet.password()
    fireEvent.input(passwordInput, {target: {value: password}})
    const passwordStatus = sut.getByTestId('password-status')
    expect(passwordStatus.title).toBe('Tudo certo')
    expect(passwordStatus.textContent).toBe('🟢')
  })

  test('should enable submit button when Validation succeeds', () => {
    const {sut} = makeSut()
    const passwordInput = sut.getByTestId('password')
    const password = faker.internet.password()
    fireEvent.input(passwordInput, {target: {value: password}})
    const emailInput = sut.getByTestId('email')
    const email = faker.internet.email()
    fireEvent.input(emailInput, {target: {value: email}})
    const submitButton = sut.getByTestId('submit') as HTMLButtonElement
    expect(submitButton.disabled).toBe(false)
  })

  test('should show the spinner when submited', () => {
    const {sut} = makeSut()
    const passwordInput = sut.getByTestId('password')
    const password = faker.internet.password()
    fireEvent.input(passwordInput, {target: {value: password}})
    const emailInput = sut.getByTestId('email')
    const email = faker.internet.email()
    fireEvent.input(emailInput, {target: {value: email}})
    const submitButton = sut.getByTestId('submit')
    fireEvent.click(submitButton)
    const spinner = sut.getByTestId('spinner')
    expect(spinner).toBeTruthy()
  })

  test('should call Authentication with correct values', () => {
    const {sut, authenticationSpy} = makeSut()
    const passwordInput = sut.getByTestId('password')
    const password = faker.internet.password()
    fireEvent.input(passwordInput, {target: {value: password}})
    const emailInput = sut.getByTestId('email')
    const email = faker.internet.email()
    fireEvent.input(emailInput, {target: {value: email}})
    const submitButton = sut.getByTestId('submit')
    fireEvent.click(submitButton)
    
    expect(authenticationSpy.params).toEqual({
      email,
      password
    })
  })
})
