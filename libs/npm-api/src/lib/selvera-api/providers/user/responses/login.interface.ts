/**
 * Interface for POST /token/login (Response)
 */

export interface LoginResponse {
  accountType: number
  token: string
}
