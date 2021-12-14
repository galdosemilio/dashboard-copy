import { Component, Input, OnInit } from '@angular/core'
import { MatDialog } from '@angular/material/dialog'
import { ContextService, NotifierService } from '@app/service'
import { PromptDialog, SupervisingProvidersDataSource } from '@app/shared'
import { _ } from '@app/shared/utils'
import { RPM, SupervisingProviderAssociationItem } from '@coachcare/sdk'
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy'

@UntilDestroy()
@Component({
  selector: 'clinic-supervising-providers-table',
  templateUrl: './supervising-providers-table.component.html',
  styleUrls: ['./supervising-providers-table.component.scss']
})
export class ClinicSupervisingProvidersTable implements OnInit {
  @Input()
  public source: SupervisingProvidersDataSource

  public isAdmin: boolean
  public rows: SupervisingProviderAssociationItem[] = []

  constructor(
    private context: ContextService,
    private dialog: MatDialog,
    private notifier: NotifierService,
    private rpm: RPM
  ) {}

  public ngOnInit(): void {
    void this.resolveAdminStatus()
    this.source
      .connect()
      .pipe(untilDestroyed(this))
      .subscribe((supervisingProviders) => (this.rows = supervisingProviders))
  }

  public showRemoveProviderDialog(association): void {
    if (this.source.isInherited || !this.isAdmin) {
      return
    }

    this.dialog
      .open(PromptDialog, {
        data: {
          title: _('BOARD.CLINIC_REMOVE_SUP_PROVIDER_TITLE'),
          content: _('BOARD.CLINIC_REMOVE_SUP_PROVIDER_DESC'),
          contentParams: {
            account: `${association.account.firstName} ${association.account.lastName}`
          }
        }
      })
      .afterClosed()
      .pipe((confirm) => confirm)
      .subscribe(() => void this.removeSupervisingProvider(association))
  }

  private async removeSupervisingProvider(
    association: SupervisingProviderAssociationItem
  ): Promise<void> {
    try {
      await this.rpm.removeSupervisingProvider({
        id: association.id
      })
      this.notifier.success(_('NOTIFY.SUCCESS.SUPERVISING_PROVIDER_REMOVED'))
      this.source.refresh()
    } catch (error) {
      this.notifier.error(error)
    }
  }

  private async resolveAdminStatus(): Promise<void> {
    try {
      this.isAdmin = await this.context.orgHasPerm(
        this.context.clinic.id,
        'admin'
      )
    } catch (error) {
      this.notifier.error(error)
    }
  }
}
