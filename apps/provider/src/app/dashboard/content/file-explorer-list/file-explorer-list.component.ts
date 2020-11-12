import {
  ChangeDetectorRef,
  Component,
  Input,
  OnDestroy,
  OnInit,
  ViewEncapsulation
} from '@angular/core'
import {
  ContentMovedEvent,
  FileExplorerBaseOptions,
  FileExplorerContent
} from '@app/dashboard/content/models'
import { FileExplorerDatasource } from '@app/dashboard/content/services'
import { ContextService, SelectedOrganization } from '@app/service'
import { FileExplorerBase } from '../file-explorer-base/file-explorer-base'

interface FileExplorerContentDirectory {
  content: FileExplorerContent
  disabled?: boolean
  draggableDirectory?: FileExplorerContentDirectory
  isDraggable?: boolean
  isDroppable?: boolean
  isOpen?: boolean
  source?: FileExplorerDatasource
}

@Component({
  selector: 'app-content-file-explorer-list',
  templateUrl: './file-explorer-list.component.html',
  styleUrls: ['./file-explorer-list.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class FileExplorerListComponent extends FileExplorerBase
  implements OnDestroy, OnInit {
  @Input()
  options: FileExplorerBaseOptions = {
    enableDrag: true,
    enableDrop: true,
    disableForeign: false,
    whitelistedContentTypes: []
  }
  @Input()
  organization: SelectedOrganization

  public contentDirectories: FileExplorerContentDirectory[]
  public selectedContentId: string

  constructor(private cdr: ChangeDetectorRef, private context: ContextService) {
    super()
  }

  public ngOnDestroy(): void {
    super.ngOnDestroy()
  }

  public ngOnInit(): void {
    this.subscribeToSource()
    this.subscribeToEvents()

    super.ngOnInit()
  }

  public dropDirectory($event: any): void {
    this.events.moveContent.emit({
      from: $event.drag.content.parentId,
      to: $event.drop.content.id,
      content: $event.drag.content
    })
  }

  public reset(): void {
    this.contentDirectories.forEach((directory) => {
      if (!directory.isOpen) {
        return
      }

      this.toggleDirectory(directory)
    })

    delete this.selectedContentId
  }

  public toggleDirectory(directory: FileExplorerContentDirectory): void {
    if (!directory.disabled) {
      this.selectedContentId = directory.content.id
      this.events.contentSelected.emit(directory.content)
    }

    if (!directory.content.isFolder) {
      return
    }

    // This way, the sources only exist when needed -- Zcyon
    if (directory.isOpen) {
      delete directory.source
    } else {
      directory.source = this.source.getChildDatasource()
      // Overrides to support the File Vault
      directory.source.addDefault({
        account: this.context.accountId,
        parent: directory.content.id
      } as any)
      directory.source.addDefault({ organization: this.organization.id })
      directory.source.addDefault({ parentId: directory.content.id })
    }

    directory.isOpen = !directory.isOpen
    this.cdr.detectChanges()
  }

  private generateContentDirectories(
    contents: FileExplorerContent[],
    sort: boolean = false
  ): void {
    this.contentDirectories = this.contentDirectories
      ? this.contentDirectories
      : []
    const newContents: FileExplorerContentDirectory[] = []
    let leftContents: FileExplorerContentDirectory[] = []

    contents.forEach((content: FileExplorerContent) => {
      if (
        this.options.whitelistedContentTypes &&
        this.options.whitelistedContentTypes.length
          ? this.options.whitelistedContentTypes.indexOf(content.type.code) > -1
          : true
      ) {
        const contentDirectory: FileExplorerContentDirectory = {
          content: content,
          disabled: this.options.disableForeign && content.isForeign,
          source: undefined,
          isOpen: false
        }

        contentDirectory.draggableDirectory = this.getDraggableDirectory(
          contentDirectory
        )
        contentDirectory.isDraggable = this.isDraggable(contentDirectory)
        contentDirectory.isDroppable = this.isDroppable(contentDirectory)

        newContents.push(contentDirectory)
      }
    })

    if (this.contentDirectories.length) {
      newContents.forEach((contentDirectory: FileExplorerContentDirectory) => {
        const existingIndex: number = this.contentDirectories.findIndex(
          (cD: FileExplorerContentDirectory) =>
            cD.content.id === contentDirectory.content.id
        )
        if (existingIndex > -1) {
          this.contentDirectories.splice(existingIndex, 1, contentDirectory)
        } else {
          leftContents.push(contentDirectory)
        }
      })
    } else {
      leftContents = newContents
    }

    if (sort) {
      leftContents.forEach((c: FileExplorerContentDirectory) => {
        const placeIndex: number = this.contentDirectories.findIndex(
          (cD: FileExplorerContentDirectory) =>
            cD.content.name.localeCompare(c.content.name) === 1
        )
        if (placeIndex > -1) {
          this.contentDirectories.splice(placeIndex, 0, c)
        } else {
          this.contentDirectories.push(c)
        }
      })
    } else {
      this.contentDirectories.push(...leftContents)
    }
    this.cdr.detectChanges()
  }

  private getDraggableDirectory(
    directory: FileExplorerContentDirectory
  ): FileExplorerContentDirectory {
    return { content: directory.content, isOpen: directory.isOpen }
  }

  private isDraggable(directory: FileExplorerContentDirectory): boolean {
    return this.options.enableDrag && !directory.content.isForeign
  }

  private isDroppable(directory: FileExplorerContentDirectory): boolean {
    return (
      this.options.enableDrop &&
      directory.content.isFolder &&
      !directory.content.isForeign
    )
  }

  private subscribeToSource(): void {
    if (this.source) {
      this.subscriptions.connection = this.source
        .connect()
        .subscribe((contents: FileExplorerContent[]) => {
          delete this.selectedContentId
          this.generateContentDirectories(contents)
        })
    }
  }

  private subscribeToEvents(): void {
    if (this.events) {
      this.subscriptions.resetFiles = this.events.resetFiles.subscribe(() => {
        delete this.contentDirectories
        this.currentPage = 0
      })
      this.subscriptions.contentAdded = this.events.contentAdded.subscribe(
        (newContent: FileExplorerContent) => {
          if (this.source.parentId === newContent.parentId) {
            this.generateContentDirectories([newContent], true)
            this.selectedContentId = newContent.id
            this.events.contentSelected.emit(newContent)
          }
        }
      )
      this.subscriptions.contentUpdated = this.events.contentUpdated.subscribe(
        (updatedContent: FileExplorerContent) => {
          if (this.source.parentId === updatedContent.parentId) {
            this.generateContentDirectories([updatedContent])
          }
        }
      )
      this.subscriptions.contentDeleted = this.events.contentDeleted.subscribe(
        (deletedContent: FileExplorerContent) => {
          const foundIndex: number = this.contentDirectories.findIndex(
            (cD: FileExplorerContentDirectory) =>
              cD.content.id === deletedContent.id
          )
          if (foundIndex > -1) {
            this.contentDirectories.splice(foundIndex, 1)
          }
          if (this.selectedContentId === deletedContent.id) {
            delete this.selectedContentId
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
        (moveEvent: ContentMovedEvent) => {
          if (
            moveEvent.to === moveEvent.content.id ||
            moveEvent.to === moveEvent.from
          ) {
            return
          }

          this.events.contentSelected.emit()

          if (moveEvent.from === this.source.parentId) {
            this.contentDirectories.splice(
              this.contentDirectories.findIndex(
                (cD: FileExplorerContentDirectory) =>
                  cD.content.id === moveEvent.content.id
              ),
              1
            )
          } else if (moveEvent.to === this.source.parentId) {
            this.generateContentDirectories([moveEvent.content], true)
          }
        }
      )
    }
  }
}
