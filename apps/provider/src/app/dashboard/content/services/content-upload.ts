import {
  HttpClient,
  HttpEvent,
  HttpEventType,
  HttpHeaders
} from '@angular/common/http'
import { EventEmitter, Injectable } from '@angular/core'
import { VaultDatasource } from '@app/dashboard/accounts'
import {
  CONTENT_TYPE_MAP,
  ContentFile,
  ContentUpload,
  ContentUploadTicket,
  FileExplorerContent,
  FileExplorerContentMetadata,
  QueuedContent
} from '@app/dashboard/content/models'
import { FileExplorerDatasource } from '@app/dashboard/content/services/file-explorer.datasource'
import { ContextService } from '@app/service'
import { BehaviorSubject, Observable } from 'rxjs'

@Injectable()
export class ContentUploadService {
  public contentAdded$: EventEmitter<FileExplorerContent> = new EventEmitter<
    FileExplorerContent
  >()
  public organization: any
  public uploads: ContentUpload[] = []
  public uploads$: BehaviorSubject<ContentUpload[]> = new BehaviorSubject<
    ContentUpload[]
  >([])
  public visibleUploads$: BehaviorSubject<
    ContentUpload[]
  > = new BehaviorSubject<ContentUpload[]>([])
  public source: FileExplorerDatasource | VaultDatasource

  private uploadProgressInterval: any
  private ticketMatureTime = 3000

  constructor(private context: ContextService, private http: HttpClient) {
    this.visibleUploads$.subscribe((uploads: ContentUpload[]) => {
      if (!uploads.length) {
        this.uploads = []
      }
    })
  }

  cancelAllContentUploads(): void {
    this.uploads
      .filter((upload: ContentUpload) => upload.progress < 100 && !upload.error)
      .forEach((upload: ContentUpload) => {
        if (upload.subscription) {
          upload.subscription.unsubscribe()
        }

        if (upload.id) {
          this.requestContentDeletion(upload.id)
        }
      })

    this.uploads = []
    this.emitUploads()
  }

  async createContents(contents: QueuedContent[]): Promise<void> {
    try {
      const contentsArray = contents.slice()

      while (contentsArray.length) {
        const content = contentsArray.shift()

        const ticket: ContentUploadTicket = {
          number: this.uploads.length,
          contentUpload: this.getContentUploadInstance(content),
          queuedContent: content
        }
        this.uploads.push(ticket.contentUpload)
        await this.uploadContent(ticket)

        this.startUploadProgressInterval()
      }
    } catch (error) {
      console.error(error)
    }
  }

  hasPendingUploads(): boolean {
    return !!this.uploads.find(
      (up: ContentUpload) => up.progress < 100 && !up.error
    )
  }

  removeContentUpload(index: number): void {
    this.uploads[index].hidden = true
    this.emitUploads()
  }

  requestContentCreation(
    ticket: ContentUploadTicket,
    reportProgress: boolean = true
  ): Promise<FileExplorerContent> {
    return new Promise<FileExplorerContent>(async (resolve, reject) => {
      try {
        const ticketContent = ticket.contentUpload.content
        const content: FileExplorerContent = await this.source.createContent(
          {
            account: this.context.accountId,
            createdBy: this.context.user.id,
            organization: this.organization
              ? this.organization.id
              : this.context.organization.id,
            name: ticketContent.name,
            description: ticketContent.description,
            isPublic: ticketContent.isPublic,
            type: ticketContent.type.id,
            metadata: ticketContent.metadata,
            parentId: ticketContent.parentId,
            parent: ticketContent.parentId || ticketContent.parent
          },
          { omitLoading: true }
        )

        if (ticketContent.packages && ticketContent.packages.length) {
          while (ticketContent.packages.length) {
            const p = ticketContent.packages.pop()
            await this.source.createContentPackage(
              {
                id: content.id,
                package: p.id
              },
              { omitLoading: true }
            )
          }
        }

        if (reportProgress) {
          this.uploads[ticket.number].progress = 100
        }

        this.contentAdded$.emit(content)
        resolve(content)
      } catch (error) {
        if (this.uploads[ticket.number]) {
          this.uploads[ticket.number].error = error
        }
        reject(error)
      }
    })
  }

  private emitUploads(): void {
    this.visibleUploads$.next(
      this.uploads.filter(
        (upload: ContentUpload) =>
          !upload.hidden || (upload.hidden && !upload.mature)
      )
    )
    this.uploads$.next(this.uploads)
  }

  private getContentUploadInstance(content: QueuedContent): ContentUpload {
    const contentUpload: ContentUpload = {
      progress: 0,
      error: '',
      content: undefined
    }

    switch (content.type.code) {
      case CONTENT_TYPE_MAP.file.code:
        contentUpload.content = new ContentFile(
          Object.assign(
            { ...content.details },
            {
              file: content.file,
              type: content.type,
              parentId: content.destination.id
            }
          )
        )
        break

      case CONTENT_TYPE_MAP.hyperlink.code:
        contentUpload.content = new FileExplorerContent(
          Object.assign(
            { ...content.details },
            { metadata: { url: content.url }, parentId: content.destination.id }
          )
        )
        break

      case CONTENT_TYPE_MAP.youtube.code:
        contentUpload.content = new FileExplorerContent(
          Object.assign(
            { ...content.details },
            {
              metadata: {
                url: content.url,
                content: `<iframe src="${content.url}" style="height:100%;width:100%;" allowfullscreen></iframe>`
              },
              parentId: content.destination.id
            }
          )
        )
        break

      default:
        contentUpload.content = new FileExplorerContent(
          Object.assign(
            { ...content.details },
            { parentId: content.destination.id }
          )
        )
        break
    }

    return contentUpload
  }

  private startUploadProgressInterval(): void {
    if (this.uploadProgressInterval !== undefined) {
      return
    }

    this.uploadProgressInterval = setInterval(() => {
      const finishedUploads: ContentUpload[] = [],
        maturableUploads: ContentUpload[] = []

      this.uploads.forEach((upload: ContentUpload) => {
        if (upload.progress === 100 && !upload.error) {
          upload.hidden = true
          finishedUploads.push(upload)
          maturableUploads.push(upload)
        } else if (upload.error) {
          upload.mature = true
        }
      })

      this.emitUploads()

      if (maturableUploads.length) {
        setTimeout(() => {
          maturableUploads.forEach((mU: ContentUpload) => (mU.mature = true))
          this.emitUploads()
        }, this.ticketMatureTime)
      }

      if (finishedUploads.length >= this.uploads.length) {
        this.stopUploadProgressInterval()
      }
    }, 800)
  }

  private stopUploadProgressInterval(): void {
    if (this.uploadProgressInterval === undefined) {
      return
    }

    clearInterval(this.uploadProgressInterval)
    this.uploadProgressInterval = undefined
  }

  private async uploadContent(ticket: ContentUploadTicket): Promise<void> {
    switch (ticket.queuedContent.type.code) {
      case CONTENT_TYPE_MAP.file.code:
        await this.createAsFile(ticket)
        break
      case CONTENT_TYPE_MAP.hyperlink.code:
      case CONTENT_TYPE_MAP.youtube.code:
        await this.createAsHyperlink(ticket)
        break
      default:
        await this.createAsDefault(ticket)
        break
    }
  }

  private async createAsFile(ticket: ContentUploadTicket): Promise<void> {
    try {
      const response: FileExplorerContentMetadata = await this.source.getUploadUrl(
          {
            filename: ticket.contentUpload.content.name
          }
        ),
        paramIndex = response.url.indexOf('?')

      ticket.contentUpload.content.metadata = Object.assign({}, response, {
        url: response.url.substring(
          0,
          paramIndex > -1 ? paramIndex : response.url.length
        ),
        size: ticket.queuedContent.file.size
      })

      ticket.contentUpload.id = (
        await this.requestContentCreation(ticket, false)
      ).id
      ticket.contentUpload.subscription = this.requestFileUpload({
        body: ticket.queuedContent.file,
        mimeType: response.mimeType,
        uploadUrl: response.url
      }).subscribe((event: any) => {
        switch (event.type) {
          case HttpEventType.UploadProgress:
            this.uploads[ticket.number].progress =
              (event.loaded * 100) / event.total
            break
          case HttpEventType.ResponseHeader:
            if (!event.ok) {
              throw new Error('Upload failed')
            }
            break
        }
      })
    } catch (error) {
      if (ticket.contentUpload.id) {
        this.requestContentDeletion(ticket.contentUpload.id)
      }
      this.uploads[ticket.number].error = error
    }
  }

  private createAsHyperlink(
    ticket: ContentUploadTicket
  ): Promise<FileExplorerContent> {
    const ticketContent = ticket.contentUpload.content
    ticketContent.type = CONTENT_TYPE_MAP.file
    ticketContent.metadata = Object.assign(
      { ...ticketContent.metadata },
      { mimeType: 'text/html' }
    )
    ticket.contentUpload.content = ticketContent
    return this.requestContentCreation(ticket).catch(
      (error) => (this.uploads[ticket.number].error = error)
    )
  }

  private createAsDefault(
    ticket: ContentUploadTicket
  ): Promise<FileExplorerContent> {
    return this.requestContentCreation(ticket)
  }

  private requestContentDeletion(id: string): Promise<void> {
    return new Promise<void>(async (resolve, reject) => {
      try {
        await this.source.deleteContent(id)
      } catch (error) {
        reject(error)
      }
    })
  }

  private requestFileUpload(args: any): Observable<HttpEvent<any>> {
    const headers = new HttpHeaders().append('Content-Type', args.mimeType)

    return this.http.request('PUT', args.uploadUrl, {
      body: args.body,
      headers: headers,
      reportProgress: true,
      responseType: 'text',
      observe: 'events'
    })
  }
}
