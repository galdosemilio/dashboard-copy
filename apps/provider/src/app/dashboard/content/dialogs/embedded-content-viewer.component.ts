import { Component, Inject } from '@angular/core'
import { MAT_DIALOG_DATA } from '@coachcare/material'
import { DomSanitizer } from '@angular/platform-browser'

@Component({
  selector: 'app-content-embedded-content-viewer',
  templateUrl: './embedded-content-viewer.component.html',
  styleUrls: ['./embedded-content-viewer.component.scss']
})
export class EmbeddedContentViewerComponent {
  public innerHTML: any

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private domSanitizer: DomSanitizer
  ) {
    this.innerHTML = this.domSanitizer.bypassSecurityTrustHtml(
      this.data.content
    )
  }
}
