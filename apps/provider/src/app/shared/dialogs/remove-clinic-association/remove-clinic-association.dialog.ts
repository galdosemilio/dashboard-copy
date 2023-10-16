import { Component, Inject, OnInit } from '@angular/core'
import { ContextService, NotifierService } from '@app/service'
import { RPMStateEntry } from '@app/shared/components/rpm/models'
import { MAT_DIALOG_DATA } from '@coachcare/material'
import {
  AccountProvider,
  AccountRef,
  CareManagementState
} from '@coachcare/sdk'

export interface RemoveClinicAssociationDialogProps {
  organizationId: string
}

const MAX_CONCURRENT_EPISODES_OF_CARE = 3

@Component({
  selector: 'app-remove-clinic-association-dialog',
  templateUrl: './remove-clinic-association.dialog.html',
  styleUrls: ['./remove-clinic-association.dialog.scss'],
  host: { class: 'ccr-dialog' }
})
export class RemoveClinicAssociationDialog implements OnInit {
  public client: AccountRef
  public entries: RPMStateEntry[] = []

  constructor(
    private account: AccountProvider,
    private context: ContextService,
    @Inject(MAT_DIALOG_DATA) private data: RemoveClinicAssociationDialogProps,
    private notifier: NotifierService,
    private careManagementState: CareManagementState
  ) {}

  public ngOnInit(): void {
    this.client = this.context.account
    void this.resolveEntries()
  }

  private async resolveEntries(): Promise<void> {
    try {
      const response = await this.careManagementState.getList({
        account: this.context.accountId,
        organization: this.data.organizationId,
        limit: MAX_CONCURRENT_EPISODES_OF_CARE,
        offset: 0
      })

      this.entries = response.data.map(
        (item) => new RPMStateEntry({ rpmState: item })
      )
    } catch (error) {
      this.notifier.error(error)
    }
  }
}
