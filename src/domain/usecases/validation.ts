import { AccountModel } from '../models'

export type ValidationParams = {
  email: string
  password: string
}

export interface Validation {
  auth(params: ValidationParams): Promise<AccountModel>
}
