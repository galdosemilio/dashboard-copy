import { Component, OnInit } from '@angular/core'
import { ContextService, NotifierService } from '@app/service'
import { EcommerceProduct } from '@coachcare/common/model'
import { EcommerceCreateTokenResponse, EcommerceProvider } from '@coachcare/sdk'
import { Client, makeClient } from '@spree/storefront-api-v2-sdk'

@Component({
  selector: 'app-ecommerce',
  templateUrl: './ecommerce.component.html'
})
export class EcommerceComponent implements OnInit {
  public products: EcommerceProduct[] = []

  private spree: Client
  private tokenRes: EcommerceCreateTokenResponse

  constructor(
    private context: ContextService,
    private ecommerce: EcommerceProvider,
    private notifier: NotifierService
  ) {}

  public async ngOnInit(): Promise<void> {
    const storeUrl = this.context.organization.preferences.storeUrl ?? null

    if (!storeUrl) {
      return
    }

    this.createSpreeClient(storeUrl)
    await this.fetchSpreeToken()
    await this.fetchProducts()
  }

  private createSpreeClient(storeUrl: string): void {
    this.spree = makeClient({ host: storeUrl })
  }

  private async fetchProducts(): Promise<void> {
    try {
      const productsRes = await this.spree.products.list(
        {
          bearerToken: this.tokenRes.token
        },
        { include: 'images' }
      )

      if (productsRes.isFail()) {
        throw new Error(
          `Couldn't fetch product list. Reason: ${productsRes.fail().message}`
        )
      }

      const includedData = productsRes.success().included

      this.products = productsRes
        .success()
        .data.map((entry) => new EcommerceProduct(entry, includedData))
    } catch (error) {
      this.notifier.error(error)
    }
  }

  private async fetchSpreeToken(): Promise<void> {
    try {
      this.tokenRes = await this.ecommerce.createToken({
        organization: this.context.organizationId
      })
    } catch (error) {
      this.notifier.error(error)
    }
  }
}
