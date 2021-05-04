import { Component, Input } from '@angular/core'
import { MatDialog } from '@coachcare/material'
import { NotifierService } from '@app/service'
import { PromptDialog } from '@app/shared'
import { Package } from '@app/shared/components/package-table'
import { PackageDatasource } from '@app/shared/components/package-table/services'
import { _ } from '@app/shared/utils'
import { PackageOrganization } from '@coachcare/sdk'

@Component({
  selector: 'app-clinic-phases-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.scss']
})
export class ClinicPhasesTableComponent {
  @Input() isAdmin = false
  @Input() source: PackageDatasource

  public columns: string[] = [
    'id',
    'name',
    'description',
    'organization',
    'actions'
  ]

  constructor(
    private dialog: MatDialog,
    private notifier: NotifierService,
    private packageOrganization: PackageOrganization
  ) {}

  public onRemove(row: Package) {
    this.dialog
      .open(PromptDialog, {
        data: {
          title: _('BOARD.REMOVE_PHASE_TITLE'),
          content: _('BOARD.REMOVE_PHASE_DESCRIPTION'),
          contentParams: { phase: row.title }
        }
      })
      .afterClosed()
      .subscribe(async (confirm) => {
        try {
          if (!confirm) {
            return
          }

          await this.packageOrganization.update({
            id: row.associationId,
            isActive: false
          })

          this.notifier.success(_('NOTIFY.SUCCESS.PHASE_REMOVED'))

          this.source.refresh()
        } catch (error) {
          this.notifier.error(error)
        }
      })
  }
}
