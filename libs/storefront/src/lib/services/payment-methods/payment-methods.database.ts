import { Injectable } from '@angular/core'
import { SpreeProvider } from '@coachcare/sdk'
import { StorefrontPaymentMethod } from '../../model'

export interface StorefrontFetchPaymentMethodResponse {
  data: StorefrontPaymentMethod[]
}

@Injectable()
export class StorefrontPaymentMethodsDatabase {
  constructor(private spreeProvider: SpreeProvider) {}

  public async deletePaymentMethod(
    paymentMethod: StorefrontPaymentMethod
  ): Promise<void> {
    return this.spreeProvider.deleteCreditCard({ cardToken: paymentMethod.id })
  }

  public async fetch(): Promise<StorefrontFetchPaymentMethodResponse> {
    const creditCardsRes = await this.spreeProvider.getCreditCards()

    return {
      data: creditCardsRes.credit_cards.map((entry) => ({
        isDefault: entry.default_source ?? false,
        id: entry.id,
        name: entry.name,
        expMonth: entry.exp_month,
        expYear: entry.exp_year,
        last4Digits: entry.last4,
        type: entry.brand.toLowerCase()
      }))
    }
  }

  public async setPaymentMethodAsDefault(
    paymentMethod: StorefrontPaymentMethod
  ): Promise<void> {
    return this.spreeProvider.setCreditCardAsDefault({
      cardToken: paymentMethod.id
    })
  }
}
