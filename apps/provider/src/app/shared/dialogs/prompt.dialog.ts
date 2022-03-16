import { Component, Inject, OnInit } from '@angular/core'
import { MAT_DIALOG_DATA, MatDialogRef } from '@coachcare/material'
import { _ } from '@app/shared/utils'

export interface PromptDialogData {
  title: string
  titleParams?: any
  content: string
  contentParams?: any
  no?: string
  yes?: string
  color?: string
}

@Component({
  selector: 'app-dialog-prompt',
  templateUrl: 'prompt.dialog.html',
  host: { class: 'ccr-dialog' }
})
export class PromptDialog implements OnInit {
  constructor(
    public dialogRef: MatDialogRef<PromptDialog>,
    @Inject(MAT_DIALOG_DATA) public data: PromptDialogData
  ) {}

  public ngOnInit(): void {
    this.data = {
      titleParams: {},
      contentParams: {},
      no: _('GLOBAL.NO'),
      yes: _('GLOBAL.YES'),
      color: 'warn',
      ...this.data
    }
  }
}
