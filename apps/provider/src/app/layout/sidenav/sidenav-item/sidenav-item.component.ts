import {
  Component,
  HostBinding,
  Input,
  OnChanges,
  QueryList,
  ViewChildren
} from '@angular/core'
import { ToggleMenu } from '@app/layout/store'
import { Store } from '@ngrx/store'
import { CCRConfig } from '@app/config'

export interface SidenavItem {
  code?: string
  navName: string
  navRoute?: string
  navLink?: string
  navAction?: string
  route?: string
  icon?: string
  isAllowedForPatients?: boolean
  isHiddenForProviders?: boolean
  children?: Array<SidenavItem>
  expanded?: boolean
  badge?: number | string
  cssClass?: string
  shouldFetchNavLink?: boolean
  getNavLink?: () => Promise<string>
  fontIcon?: { fontSet: string; fontIcon: string }
}

@Component({
  selector: 'app-sidenav-item',
  templateUrl: './sidenav-item.component.html'
})
export class SidenavItemComponent implements OnChanges {
  @ViewChildren(SidenavItemComponent) children: QueryList<SidenavItemComponent>
  @Input() sidenavItem: SidenavItem
  @Input() level = 1
  @Input() parent: SidenavItemComponent
  @Input() isSidenavOpen = false

  @HostBinding('attr.class') cssClass = ''

  active = false
  _this: SidenavItemComponent = this

  constructor(private store: Store<CCRConfig>) {}

  ngOnChanges(changes) {
    this.active = this.sidenavItem.expanded
    this.cssClass = this.sidenavItem.cssClass
  }

  get height(): number {
    let addedHeight = 0
    if (this.children) {
      this.children.forEach((childComponent) => {
        if (childComponent.active) {
          addedHeight += childComponent.height
        }
      })
    }
    return (
      this.sidenavItem.children.filter((child) => !child.cssClass).length * 36 +
      addedHeight
    )
  }

  get levelClass(): string {
    return `level${this.level}`
  }

  get hasChildren(): boolean {
    if (!this.sidenavItem || !this.sidenavItem.children) {
      return false
    }
    return this.sidenavItem.children.length > 0
  }

  toggleDropdown(active: boolean): void {
    this.sidenavItem.expanded = active
    this.active = active
  }

  clicked(event: MouseEvent): void {
    this.toggleDropdown(!this.active)
  }

  openLink(link: string) {
    window.open(link, '_self')
  }

  newWindow(link: string) {
    window.open(link, '_blank')
  }

  public async onClickNavLink(sidenavItem: SidenavItem): Promise<void> {
    try {
      let link = sidenavItem.navLink

      if (sidenavItem.shouldFetchNavLink) {
        link = await sidenavItem.getNavLink()
      }

      return this.newWindow(link)
    } catch (error) {
      console.error(error)
    }
  }

  public performAction(action: string): void {
    if (action === 'videoPlayer') {
    }
  }

  toggleMenu(e: Event): void {
    this.store.dispatch(new ToggleMenu())
    e.stopPropagation()
  }
}
