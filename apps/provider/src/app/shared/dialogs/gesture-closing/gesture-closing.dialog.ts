import { Component, Inject, OnInit } from '@angular/core'
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog'
import { GestureService } from '@app/service'
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy'
import { filter } from 'rxjs/operators'

interface GestureClosingDialogProps {
  accept?: string
  acceptParams?: string
  content: string
  contentParams?: any
  title?: string
  titleParams?: any
}

@UntilDestroy()
@Component({
  selector: 'ccr-gesture-closing-dialog',
  templateUrl: './gesture-closing.dialog.html',
  host: { class: 'ccr-dialog' }
})
export class GestureClosingDialog implements OnInit {
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: GestureClosingDialogProps,
    private dialogRef: MatDialogRef<GestureClosingDialog>,
    private gesture: GestureService
  ) {}

  public ngOnInit(): void {
    this.data = this.data ?? { title: '', content: '' }

    this.gesture.userIdle$
      .pipe(
        untilDestroyed(this),
        filter((idle) => !idle)
      )
      .subscribe(() => this.dialogRef.close())
  }
}
