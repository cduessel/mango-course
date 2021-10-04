import {Authentication, AuthenticationParams} from '../../domain/usecases/authentication'
import {mockAccountModel} from '../../domain/test'
import {AccountModel} from '../../domain/models/account-models'

export class AuthenticationSpy implements Authentication {
  account = mockAccountModel()
  params: AuthenticationParams
  callsCount = 0

  async auth(params: AuthenticationParams): Promise<AccountModel> {
    this.params = params
    this.callsCount++
    return Promise.resolve(this.account)
  }
}