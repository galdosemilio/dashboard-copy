import { Injectable } from '@angular/core'
import { MatDialog } from '@coachcare/material'

import { OrganizationsDatabase } from '@coachcare/backend/data'
import { Entity, NamedEntity } from '@coachcare/sdk'
import { _ } from '@coachcare/backend/shared'
import { PromptDialog, PromptDialogData } from '@coachcare/common/dialogs/core'

@Injectable()
export class CcrOrganizationDialogs {
  constructor(
    protected dialog: MatDialog,
    protected database: OrganizationsDatabase
  ) {}

  activatePrompt(item: NamedEntity): Promise<any> {
    return new Promise((resolve, reject) => {
      const data: PromptDialogData = {
        title: _('SHARED.ORGS.CONFIRM_ACTIVATE'),
        content: _('SHARED.ORGS.CONFIRM_ACTIVATE_PROMPT'),
        contentParams: { item: `${item.name}` }
      }

      this.dialog
        .open(PromptDialog, { data: data })
        .afterClosed()
        .subscribe((confirm) => {
          if (confirm) {
            this.database
              .update({
                id: item.id,
                isActive: true
              })
              .then(resolve)
              .catch(reject)
          } else {
            reject()
          }
        })
    })
  }

  deactivatePrompt(item: NamedEntity): Promise<any> {
    return new Promise((resolve, reject) => {
      const data: PromptDialogData = {
        title: _('SHARED.ORGS.CONFIRM_REMOVE_ORG'),
        content: _('SHARED.ORGS.CONFIRM_REMOVE_ORG_PROMPT'),
        contentParams: { item: `${item.name}` }
      }

      this.dialog
        .open(PromptDialog, { data: data })
        .afterClosed()
        .subscribe((confirm) => {
          if (confirm) {
            this.database
              .update({
                id: item.id,
                isActive: false
              })
              .then(resolve)
              .catch(reject)
          } else {
            reject()
          }
        })
    })
  }

  deletePrompt(item: NamedEntity): Promise<any> {
    return new Promise((resolve, reject) => {
      const data: PromptDialogData = {
        title: _('SHARED.ORGS.CONFIRM_REMOVE_ORG'),
        content: _('SHARED.ORGS.CONFIRM_REMOVE_ORG_PROMPT'),
        contentParams: { item: `${item.name}` }
      }

      this.dialog
        .open(PromptDialog, { data })
        .afterClosed()
        .subscribe((confirm) => {
          if (confirm) {
            this.database.delete(item.id).then(resolve).catch(reject)
          } else {
            reject()
          }
        })
    })
  }

  removePrompt(item: Entity, data: PromptDialogData): Promise<any> {
    return new Promise((resolve, reject) => {
      this.dialog
        .open(PromptDialog, { data })
        .afterClosed()
        .subscribe((confirm) => {
          if (confirm) {
            this.database
              .update({
                id: item.id,
                parentOrganizationId: null
              })
              .then(resolve)
              .catch(reject)
          } else {
            reject()
          }
        })
    })
  }
}
