import { Component, Input, OnDestroy, OnInit, ViewChild } from '@angular/core'
import { MatSort } from '@coachcare/common/material'
import { ActivatedRoute, Router } from '@angular/router'
import { LabelDialogs } from '@board/services'
import { LabelsDatabase, LabelsDataSource } from '@coachcare/backend/data'
import { getterSorter } from '@coachcare/backend/model'
import { PackageSingle } from '@coachcare/npm-api'
import { _ } from '@coachcare/backend/shared'
import { NotifierService } from '@coachcare/common/services'

@Component({
  selector: 'ccr-package-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.scss']
})
export class LabelsTableComponent implements OnInit, OnDestroy {
  @Input() columns = []
  @Input() source: LabelsDataSource

  @ViewChild(MatSort, { static: false })
  sort: MatSort

  constructor(
    protected router: Router,
    protected route: ActivatedRoute,
    protected notifier: NotifierService,
    protected database: LabelsDatabase,
    private dialogs: LabelDialogs
  ) {}

  ngOnInit() {
    this.source.setSorter(this.sort, getterSorter(this.sort))
  }

  ngOnDestroy() {
    this.source.unsetSorter()
  }

  onDisplay(row: PackageSingle): void {
    this.router.navigate([row.id], { relativeTo: this.route })
  }

  onEdit(row: PackageSingle): void {
    this.router.navigate([row.id, 'info', 'edit'], { relativeTo: this.route })
  }

  onActivate(row: PackageSingle) {
    this.dialogs
      .activatePrompt(row)
      .then(() => {
        row.isActive = true
        this.notifier.success(_('NOTIFY.SUCCESS.LABEL_ACTIVATED'))
      })
      .catch((err) => {
        if (err) {
          // non-discarded prompt
          this.notifier.error(err)
        }
      })
  }

  onDeactivate(row: PackageSingle) {
    this.dialogs
      .deactivatePrompt(row)
      .then(() => {
        row.isActive = false
        this.notifier.success(_('NOTIFY.SUCCESS.LABEL_DEACTIVATED'))
      })
      .catch((err) => {
        if (err) {
          // non-discarded prompt
          this.notifier.error(err)
        }
      })
  }
}
