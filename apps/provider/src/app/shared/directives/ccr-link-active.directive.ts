//tslint:disable:no-conflicting-lifecycle
import {
  AfterContentInit,
  ContentChildren,
  Directive,
  DoCheck,
  ElementRef,
  Input,
  OnChanges,
  OnDestroy,
  QueryList,
  Renderer2
} from '@angular/core'
import {
  NavigationEnd,
  Router,
  RouterLink,
  RouterLinkWithHref
} from '@angular/router'
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy'

@UntilDestroy()
@Directive({
  selector: '[ccrLinkActive]',
  exportAs: 'ccrLinkActive'
})
export class CcrLinkActiveDirective
  implements AfterContentInit, DoCheck, OnChanges, OnDestroy {
  @Input() urlLinks: string[] = []

  @ContentChildren(RouterLink, { descendants: true })
  links: QueryList<RouterLink>

  @ContentChildren(RouterLinkWithHref, { descendants: true })
  linksWithHrefs: QueryList<RouterLinkWithHref>

  private active = false
  private classes: string[] = []
  private initialized = false

  @Input()
  ccrLinkActiveOptions: { exact: boolean } = { exact: false }

  @Input()
  set ccrLinkActive(data: string[] | string) {
    const classes = Array.isArray(data) ? data : data.split(' ')
    this.classes = classes.filter((c) => !!c)
  }

  constructor(
    private router: Router,
    private element: ElementRef,
    private renderer: Renderer2
  ) {
    this.router.events.pipe(untilDestroyed(this)).subscribe((s) => {
      if (s instanceof NavigationEnd) {
        this.update()
      }
    })
  }

  ngAfterContentInit() {
    if (this.initialized) {
      return
    }
    this.initialized = true
    this.links.changes.subscribe((_) => this.update())
    this.linksWithHrefs.changes.subscribe((_) => this.update())
    this.update()
  }

  ngDoCheck() {
    if (!this.initialized && this.links) {
      this.ngAfterContentInit()
    }
  }

  ngOnChanges() {
    this.update()
  }

  ngOnDestroy() {}

  private update(): void {
    if (!this.links || !this.linksWithHrefs || !this.router.navigated) {
      return
    }

    const hasActiveLinks = this.hasActiveLinks()

    // react only when status has changed to prevent unnecessary dom updates
    if (this.active !== hasActiveLinks) {
      this.classes.forEach((c) => {
        if (hasActiveLinks) {
          this.renderer.addClass(this.element.nativeElement, c)
        } else {
          this.renderer.removeClass(this.element.nativeElement, c)
        }
      })
      Promise.resolve(hasActiveLinks).then((active) => (this.active = active))
    }
  }

  private isLinkActive(
    router: Router
  ): (link: RouterLink | RouterLinkWithHref) => boolean {
    return (link: RouterLink | RouterLinkWithHref) =>
      router.isActive(link.urlTree, this.ccrLinkActiveOptions.exact)
  }

  private hasActiveLinks(): boolean {
    return (
      this.links.some(this.isLinkActive(this.router)) ||
      this.linksWithHrefs.some(this.isLinkActive(this.router)) ||
      this.urlLinks.some((urlLink) => this.router.url.indexOf(urlLink) > -1)
    )
  }

  get isActive(): boolean {
    return this.active
  }
}
