import {
  HttpClient,
  HttpEvent,
  HttpEventType,
  HttpHeaders
} from '@angular/common/http'
import {
  ChangeDetectorRef,
  Component,
  EventEmitter,
  HostBinding,
  Inject,
  Input,
  OnInit,
  Output,
  ViewChild
} from '@angular/core'
import { OrganizationPreference, SignedUrl } from '@coachcare/npm-api'
import { LogoDirective } from '@coachcare/common/directives'
import { NotifierService } from '@coachcare/common/services'
import { APP_ENVIRONMENT, AppEnvironment } from '@coachcare/common/shared'
import { Observable, Subscription } from 'rxjs'
import * as parseUrl from 'url-parse'

export interface LogoComponentOutput {
  logoUrl: string
  logoFilename: string
  logoBaseUrl: string
}

@Component({
  selector: 'ccr-logo',
  templateUrl: './logo.component.html'
})
export class LogoComponent implements OnInit {
  @Input() id: string // organization id
  @Input() url: string // logo url
  @Input() name = 'logo' // file upload name
  @Input() size: string
  @Input() fileName: string

  @HostBinding('class.ccr-editable')
  @Input()
  editable = false

  @Output() change = new EventEmitter<any>()

  @ViewChild('logo', { static: false })
  logo: LogoDirective

  logoUrl: string
  uploading = false
  subscription: Subscription

  constructor(
    @Inject(APP_ENVIRONMENT) private environment: AppEnvironment,
    private cdr: ChangeDetectorRef,
    private http: HttpClient,
    private api: OrganizationPreference,
    private notifier: NotifierService
  ) {}

  ngOnInit() {
    this.logoUrl = this.url
  }

  async startUpload(e: any) {
    try {
      const file = e.target.files ? e.target.files[0] : null

      if (file) {
        const ext = file.name.split('.').pop()
        const filename = `${this.name || 'logo'}.${ext}`

        const assets = await this.api.createAssets({
          id: this.id || '',
          assets: [{ name: filename }]
        })
        const signed: SignedUrl = assets.urls[0]

        const parsed = parseUrl(signed.url, {}, false)

        const fileName = parsed.pathname.split('/').pop() as string
        const logoBaseUrl = this.environment.cdn
        const logoUrl = logoBaseUrl + '/' + fileName

        this.uploading = true
        this.cdr.detectChanges()

        this.subscription = this.handleUpload({
          mimeType: file.type,
          body: file,
          uploadUrl: signed.url
        }).subscribe((event: HttpEvent<any>) => {
          if (event.type === HttpEventType.Response) {
            if (event.status === 200) {
              this.change.emit({
                logoUrl,
                [this.fileName]: fileName,
                logoBaseUrl
              })
              this.logoUrl = logoUrl + '?' + new Date().getTime()
              this.stopUpload()
            }
          }
        })
      }
    } catch (error) {
      this.notifier.error(error)
    }
  }

  stopUpload() {
    if (this.subscription) {
      this.subscription.unsubscribe()
      delete this.subscription
    }
    this.uploading = false
    this.cdr.detectChanges()
  }

  private handleUpload(args: any): Observable<HttpEvent<any>> {
    const headers = new HttpHeaders().append('Content-Type', args.mimeType)

    return this.http.request('PUT', args.uploadUrl, {
      body: args.body,
      headers: headers,
      reportProgress: false,
      responseType: 'text',
      observe: 'events'
    })
  }
}
