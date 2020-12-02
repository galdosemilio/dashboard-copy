import { Component, Input, OnDestroy, OnInit } from '@angular/core'
import {
  ContentUpload,
  FileExplorerContent,
  FileExplorerEvents
} from '@app/dashboard/content/models'
import {
  ContentUploadService,
  FileExplorerDatasource
} from '@app/dashboard/content/services'
import { NotifierService, SelectedOrganization } from '@app/service'
import { CcrDropEvent } from '@app/shared'
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy'

@UntilDestroy()
@Component({
  selector: 'app-content-file-explorer',
  templateUrl: './file-explorer.component.html',
  styleUrls: ['./file-explorer.component.scss']
})
export class FileExplorerComponent implements OnDestroy, OnInit {
  @Input()
  mode: string

  @Input()
  set organization(org: SelectedOrganization) {
    if (this._organization !== org) {
      delete this.selectedContent
      this._organization = org
    }
  }

  get organization(): SelectedOrganization {
    return this._organization
  }

  @Input()
  datasource: FileExplorerDatasource
  @Input()
  events: FileExplorerEvents
  @Input()
  useMode: 'digital-library' | 'vault'

  public selectedContent: FileExplorerContent
  public shouldShowUploadTracker: boolean

  private _organization: SelectedOrganization

  constructor(
    private contentUpload: ContentUploadService,
    private notifier: NotifierService
  ) {
    this.contentUpload.visibleUploads$.subscribe((uploads: ContentUpload[]) => {
      this.shouldShowUploadTracker = uploads.length > 0
    })
  }

  ngOnDestroy() {}

  ngOnInit() {
    if (this.events) {
      this.events.contentSorted
        .pipe(untilDestroyed(this))
        .subscribe(async ($event: CcrDropEvent) => {
          try {
            const draggedIndex = this.datasource.result.findIndex(
              (element) => element.id === $event.drag.id
            )
            const droppedIndex = this.datasource.result.findIndex(
              (element) => element.id === $event.drop.id
            )

            if (draggedIndex + 1 === droppedIndex) {
              return
            }

            const promises = []
            promises.push(
              this.datasource.updateContent({
                id: $event.drag.id,
                sortOrder: $event.drop.sortOrder
              })
            )

            const offsetElements = this.datasource.result
              .slice()
              .splice(0, droppedIndex)

            offsetElements.forEach((element) => {
              if (element.id === $event.drag.id || !element.localSortOrder) {
                return
              }

              promises.push(
                this.datasource.updateContent({
                  id: element.id,
                  sortOrder: ++element.sortOrder
                })
              )
            })

            while (promises.length) {
              await promises.pop()
            }

            this.datasource.refresh()
          } catch (error) {
            this.notifier.error(error)
          }
        })

      this.events.contentSelected
        .pipe(untilDestroyed(this))
        .subscribe(async (content: FileExplorerContent) => {
          try {
            if (this.mode !== 'list' && content) {
              if (this.selectedContent !== content) {
                if (!content.isPublic) {
                  const contentPackages: any[] = await this.datasource.getAllContentPackage(
                    {
                      id: content.id
                    }
                  )
                  content.packages = contentPackages
                }
                this.selectedContent = content
              }
            } else {
              this.selectedContent = undefined
            }
          } catch (error) {
            this.notifier.error(error)
          }
        })
    }
  }
}
