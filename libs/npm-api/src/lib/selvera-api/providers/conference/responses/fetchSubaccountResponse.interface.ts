/**
 * Interface for GET /conference/subaccount/:id (response)
 */

import { Subaccount } from './fetchAllSubaccountsResponse.interface'

export interface FetchSubaccountResponse extends Subaccount {
  data: {
    id: string
  }
}
