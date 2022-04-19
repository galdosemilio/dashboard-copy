import { Component, Input, OnInit } from '@angular/core'
import { MatDialog } from '@angular/material/dialog'
import { ContextService } from '@app/service'
import { EcommerceCreateTokenResponse } from '@coachcare/sdk'
import { DeviceDetectorService } from 'ngx-device-detector'
import { BuyProductDialog } from '../../dialogs'
import { EcommerceProduct } from '../../model'

@Component({
  selector: 'app-ecommerce-product',
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.scss']
})
export class ProductComponent implements OnInit {
  @Input() canBuy = true
  @Input() product: EcommerceProduct
  @Input() showImage = true
  @Input() tokenRes: EcommerceCreateTokenResponse

  public imageBaseUrl: string

  constructor(
    private context: ContextService,
    private deviceDetector: DeviceDetectorService,
    private dialog: MatDialog
  ) {}

  public ngOnInit(): void {
    this.imageBaseUrl = this.context.organization.preferences?.storeUrl ?? ''
  }

  public showBuyProductDialog(): void {
    let dialogWidth = '45vw'

    if (this.deviceDetector.isMobile()) {
      dialogWidth = '95vw'
    } else if (this.deviceDetector.isTablet()) {
      dialogWidth = '75vw'
    }

    this.dialog.open(BuyProductDialog, {
      data: { product: this.product, tokenRes: this.tokenRes },
      width: dialogWidth,
      maxWidth: '100vw',
      disableClose: true
    })
  }
}
