import { Component } from '@angular/core'
import { ContentUpload } from '@app/dashboard/content/models'
import { ContentUploadService } from '@app/dashboard/content/services'

@Component({
  selector: 'app-content-file-upload-tracker',
  templateUrl: './file-upload-tracker.component.html',
  styleUrls: ['./file-upload-tracker.component.scss']
})
export class FileUploadTrackerComponent {
  public status: any = {
    minimized: false
  }
  public uploadAmount: number

  constructor(public contentUpload: ContentUploadService) {
    this.contentUpload.visibleUploads$.subscribe(
      (uploads: ContentUpload[]) => (this.uploadAmount = uploads.length)
    )
  }
}
