import { ChangeDetectorRef, Directive, HostBinding, Input } from '@angular/core'
import { AccountProvider } from '@coachcare/sdk'
import { EventsService } from '../services'

@Directive({
  selector: 'img[ccrAvatar]',
  exportAs: 'ccrAvatar',
  host: {
    '(error)': 'onError()'
  }
})
export class CcrAvatarDirective {
  accountId: string

  @HostBinding('src')
  src: string

  @Input()
  default = '/assets/avatar.png'

  constructor(
    private cdr: ChangeDetectorRef,
    private bus: EventsService,
    private account: AccountProvider
  ) {
    this.bus.register('user.avatar', (id: string) => {
      if (id === this.accountId) {
        this.refresh()
        this.cdr.detectChanges()
      }
    })
  }

  @Input()
  set ccrAvatar(accountId) {
    this.accountId = accountId
    this.refresh()
  }

  onError() {
    this.src = this.default
  }

  async refresh() {
    this.src =
      (this.accountId && (await this.account.getAvatar(this.accountId)).url) ||
      this.default
  }
}
