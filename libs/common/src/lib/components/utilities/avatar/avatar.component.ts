import { HttpClient, HttpHeaders } from '@angular/common/http'
import { Component, HostBinding, Input } from '@angular/core'
import { EventsService, NotifierService } from '@coachcare/common/services'
import { _ } from '@coachcare/common/shared'
import { AccountProvider } from '@coachcare/sdk'

@Component({
  selector: 'ccr-avatar',
  templateUrl: './avatar.component.html'
})
export class CcrAvatarComponent {
  @Input() account: string
  @Input() size: 'big' | 'bigger' | 'giant' | 'messages'

  @HostBinding('class.ccr-editable')
  @Input()
  editable = false

  constructor(
    private api: AccountProvider,
    private bus: EventsService,
    private notifier: NotifierService,
    private http: HttpClient
  ) {}

  public async uploadAvatar(e) {
    const file = e.target.files ? e.target.files[0] : null

    if (!file) {
      return
    }

    try {
      const avatar = await this.api.getAvatar(this.account)

      if (avatar?.url) {
        await this.api.deleteAvatar(this.account)
      }

      const { url } = await this.api.uploadAvatar(this.account)

      await this.requestFileUpload(url, file).toPromise()

      this.bus.trigger('user.avatar', this.account)
    } catch (err) {
      this.notifier.error(_('NOTIFY.ERROR.AVATAR_UPLOAD_FAILED'))
    }
  }

  private requestFileUpload(url: string, file: File) {
    const headers = new HttpHeaders().append('Content-Type', 'image/jpeg')
    return this.http.request('PUT', url, {
      body: file,
      headers: headers,
      responseType: 'text',
      observe: 'events'
    })
  }
}
