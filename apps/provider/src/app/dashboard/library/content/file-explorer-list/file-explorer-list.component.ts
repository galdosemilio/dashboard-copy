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
  FileExplorerContent,
  FileExplorerContentDirectory
} from '@app/dashboard/library/content/models'
import { ContextService, SelectedOrganization } from '@app/service'
import { GetAllVaultContentRequest } from '@coachcare/sdk'
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy'
import { filter } from 'rxjs/operators'
import { FileExplorerBase } from '../file-explorer-base/file-explorer-base'

@UntilDestroy()
@Component({
  selector: 'app-content-file-explorer-list',
  templateUrl: './file-explorer-list.component.html',
  styleUrls: ['./file-explorer-list.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class FileExplorerListComponent
  extends FileExplorerBase
  implements OnDestroy, OnInit
{
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
  public isLoading: boolean

  constructor(private cdr: ChangeDetectorRef, private context: ContextService) {
    super()
    this.mapContentDirectory = this.mapContentDirectory.bind(this)
    this.onContentAdded = this.onContentAdded.bind(this)
    this.onContentDeleted = this.onContentDeleted.bind(this)
    this.onContentMoved = this.onContentMoved.bind(this)
    this.onContentSelected = this.onContentSelected.bind(this)
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

    this.selectedContentId = null
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
      directory.source = null
    } else {
      directory.source = this.source.getChildDatasource()

      this.isLoading = directory.source.isLoading

      // Overrides to support the File Vault
      directory.source.addDefault({
        account: this.context.accountId,
        parent: directory.content.id
      } as GetAllVaultContentRequest)
      directory.source.addDefault({ organization: this.organization.id })
      directory.source.addDefault({ parentId: directory.content.id })

      directory.source.change$.pipe(untilDestroyed(this)).subscribe(() => {
        this.isLoading = directory.source.isLoading
        this.cdr.detectChanges()
      })
    }

    directory.isOpen = !directory.isOpen
    this.cdr.detectChanges()
  }

  private mapContentDirectory(
    content: FileExplorerContent
  ): FileExplorerContentDirectory | null {
    if (
      this.options.whitelistedContentTypes?.length &&
      !this.options.whitelistedContentTypes?.includes(content.type.code)
    ) {
      return null
    }

    return new FileExplorerContentDirectory(content, this.options)
  }

  private generateContentDirectories(
    contents: FileExplorerContent[],
    sort: boolean = false
  ): void {
    this.contentDirectories = this.contentDirectories || []

    let leftContents: FileExplorerContentDirectory[] = []

    const newContents: FileExplorerContentDirectory[] = contents
      .map(this.mapContentDirectory)
      .filter((contentEntry) => contentEntry)

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

  private onContentAdded(newContent: FileExplorerContent): void {
    this.generateContentDirectories([newContent], true)
    this.selectedContentId = newContent.id
    this.events.contentSelected.emit(newContent)
  }

  private onContentDeleted(deletedContent: FileExplorerContent): void {
    const foundIndex: number = this.contentDirectories.findIndex(
      (cD: FileExplorerContentDirectory) => cD.content.id === deletedContent.id
    )
    if (foundIndex > -1) {
      this.contentDirectories.splice(foundIndex, 1)
    }
    if (this.selectedContentId === deletedContent.id) {
      this.selectedContentId = null
      this.events.contentSelected.emit()
    }
  }

  private onContentMoved(moveEvent: ContentMovedEvent): void {
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

  private onContentSelected(selectedContent: FileExplorerContent): void {
    if (selectedContent) {
      this.selectedContentId =
        selectedContent.id !== this.selectedContentId
          ? selectedContent.id
          : this.selectedContentId
    } else {
      this.selectedContentId = null
    }
  }

  private subscribeToSource(): void {
    if (this.source) {
      this.source
        .connect()
        .pipe(untilDestroyed(this))
        .subscribe((contents: FileExplorerContent[]) => {
          this.selectedContentId = null
          this.generateContentDirectories(contents)
        })
    }
  }

  private subscribeToEvents(): void {
    if (!this.events) {
      return
    }

    this.events.resetFiles.pipe(untilDestroyed(this)).subscribe(() => {
      this.contentDirectories = null
      this.currentPage = 0
    })

    this.events.contentAdded
      .pipe(
        untilDestroyed(this),
        filter((newContent) => this.source.parentId === newContent.parentId)
      )
      .subscribe(this.onContentAdded)

    this.events.contentUpdated
      .pipe(
        untilDestroyed(this),
        filter(
          (updatedContent) => this.source.parentId === updatedContent.parentId
        )
      )
      .subscribe((updatedContent) =>
        this.generateContentDirectories([updatedContent])
      )

    this.events.contentDeleted
      .pipe(untilDestroyed(this))
      .subscribe(this.onContentDeleted)

    this.events.contentSelected
      .pipe(untilDestroyed(this))
      .subscribe(this.onContentSelected)

    this.events.contentMoved
      .pipe(untilDestroyed(this))
      .subscribe(this.onContentMoved)
  }
}
