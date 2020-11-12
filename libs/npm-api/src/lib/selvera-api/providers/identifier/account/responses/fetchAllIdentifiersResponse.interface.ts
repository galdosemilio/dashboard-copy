/**
 * Interface for GET /account/:account/external-identifier (Response)
 */

import { Identifier } from '../entities'

export interface FetchAllIdentifiersResponse {
  data: Array<Identifier>
}
