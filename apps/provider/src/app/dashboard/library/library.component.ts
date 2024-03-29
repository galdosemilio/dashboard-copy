import { Component, HostListener, OnInit } from '@angular/core'
import { MatDialog } from '@coachcare/material'
import { ContextService, EventsService } from '@app/service'
import { _, PromptDialog } from '@app/shared'
import { ContentUploadService } from './content/services'

@Component({
  selector: 'app-library',
  templateUrl: './library.component.html'
})
export class LibraryComponent implements OnInit {
  @HostListener('window:beforeunload', ['$event'])
  beforeUnload($event: any) {
    if (this.contentUpload.hasPendingUploads()) {
      $event.returnValue = true
    }
  }

  public isProvider: boolean

  constructor(
    private contentUpload: ContentUploadService,
    private context: ContextService,
    private dialog: MatDialog,
    private bus: EventsService
  ) {}

  ngOnInit() {
    this.isProvider = this.context.isProvider
    this.bus.trigger('right-panel.deactivate')
  }

  canDeactivate(): Promise<boolean> {
    return new Promise<boolean>((resolve) => {
      if (this.contentUpload.hasPendingUploads()) {
        const data = {
          title: _('LIBRARY.CONTENT.CONTENT_UPLOAD_WARNING'),
          content: _('LIBRARY.CONTENT.CONTENT_UPLOAD_MESSAGE')
        }
        this.dialog
          .open(PromptDialog, { data: data, disableClose: true })
          .afterClosed()
          .subscribe((confirm: boolean) => {
            if (confirm) {
              this.contentUpload.cancelAllContentUploads()
              resolve(true)
            } else {
              resolve(false)
            }
          })
      } else {
        resolve(true)
      }
    })
  }
}
