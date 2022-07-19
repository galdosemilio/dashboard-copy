export interface StorefrontPaymentMethod {
  expMonth?: number
  expYear?: number
  id: string
  isDefault: boolean
  last4Digits?: string
  name: string
  type?: string
}
