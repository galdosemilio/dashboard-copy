import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@coachcare/layout';
import { _ } from '@coachcare/backend/shared';
import { ConfirmDialogData } from './confirm-data.interface';

/**
 * Core Confirm Dialog
 */
@Component({
  selector: 'ccr-dialog-confirm',
  templateUrl: 'confirm.dialog.html',
  host: {
    class: 'ccr-dialog ccr-confirm'
  }
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
    this.data = {
      titleParams: {},
      contentParams: {},
      accept: _('GLOBAL.OK'),
      color: '',
      ...data
    };
  }
}
