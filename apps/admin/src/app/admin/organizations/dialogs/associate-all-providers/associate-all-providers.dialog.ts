import { ChangeDetectorRef, Component, Inject, OnInit } from '@angular/core'
import { MAT_DIALOG_DATA, MatDialogRef } from '@coachcare/common/material'
import {
  AccountProvider,
  AccountFullData,
  AccountTypeIds,
  ActiveCampaign
} from '@coachcare/npm-api'
import { ContextService, NotifierService } from '@coachcare/common/services'
import { sleep } from '@coachcare/common/shared'

export interface AssociateAllProvidersDialogData {
  organizationId: string
}

@Component({
  selector: 'ccr-organizations-associate-all-providers-dialog',
  templateUrl: './associate-all-providers.dialog.html',
  styleUrls: ['./associate-all-providers.dialog.scss'],
  host: { class: 'ccr-dialog' }
})
export class AssociateAllProvidersDialogComponent implements OnInit {
  public currentProvider = ''
  public failedProviders: AccountFullData[] = []
  public progress = 0
  public state: 'warning' | 'processing' | 'results' = 'warning'

  private organizationId: string

  constructor(
    private account: AccountProvider,
    private activeCampaign: ActiveCampaign,
    private cdr: ChangeDetectorRef,
    private context: ContextService,
    @Inject(MAT_DIALOG_DATA) private data: AssociateAllProvidersDialogData,
    private dialogRef: MatDialogRef<AssociateAllProvidersDialogComponent>,
    private notifier: NotifierService
  ) {}

  public ngOnInit(): void {
    this.organizationId =
      this.data.organizationId || this.context.organizationId || ''
  }

  public async onAssociateAllProviders(
    initialProviders: AccountFullData[] = []
  ): Promise<void> {
    try {
      this.dialogRef.disableClose = true
      this.state = 'processing'

      const cooldownTime = 750
      const batchSize = 25

      let batchIndex = 0
      let initialPromiseAmount = 0
      let currentPromiseAmount = 0

      const providers = initialProviders.length
        ? initialProviders
        : (
            await this.account.getAll({
              organization: this.organizationId,
              accountType: AccountTypeIds.Provider,
              offset: 0,
              limit: 'all'
            })
          ).data

      const associationPromises = providers.map((provider) =>
        this.activeCampaign.createNewsletterSubscription({
          account: provider.id,
          organization: this.organizationId
        })
      )

      const failedRequests: number[] = []

      initialPromiseAmount = associationPromises.length

      while (associationPromises.length) {
        const promiseBatch = associationPromises.splice(0, batchSize)
        const actualBatchSize = promiseBatch.length

        while (promiseBatch.length) {
          try {
            const currentProvider = providers[batchIndex]
            this.currentProvider = `${currentProvider.firstName} ${currentProvider.lastName}`
            this.cdr.detectChanges()
            await promiseBatch.shift()
            ++batchIndex
          } catch (error) {
            failedRequests.push(batchIndex)
            ++batchIndex
          }
        }

        await sleep(cooldownTime)
        currentPromiseAmount += actualBatchSize

        this.progress = Math.round(
          (currentPromiseAmount / initialPromiseAmount) * 100
        )
        this.cdr.detectChanges()
      }

      this.failedProviders = failedRequests.map((index) => providers[index])

      this.state = 'results'
      this.progress = 0
      this.cdr.detectChanges()
    } catch (error) {
      this.notifier.error(error)
      this.state = 'warning'
    } finally {
      this.dialogRef.disableClose = false
    }
  }
}
