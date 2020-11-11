import { Component, Inject } from '@angular/core'
import { MAT_DIALOG_DATA, MatDialogRef } from '@coachcare/material'

import { _ } from '@app/shared/utils'

export interface OptionsDialogData {
  title: string
  titleParams?: any
  content: string
  contentParams?: any
  options: Array<{
    viewValue: string
    value: any
    color?: string
  }>
  cancel?: string
}

@Component({
  selector: 'app-dialog-options',
  templateUrl: 'options.dialog.html',
  host: { class: 'ccr-prompt' }
})
export class OptionsDialog {
  title = ''
  content = ''

  constructor(
    public dialogRef: MatDialogRef<OptionsDialog>,
    @Inject(MAT_DIALOG_DATA) public data: OptionsDialogData
  ) {
    // WARNING be sure to have translated strings of the parameters
    // because after the extraction they are empty
    this.data = Object.assign(
      {
        titleParams: {},
        contentParams: {},
        options: [],
        cancel: _('GLOBAL.CANCEL')
      },
      data
    )
  }
}
