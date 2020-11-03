import { chain, fromPairs } from 'lodash'
import { Observable } from 'rxjs'
import { map } from 'rxjs/operators'

import {
  ContentCopiedEvent,
  FileExplorerContent
} from '@app/dashboard/content/models'
import { ContextService, NotifierService } from '@app/service'
import { _, TableDataSource } from '@app/shared'
import {
  ContentSingle,
  CreateContentPackageRequest,
  CreateVaultContentRequest,
  DeleteContentPackageRequest,
  Entity,
  GetAllVaultContentRequest,
  GetAllVaultContentResponse,
  GetUploadUrlContentRequest,
  GetUploadUrlContentResponse,
  UpdateContentRequest
} from '@app/shared/selvera-api'
import { VaultDatabase } from './vault.database'

export class VaultDatasource extends TableDataSource<
  FileExplorerContent,
  GetAllVaultContentResponse,
  GetAllVaultContentRequest
> {
  public get parentId(): string {
    return this.criteria.parent
  }

  showEmpty = () => {
    if (this.criteria.parent) {
      return _('NOTIFY.SOURCE.NO_CONTENT_SUBFOLDER')
    }
    return _('NOTIFY.SOURCE.NO_CONTENT_AVAILABLE')
  }

  public next: number

  constructor(
    protected context: ContextService,
    protected notify: NotifierService,
    protected database: VaultDatabase
  ) {
    super()
    this.pageSize = 100
    this.addDefault({ limit: this.pageSize })
  }

  disconnect() {}

  defaultFetch(): GetAllVaultContentResponse {
    return { data: [], pagination: {} }
  }

  fetch(
    criteria: GetAllVaultContentRequest
  ): Observable<GetAllVaultContentResponse> {
    return this.database.fetch(criteria)
  }

  async mapResult(
    result: GetAllVaultContentResponse
  ): Promise<FileExplorerContent[]> {
    this.total = result.pagination.next
      ? result.pagination.next + 1
      : this.criteria.offset + result.data.length

    this.next = result.pagination.next

    const ids = chain(result.data).map('organization.id').uniq().value()

    const perms = fromPairs(
      await Promise.all(
        ids.map(async (id) => [
          id,
          await this.context.orgHasPerm(id, 'allowClientPhi')
        ])
      )
    )

    let fileExplorerSortOrder = 0
    const opts = { organizationId: this.criteria.organization }
    const data = result.data
      .map((r: ContentSingle) => {
        const localSortOrder = r.sortOrder ? false : true
        fileExplorerSortOrder = r.sortOrder
          ? r.sortOrder
          : ++fileExplorerSortOrder
        return new FileExplorerContent(
          {
            ...r,
            localSortOrder: localSortOrder,
            sortOrder: fileExplorerSortOrder,
            isAdmin:
              this.context.organization.permissions.allowClientPhi &&
              perms[r.organization.id]
          },
          opts
        )
      })
      .sort((prev, next) => {
        if (prev.sortOrder > next.sortOrder) {
          return 1
        } else if (prev.sortOrder < next.sortOrder) {
          return -1
        } else {
          return 0
        }
      })
      .sort((prev, next) => {
        if (prev.isForeign && !next.isForeign) {
          return -1
        } else if (
          (prev.isForeign && next.isForeign) ||
          (!prev.isForeign && !next.isForeign)
        ) {
          return 0
        } else if (!prev.isForeign && next.isForeign) {
          return 1
        }
      })

    data.forEach((content: FileExplorerContent, index: number) => {
      if (content.isForeign && data[index + 1] && !data[index + 1].isForeign) {
        content.isLastForeign = true
      }
    })

    return data
  }

  copyContent(args: ContentCopiedEvent): Promise<FileExplorerContent> {
    return Promise.reject('This action is not supported')
  }

  createContent(args: CreateVaultContentRequest): Promise<FileExplorerContent> {
    const opts = {
      organizationId: this.criteria.organization
    }
    return this.execRequest(
      this.database
        .createContent({
          ...args,
          account: this.context.accountId,
          createdBy: this.context.user.id
        })
        .pipe(
          map(
            (content: ContentSingle) => new FileExplorerContent(content, opts)
          )
        )
        .toPromise()
    )
  }

  createContentPackage(args: CreateContentPackageRequest): Promise<void> {
    return this.execRequest(
      this.database.createContentPackage(args).toPromise()
    )
  }

  updateContent(args: UpdateContentRequest): Promise<FileExplorerContent> {
    const opts = {
      organizationId: this.criteria.organization
    }
    return this.execRequest(
      this.database
        .updateContent(args, opts)
        .pipe(
          map(
            (content: FileExplorerContent) => new FileExplorerContent(content)
          )
        )
        .toPromise()
    )
  }

  deleteContent(id: string): Promise<void> {
    return this.execRequest(this.database.deleteContent({ id: id }).toPromise())
  }

  deleteContentPackage(args: DeleteContentPackageRequest): Promise<void> {
    return this.execRequest(
      this.database.deleteContentPackage(args).toPromise()
    )
  }

  getAllContentPackage(args: Entity): Promise<Entity[]> {
    return new Promise<Entity[]>((resolve) => {
      resolve([])
    })
  }

  getChildDatasource(): VaultDatasource {
    const source: VaultDatasource = new VaultDatasource(
      this.context,
      this.notify,
      this.database
    )
    source.addDefault(this.defaults)
    return source
  }

  getDownloadUrl(args: Entity): Promise<any> {
    return this.execRequest(this.database.getDownloadUrl(args).toPromise())
  }

  getUploadUrl(
    args: GetUploadUrlContentRequest
  ): Promise<GetUploadUrlContentResponse> {
    return this.execRequest(this.database.getUploadUrl(args).toPromise())
  }

  hasParentIdSet(): boolean {
    return this.criteria.parent !== undefined
  }

  private execRequest(promise: Promise<any>): Promise<any> {
    return new Promise<any>(async (resolve, reject) => {
      this.isLoading = true
      this.change$.next()

      try {
        const response = await promise
        resolve(response)
      } catch (error) {
        this.notify.error(error)
        reject(error)
      } finally {
        this.isLoading = false
        this.change$.next()
      }
    })
  }
}
