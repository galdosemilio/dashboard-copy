import {
  Directive,
  ElementRef,
  EventEmitter,
  HostListener,
  Input,
  OnInit,
  Output,
  Renderer2
} from '@angular/core'
import { Router } from '@angular/router'
import { AccountTypeId } from '@coachcare/sdk'
import { environment } from 'apps/provider/src/environments/environment'

@Directive({
  selector: '[ccrAccountLink]'
})
export class CcrAccountLinkDirective implements OnInit {
  @Input()
  accountType: AccountTypeId

  @Input()
  allowLinkingBlank: boolean = false

  @Input()
  set ccrAccountLink(accountId) {
    this.accountId = accountId
  }

  @Output()
  onOpen: EventEmitter<void> = new EventEmitter<void>()

  @HostListener('click', ['$event'])
  public clickEvent(): void {
    const prefixUrl = environment.production ? '/provider' : ''

    switch (this.accountType) {
      case AccountTypeId.Client:
        void this.router.navigate([
          `${prefixUrl}/accounts/patients`,
          this.accountId
        ])
        this.onOpen.emit()
        break
      case AccountTypeId.Provider:
        void this.router.navigate([
          `${prefixUrl}/accounts/coaches`,
          this.accountId
        ])
        this.onOpen.emit()
        break
      default:
        break
    }
  }

  private accountId: string

  constructor(
    private el: ElementRef,
    private renderer: Renderer2,
    protected router: Router
  ) {
    this.el.nativeElement.style.cursor = 'pointer'
    this.onOpenLink = this.onOpenLink.bind(this)
  }

  public ngOnInit(): void {
    if (this.allowLinkingBlank) {
      this.appendOpenIcon()
    }
  }

  private appendOpenIcon(): void {
    const openIcon = this.renderer.createElement('mat-icon')
    this.renderer.appendChild(openIcon, this.renderer.createText('launch'))
    this.renderer.addClass(openIcon, 'mat-icon')
    this.renderer.addClass(openIcon, 'material-icons')

    openIcon.addEventListener('click', this.onOpenLink)

    this.renderer.appendChild(this.el.nativeElement, openIcon)
  }

  private onOpenLink(event: Event): void {
    event.stopPropagation()
    const origin = window.location.origin

    switch (this.accountType) {
      case AccountTypeId.Client:
        window.open(`${origin}/accounts/patients/${this.accountId}`, '_blank')
        break
      case AccountTypeId.Provider:
        window.open(`${origin}/accounts/coaches/${this.accountId}`, '_blank')
        break
      default:
        break
    }
  }
}
