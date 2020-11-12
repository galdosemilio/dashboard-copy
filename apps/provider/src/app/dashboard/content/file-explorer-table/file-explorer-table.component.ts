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
import { MatSort, MatTable } from '@coachcare/material'
import { FileExplorerBase } from '@app/dashboard/content/file-explorer-base/file-explorer-base'
import {
  CONTENT_TYPE_MAP,
  FileExplorerContent
} from '@app/dashboard/content/models'
import {
  ContextService,
  NotifierService,
  SelectedOrganization
} from '@app/service'
import { BindForm, BINDFORM_TOKEN, CcrPaginator } from '@app/shared'
import { untilDestroyed } from 'ngx-take-until-destroy'

export interface FileExplorerRoute {
  content: FileExplorerContent
  pageIndex: number
}

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
export class FileExplorerTableComponent extends FileExplorerBase
  implements BindForm, OnDestroy, OnInit {
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
  initialRoutes: FileExplorerRoute[] = []
  @Input()
  mode: 'digital-library' | 'vault'
  @Input()
  organization: SelectedOrganization
  @ViewChild(CcrPaginator, { static: true })
  paginator: CcrPaginator
  @ViewChild(MatSort, { static: true })
  sort: MatSort
  @ViewChild(MatTable, { read: ElementRef, static: true })
  table: ElementRef

  set paginationEnabled(enabled: boolean) {
    this._paginationEnabled = !!enabled

    if (this._paginationEnabled) {
      this.paginator.pageIndex = 0
    }

    this.paginator.page.next()
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
    'createdAt',
    'availability',
    'actions'
  ]

  public columns = [
    'index',
    'icon',
    'name',
    'description',
    'createdAt',
    'availability',
    'actions'
  ]
  public form: FormGroup
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
    private formBuilder: FormBuilder,
    private notifier: NotifierService
  ) {
    super()
  }

  ngOnDestroy() {
    this.source.unregister('page')
    this.source.unregister('parentId')
    this.source.unsetSorter()
  }

  ngOnInit() {
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
    let page: number, route: FileExplorerRoute
    this.route.pop()
    route = this.route[this.route.length - 1]
    page = route ? route.pageIndex : this.root.pageIndex
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
        if (content.metadata && content.metadata.url) {
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

  openDirectory(content: FileExplorerContent): void {
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
      this.accountName = account
        ? `${account.firstName} ${account.lastName}`
        : ''
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
  }
}
