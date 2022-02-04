import { Component, Input, OnInit } from '@angular/core'
import {
  ContentUpload,
  FileExplorerContent,
  FileExplorerEvents
} from '@app/dashboard/library/content/models'
import {
  ContentUploadService,
  FileExplorerDatasource
} from '@app/dashboard/library/content/services'
import {
  ContextService,
  NotifierService,
  SelectedOrganization
} from '@app/service'
import { CcrDropEvent } from '@app/shared'
import { AccountTypeIds } from '@coachcare/sdk'
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy'

interface FileExplorerDropEvent {
  id: string
  sortOrder: number
}

@UntilDestroy()
@Component({
  selector: 'app-content-file-explorer',
  templateUrl: './file-explorer.component.html',
  styleUrls: ['./file-explorer.component.scss']
})
export class FileExplorerComponent implements OnInit {
  @Input()
  mode: string

  @Input()
  set organization(org: SelectedOrganization) {
    if (this._organization === org) {
      return
    }

    delete this.selectedContent
    this._organization = org
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

  public isProvider: boolean
  public selectedContent: FileExplorerContent
  public shouldShowUploadTracker: boolean

  private _organization: SelectedOrganization

  constructor(
    private contentUpload: ContentUploadService,
    private context: ContextService,
    private notifier: NotifierService
  ) {
    this.onContentSorted = this.onContentSorted.bind(this)
    this.onContentSelected = this.onContentSelected.bind(this)
  }

  public ngOnInit(): void {
    this.isProvider =
      this.context.user.accountType.id === AccountTypeIds.Provider

    this.subscribeToEvents()
  }

  private async onContentSorted(
    $event: CcrDropEvent<FileExplorerDropEvent>
  ): Promise<void> {
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

      await this.datasource.updateContent({
        id: $event.drag.id,
        sortOrder: $event.drop.sortOrder
      })

      this.datasource.refresh()
    } catch (error) {
      this.notifier.error(error)
    }
  }

  private async onContentSelected(content: FileExplorerContent): Promise<void> {
    try {
      if (this.mode !== 'list' && content) {
        if (this.selectedContent !== content) {
          if (!content.isPublic) {
            const contentPackages = await this.datasource.getAllContentPackage({
              id: content.id
            })
            content.packages = contentPackages.map((entity) => ({ ...entity }))
          }
          this.selectedContent = content
        }
      } else {
        this.selectedContent = undefined
      }
    } catch (error) {
      this.notifier.error(error)
    }
  }

  private subscribeToEvents(): void {
    this.contentUpload.visibleUploads$.subscribe((uploads: ContentUpload[]) => {
      this.shouldShowUploadTracker = uploads.length > 0
    })

    if (!this.events) {
      return
    }

    this.events.contentSorted
      .pipe(untilDestroyed(this))
      .subscribe(this.onContentSorted)

    this.events.contentSelected
      .pipe(untilDestroyed(this))
      .subscribe(this.onContentSelected)
  }
}
