import { Component, Inject, ViewEncapsulation } from '@angular/core'
import { FormGroup } from '@angular/forms'
import { MAT_DIALOG_DATA, MatDialogRef } from '@coachcare/material'

import { OrganizationsDatabase } from '@coachcare/backend/data'
import { OrgUpdateRequest } from '@coachcare/sdk'
import { _ } from '@coachcare/backend/shared'
import { NotifierService } from '@coachcare/common/services'

export interface AccountCreateDialogData {
  accountType?: string
  title: string
  content: string
  organization: string
  addChild: boolean
}

@Component({
  selector: 'ccr-add-organization-dialog',
  templateUrl: 'add-organization.dialog.html',
  host: { class: 'ccr-dialog' },
  encapsulation: ViewEncapsulation.None
})
// eslint-disable-next-line @angular-eslint/component-class-suffix
export class CcrAddOrganizationDialog {
  form: FormGroup
  temp: {}

  private selectedOrganization: any

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: AccountCreateDialogData,
    private dialogRef: MatDialogRef<AccountCreateDialogData>,
    private notifier: NotifierService,
    private database: OrganizationsDatabase
  ) {
    this.data = data
  }

  orgSelected(id: string) {
    if (typeof id !== 'object' || id === null) {
      this.selectedOrganization = id
    }
  }

  onSubmit() {
    if (!this.selectedOrganization) {
      return
    }
    let req: OrgUpdateRequest
    if (this.data.addChild) {
      req = {
        id: this.selectedOrganization,
        parentOrganizationId: this.data.organization
      }
    } else {
      req = {
        id: this.data.organization,
        parentOrganizationId: this.selectedOrganization
      }
    }
    this.database
      .update(req)
      .then(() => {
        this.notifier.success(_('NOTIFY.SUCCESS.ORG_ADDED'))
        this.dialogRef.close(true)
      })
      .catch((err) => {
        if (err) {
          // non-discarded prompt
          this.notifier.error(err)
        }
      })
  }
}
