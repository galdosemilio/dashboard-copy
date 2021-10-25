import {
  AfterViewInit,
  Component,
  Input,
  OnDestroy,
  OnInit
} from '@angular/core'
import { NavigationStart, Router } from '@angular/router'
import { CCRConfig, CCRPalette } from '@app/config'
import { SidenavOptions } from '@app/config/section/consts'
import { FetchSubaccount } from '@app/layout/store/call/call.action'
import {
  ContextService,
  MessagingService,
  SelectedOrganization
} from '@app/service'
import { _ } from '@app/shared'
import { configSelector } from '@app/store/config'
import { select, Store } from '@ngrx/store'
import { TranslateService } from '@ngx-translate/core'
import { findIndex, get } from 'lodash'
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy'
import { SidenavItem } from '../sidenav/sidenav-item/sidenav-item.component'

export interface SidenavOrg {
  id: string
  name: string
}

@UntilDestroy()
@Component({
  selector: 'app-menu-wellcore',
  templateUrl: './sidenav-wellcore.component.html',
  styleUrls: ['./sidenav-wellcore.component.scss']
})
export class SidenavWellcoreComponent
  implements AfterViewInit, OnInit, OnDestroy {
  @Input()
  isOpened = false

  _this: SidenavWellcoreComponent = this
  sidenavItems: SidenavItem[] = []

  logoSrc = './assets/wellcore-logo.png'
  palette: CCRPalette
  route: string

  organization: SelectedOrganization
  userName: string
  private currentLang: string

  constructor(
    router: Router,
    public context: ContextService,
    private messaging: MessagingService,
    private store: Store<CCRConfig>,
    private translate: TranslateService
  ) {
    this.updateUnread = this.updateUnread.bind(this)

    this.store
      .pipe(select(configSelector))
      .subscribe((conf) => (this.palette = conf.palette))

    router.events.subscribe((event) => {
      if (event instanceof NavigationStart) {
        this.route = event.url.split('/')[1]
        this.updateNavigation()
      }
    })
  }

  ngAfterViewInit() {}

  ngOnDestroy(): void {}

  ngOnInit() {
    const user = this.context.user
    this.userName = user.firstName + ' ' + user.lastName
    this.currentLang = this.translate.currentLang

    this.initNavigation()

    this.translate.onLangChange.pipe(untilDestroyed(this)).subscribe(() => {
      this.currentLang = this.translate.currentLang
      this.updateContactLinks()
    })

    this.context.organization$.subscribe((org) => {
      this.organization = org
      this.updateContactLinks()
    })

    // listen event to refresh unread
    this.messaging.unreadCount$
      .pipe(untilDestroyed(this))
      .subscribe(this.updateUnread)

    this.store.dispatch(new FetchSubaccount(this.context.organizationId))
  }

  initNavigation() {
    this.sidenavItems = [
      {
        code: SidenavOptions.DASHBOARD,
        navName: _('GLOBAL.DASHBOARD'),
        navRoute: 'dashboard',
        icon: 'dashboard'
      },
      {
        code: SidenavOptions.NEW_APPOINTMENT,
        navName: _('GLOBAL.APPOINTMENTS'),
        navRoute: 'schedule/list',
        icon: 'date_range'
      },
      {
        code: SidenavOptions.TEST_RESULTS,
        navName: _('SIDENAV.TEST_RESULTS'),
        route: 'test-results',
        navRoute: 'test-results',
        fontIcon: { fontSet: 'fas', fontIcon: 'fa-vial' }
      },
      {
        code: SidenavOptions.MESSAGES,
        navName: _('SIDENAV.MESSAGES'),
        route: 'messages',
        navRoute: 'messages',
        icon: 'chat',
        badge: 0
      },
      {
        code: SidenavOptions.PROFILE_SETTINGS,
        navName: _('SIDENAV.PROFILE_SETTINGS'),
        route: 'profile',
        navRoute: 'profile',
        icon: 'person'
      },
      {
        navName: _('SIDENAV.RESOURCES'),
        route: 'resources',
        icon: 'help',
        navRoute: 'resources',
        children: [
          {
            code: SidenavOptions.RESOURCES_SCHEDULE_SUPPORT_CALL,
            navName: _('SIDENAV.SCHEDULE_SUPPORT_CALL'),
            navLink: 'https://calendly.com/coachcarekjm/supportcall',
            icon: 'add_ic_call'
          },
          {
            code: SidenavOptions.RESOURCES_CONTACT,
            navName: _('SIDENAV.CONTACT_SUPPORT'),
            navLink: `https://coachcare.zendesk.com/hc/en-us/requests/new?lang=${this.currentLang}`,
            icon: 'email'
          }
        ]
      }
    ]

    this.updateUnread()
  }

  private updateContactLinks(): void {
    const baseLang = this.currentLang.split('-')[0]

    let idxProviderContactChild
    const providerContactLink = this.context.isOrphaned
      ? undefined
      : get(this.context.organization.mala, 'custom.links.providerContact')

    const idxProviderContact = this.sidenavItems.findIndex(
      (item) =>
        item.children &&
        (idxProviderContactChild = item.children.findIndex(
          (child) => child.navName === _('SIDENAV.CONTACT_SUPPORT')
        )) > -1
    )

    const idxSupportCallChild =
      idxProviderContact && this.sidenavItems.length > 0
        ? this.sidenavItems[idxProviderContact].children.findIndex(
            (child) => child.navName === _('SIDENAV.SCHEDULE_SUPPORT_CALL')
          )
        : -1

    if (idxProviderContact > -1) {
      if (idxProviderContactChild > -1) {
        this.sidenavItems[idxProviderContact].children[
          idxProviderContactChild
        ].navLink = providerContactLink
          ? providerContactLink
          : `https://coachcare.zendesk.com/hc/en-us/requests/new?lang=${baseLang}`
      }

      if (idxSupportCallChild > -1) {
        this.sidenavItems[idxProviderContact].children[idxSupportCallChild] = {
          ...this.sidenavItems[idxProviderContact].children[
            idxSupportCallChild
          ],
          cssClass:
            this.translate.currentLang.split('-')[0] === 'en' ? '' : 'hidden'
        }
      }
    }
  }

  updateNavigation() {
    this.sidenavItems = this.sidenavItems.map((item) => {
      if (this.route === item.route && !item.expanded) {
        item.expanded = true
        return { ...item }
      }
      return item
    })
  }

  private updateUnread(): void {
    const { unreadThreadsCount } = this.messaging.unreadCount$.getValue()
    const m = findIndex(this.sidenavItems, { navRoute: 'messages' })
    if (this.sidenavItems[m].badge !== unreadThreadsCount) {
      this.sidenavItems[m].badge = unreadThreadsCount
      this.sidenavItems[m] = Object.assign({}, this.sidenavItems[m])
    }
  }
}
