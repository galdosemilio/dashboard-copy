import { PaginationResponse } from '../../common/entities'
import { OrganizationBillingItem } from '../entities'

export interface FetchOrganizationBillingResponse {
  data: OrganizationBillingItem[]
  pagination: PaginationResponse
}
