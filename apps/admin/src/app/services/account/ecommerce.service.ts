import { Injectable } from '@angular/core'
import {
  CookieService,
  ECOMMERCE_ACCESS_TOKEN
} from '@coachcare/common/services'
import { EcommerceProvider, SpreeProvider } from '@coachcare/sdk'

@Injectable()
export class EcommerceService {
  public storeUrl: string

  get hasStore(): boolean {
    return !!this.storeUrl
  }

  constructor(
    private ecommerce: EcommerceProvider,
    private spreeProvider: SpreeProvider,
    private cookie: CookieService
  ) {}

  async createExternalIdentifier(accountId: string) {
    await this.ecommerce.createExternalIdentifier({
      account: accountId
    })
  }

  async loadSpreeInfo(accountId: string): Promise<string> {
    if (!this.hasStore) {
      return
    }

    const ecommerceAccessToken = this.cookie.get(ECOMMERCE_ACCESS_TOKEN)

    if (ecommerceAccessToken) {
      this.spreeProvider.setBaseApiOptions(
        {
          baseUrl: this.storeUrl,
          headers: { Authorization: `Bearer ${ecommerceAccessToken}` }
        },
        true
      )
      return
    }

    const spreeAccessTokenResponse = await this.ecommerce.createToken({
      account: accountId
    })

    this.spreeProvider.setBaseApiOptions(
      {
        baseUrl: this.storeUrl,
        headers: { Authorization: `Bearer ${spreeAccessTokenResponse.token}` }
      },
      true
    )

    this.cookie.set(
      ECOMMERCE_ACCESS_TOKEN,
      spreeAccessTokenResponse.token,
      new Date(spreeAccessTokenResponse.expiresAt)
    )

    return spreeAccessTokenResponse.token
  }

  setupUrl(url: string) {
    this.storeUrl = url
  }
}
