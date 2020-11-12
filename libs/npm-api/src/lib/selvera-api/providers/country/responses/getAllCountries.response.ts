import { Country } from '../entities'
import { PaginationResponse } from './paginationResponse.interface'

export interface GetAllCountriesResponse {
  data: Country[]
  pagination: PaginationResponse
}
