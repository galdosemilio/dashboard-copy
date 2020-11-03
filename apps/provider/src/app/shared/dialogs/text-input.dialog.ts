import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@coachcare/common/material';
import { _ } from '@app/shared/utils';

@Component({
  selector: 'app-text-input-dialog',
  templateUrl: './text-input.dialog.html',
  host: { class: 'ccr-dialog' },
})
export class TextInputDialog {
  public text: string;

  constructor(
    private dialogRef: MatDialogRef<TextInputDialog>,
    @Inject(MAT_DIALOG_DATA)
    public data: {
      title: string;
      label: string;
      ok: string;
      cancel: string;
    }
  ) {
    this.data = Object.assign(
      {
        cancel: _('GLOBAL.CANCEL'),
        ok: _('GLOBAL.CREATE'),
        color: 'warn',
      },
      data
    );
  }

  onConfirm() {
    this.dialogRef.close(this.text.trim());
  }

  onCancel() {
    this.dialogRef.close(false);
  }
}
