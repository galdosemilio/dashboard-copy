import { Component, Inject } from '@angular/core'
import { MAT_DIALOG_DATA, MAT_LABEL_GLOBAL_OPTIONS } from '@coachcare/material'

@Component({
  selector: 'app-library-view-addendum-dialog',
  templateUrl: './view-addendum.dialog.html',
  styleUrls: ['./view-addendum.dialog.scss'],
  providers: [
    { provide: MAT_LABEL_GLOBAL_OPTIONS, useValue: { float: 'always' } }
  ],
  host: { class: 'ccr-dialog' }
})
export class ViewAddendumDialog {
  constructor(@Inject(MAT_DIALOG_DATA) public data: any) {}
}
