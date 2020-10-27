import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@coachcare/common/material';

import { _ } from '@app/shared/utils';

export interface PromptDialogData {
  title: string;
  titleParams?: any;
  content: string;
  contentParams?: any;
  no?: string;
  yes?: string;
  color?: string;
}

@Component({
  selector: 'app-dialog-prompt',
  templateUrl: 'prompt.dialog.html',
  host: { class: 'ccr-dialog' },
})
export class PromptDialog {
  title = '';
  content = '';

  constructor(
    public dialogRef: MatDialogRef<PromptDialog>,
    @Inject(MAT_DIALOG_DATA) public data: PromptDialogData
  ) {
    // WARNING be sure to have translated strings of the parameters
    // because after the extraction they are empty
    this.data = Object.assign(
      {
        titleParams: {},
        contentParams: {},
        no: _('GLOBAL.NO'),
        yes: _('GLOBAL.YES'),
        color: 'warn',
      },
      data
    );
  }
}
