import { Component, OnInit } from '@angular/core'
import { MatDialog } from '@angular/material/dialog'
import { PromptDialog } from '@coachcare/common/dialogs/core'
import { NotifierService } from '@coachcare/common/services'
import { _ } from '@coachcare/common/shared'
import { SpreeProvider } from '@coachcare/sdk'
import { StorefrontPaymentMethodDialog } from '@coachcare/storefront/dialogs'
import { StorefrontPaymentMethod } from '@coachcare/storefront/model'
import {
  StorefrontPaymentMethodsDatabase,
  StorefrontPaymentMethodsDataSource
} from '@coachcare/storefront/services'
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy'
import { Token } from '@stripe/stripe-js'
import { StripeService } from 'ngx-stripe'
import { filter } from 'rxjs/operators'

@UntilDestroy()
@Component({
  selector: 'storefront-payment-management',
  templateUrl: './payment-management.component.html',
  styleUrls: ['./payment-management.component.scss']
})
export class StorefrontPaymentManagementPageComponent implements OnInit {
  public entries: StorefrontPaymentMethod[] = []
  public isLoading: boolean
  public source: StorefrontPaymentMethodsDataSource

  public get disabled() {
    return this.entries.length === 1 || this.isLoading || this.source.isLoading
  }

  constructor(
    private database: StorefrontPaymentMethodsDatabase,
    private dialog: MatDialog,
    private notifier: NotifierService,
    private spree: SpreeProvider,
    private stripeService: StripeService
  ) {}

  public ngOnInit(): void {
    this.createDataSource()
  }

  public showAddPaymentMethodDialog(): void {
    this.dialog
      .open(StorefrontPaymentMethodDialog, {
        width: '60vw',
        maxWidth: '500px'
      })
      .afterClosed()
      .pipe(filter((token) => token))
      .subscribe((token) => this.addPaymentMethod(token))
  }

  public async addPaymentMethod(token: Token) {
    this.isLoading = true

    try {
      await this.spree.createCreditCard({
        credit_card: { token: token.id }
      })

      this.source.refresh()
      this.notifier.success(_('NOTIFY.SUCCESS.PAYMENT_METHOD_CREATED'))
    } catch (err) {
      this.notifier.error(err)
    } finally {
      this.isLoading = false
    }
  }

  public showDeletePaymentMethodDialog(
    paymentMethod: StorefrontPaymentMethod
  ): void {
    this.dialog
      .open(PromptDialog, {
        data: {
          title: _('GLOBAL.DELETE_PAYMENT_METHOD'),
          content: _('GLOBAL.DELETE_PAYMENT_METHOD_DESCRIPTION'),
          contentParams: {
            last4: paymentMethod.last4Digits ?? ''
          }
        }
      })
      .afterClosed()
      .pipe(filter((confirm) => confirm))
      .subscribe(() => this.deletePaymentMethod(paymentMethod))
  }

  public showSetDefaultDialog(paymentMethod: StorefrontPaymentMethod): void {
    this.dialog
      .open(PromptDialog, {
        data: {
          title: _('GLOBAL.SET_PAYMENT_METHOD_AS_DEFAULT'),
          content: _('GLOBAL.SET_PAYMENT_METHOD_AS_DEFAULT_DESCRIPTION'),
          contentParams: {
            last4: paymentMethod.last4Digits ?? ''
          }
        },
        panelClass: [
          'wellcore-dialog',
          'force-wellcore-layout',
          'wellcore-body'
        ]
      })
      .afterClosed()
      .pipe(filter((confirm) => confirm))
      .subscribe(() => this.setPaymentMethodAsDefault(paymentMethod))
  }

  private createDataSource(): void {
    this.source = new StorefrontPaymentMethodsDataSource(this.database)
    this.source
      .connect()
      .pipe(untilDestroyed(this))
      .subscribe((value) => (this.entries = value))
  }

  private async deletePaymentMethod(
    paymentMethod: StorefrontPaymentMethod
  ): Promise<void> {
    try {
      this.isLoading = true
      await this.database.deletePaymentMethod(paymentMethod)
      this.source.refresh()
      this.notifier.success(_('NOTIFY.SUCCESS.PAYMENT_METHOD_DELETED'))
    } catch (error) {
      this.notifier.error(error)
    } finally {
      this.isLoading = false
    }
  }

  private async setPaymentMethodAsDefault(
    paymentMethod: StorefrontPaymentMethod
  ): Promise<void> {
    try {
      this.isLoading = true
      await this.database.setPaymentMethodAsDefault(paymentMethod)
      this.source.refresh()
      this.notifier.success(_('NOTIFY.SUCCESS.PAYMENT_METHOD_UPDATE'))
    } catch (error) {
      this.notifier.error(error)
    } finally {
      this.isLoading = false
    }
  }
}
