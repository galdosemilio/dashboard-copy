import { Component, HostBinding, Input } from '@angular/core'
import { AccountProvider } from '@coachcare/npm-api'

import { EventsService, NotifierService } from '@app/service'
import { AvatarSubmitRequest } from '@coachcare/npm-api'
import { _ } from '@app/shared/utils'

@Component({
  selector: 'ccr-avatar',
  templateUrl: './avatar.component.html'
})
export class CcrAvatarComponent {
  @Input() account: string
  @Input() size: string

  @HostBinding('class.ccr-editable')
  @Input()
  editable = false

  constructor(
    private api: AccountProvider,
    private bus: EventsService,
    private notifier: NotifierService
  ) {}

  uploadAvatar(e) {
    const file = e.target.files ? e.target.files[0] : null

    if (file) {
      const reader = new FileReader()
      reader.onload = this.handleUpload.bind(this)
      reader.readAsBinaryString(file)
    }
  }

  private handleUpload(e) {
    const request: AvatarSubmitRequest = {
      client: this.account,
      avatar: btoa(e.target.result)
    }
    this.api
      .submitAvatar(request)
      .then(() => this.bus.trigger('user.avatar', this.account))
      .catch(() => this.notifier.error(_('NOTIFY.ERROR.AVATAR_UPLOAD_FAILED')))
  }
}
