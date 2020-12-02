import {
  Component,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit
} from '@angular/core'
import {
  ContentMovedEvent,
  FileExplorerContent
} from '@app/dashboard/content/models'
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy'
import { FileExplorerBase } from '../file-explorer-base/file-explorer-base'

@UntilDestroy()
@Component({
  selector: 'app-content-file-explorer-grid',
  templateUrl: './file-explorer-grid.component.html',
  styleUrls: ['./file-explorer-grid.component.scss']
})
export class FileExplorerGridComponent
  extends FileExplorerBase
  implements OnDestroy, OnInit {
  @Input() inaccessible?: boolean

  public contentDirectories: FileExplorerContent[]
  public route: FileExplorerContent[] = []
  public selectedContentId: string

  private onParentIdChange: EventEmitter<void> = new EventEmitter<void>()

  dropContent($event: any): void {
    this.events.moveContent.emit({
      from: $event.drag.parentId,
      to: $event.drop.id,
      content: $event.drag
    })
  }

  ngOnDestroy(): void {
    if (this.subscriptions.connection) {
      this.route = []
      this.onParentIdChange.emit()
      this.source.unregister('parentId')
    }
    super.ngOnDestroy()
  }

  ngOnInit(): void {
    if (this.source) {
      this.subscribeToSource()
      if (this.events) {
        this.subscribeToEvents()
      }
    }

    super.ngOnInit()
    this.resetSurfaceNav()
  }

  getDroppableContent(content: FileExplorerContent): FileExplorerContent {
    return { ...content, id: content.parentId || null }
  }

  goToRoute(index: number): void {
    while (this.route.length - 1 > index) {
      this.goUp()
    }
  }

  goUp(): void {
    this.route.pop()
    this.selectedContentId = undefined
    this.resetSurfaceNav()
  }

  openDirectory(content: FileExplorerContent): void {
    if (!content.isFolder) {
      return
    }

    this.route.push(content)
    this.resetSurfaceNav()
  }

  selectDirectory(content: FileExplorerContent): void {
    this.events.contentSelected.emit(content)
  }

  private resetSurfaceNav(): void {
    this.currentPage = 0
    this.contentDirectories = undefined
    this.onLoadMore.emit()
    this.onParentIdChange.emit()
    this.source.refresh()
    this.events.contentSelected.emit()
  }

  private subscribeToEvents(): void {
    this.subscriptions.contentAdded = this.events.contentAdded.subscribe(() =>
      this.source.refresh()
    )
    this.subscriptions.contentUpdated = this.events.contentUpdated.subscribe(
      (content: FileExplorerContent) => {
        const foundIndex: number = this.contentDirectories.findIndex(
          (cD: FileExplorerContent) => cD.id === content.id
        )
        if (foundIndex > -1) {
          this.contentDirectories.splice(foundIndex, 1, content)
        }
      }
    )
    this.subscriptions.resetFiles = this.events.resetFiles.subscribe(() => {
      this.route = []
      this.currentPage = 0
      delete this.contentDirectories
      this.onParentIdChange.emit()
    })
    this.subscriptions.contentDeleted = this.events.contentDeleted.subscribe(
      (deletedContent: FileExplorerContent) => {
        const foundIndex: number = this.contentDirectories.findIndex(
          (cD: FileExplorerContent) => cD.id === deletedContent.id
        )
        if (foundIndex > -1) {
          this.contentDirectories.splice(foundIndex, 1)
        }
        if (this.selectedContentId === deletedContent.id) {
          this.events.contentSelected.emit()
        }
      }
    )
    this.subscriptions.contentSelected = this.events.contentSelected.subscribe(
      (selectedContent: FileExplorerContent) => {
        if (selectedContent) {
          this.selectedContentId =
            selectedContent.id !== this.selectedContentId
              ? selectedContent.id
              : this.selectedContentId
        } else {
          delete this.selectedContentId
        }
      }
    )
    this.subscriptions.contentMoved = this.events.contentMoved.subscribe(
      (event: ContentMovedEvent) => {
        if (event.from === event.to) {
          return
        }

        if (event.to !== event.content.id) {
          this.events.contentSelected.emit()
          this.contentDirectories.splice(
            this.contentDirectories.findIndex(
              (cD: FileExplorerContent) => cD.id === event.content.id
            ),
            1
          )
        }
      }
    )
    this.events.filtered
      .pipe(untilDestroyed(this))
      .subscribe(() => this.resetSurfaceNav())
  }

  private subscribeToSource(): void {
    this.subscriptions.connection = this.source
      .connect()
      .subscribe((contents: FileExplorerContent[]) => {
        this.contentDirectories = this.contentDirectories
          ? this.contentDirectories
          : []

        const leftContents: FileExplorerContent[] = []

        contents.forEach((contentDirectory: FileExplorerContent) => {
          const existingIndex: number = this.contentDirectories.findIndex(
            (cD: FileExplorerContent) => cD.id === contentDirectory.id
          )
          if (existingIndex > -1) {
            this.contentDirectories.splice(existingIndex, 1, contentDirectory)
          } else {
            leftContents.push(contentDirectory)
          }
        })

        this.contentDirectories.push(...leftContents)
      })

    this.source.register('parentId', false, this.onParentIdChange, () => {
      const currentRoute: FileExplorerContent = this.route[
        this.route.length - 1
      ]
      return {
        parentId: currentRoute ? currentRoute.id : undefined
      }
    })
  }
}
