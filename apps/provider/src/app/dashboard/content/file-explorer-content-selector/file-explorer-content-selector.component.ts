import {
  Component,
  forwardRef,
  Input,
  OnDestroy,
  OnInit,
  Output,
  ViewChild
} from '@angular/core'
import { FormBuilder, FormGroup } from '@angular/forms'
import { VaultDatabase, VaultDatasource } from '@app/dashboard/accounts'
import {
  CONTENT_TYPE_MAP,
  FileExplorerBaseOptions,
  FileExplorerContent,
  FileExplorerEvents
} from '@app/dashboard/content/models'
import {
  FileExplorerDatabase,
  FileExplorerDatasource
} from '@app/dashboard/content/services'
import { ContextService, NotifierService } from '@app/service'
import { _, BindForm, BINDFORM_TOKEN } from '@app/shared'
import { TranslateService } from '@ngx-translate/core'
import * as moment from 'moment'
import { BehaviorSubject, Subscription } from 'rxjs'
import { FileExplorerListComponent } from '../file-explorer-list/file-explorer-list.component'

@Component({
  selector: 'app-content-file-explorer-content-selector',
  templateUrl: './file-explorer-content-selector.component.html',
  styleUrls: ['./file-explorer-content-selector.component.scss'],
  providers: [
    {
      provide: BINDFORM_TOKEN,
      useExisting: forwardRef(() => FileExplorerContentSelectorComponent)
    }
  ]
})
export class FileExplorerContentSelectorComponent
  implements BindForm, OnDestroy, OnInit {
  @Input() mode: 'digital-library' | 'vault'
  @Input()
  opts: any = {
    disableForeignContent: false,
    shouldShowRootFolderButton: false,
    whitelistedContentTypes: []
  }
  @Input() organization: any

  @Output()
  contentSelected: BehaviorSubject<FileExplorerContent> = new BehaviorSubject<
    FileExplorerContent
  >(undefined)

  @ViewChild(FileExplorerListComponent, { static: true })
  fileExplorerList: FileExplorerListComponent

  public datasource: FileExplorerDatasource | VaultDatasource
  public events: FileExplorerEvents = new FileExplorerEvents()
  public form: FormGroup
  public listOptions: FileExplorerBaseOptions = {
    enableDrag: false,
    enableDrop: false,
    whitelistedContentTypes: [CONTENT_TYPE_MAP.folder.code]
  }

  private contentSelectedSubscription: Subscription
  private rootFolderContent: FileExplorerContent = {
    id: null,
    name: 'Root Folder',
    type: CONTENT_TYPE_MAP.folder,
    organization: {
      id: this.context.organization.id,
      name: this.context.organization.name
    },
    isForeign: false,
    isFolder: true,
    icon: CONTENT_TYPE_MAP.folder.icon,
    createdAt: moment().toISOString(),
    isPublic: false,
    description: ''
  }

  constructor(
    public context: ContextService,
    private database: FileExplorerDatabase,
    private vaultDatabase: VaultDatabase,
    private formBuilder: FormBuilder,
    private notifier: NotifierService,
    private translateService: TranslateService
  ) {}

  ngOnDestroy(): void {
    if (this.contentSelectedSubscription) {
      this.contentSelectedSubscription.unsubscribe()
    }
  }

  async ngOnInit(): Promise<void> {
    if (this.organization) {
      this.rootFolderContent.organization = this.organization
    }

    this.createDatasource()
    this.createForm()
    this.subscribeToEvents()

    const translations = await this.translateService
      .get([_('LIBRARY.CONTENT.ROOT')])
      .toPromise()
    this.rootFolderContent.name = translations['LIBRARY.CONTENT.ROOT']

    if (this.opts.shouldShowRootFolderButton) {
      this.events.contentSelected.emit(this.rootFolderContent)
    }

    if (
      this.opts.whitelistedContentTypes &&
      this.opts.whitelistedContentTypes.length
    ) {
      this.listOptions.whitelistedContentTypes = this.opts.whitelistedContentTypes
    }

    this.listOptions = {
      ...this.listOptions,
      disableForeign:
        this.opts.disableForeignContent !== undefined
          ? this.opts.disableForeignContent
          : false
    }
  }

  selectRootFolder(): void {
    this.fileExplorerList.reset()
    this.events.contentSelected.emit(this.rootFolderContent)
  }

  private createDatasource(): void {
    if (this.mode === 'vault') {
      this.datasource = new VaultDatasource(
        this.context,
        this.notifier,
        this.vaultDatabase
      )
      this.datasource.addDefault({ account: this.context.accountId })
    } else {
      this.datasource = new FileExplorerDatasource(
        this.context,
        this.notifier,
        this.database
      )
    }

    this.datasource.addRequired(this.context.organization$, () => {
      return {
        organization: this.organization
          ? this.organization.id
          : this.context.organization.id
      }
    })
  }

  private createForm(): void {
    this.form = this.formBuilder.group({
      selectedContent: [undefined]
    })
  }

  private subscribeToEvents(): void {
    this.events.contentSelected.subscribe((content: FileExplorerContent) => {
      this.form.patchValue({
        selectedContent: content
      })
      this.contentSelected.next(content)
    })
  }
}
