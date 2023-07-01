import { Component, Inject, OnInit } from '@angular/core'
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog'
import { NotifierService } from '@coachcare/common/services'
import { SpreeProvider } from '@coachcare/sdk'
import { StorefrontService } from '@coachcare/storefront/services'
import { JsonApiDocument, OrderAttr } from '@spree/storefront-api-v2-sdk'
import { StorefrontOrderEntry } from '../../model'

interface StorefrontOrderDetailsDialogProps {
  order: StorefrontOrderEntry
}

@Component({
  selector: 'storefront-order-details-dialog',
  templateUrl: './order-details.dialog.html',
  styleUrls: ['./order-details.dialog.scss'],
  host: { class: 'ccr-dialog' }
})
export class StorefrontOrderDetailsDialog implements OnInit {
  public order: StorefrontOrderEntry

  constructor(
    @Inject(MAT_DIALOG_DATA) private data: StorefrontOrderDetailsDialogProps,
    private dialogRef: MatDialogRef<StorefrontOrderDetailsDialog>,
    private notifier: NotifierService,
    private spree: SpreeProvider,
    private storefront: StorefrontService
  ) {}

  public async ngOnInit(): Promise<void> {
    await this.fetchOrder(this.data.order.id)
  }

  private async fetchOrder(id: string): Promise<void> {
    try {
      const response = await this.spree.getSingleOrder({
        number: id,
        include: [
          'billing_address',
          'shipping_address',
          'line_items',
          'payments',
          'payments.source',
          'variants',
          'variants.images'
        ]
      })
      this.order = new StorefrontOrderEntry(
        response.data as unknown as OrderAttr,
        response.included as unknown as JsonApiDocument[],
        this.storefront.storeUrl ?? ''
      )
    } catch (error) {
      this.notifier.error(error)
      this.dialogRef.close()
    }
  }
}
