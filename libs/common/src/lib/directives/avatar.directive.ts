import { Directive, HostBinding, HostListener, Input } from '@angular/core'
import { ApiService } from '@coachcare/npm-api'
import { ConfigService } from '@coachcare/common/services'

@Directive({
  selector: 'img[ccrAvatar]',
  exportAs: 'ccrAvatar'
})
export class AvatarDirective {
  @HostBinding('src') src: string

  @Input() default: string = this.config.get('api.avatar.default')

  account: string | number
  private path: string

  constructor(private api: ApiService, private config: ConfigService) {
    this.path = config.get('api.avatar.path')
  }

  @Input()
  set ccrAvatar(account: string | number) {
    this.account = account
    this.refresh()
  }

  @HostListener('error')
  onError() {
    this.src = this.default
  }

  refresh(force = false) {
    this.src = this.account
      ? this.api.getUrl(
          this.path.replace(/:id/g, this.account.toString()) +
            (force ? `?${+new Date()}` : ''),
          '2.0'
        )
      : this.default
  }
}
