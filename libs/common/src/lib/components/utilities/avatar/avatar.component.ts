import { Component, HostBinding, Input, ViewChild } from '@angular/core'
import { AccountAvatar, SubmitAccountAvatarRequest } from '@coachcare/npm-api'
import { _ } from '@coachcare/common/shared'
import { AvatarDirective } from '@coachcare/common/directives'
import { NotifierService } from '@coachcare/common/services'

@Component({
  selector: 'ccr-avatar',
  templateUrl: './avatar.component.html'
})
export class AvatarComponent {
  @Input() account: string
  @Input() size: string

  @HostBinding('class.ccr-editable')
  @Input()
  editable = false

  @ViewChild('avatar', { static: false })
  avatar: AvatarDirective

  constructor(private api: AccountAvatar, private notifier: NotifierService) {}

  uploadAvatar(e: any) {
    const file = e.target.files ? e.target.files[0] : null

    if (file) {
      const reader = new FileReader()
      reader.onload = this.handleUpload.bind(this)
      reader.readAsBinaryString(file)
    }
  }

  private handleUpload(e: any) {
    const request: SubmitAccountAvatarRequest = {
      id: this.account,
      avatar: btoa(e.target.result)
    }
    this.api
      .submit(request)
      .then(() => this.avatar.refresh(true))
      .catch(() => this.notifier.error(_('NOTIFY.ERROR.AVATAR_UPLOAD_FAILED')))
  }
}
