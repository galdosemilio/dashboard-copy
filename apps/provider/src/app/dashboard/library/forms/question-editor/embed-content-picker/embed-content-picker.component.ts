import { Component, Input, Output } from '@angular/core'
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser'
import {
  CONTENT_TYPE_MAP,
  FileExplorerContent
} from '@app/dashboard/content/models'
import { Subject } from 'rxjs'

@Component({
  selector: 'app-library-embed-content-picker',
  templateUrl: './embed-content-picker.component.html',
  styleUrls: ['./embed-content-picker.component.scss']
})
export class EmbedContentPickerComponent {
  @Input()
  set url(url: SafeResourceUrl) {
    if (url) {
      this._url = this.sanitizer.bypassSecurityTrustResourceUrl(url as string)
      this.selectedContentURL = this._url
      this.status = 'view_content'
    }
  }

  get url(): SafeResourceUrl {
    return this._url
  }

  @Output()
  selectContent: Subject<FileExplorerContent> = new Subject<
    FileExplorerContent
  >()

  selectedContent: FileExplorerContent
  selectedContentURL: SafeResourceUrl
  selectorOpts: any = {
    shouldShowRootFolderButton: false,
    whitelistedContentTypes: [
      CONTENT_TYPE_MAP.folder.code,
      CONTENT_TYPE_MAP.hyperlink.code,
      CONTENT_TYPE_MAP.file.code
    ]
  }
  status: 'view_content' | 'pick_content' | 'no_content' = 'no_content'

  private _url: SafeResourceUrl

  constructor(private sanitizer: DomSanitizer) {}

  confirmContent() {
    this.selectContent.next(this.selectedContent)
    this.status = 'view_content'
  }

  contentSelected(content: FileExplorerContent) {
    if (
      content &&
      (content.type.code === CONTENT_TYPE_MAP.file.code ||
        content.type.code === CONTENT_TYPE_MAP.hyperlink.code)
    ) {
      this.selectedContent = content
      this.selectedContentURL = this.sanitizer.bypassSecurityTrustResourceUrl(
        content.metadata.url
      )
    }
  }
}
