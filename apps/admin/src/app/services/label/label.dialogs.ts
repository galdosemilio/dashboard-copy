import { Injectable } from '@angular/core'
import { MatDialog } from '@coachcare/material'

import { LabelsDatabase } from '@coachcare/backend/data'
import { TitledEntity } from '@coachcare/npm-api'
import { _ } from '@coachcare/backend/shared'
import { PromptDialog, PromptDialogData } from '@coachcare/common/dialogs/core'

@Injectable()
export class LabelDialogs {
  constructor(
    protected dialog: MatDialog,
    protected database: LabelsDatabase
  ) {}

  activatePrompt(item: TitledEntity): Promise<any> {
    return new Promise((resolve, reject) => {
      const data: PromptDialogData = {
        title: _('PROMPT.LABEL.CONFIRM_ACTIVATE'),
        content: _('PROMPT.LABEL.CONFIRM_ACTIVATE_PROMPT'),
        contentParams: { item: `${item.title}` }
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

  deactivatePrompt(item: TitledEntity): Promise<any> {
    return new Promise((resolve, reject) => {
      const data: PromptDialogData = {
        title: _('PROMPT.LABEL.CONFIRM_DEACTIVATE'),
        content: _('PROMPT.LABEL.CONFIRM_DEACTIVATE_PROMPT'),
        contentParams: { item: `${item.title}` }
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
}
