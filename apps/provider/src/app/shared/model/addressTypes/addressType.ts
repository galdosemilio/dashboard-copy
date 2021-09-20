export interface UserAddress {
  id?: string
  labels: Array<string>
  address1: string
  address2?: string
  city: string
  stateProvince: string
  country: string
  postalCode: string
}
