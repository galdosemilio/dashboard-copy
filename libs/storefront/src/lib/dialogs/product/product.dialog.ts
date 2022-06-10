import { Component, Inject, OnInit } from '@angular/core'
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog'
import {
  StorefrontOptionValue,
  StorefrontProduct,
  StorefrontProductOption,
  StorefrontVariant
} from '@coachcare/storefront/services'
import { UntilDestroy } from '@ngneat/until-destroy'

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

  public quantity = 1

  get productPrice(): string {
    if (this.selectedVariant) {
      return this.selectedVariant.display_price
    }

    return this.product.attributes.display_price
  }

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: StorefrontProduct,
    private dialogRef: MatDialogRef<{ id: string; quantity: number }>
  ) {}

  ngOnInit(): void {
    this.product = this.data
    this.options = this.data.options
    this.defaultVariant = this.data.variants.find(
      (variant) => variant.is_master
    )
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

  public onSelectOption(index: number, option: StorefrontOptionValue) {
    this.options[index].selected = option.id
    this.setSelectedVariant()
  }

  public async addItemToCart() {
    const variantId = this.selectedVariant?.id || this.defaultVariant?.id
    this.dialogRef.close({ id: variantId, quantity: this.quantity })
  }
}
