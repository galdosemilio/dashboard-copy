/**
 * Interfaces for Supplement Data
 */

export interface OrganizationSupplements {
  id: string
  supplement: SupplementResponse
  dosage: null | number
}

export interface SupplementConsumption {
  supplement: {
    id: string
    name: string
    shortName: string
  }
  quantity: number
}

export type SupplementConsumptionResponse = SupplementConsumption & {
  id: string
}

export interface SupplementResponse {
  id: string
  fullName: string
  shortName: string
  isActive: boolean
}
