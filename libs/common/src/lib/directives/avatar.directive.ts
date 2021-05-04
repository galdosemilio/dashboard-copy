import { ChangeDetectorRef, Directive, HostBinding, Input } from '@angular/core'
import { ApiService } from '@coachcare/sdk'
import { EventsService } from '../services'

@Directive({
  selector: 'img[ccrAvatar]',
  exportAs: 'ccrAvatar',
  host: {
    '(error)': 'onError()'
  }
})
export class CcrAvatarDirective {
  account: string

  @HostBinding('src')
  src: string

  @Input()
  default = '../assets/avatar.png'

  constructor(
    private cdr: ChangeDetectorRef,
    private api: ApiService,
    private bus: EventsService
  ) {
    this.bus.register('user.avatar', (id: string) => {
      if (id === this.account) {
        this.refresh(true)
        this.cdr.detectChanges()
      }
    })
  }

  @Input()
  set ccrAvatar(account) {
    this.account = account
    this.refresh()
  }

  onError() {
    this.src = this.default
  }

  refresh(force = false) {
    this.src = this.account
      ? this.api.getUrl(
          `/account/${this.account}/avatar` + (force ? `?${+new Date()}` : ''),
          '2.0'
        )
      : this.default
  }
}
