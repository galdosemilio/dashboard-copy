import { Component, Input, OnDestroy, OnInit } from '@angular/core'
import { MatDialog } from '@coachcare/material'
import {
  ContentBatchCopyDialog,
  ContentCreateDialog,
  ContentEditDialog,
  ContentMoveDialog,
  EmbeddedContentViewerComponent,
  FolderCreateDialog,
  FormPreviewDialog,
  InsertFormDialog
} from '@app/dashboard/content/dialogs'
import {
  CONTENT_TYPE_MAP,
  ContentCopiedEvent,
  ContentMovedEvent,
  ContentTypeMapItem,
  ContentUploadTicket,
  CopyContentPromptEvent,
  FILE_TYPE_MAP,
  FileExplorerContent,
  FileExplorerEvents,
  FileTypeMapItem,
  QueuedContent
} from '@app/dashboard/content/models'
import {
  ContentUploadService,
  FileExplorerDatabase,
  FileExplorerDatasource
} from '@app/dashboard/content/services'
import {
  ContextService,
  NotifierService,
  SelectedOrganization
} from '@app/service'
import { _, PromptDialog } from '@app/shared'
import {
  Entity,
  FetchPackagesSegment,
  OrganizationEntity
} from '@coachcare/sdk'
import { uniqBy, values } from 'lodash'
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy'
import { BehaviorSubject, Subject, Subscription } from 'rxjs'
import { VaultDatasource } from '../accounts'

@UntilDestroy()
@Component({
  selector: 'app-content',
  templateUrl: './content.component.html',
  styleUrls: ['./content.component.scss']
})
export class ContentComponent implements OnDestroy, OnInit {
  @Input() mode: 'digital-library' | 'vault' = 'digital-library'
  @Input() organizationOverride: any
  // eslint-disable-next-line @angular-eslint/no-input-rename
  @Input('source') datasource: FileExplorerDatasource | VaultDatasource

  public clinic: string
  public viewMode: 'list' | 'grid' = 'list'
  public events: FileExplorerEvents = new FileExplorerEvents()
  public cloneContentZendeskLink =
    'https://coachcare.zendesk.com/hc/en-us/articles/360049925131-How-to-Clone-Duplicate-Digital-Library-Content'
  public contentType$: BehaviorSubject<string> = new BehaviorSubject<string>('')
  public contentTypes: ContentTypeMapItem[] = values(CONTENT_TYPE_MAP)
  public fileType$: BehaviorSubject<string> = new BehaviorSubject<string>('')
  public fileTypes: FileTypeMapItem[] = uniqBy(values(FILE_TYPE_MAP), 'name')
  public filteredOrgs: OrganizationEntity[] = []
  public isProvider: boolean
  public sourceOptionals: any = {
    type: undefined,
    mimeType: undefined
  }
  public zendeskLink =
    'https://coachcare.zendesk.com/hc/en-us/articles/360018719912-Adding-to-the-Digital-Library'

  private subscriptions: { [key: string]: Subscription } = {}
  organization: SelectedOrganization
  organizationOverride$: Subject<any> = new Subject<any>()

  constructor(
    public context: ContextService,
    private database: FileExplorerDatabase,
    private dialog: MatDialog,
    private notifier: NotifierService,
    private contentUpload: ContentUploadService
  ) {}

  ngOnDestroy() {
    Object.keys(this.subscriptions).forEach((key: string) => {
      if (this.subscriptions[key]) {
        this.subscriptions[key].unsubscribe()
      }
    })
  }

  ngOnInit() {
    this.isProvider = this.context.isProvider

    if (!this.isProvider) {
      this.organizationOverride = this.context.organization
    }

    this.mergeFileTypeMimes()
    if (!this.datasource) {
      this.datasource = new FileExplorerDatasource(
        this.context,
        this.notifier,
        this.database
      )
    }
    this.subscribeToEvents()
    this.datasource.addRequired(this.context.organization$, () => ({
      organization: this.organizationOverride
        ? this.organizationOverride.id
        : this.context.organization.id
    }))
    this.datasource.addOptional(this.fileType$, () => ({
      mimeType: this.sourceOptionals.mimeType || undefined
    }))
    this.datasource.addRequired(this.contentType$, () => {
      return this.sourceOptionals.type
        ? this.sourceOptionals.type.fetchProperties
          ? this.sourceOptionals.type.fetchProperties()
          : {
              type: this.sourceOptionals.type.id || undefined,
              mimeType: this.sourceOptionals.mimeType || undefined
            }
        : undefined
    })
    this.contentUpload.source = this.datasource
    this.contentUpload.organization = this.organizationOverride || undefined

    if (this.mode === 'vault') {
      if (this.organizationOverride) {
        this.clinic = this.organizationOverride.id
        this.datasource.addOptional(this.organizationOverride$, () => ({
          organization: this.organizationOverride.id
        }))
      }
    }
  }

  createContent() {
    this.dialog
      .open(ContentCreateDialog, {
        autoFocus: false,
        data: { parent: this.datasource.parentId, mode: this.mode },
        disableClose: true,
        width: '80vw',
        panelClass: 'ccr-full-dialog'
      })
      .afterClosed()
      .subscribe(async (queuedContents: QueuedContent[]) => {
        if (queuedContents && queuedContents.length) {
          this.contentUpload.createContents(queuedContents)
        }
      })
  }

  createFolder() {
    const data = {
      mode: this.mode,
      parent: this.datasource.parentId,
      organization: this.organizationOverride || undefined,
      title: _('LIBRARY.CONTENT.NEW_FOLDER'),
      label: _('LIBRARY.CONTENT.FOLDER_NAME'),
      ok: _('LIBRARY.CONTENT.CREATE_FOLDER')
    }
    this.dialog
      .open(FolderCreateDialog, {
        autoFocus: false,
        data: data,
        width: '80vw',
        panelClass: 'ccr-full-dialog'
      })
      .afterClosed()
      .subscribe(async (args: ContentUploadTicket) => {
        if (args) {
          await this.contentUpload.requestContentCreation(args, false)
        }
      })
  }

  insertForm() {
    this.dialog
      .open(InsertFormDialog, {
        data: {
          mode: this.mode,
          organization: this.organizationOverride || undefined,
          parent: this.datasource.parentId
        },
        width: '80vw',
        panelClass: 'ccr-full-dialog'
      })
      .afterClosed()
      .subscribe(async (args: ContentUploadTicket) => {
        if (args) {
          await this.contentUpload.requestContentCreation(args, false)
        }
      })
  }

  mergeFileTypeMimes() {
    const fileTypes: FileTypeMapItem[] = values(FILE_TYPE_MAP)
    this.fileTypes.forEach((fT: FileTypeMapItem) => {
      const mergeable: FileTypeMapItem = fileTypes.find(
        (type: FileTypeMapItem) =>
          type.name === fT.name && type.mimeType !== fT.mimeType
      )
      if (mergeable) {
        fT.mimeType = Array.isArray(fT.mimeType)
          ? [...fT.mimeType, mergeable.mimeType.toString()]
          : [fT.mimeType, mergeable.mimeType.toString()]
      }
    })
  }

  public openBatchCloneDialog(): void {
    this.dialog
      .open(ContentBatchCopyDialog, {
        data: {
          datasource: this.datasource,
          events: this.events,
          organization: this.organizationOverride
        },
        disableClose: true,
        panelClass: 'ccr-full-dialog',
        width: '90vw'
      })
      .afterClosed()
      .subscribe((refresh) => {
        if (!refresh) {
          return
        }

        this.datasource.refresh()
      })
  }

  async selectOrganization(org: any) {
    const organization = await this.context.getOrg(org.id)
    if (organization) {
      this.organizationOverride = organization
      this.contentUpload.organization = organization
      this.organizationOverride$.next(organization)
    }
  }

  setViewMode(mode) {
    if (mode === this.viewMode) {
      return
    }

    if (this.datasource && this.datasource.hasParentIdSet()) {
      setTimeout(() => {
        const data = {
          title: _('LIBRARY.CONTENT.VIEWMODE_TOGGLE_WARNING'),
          content: _('LIBRARY.CONTENT.VIEWMODE_TOGGLE_MESSAGE')
        }

        this.dialog
          .open(PromptDialog, { data: data })
          .afterClosed()
          .subscribe((confirm: boolean) => {
            if (confirm) {
              this.viewMode = mode
              this.events.contentSelected.emit()
            }
          })
      })
    } else {
      this.viewMode = mode
      this.events.contentSelected.emit()
    }
  }

  private subscribeToEvents() {
    this.subscriptions.organizationSubscription = this.context.organization$.subscribe(
      (org) => {
        this.organization = this.organizationOverride || org
        this.events.resetFiles.emit()
      }
    )
    this.subscriptions.updateContentSubscription = this.events.updateContent.subscribe(
      async (content: FileExplorerContent) => {
        try {
          let updatedContent: FileExplorerContent
          await this.removeContentPackages(content)
          if (content.isPublic) {
            updatedContent = await this.datasource.updateContent({
              ...content,
              parent: content.parent || content.parentId,
              isVisibleToPatient: content.isVisibleToPatient,
              sortOrder: undefined
            })
          } else if (content.packages && content.packages.length) {
            updatedContent = await this.datasource.updateContent({
              ...content,
              parent: content.parent || content.parentId,
              isVisibleToPatient: content.isVisibleToPatient,
              sortOrder: undefined
            })

            while (content.packages.length) {
              const p: FetchPackagesSegment = content.packages.pop()
              await this.datasource.createContentPackage({
                id: content.id,
                package: p.id
              })
            }
          }

          this.events.contentUpdated.emit(
            updatedContent ||
              (await this.datasource.updateContent({
                ...content,
                parent: content.parent || content.parentId,
                isVisibleToPatient: content.isVisibleToPatient,
                sortOrder: undefined
              }))
          )
        } catch (error) {
          this.notifier.error(error)
        }
      }
    )
    this.subscriptions.updateContentPromptSubscription = this.events.updateContentPrompt.subscribe(
      (content: FileExplorerContent) => this.updateContentPrompt(content)
    )
    this.subscriptions.deleteContentSubscription = this.events.deleteContent.subscribe(
      (content: FileExplorerContent) => this.deleteContent(content)
    )
    this.subscriptions.moveContentSubscription = this.events.moveContent.subscribe(
      async (event: ContentMovedEvent) => {
        try {
          if (event.content.id !== event.to) {
            const content = Object.assign({}, event.content)
            content.parentId = event.to
            this.events.contentUpdated.emit(
              await this.datasource.updateContent({
                ...content,
                parent: content.parent || content.parentId,
                isVisibleToPatient: content.isVisibleToPatient
              })
            )
            this.events.contentMoved.emit(event)
          }
        } catch (error) {
          this.notifier.error(error)
        }
      }
    )
    this.subscriptions.moveContentPromptSubscription = this.events.moveContentPrompt.subscribe(
      (content: FileExplorerContent) => this.moveContentPrompt(content)
    )
    this.subscriptions.contentAddedSubscription = this.contentUpload.contentAdded$.subscribe(
      (content: FileExplorerContent) => this.events.contentAdded.emit(content)
    )
    this.subscriptions.openContentSubscription = this.events.openContent.subscribe(
      (content: FileExplorerContent) => this.openContent(content)
    )
    this.subscriptions.copyContentPrompt = this.events.copyContentPrompt.subscribe(
      (event: CopyContentPromptEvent) => this.copyContentPrompt(event)
    )
    this.subscriptions.copyContent = this.events.copyContent.subscribe(
      (event: ContentCopiedEvent) => {
        this.copyContent(event)
      }
    )
    this.contentType$.pipe(untilDestroyed(this)).subscribe((index: string) => {
      this.sourceOptionals.type =
        index !== '' ? this.contentTypes[index] : undefined
      this.events.filtered.emit()
    })
    this.fileType$.pipe(untilDestroyed(this)).subscribe((index: string) => {
      this.sourceOptionals.mimeType =
        index !== '' ? this.fileTypes[index].mimeType : undefined
      this.events.filtered.emit()
    })
  }

  private async copyContent(event: ContentCopiedEvent): Promise<void> {
    try {
      await this.datasource.copyContent(event)
      this.notifier.success(_('NOTIFY.SUCCESS.CONTENT_CLONED'))
      this.datasource.refresh()
    } catch (error) {
      this.notifier.error(error)
    }
  }

  private copyContentPrompt(event: CopyContentPromptEvent) {
    this.dialog
      .open(ContentBatchCopyDialog, {
        autoFocus: false,
        data: {
          selectedContents: [event.content],
          datasource: this.datasource,
          events: this.events,
          initialRoutes: event.routes || [],
          organization: this.organizationOverride
        },
        width: '80vw',
        panelClass: 'ccr-full-dialog'
      })
      .afterClosed()
      .subscribe((refresh) => {
        if (!refresh) {
          return
        }

        this.datasource.refresh()
      })
  }

  private deleteContent(content: FileExplorerContent) {
    const data = {
      title: _('LIBRARY.CONTENT.DELETE_CONTENT_TITLE'),
      content: _('LIBRARY.CONTENT.DELETE_CONTENT_WARNING_MESSAGE'),
      titleParams: {
        name: content.name
      }
    }
    this.dialog
      .open(PromptDialog, { data: data })
      .afterClosed()
      .subscribe(async (confirm: boolean) => {
        if (confirm) {
          await this.datasource.deleteContent(content.id)
          this.events.contentDeleted.emit(content)
        }
      })
  }

  private moveContentPrompt(content: FileExplorerContent) {
    this.dialog
      .open(ContentMoveDialog, {
        autoFocus: false,
        data: {
          content: content,
          mode: this.mode,
          organization: this.organizationOverride || undefined
        },
        width: '80vw',
        panelClass: 'ccr-full-dialog'
      })
      .afterClosed()
      .subscribe((event: ContentMovedEvent) => {
        if (event) {
          this.events.moveContent.emit(event)
        }
      })
  }

  private openContent(content: FileExplorerContent) {
    if (content.type.code === 'form') {
      this.dialog.open(FormPreviewDialog, { data: { content }, width: '60vw' })
      return
    }

    if (content.metadata.content) {
      this.dialog.open(EmbeddedContentViewerComponent, {
        data: { content: content.metadata.content, title: content.name }
      })
    } else {
      const solvedURL: string = content.metadata.url.match(/^https?:/)
        ? content.metadata.url
        : `//${content.metadata.url}`
      window.open(solvedURL, '_blank')
    }
  }

  private removeContentPackages(content: FileExplorerContent): Promise<void> {
    return new Promise<void>(async (resolve, reject) => {
      try {
        const contentPackages: Entity[] = await this.datasource.getAllContentPackage(
          {
            id: content.id
          }
        )

        while (contentPackages.length) {
          const cP: Entity = contentPackages.pop()
          await this.datasource.deleteContentPackage({
            id: content.id,
            package: cP.id
          })
        }

        resolve()
      } catch (error) {
        reject(error)
      }
    })
  }

  private async updateContentPrompt(content: FileExplorerContent) {
    const packages: Entity[] = await this.datasource.getAllContentPackage({
      id: content.id
    })
    this.dialog
      .open(ContentEditDialog, {
        autoFocus: false,
        data: { content: content, packages: packages, mode: this.mode },
        width: '80vw',
        panelClass: 'ccr-full-dialog'
      })
      .afterClosed()
      .subscribe(async (updatedContent: FileExplorerContent) => {
        if (updatedContent) {
          this.events.updateContent.emit(updatedContent)
        }
      })
  }
}
