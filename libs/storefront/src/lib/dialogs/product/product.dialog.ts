import { Component, Inject, OnInit } from '@angular/core'
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog'
import {
  StorefrontProduct,
  StorefrontProductOption,
  StorefrontService,
  StorefrontVariant
} from '@coachcare/storefront/services'
import {
  NgxGalleryAnimation,
  NgxGalleryImage,
  NgxGalleryImageSize,
  NgxGalleryOptions
} from '@kolkov/ngx-gallery'
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy'
import { DeviceDetectorService } from 'ngx-device-detector'

@UntilDestroy()
@Component({
  selector: 'ccr-storefront-product-dialog',
  templateUrl: './product.dialog.html',
  host: { class: 'ccr-dialog' },
  styleUrls: ['./product.dialog.scss']
})
export class StorefrontProductDialog implements OnInit {
  public product: StorefrontProduct
  public selectedVariant: StorefrontVariant
  public defaultVariant: StorefrontVariant
  public options: StorefrontProductOption[] = []
  public productImages: NgxGalleryImage[] = []
  public quantity = 1
  public planId: string
  public subscribed = false
  public isLoading = false
  public isMobileDevice: boolean
  public get galleryOptions(): NgxGalleryOptions[] {
    return [
      {
        width: '400px',
        height: '400px',
        thumbnailsColumns: 4,
        imageAnimation: NgxGalleryAnimation.Slide,
        imageSize: NgxGalleryImageSize.Contain,
        thumbnailSize: NgxGalleryImageSize.Contain,
        imageArrows: this.productImages.length > 1,
        thumbnails: this.productImages.length > 1
      },
      {
        breakpoint: 450,
        width: '100%',
        preview: false
      }
    ]
  }

  get productPrice(): string {
    if (this.selectedVariant) {
      return this.selectedVariant.display_price
    }

    return this.product.attributes.display_price
  }

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: StorefrontProduct,
    private dialogRef: MatDialogRef<{ id: string; quantity: number }>,
    private storefront: StorefrontService,
    private deviceDetector: DeviceDetectorService
  ) {
    dialogRef.disableClose = true
  }

  ngOnInit(): void {
    this.isMobileDevice = this.deviceDetector.isMobile()
    this.product = this.data
    this.options = this.data.options
    this.defaultVariant = this.data.variants.find(
      (variant) => variant.is_master
    )
    this.productImages = this.product.images.map((image) => ({
      small: image,
      medium: image,
      big: image
    }))
    this.storefront.subscriptions$
      .pipe(untilDestroyed(this))
      .subscribe((subs) => {
        this.planId = this.product.attributes?.public_metadata?.subscription_id
        this.subscribed = subs.some((sub) => {
          return sub.processorPlan === this.planId
        })
      })

    this.setSelectedVariant()
  }

  private setSelectedVariant() {
    const selectedValues = this.options.map((option) => option.selected)

    this.selectedVariant = this.product.variants.find((variant) =>
      selectedValues.some((value) => variant.optionValues.includes(value))
    )
  }

  public onChangeQuantity(quantity: number) {
    if (quantity <= 0) {
      return
    }

    this.quantity = quantity
  }

  public onSelectOption(index: number, value: string) {
    this.options[index].selected = value
    this.setSelectedVariant()
  }

  public async addItemToCart() {
    const variantId = this.selectedVariant?.id || this.defaultVariant?.id
    this.dialogRef.close({ id: variantId, quantity: this.quantity })
  }

  public async onSubscribe() {
    this.isLoading = true
    const response = await this.storefront.createStripeCheckoutSubscription(
      this.planId,
      `${window.location.origin}/storefront`
    )
    window.location.href = response.url
  }

  public async onManageSubscription() {
    this.isLoading = true
    const response = await this.storefront.createStripeCustomerPortal(
      `${window.location.origin}/storefront`
    )
    window.location.href = response.url
  }
}
