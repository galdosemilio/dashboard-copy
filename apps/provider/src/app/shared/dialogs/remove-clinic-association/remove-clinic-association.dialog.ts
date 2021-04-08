import { Component, Inject, OnInit } from '@angular/core'
import { ContextService, NotifierService } from '@app/service'
import {
  RPMStateEntry,
  RPMStateEntryPendingStatus
} from '@app/shared/components/rpm/models'
import { _ } from '@app/shared/utils'
import { MAT_DIALOG_DATA } from '@coachcare/material'
import {
  AccountProvider,
  AccountRef,
  AccSingleResponse,
  RPM
} from '@coachcare/npm-api'

export interface RemoveClinicAssociationDialogProps {
  organizationId: string
}

@Component({
  selector: 'app-remove-clinic-association-dialog',
  templateUrl: './remove-clinic-association.dialog.html',
  styleUrls: ['./remove-clinic-association.dialog.scss'],
  host: { class: 'ccr-dialog' }
})
export class RemoveClinicAssociationDialog implements OnInit {
  public client: AccountRef
  public entryIsActive: boolean
  public entryPending: RPMStateEntryPendingStatus
  public rpmEntry: RPMStateEntry | null = null

  constructor(
    private account: AccountProvider,
    private context: ContextService,
    @Inject(MAT_DIALOG_DATA) private data: RemoveClinicAssociationDialogProps,
    private notifier: NotifierService,
    private rpm: RPM
  ) {}

  public ngOnInit(): void {
    this.client = this.context.account
    void this.resolveRPMEntry()
  }

  private async resolveRPMEntry(): Promise<void> {
    try {
      const response = await this.rpm.getList({
        account: this.context.accountId,
        organization: this.data.organizationId,
        limit: 1,
        offset: 0
      })

      const rpmEntry = response.data.length
        ? new RPMStateEntry({ rpmState: response.data.pop() })
        : null

      this.rpmEntry = rpmEntry

      if (this.rpmEntry && this.rpmEntry.rpmState.createdBy) {
        this.rpmEntry.rpmState.createdBy = await this.resolveCreatedByAccount(
          this.rpmEntry.rpmState.createdBy.id
        )
      }

      this.entryIsActive = this.rpmEntry ? this.rpmEntry.isActive : false
      this.entryPending = this.rpmEntry ? this.rpmEntry.pending : null
    } catch (error) {
      this.notifier.error(error)
    }
  }

  private async resolveCreatedByAccount(
    id: string
  ): Promise<AccSingleResponse> {
    try {
      return await this.account.getSingle(id)
    } catch (error) {
      return {
        id: '',
        accountType: undefined,
        firstName: _('BOARD.INACCESSIBLE_PROVIDER'),
        lastName: '',
        email: '',
        preferredLocales: [],
        preference: {},
        createdAt: '',
        isActive: true,
        measurementPreference: 'metric',
        timezone: '',
        phone: '',
        countryCode: '',
        phoneType: 'ios'
      }
    }
  }
}
