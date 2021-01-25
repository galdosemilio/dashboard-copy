import { chain, fromPairs } from 'lodash'
import { Observable } from 'rxjs'
import { map } from 'rxjs/operators'

import {
  ContentCopiedEvent,
  FileExplorerContent
} from '@app/dashboard/content/models'
import { ContextService, NotifierService } from '@app/service'
import { _, bufferedRequests, TableDataSource } from '@app/shared'
import {
  ContentSingle,
  CreateContentPackageRequest,
  CreateContentRequest,
  DeleteContentPackageRequest,
  Entity,
  GetAllContentPackageResponse,
  GetAllContentRequest,
  GetAllContentResponse,
  GetUploadUrlContentRequest,
  GetUploadUrlContentResponse,
  UpdateContentRequest
} from '@coachcare/npm-api'
import { FileExplorerDatabase } from './file-explorer.database'

interface ExecRequestOpts {
  omitLoading: boolean
}

export class FileExplorerDatasource extends TableDataSource<
  FileExplorerContent,
  GetAllContentResponse,
  GetAllContentRequest
> {
  public get parentId(): string {
    return this.criteria.parentId
  }

  showEmpty = () => {
    if (this.criteria.parentId) {
      return _('NOTIFY.SOURCE.NO_CONTENT_SUBFOLDER')
    }
    return _('NOTIFY.SOURCE.NO_CONTENT_AVAILABLE')
  }

  public next: number

  constructor(
    protected context: ContextService,
    protected notify: NotifierService,
    protected database: FileExplorerDatabase
  ) {
    super()
    this.pageSize = 100
    this.addDefault({ limit: this.pageSize })
  }

  disconnect() {}

  defaultFetch(): GetAllContentResponse {
    return { data: [], pagination: {} }
  }

  fetch(criteria: GetAllContentRequest): Observable<GetAllContentResponse> {
    return this.database.fetch(criteria)
  }

  async mapResult(
    result: GetAllContentResponse
  ): Promise<FileExplorerContent[]> {
    this.total = result.pagination.next
      ? result.pagination.next + 1
      : this.criteria.offset + result.data.length

    this.next = result.pagination.next

    const ids = chain(result.data).map('organization.id').uniq().value()

    const perms = fromPairs(
      await Promise.all(
        ids.map(async (id) => [id, await this.context.orgHasPerm(id, 'admin')])
      )
    )

    let fileExplorerSortOrder = 0
    const opts = { organizationId: this.context.organizationId }
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
              this.context.organization.permissions.admin &&
              this.context.organization.isDirect &&
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

  public async copyContent(
    args: ContentCopiedEvent
  ): Promise<FileExplorerContent> {
    try {
      const copiedSingle = await this.database
        .copyContent({
          id: args.content.id,
          organization: args.organizationId || this.context.organizationId,
          parentId: args.to || undefined,
          mode: args.overrideDetails.isPublic ? 'public' : 'private'
        })
        .toPromise()

      const contentPackages =
        args.overrideDetails.packages && args.overrideDetails.packages.length
          ? args.overrideDetails.packages.slice()
          : []

      const packagePromises = []

      if (contentPackages && contentPackages.length) {
        while (contentPackages.length) {
          const p = contentPackages.pop()
          packagePromises.push(
            this.createContentPackage({
              id: copiedSingle.id,
              package: p.id
            })
          )
        }

        await bufferedRequests(packagePromises)
      }

      const { name, ...updateParams } = {
        ...copiedSingle,
        ...args.overrideDetails
      }

      return await this.updateContent(updateParams)
    } catch (error) {
      return Promise.reject(error)
    }
  }

  createContent(
    args: CreateContentRequest,
    execRequestOpts: ExecRequestOpts = { omitLoading: false }
  ): Promise<FileExplorerContent> {
    const opts = {
      organizationId: this.context.organization.id
    }
    return this.execRequest(
      this.database
        .createContent(args)
        .pipe(
          map(
            (content: ContentSingle) => new FileExplorerContent(content, opts)
          )
        )
        .toPromise(),
      execRequestOpts
    )
  }

  createContentPackage(
    args: CreateContentPackageRequest,
    execRequestOpts: ExecRequestOpts = { omitLoading: false }
  ): Promise<void> {
    return this.execRequest(
      this.database.createContentPackage(args).toPromise(),
      execRequestOpts
    )
  }

  updateContent(args: UpdateContentRequest): Promise<FileExplorerContent> {
    const opts = {
      organizationId: this.context.organization.id
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
    return this.execRequest(
      this.database
        .getAllContentPackage(args)
        .pipe(map((response: GetAllContentPackageResponse) => response.data))
        .toPromise()
    )
  }

  getChildDatasource(): FileExplorerDatasource {
    const source: FileExplorerDatasource = new FileExplorerDatasource(
      this.context,
      this.notify,
      this.database
    )
    source.addDefault(this.defaults)
    return source
  }

  getDownloadUrl(args: Entity): Promise<any> {
    return this.execRequest(
      new Promise<void>((resolve) => resolve())
    )
  }

  getUploadUrl(
    args: GetUploadUrlContentRequest
  ): Promise<GetUploadUrlContentResponse> {
    return this.execRequest(this.database.getUploadUrl(args).toPromise(), {
      omitLoading: true
    })
  }

  hasParentIdSet(): boolean {
    return this.criteria.parentId !== undefined
  }

  private execRequest(
    promise: Promise<any>,
    execRequestOpts: ExecRequestOpts = { omitLoading: false }
  ): Promise<any> {
    return new Promise<any>(async (resolve, reject) => {
      this.isLoading = !execRequestOpts.omitLoading
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
