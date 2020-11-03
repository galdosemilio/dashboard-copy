import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@coachcare/common/material';

import { _ } from '@app/shared/utils/i18n.utils';

export interface ConfirmDialogData {
  title?: string;
  titleParams?: any;
  content: string;
  contentParams?: any;
  accept?: string;
  color?: string;
}

@Component({
  selector: 'app-dialog-confirm',
  templateUrl: 'confirm.dialog.html',
  host: { class: 'ccr-dialog' },
})
export class ConfirmDialog {
  title = '';
  content = '';

  constructor(
    public dialogRef: MatDialogRef<ConfirmDialog>,
    @Inject(MAT_DIALOG_DATA) public data: ConfirmDialogData
  ) {
    // WARNING be sure to have translated strings of the parameters
    // because after the extraction they are empty
    this.data = Object.assign(
      {
        titleParams: {},
        contentParams: {},
        accept: _('GLOBAL.OK'),
        color: '',
      },
      data
    );
  }
}
