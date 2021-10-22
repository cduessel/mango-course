import React from "react"
import { Router } from 'react-router-dom'
import { createMemoryHistory } from 'history'
import faker from 'faker'
import 'jest-localstorage-mock'
import { render, RenderResult, fireEvent, cleanup, waitFor } from '@testing-library/react';
import {Login} from '../index'
import {ValidationStub, AuthenticationSpy} from "../../test"
import { InvalidCredentialsError } from '../../../domain/errors'

type SutTypes = {
  sut: RenderResult,
  authenticationSpy: AuthenticationSpy
}

type SutParams = {
  validationError: string
}

const history = createMemoryHistory({ initialEntries: ['/login']})
const makeSut = (params?: SutParams): SutTypes => {
  const validationStub = new ValidationStub()
  const authenticationSpy = new AuthenticationSpy()
  validationStub.errorMessage = params?.validationError

  const sut = render(
  <Router history={history}>
    <Login validation={validationStub} authentication={authenticationSpy} />)
  </Router>
  )

  return {
    sut,
    authenticationSpy
  }
}

const simulateValidSubmit = async (sut: RenderResult, password = faker.internet.password(), email = faker.internet.email()): Promise<void> => {
  simulatePasswordField(sut, password)
  simulateEmailField(sut, email)
  const form = sut.getByTestId('form')
  fireEvent.submit(form)
  await waitFor(() => form)
}

const simulateEmailField = (sut: RenderResult, email = faker.internet.email()): void => {
  const emailInput = sut.getByTestId('email')
  fireEvent.input(emailInput, {target: {value: email}})
}

const simulatePasswordField = (sut: RenderResult, password = faker.internet.password()): void => {
  const passwordInput = sut.getByTestId('password')
  fireEvent.input(passwordInput, {target: {value: password}})
}

const testStatusForField = (sut: RenderResult, fieldName: string, validationError?: string): void => {
  const fieldStatus = sut.getByTestId(`${fieldName}-status`)
  expect(fieldStatus.title).toBe(validationError || 'Tudo certo')
  expect(fieldStatus.textContent).toBe(validationError ? '🔴' : '🟢')
}

const testErrorWrapChildCount = (sut: RenderResult, count: number): void => {
  const errorWrap = sut.getByTestId('error-wrap')
  expect(errorWrap.childElementCount).toBe(count)
}

const testElementExists = (sut: RenderResult, fieldName: string): void => {
  const element = sut.getByTestId(fieldName)
  expect(element).toBeTruthy()
}

const testElementText = (sut: RenderResult, fieldName: string, text: string): void => {
  const element = sut.getByTestId(fieldName)
  expect(element.textContent).toBe(text)
}

const testButtonIsDisabled = (sut: RenderResult, fieldName: string, isDisabled: boolean): void => {
  const button = sut.getByTestId(fieldName) as HTMLButtonElement
  expect(button.disabled).toBe(isDisabled)
}

describe('<Login />', () => {
  afterEach(cleanup)
  beforeEach(() => {
    localStorage.clear()
  })

  test('should start with initial state', () => {
    const validationError = faker.random.words()
    const {sut} = makeSut({validationError})
    testErrorWrapChildCount(sut, 0)
    testButtonIsDisabled(sut, 'submit', true) 
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
    testStatusForField(sut, 'email', validationError)
  })

  test('should show error if password Validation fails', () => {
    const validationError = faker.random.words()
    const {sut} = makeSut({validationError})
    simulatePasswordField(sut)
    testStatusForField(sut, 'password', validationError)
  })

  test('should show valid email state if Validation succeeds', () => {
    const {sut} = makeSut()
    simulateEmailField(sut)
    testStatusForField(sut, 'email')
  })
  test('should show valid password state if Validation succeeds', () => {
    const {sut} = makeSut()
    simulatePasswordField(sut)
    testStatusForField(sut, 'password')
  })

  test('should enable submit button when Validation succeeds', () => {
    const {sut} = makeSut()
    simulatePasswordField(sut)
    simulateEmailField(sut)
    testButtonIsDisabled(sut, 'submit', false)
  })

  test('should show the spinner when submited', async () => {
    const {sut} = makeSut()
    await simulateValidSubmit(sut)
    testElementExists(sut, 'spinner')
  })

  test('should call Authentication with correct values', async () => {
    const {sut, authenticationSpy} = makeSut()
    const password = faker.internet.password()
    const email = faker.internet.email()
    await simulateValidSubmit(sut, password, email)
    expect(authenticationSpy.params).toEqual({
      email,
      password
    })
  })

  test('should call Authentication only once', async () => {
    const {sut, authenticationSpy} = makeSut()
    await simulateValidSubmit(sut)
    await simulateValidSubmit(sut)
    expect(authenticationSpy.callsCount).toBe(1)
  })

  test('should not call Authentication if form is invalid', async () => {
    const validationError = faker.random.words()
    const {sut, authenticationSpy} = makeSut({validationError})
    await simulateValidSubmit(sut)
    expect(authenticationSpy.callsCount).toBe(0)
  })

  test('should present error if Authentication fails', async () => {
    const {sut, authenticationSpy} = makeSut()
    const error = new InvalidCredentialsError()
    jest.spyOn(authenticationSpy, 'auth').mockReturnValueOnce(Promise.reject(error))
    await simulateValidSubmit(sut)
    testElementText(sut, 'main-error', error.message)
    testErrorWrapChildCount(sut, 1)
  })

  test('should add access token to localstorage on success', async () => {
    const {sut, authenticationSpy} = makeSut()
    await simulateValidSubmit(sut)
    expect(localStorage.setItem).toHaveBeenCalledWith('accessToken', authenticationSpy.account.accessToken)
    expect(history.length).toBe(1)
    expect(history.location.pathname).toBe('/')
  })

  test('should go to signup page', async () => {
    const {sut} = makeSut()
    const signup = sut.getByTestId('signup')
    fireEvent.click(signup)
    expect(history.length).toBe(2)
    expect(history.location.pathname).toBe('/signup')
  })
})
