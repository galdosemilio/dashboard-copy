import { Component, Input, OnInit } from '@angular/core'
import * as moment from 'moment'
import { PackagePriceItem, PackagePricePlanItem } from '../../model'

@Component({
  selector: 'ccr-billing-summary-item',
  templateUrl: './billing-summary-item.component.html',
  styleUrls: ['./billing-summary-item.component.scss']
})
export class BillingSummaryItemComponent implements OnInit {
  @Input()
  set billingPeriod(billingPeriod: PackagePricePlanItem | undefined) {
    this._billingPeriod = billingPeriod
    this.calculateNextBillingDate()
    this.calculateNextBillingAmount(billingPeriod)
  }

  get billingPeriod(): PackagePricePlanItem | undefined {
    return this._billingPeriod
  }

  @Input()
  set item(item: PackagePriceItem | undefined) {
    this._item = item
    this.calculateNextBillingDate()
    this.calculateNextBillingAmount(this.billingPeriod)
  }

  get item(): PackagePriceItem | undefined {
    return this._item
  }

  public nextBillingDate: string
  public nextBillingAmount: number

  private _billingPeriod?: PackagePricePlanItem
  private _item?: PackagePriceItem
  private billingDateFormat = 'MM/DD/YYYY'

  public ngOnInit(): void {
    this.calculateNextBillingDate()
    this.calculateNextBillingAmount(this.billingPeriod)
  }

  private calculateBillingTermOffset(
    item?: PackagePricePlanItem
  ): moment.DurationInputArg2 {
    if (!item) {
      return 'months'
    }

    switch (item.billingPeriod) {
      case 'monthly':
        return 'months'
      case 'annually':
        return 'years'
      default:
        return 'month'
    }
  }

  private calculateNextBillingAmount(
    billingPeriod?: PackagePricePlanItem
  ): void {
    if (!billingPeriod) {
      return
    }

    switch (billingPeriod.billingPeriod) {
      case 'monthly':
        this.nextBillingAmount = billingPeriod ? billingPeriod.price || 0 : 0
        break

      case 'annually':
        this.nextBillingAmount =
          (billingPeriod ? billingPeriod.price || 0 : 0) * 12
        break

      default:
        this.nextBillingAmount = billingPeriod ? billingPeriod.price || 0 : 0
        break
    }
  }

  private calculateNextBillingDate(): void {
    const billingTermOffset = this.calculateBillingTermOffset(
      this.billingPeriod
    )

    this.nextBillingDate = moment()
      .startOf('day')
      .add(1, 'day')
      .add(1, billingTermOffset)
      .format(this.billingDateFormat)
  }
}
