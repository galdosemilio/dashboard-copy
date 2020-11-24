import { Component, Inject } from '@angular/core'
import { MAT_DIALOG_DATA, MatDialogRef } from '@coachcare/material'
import { _ } from '@coachcare/common/shared'
import { PromptDialogData } from './prompt-data.interface'

@Component({
  selector: 'ccr-dialog-prompt',
  templateUrl: 'prompt.dialog.html',
  host: {
    class: 'ccr-dialog ccr-prompt'
  }
})
export class PromptDialog {
  title = ''
  content = ''

  constructor(
    public dialogRef: MatDialogRef<PromptDialog>,
    @Inject(MAT_DIALOG_DATA) public data: PromptDialogData
  ) {
    // WARNING be sure to have translated strings of the parameters
    // because after the extraction they are empty
    this.data = {
      titleParams: {},
      contentParams: {},
      no: _('GLOBAL.NO'),
      yes: _('GLOBAL.YES'),
      color: 'warn',
      ...data
    }
  }
}
