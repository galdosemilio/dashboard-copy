import {
  Component,
  ElementRef,
  EventEmitter,
  forwardRef,
  Input,
  OnDestroy,
  OnInit,
  ViewChild,
  ViewEncapsulation
} from '@angular/core'
import { FormBuilder, FormGroup } from '@angular/forms'
import { CcrPaginatorComponent } from '@coachcare/common/components'
import { MatDialog, MatSort, MatTable } from '@coachcare/material'
import { FileExplorerBase } from '@app/dashboard/library/content/file-explorer-base/file-explorer-base'
import {
  CONTENT_TYPE_MAP,
  FileExplorerContent
} from '@app/dashboard/library/content/models'
import {
  ContextService,
  NotifierService,
  SelectedOrganization
} from '@app/service'
import { BindForm, BINDFORM_TOKEN } from '@app/shared'
import { _ } from '@coachcare/backend/shared'
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy'
import { Router } from '@angular/router'
import { AccountTypeIds } from '@coachcare/sdk'
import { FILE_TYPE_MAP } from '@app/dashboard/library/content/models/file-type.map'
import { PromptDialog, PromptDialogData } from '@coachcare/common/dialogs/core'
import { filter } from 'rxjs/operators'
import { resolveConfig } from '@app/config/section/utils'

export interface FileExplorerRoute {
  content: FileExplorerContent
  pageIndex: number
}

@UntilDestroy()
@Component({
  selector: 'app-content-file-explorer-table',
  templateUrl: './file-explorer-table.component.html',
  styleUrls: ['./file-explorer-table.component.scss'],
  providers: [
    {
      provide: BINDFORM_TOKEN,
      useExisting: forwardRef(() => FileExplorerTableComponent)
    }
  ],
  encapsulation: ViewEncapsulation.None
})
export class FileExplorerTableComponent
  extends FileExplorerBase
  implements BindForm, OnDestroy, OnInit
{
  @Input()
  allowInlineEdit = true
  @Input()
  allowBreadcrumbs = true
  @Input()
  set checkedContents(contents: FileExplorerContent[]) {
    this._checkedContents = contents || []
  }

  get checkedContents(): FileExplorerContent[] {
    return this._checkedContents
  }
  @Input()
  hiddenColumns: string[] = ['selector']
  @Input()
  inaccessible?: boolean
  @Input()
  initialRoutes: FileExplorerRoute[] = []
  @Input()
  mode: 'digital-library' | 'vault'
  @Input()
  organization: SelectedOrganization
  @ViewChild(CcrPaginatorComponent, { static: true })
  paginator: CcrPaginatorComponent
  @ViewChild(MatSort, { static: true })
  sort: MatSort
  @ViewChild(MatTable, { read: ElementRef, static: true })
  table: ElementRef

  set paginationEnabled(enabled: boolean) {
    this._paginationEnabled = !!enabled

    if (this._paginationEnabled) {
      this.paginator.pageIndex = 0
    }

    this.paginator.page.next(this.paginator)
  }

  get paginationEnabled(): boolean {
    return this._paginationEnabled
  }

  accountName: string
  allColumns: string[] = [
    'selector',
    'index',
    'icon',
    'name',
    'description',
    'isVisibleToPatient',
    'createdAt',
    'availability',
    'externalVisibility',
    'actions',
    'id'
  ]

  public columns = [
    'index',
    'icon',
    'name',
    'description',
    'createdAt',
    'availability',
    'actions',
    'id'
  ]
  public form: FormGroup
  public isProvider: boolean
  public root: FileExplorerRoute = {
    content: {
      id: null,
      name: '',
      type: undefined,
      organization: undefined,
      isForeign: undefined,
      isFolder: undefined,
      icon: undefined,
      createdAt: undefined,
      isPublic: undefined,
      description: undefined
    },
    pageIndex: 0
  }
  public route: FileExplorerRoute[] = []
  public rowOnEdition: any = {}

  private _checkedContents: FileExplorerContent[] = []
  private _paginationEnabled = true
  private onParentIdChange: EventEmitter<void> = new EventEmitter<void>()

  constructor(
    private context: ContextService,
    private dialog: MatDialog,
    private formBuilder: FormBuilder,
    private notifier: NotifierService,
    private router: Router
  ) {
    super()
  }

  ngOnDestroy() {
    this.source.unregister('page')
    this.source.unregister('parentId')
    this.source.unsetSorter()
  }

  ngOnInit() {
    this.isProvider =
      this.context.user.accountType.id === AccountTypeIds.Provider
    this.form = this.formBuilder.group({
      name: ['Content Name'],
      description: [''],
      isPublic: [true]
    })
    this.subscribeToEvents()
    this.subscribeToSource()
    this.calculateColumns()

    if (this.initialRoutes.length) {
      this.handleInitialRouting()
    }
  }

  dropContent($event: any): void {
    this.events.moveContent.emit({
      from: $event.drag.parentId,
      to: $event.drop.id,
      content: $event.drag
    })
  }

  goToRoute(index: number): void {
    if (this.route.length && index !== this.route.length - 1) {
      const destination: number = index + 1
      while (this.route.length - 1 > destination) {
        this.route.pop()
      }
      this.goUp()
    }
  }

  goUp(): void {
    this.route.pop()
    const route = this.route[this.route.length - 1]
    const page = route ? route.pageIndex : this.root.pageIndex
    this.setPage({ pageIndex: page })
    this.source.refresh()
  }

  public isChecked(content: FileExplorerContent): boolean {
    return this.checkedContents.some((checked) => checked.id === content.id)
  }

  public onCopy(content: FileExplorerContent): void {
    if (!content.isAdmin) {
      return
    }

    this.events.copyContentPrompt.emit({
      content: content,
      routes: this.route
    })
  }

  onEdit(content: FileExplorerContent): void {
    if (content.isAdmin) {
      this.events.updateContentPrompt.emit(content)
    }
  }

  onMove(content: FileExplorerContent): void {
    if (content.isAdmin) {
      this.events.moveContentPrompt.emit(content)
    }
  }

  async onOpen(content: FileExplorerContent) {
    if (
      content.extension &&
      FILE_TYPE_MAP[content.extension]?.readable === false
    ) {
      const data: PromptDialogData = {
        title: _('LIBRARY.CONTENT.DOWNLOAD_CONTENT'),
        content: _('LIBRARY.CONTENT.PREVIEW_CONTENT_DOWNLOADABLE_NOTICE'),
        yes: _('GLOBAL.DOWNLOAD'),
        no: _('GLOBAL.CANCEL')
      }
      this.dialog
        .open(PromptDialog, { data })
        .afterClosed()
        .pipe(filter((confirm) => confirm))
        .subscribe(() => this.onOpenContent(content))
      return
    }

    void this.onOpenContent(content)
  }

  private async onOpenContent(content: FileExplorerContent) {
    try {
      if (this.mode === 'vault') {
        const downloadUrl = await this.source.getDownloadUrl({
          id: content.id
        })
        this.events.openContent.emit({
          ...content,
          metadata: { ...content.metadata, url: downloadUrl.url }
        })
      } else {
        if (
          content.type.code === 'form' ||
          (content.metadata && content.metadata.url)
        ) {
          this.events.openContent.emit(content)
        }
      }
    } catch (error) {
      this.notifier.error(error)
    }
  }

  onDelete(content: FileExplorerContent): void {
    if (content.isAdmin) {
      this.events.deleteContent.emit(content)
    }
  }

  public onToggleSelection(content: FileExplorerContent): void {
    content.checked = !this.isChecked(content)

    if (content.checked) {
      this.events.contentChecked.emit(content)
    } else {
      this.events.contentUnchecked.emit(content)
    }
  }

  public openContent(content: FileExplorerContent): void {
    if (this.isProvider) {
      return
    }

    if (content.type.code === CONTENT_TYPE_MAP.form.code) {
      void this.router.navigate([
        '/library/forms',
        content.metadata.id,
        'dieter-submissions'
      ])
      return
    }

    if (content.type.code === CONTENT_TYPE_MAP.folder.code) {
      this.openDirectory(content)
      return
    }

    void this.onOpen(content)
  }

  openDirectory(content: FileExplorerContent): void {
    if (content.type && content.type.code === CONTENT_TYPE_MAP.form.code) {
      void this.router.navigate([
        '/library/forms',
        content.metadata.id,
        'submissions'
      ])

      return
    }

    if (!content.isFolder) {
      return
    }

    if (!this.route.length) {
      this.root.pageIndex = this.currentPage
    }

    this.currentPage = 0
    this.route.push({
      content: content,
      pageIndex: this.currentPage
    })

    this.setPage({ pageIndex: this.currentPage })
    this.source.refresh()
  }

  saveChanges(): void {
    if (this.form.invalid) {
      return
    }
    const formValue = this.form.value,
      row = this.rowOnEdition
    const cleanValues: any = {}
    Object.keys(formValue).forEach(
      (key) => (cleanValues[key] = formValue[key].value)
    )
    let fullName: string = cleanValues.name || row.name

    if (row.type.code === CONTENT_TYPE_MAP.file.code && row.extension) {
      fullName = `${fullName}.${row.extension}`
    }

    this.events.updateContent.emit(
      Object.assign({}, row, cleanValues, { name: fullName })
    )
  }

  setPage($event: any) {
    if ($event) {
      this.currentPage = $event.pageIndex
      this.paginator.pageIndex = this.currentPage
      this.table.nativeElement.scrollTop = 0
    }
  }

  sortContent($event: any) {
    if ($event.drag.id === $event.drop.id) {
      return
    }
    this.events.contentSorted.emit($event)
  }

  toggleEdit(row: any, prop: string, override?: boolean): void {
    this.rowOnEdition = {}

    if (override) {
      this.rowOnEdition = row
      this.rowOnEdition.prop = prop
      let validName: string = row.name

      if (row.type.code === CONTENT_TYPE_MAP.file.code) {
        const extensionIndex: number = validName.lastIndexOf('.')
        validName = validName.substring(
          0,
          extensionIndex > -1 ? extensionIndex : validName.length
        )
      }

      this.rowOnEdition.fullName = validName
    }
  }

  private calculateColumns(): void {
    let filteredColumns = []

    if (this.mode === 'vault') {
      filteredColumns = ['availability']
    } else {
      filteredColumns = ['isVisibleToPatient', 'externalVisibility']
    }

    if (!this.isProvider) {
      filteredColumns = [
        ...filteredColumns,
        'isVisibleToPatient',
        'externalVisibility',
        'availability',
        'actions',
        'id'
      ]
    } else if (
      !resolveConfig(
        'DIGITAL_LIBRARY.EXTERNAL_VISIBILITY_OPTIONS_ENABLED',
        this.context.organization
      )
    ) {
      filteredColumns = [...filteredColumns, 'externalVisibility']
    }

    filteredColumns = [...filteredColumns, ...this.hiddenColumns]

    this.columns = this.allColumns.filter(
      (aC) => !filteredColumns.find((c) => c === aC)
    )
  }

  private handleInitialRouting(): void {
    this.route = [...this.initialRoutes]
    this.source.refresh()
  }

  private subscribeToEvents(): void {
    this.context.account$.pipe(untilDestroyed(this)).subscribe((account) => {
      const user = this.context.user

      if (this.isProvider) {
        this.accountName = account
          ? `${account.firstName} ${account.lastName}`
          : ''
        return
      }

      this.accountName = `${user.firstName} ${user.lastName}`
    })

    this.events.contentUpdated.pipe(untilDestroyed(this)).subscribe(() => {
      this.source.refresh()
      this.rowOnEdition.id = undefined
    })

    this.events.contentAdded.pipe(untilDestroyed(this)).subscribe(() => {
      this.source.refresh()
    })

    this.events.contentDeleted.pipe(untilDestroyed(this)).subscribe(() => {
      this.source.refresh()
    })

    this.events.filtered.pipe(untilDestroyed(this)).subscribe(() => {
      this.paginator.firstPage()
    })
  }

  private subscribeToSource(): void {
    this.source.register(
      'page',
      false,
      this.paginator.page,
      () =>
        ({
          limit: this.paginationEnabled ? this.paginator.pageSize : 'all',
          offset: this.paginationEnabled
            ? this.paginator.pageIndex * this.paginator.pageSize
            : 0
        } as any)
    )

    this.source.register('parentId', false, this.onParentIdChange, () => {
      const currentRoute: FileExplorerRoute = this.route[this.route.length - 1]
      return {
        parentId: currentRoute ? currentRoute.content.id : undefined,
        parent: currentRoute ? currentRoute.content.id : undefined
      }
    })

    this.source.setSorter(
      this.sort,
      () =>
        ({
          sort:
            this.sort.active && this.sort.direction
              ? [
                  {
                    property: this.sort.active,
                    dir: this.sort.direction
                  }
                ]
              : [],
          isCustomSort: !this.sort.active || !this.sort.direction
        } as any)
    )
  }
}
