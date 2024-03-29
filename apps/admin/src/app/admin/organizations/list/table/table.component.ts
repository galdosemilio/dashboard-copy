import { Component, Input, OnDestroy, OnInit, ViewChild } from '@angular/core'
import { MatDialog, MatSort } from '@coachcare/material'
import { Router } from '@angular/router'
import { getterSorter } from '@coachcare/backend/model'
import { _ } from '@coachcare/backend/shared'
import {
  CcrOrganizationDialogs,
  NotifierService
} from '@coachcare/common/services'

import { OrganizationRoutes } from '@board/services'
import {
  OrganizationsDatabase,
  OrganizationsDataSource
} from '@coachcare/backend/data'
import {
  QRCodeDisplayDialog,
  QRCodeDisplayDialogData
} from '@board/shared/dialogs'
import { OrgEntityExtended } from '@coachcare/sdk'

@Component({
  selector: 'ccr-organizations-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.scss']
})
export class OrganizationsTableComponent implements OnInit, OnDestroy {
  @Input() columns = []
  @Input() source: OrganizationsDataSource

  @ViewChild(MatSort, { static: false })
  sort: MatSort

  constructor(
    protected router: Router,
    protected notifier: NotifierService,
    protected database: OrganizationsDatabase,
    private dialog: MatDialog,
    protected dialogs: CcrOrganizationDialogs,
    public routes: OrganizationRoutes
  ) {}

  ngOnInit() {
    this.source.setSorter(this.sort, getterSorter(this.sort))
  }

  ngOnDestroy() {
    this.source.unsetSorter()
  }

  onDisplay(row: OrgEntityExtended) {
    // TODO change this when getSingle is available for Admins
    if (row.isActive) {
      void this.router.navigate([this.routes.single(row.id)])
    }
  }

  onEdit(row: OrgEntityExtended) {
    // TODO change this when getSingle is available for Admins
    if (row.isActive) {
      void this.router.navigate([this.routes.edit(row.id)])
    }
  }

  onActivate(row: OrgEntityExtended) {
    this.dialogs
      .activatePrompt(row)
      .then(() => {
        row.isActive = true
        this.notifier.success(_('NOTIFY.SUCCESS.ORG_ACTIVATED'))
      })
      .catch((err) => {
        if (err) {
          // non-discarded prompt
          this.notifier.error(err)
        }
      })
  }

  onDeactivate(row: OrgEntityExtended) {
    this.dialogs
      .deactivatePrompt(row)
      .then(() => {
        row.isActive = false
        this.notifier.success(_('NOTIFY.SUCCESS.ORG_DEACTIVATED'))
      })
      .catch((err) => {
        if (err) {
          // non-discarded prompt
          this.notifier.error(err)
        }
      })
  }

  public showQRCodeDialog(
    row: OrgEntityExtended,
    appType: 'android' | 'ios'
  ): void {
    this.dialog.open(QRCodeDisplayDialog, {
      data: {
        organization: row,
        appType,
        qrData: row.app[appType].url,
        title:
          appType === 'android'
            ? _('ADMIN.ORGS.MOB_APP_QRCODE_ANDROID')
            : _('ADMIN.ORGS.MOB_APP_QRCODE_IOS'),
        description: _('ADMIN.ORGS.MOB_APP_QRCODE_DESC'),
        descriptionParams: { id: row.id, name: row.name }
      } as QRCodeDisplayDialogData
    })
  }
}
