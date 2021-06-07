import { Component, Inject, OnInit } from '@angular/core'
import { MatDialogRef, MAT_DIALOG_DATA } from '@coachcare/material'
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy'
import { Subject } from 'rxjs'
import { delay } from 'rxjs/operators'

export interface MultipleFilesDownloadProps {
  continueDownload: (isMultiple: boolean) => void
  totalFileCount: number
  downloadCompleted$: Subject<void>
  downloadCount$: Subject<number>
}

@UntilDestroy()
@Component({
  selector: 'app-multiple-files-download-dialog',
  templateUrl: './multiple-files-download.dialog.html',
  styleUrls: ['./multiple-files-download.dialog.scss'],
  host: { class: 'ccr-dialog' }
})
export class MultipleFilesDownloadDialog implements OnInit {
  public totalFileCount: number
  public downloadCount = 0
  public progress = 0
  public isDownloading = false
  public isCompleted = false
  public downloadOption = 'all'

  constructor(
    private dialogRef: MatDialogRef<MultipleFilesDownloadDialog>,
    @Inject(MAT_DIALOG_DATA) private data: MultipleFilesDownloadProps
  ) {}

  public ngOnInit(): void {
    if (!this.data) {
      return
    }

    this.totalFileCount = this.data.totalFileCount

    this.data.downloadCompleted$
      .pipe(untilDestroyed(this), delay(4000))
      .subscribe(() => {
        this.dialogRef.close()
      })

    this.data.downloadCount$.pipe(untilDestroyed(this)).subscribe((count) => {
      this.downloadCount = count
      this.progress = (this.downloadCount / this.totalFileCount) * 100

      if (this.downloadCount === this.totalFileCount) {
        this.isCompleted = true
        this.isDownloading = false
      }
    })
  }

  public onSubmit(): void {
    this.isDownloading = true
    this.isCompleted = false
    this.progress = 0
    this.data.continueDownload(this.downloadOption === 'all')
  }
}
