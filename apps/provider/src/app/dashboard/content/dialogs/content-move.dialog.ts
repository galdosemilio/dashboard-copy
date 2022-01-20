import { Component, Inject, OnInit } from '@angular/core'
import { MAT_DIALOG_DATA, MatDialogRef } from '@coachcare/material'
import { FileExplorerContent } from '@app/dashboard/content/models'

interface ContentMoveDialogData {
  content: FileExplorerContent
  mode: 'digital-library' | 'vault'
  organization: any
}

@Component({
  selector: 'app-content-move-dialog',
  templateUrl: './content-move.dialog.html',
  styleUrls: ['./content-move.dialog.scss'],
  host: { class: 'ccr-dialog' }
})
export class ContentMoveDialog implements OnInit {
  mode: 'digital-library' | 'vault'
  organization: any
  public selectedContent: FileExplorerContent
  public selectorOpts: any = {
    shouldShowRootFolderButton: true
  }

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: ContentMoveDialogData,
    private dialogRef: MatDialogRef<ContentMoveDialog>
  ) {}

  ngOnInit(): void {
    this.mode = this.data.mode || 'digital-library'
    this.organization = this.data.organization || undefined
  }

  closeDialog(): void {
    this.dialogRef.close()
  }

  moveContent(): void {
    this.dialogRef.close({
      from: this.data.content.parentId,
      to: this.selectedContent.id,
      content: this.data.content
    })
  }

  shouldDisableMoveButton(): boolean {
    return this.selectedContent ? !this.selectedContent.isFolder : true
  }
}
