/**
 * Interface for GET /account/:id (response)
 */

import {
  AccountFullData,
  AccountPreferences,
  AccountTitle,
  ClientData
} from '../entities'

export interface AccSingleResponse extends AccountFullData {
  title?: AccountTitle
  clientData?: Partial<ClientData> // only loaded for clients
  preferredLocales: Array<string>
  preference: AccountPreferences
}
