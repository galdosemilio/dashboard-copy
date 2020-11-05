/**
 * Interface for API Headers
 */

import { CcrRol } from '../model'

export interface ApiHeaders {
  readonly cookieDomain: string
  readonly appName: string
  readonly appVersion: string
  readonly account: CcrRol // TODO assign this through ngrx.userData
  readonly [header: string]: string
}
