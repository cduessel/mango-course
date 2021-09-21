import { HttpPostClientSpy } from '../../tests/mock-http-client'
import { RemoteAuthentication } from './remote-authentication'
import {mockAuthentication} from '../../../domain/test/mock-authentication'
import {InvalidCredentialsError} from '@/domain/errors/Invalid-credentials-error'
import {UnexpectedError} from '@/domain/errors/unexpected-error'
import { HttpStatusCode } from '@/data/protocols/http/htttp-response'
import faker from 'faker'

type SutTypes = {
  sut: RemoteAuthentication
  httpPostClientSpy: HttpPostClientSpy
  
}

const makeSut = (url: string = faker.internet.url()): SutTypes => {
  const httpPostClientSpy = new HttpPostClientSpy()
  const sut = new RemoteAuthentication(url, httpPostClientSpy)
  return {
    sut,
    httpPostClientSpy
  }
}

describe('RemoteAuthentication', () => {
  test('should call http post client with correct URL ', async () => {
    const url = faker.internet.url()
    const {sut, httpPostClientSpy} = makeSut(url)
    sut.auth(mockAuthentication())
    expect(httpPostClientSpy.url).toBe(url)
  })
  test('should call http post client with correct body ', async () => {
    const {sut, httpPostClientSpy} = makeSut()
    const authenticationParams = mockAuthentication()
    sut.auth(authenticationParams)
    expect(httpPostClientSpy.body).toEqual(authenticationParams)
  })
  test('should throw InvalidCredentialsError if HttpPostClient returns 401', async () => {
    const {sut, httpPostClientSpy} = makeSut()
    httpPostClientSpy.response = {
      statusCode: HttpStatusCode.unauthorized
    }
    const promise = sut.auth(mockAuthentication())
    await expect(promise).rejects.toThrow(new InvalidCredentialsError())
  })
  test('should throw UnexpectedError if HttpPostClient returns 400', async () => {
    const {sut, httpPostClientSpy} = makeSut()
    httpPostClientSpy.response = {
      statusCode: HttpStatusCode.badRequest
    }
    const promise = sut.auth(mockAuthentication())
    await expect(promise).rejects.toThrow(new UnexpectedError())
  })
  test('should throw UnexpectedError if HttpPostClient returns 404', async () => {
    const {sut, httpPostClientSpy} = makeSut()
    httpPostClientSpy.response = {
      statusCode: HttpStatusCode.notFound
    }
    const promise = sut.auth(mockAuthentication())
    await expect(promise).rejects.toThrow(new UnexpectedError())
  })
  test('should throw UnexpectedError if HttpPostClient returns 500', async () => {
    const {sut, httpPostClientSpy} = makeSut()
    httpPostClientSpy.response = {
      statusCode: HttpStatusCode.badServer
    }
    const promise = sut.auth(mockAuthentication())
    await expect(promise).rejects.toThrow(new UnexpectedError())
  })
})
