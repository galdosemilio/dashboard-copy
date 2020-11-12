import { Directive, HostBinding, HostListener, Input } from '@angular/core'

@Directive({
  selector: 'img[ccrLogo]',
  exportAs: 'ccrLogo'
})
export class LogoDirective {
  @HostBinding('src') src: string

  @Input() default = '/assets/logo-organization.png'

  url: string

  constructor() {}

  @Input()
  set ccrLogo(url: string) {
    this.url = url
    this.refresh()
  }

  @HostListener('error')
  onError() {
    this.src = this.default
  }

  refresh() {
    this.src = this.url || this.default
  }
}
