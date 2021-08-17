import { Component, Inject } from '@angular/core'
import { MAT_DIALOG_DATA, MatDialogRef } from '@coachcare/material'

export interface GridDialogContent {
  rows?: number
  class?: string
  cols?: number
  text: string
}

export interface GridDialogData {
  title: GridDialogContent
  rowHeight?: number
  cols: number
  contents: Array<GridDialogContent>
  dir: 'rtl' | 'ltr'
}

@Component({
  selector: 'app-dialog-grid',
  templateUrl: 'grid.dialog.html',
  host: { class: 'ccr-dialog ccr-grid-dialog' }
})
export class GridDialog {
  constructor(
    public dialogRef: MatDialogRef<GridDialog>,
    @Inject(MAT_DIALOG_DATA) public data: GridDialogData
  ) {
    // WARNING be sure to have translated strings of the parameters
    // because after the extraction they are empty
    this.data = Object.assign(
      {
        title: {},
        rowHeight: 0,
        cols: 0,
        contents: [],
        dir: 'ltr'
      },
      data
    )
  }
}
