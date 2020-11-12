/**
 * A device type making the request. Web login will return a cookie, iOS and Android logins will return bearer tokens.
 */
export enum UserDeviceType {
  Web = 1,
  iOS = 2,
  Android = 3
}

/**
 * @param accountType accountType is a comma-delimited list of account types to permit login: (Admin|Provider|Client|Manager)
 */
export enum AccountType {
  Admin = 1,
  Provider = 2,
  Client = 3,
  Manager = 4
}

/**
 * Interface for POST /token/login
 */
export interface LoginRequest {
  email: string
  password: string
  deviceType: UserDeviceType
  permittedAccountTypes: Array<AccountType>
  organization?: string
}
