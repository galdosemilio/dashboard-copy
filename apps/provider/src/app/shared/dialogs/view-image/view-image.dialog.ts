import { Component, Inject, OnInit } from '@angular/core'
import { MAT_DIALOG_DATA } from '@coachcare/material'

export interface ViewImageDialogProps {
  imageUrl: string
  title?: string
}

@Component({
  selector: 'app-view-image-dialog',
  templateUrl: './view-image.dialog.html',
  styleUrls: ['./view-image.dialog.scss'],
  host: { class: 'ccr-dialog' }
})
export class ViewImageDialog implements OnInit {
  public imageUrl: string
  public title: string

  constructor(@Inject(MAT_DIALOG_DATA) private data: ViewImageDialogProps) {}

  public ngOnInit(): void {
    if (this.data) {
      this.imageUrl = this.data.imageUrl
      this.title = this.data.title
    }
  }
}
