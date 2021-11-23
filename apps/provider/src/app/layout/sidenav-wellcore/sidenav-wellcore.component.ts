import {
  AfterViewInit,
  Component,
  Input,
  OnDestroy,
  OnInit,
  ViewEncapsulation
} from '@angular/core'
import { NavigationStart, Router } from '@angular/router'
import { CCRConfig, CCRPalette } from '@app/config'
import { SidenavOptions } from '@app/config/section/consts'
import { FetchSubaccount } from '@app/layout/store/call/call.action'
import {
  AuthService,
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
import { User } from '@coachcare/sdk'
import { filter } from 'rxjs/operators'

export interface SidenavOrg {
  id: string
  name: string
}

@UntilDestroy()
@Component({
  selector: 'app-menu-wellcore',
  templateUrl: './sidenav-wellcore.component.html',
  styleUrls: ['./sidenav-wellcore.component.scss'],
  encapsulation: ViewEncapsulation.None
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
  private isProvider = false

  constructor(
    router: Router,
    public context: ContextService,
    private auth: AuthService,
    private messaging: MessagingService,
    private store: Store<CCRConfig>,
    private translate: TranslateService,
    private user: User
  ) {
    this.updateUnread = this.updateUnread.bind(this)

    this.store
      .pipe(select(configSelector))
      .subscribe((conf) => (this.palette = conf.palette))

    router.events
      .pipe(filter((event) => event instanceof NavigationStart))
      .subscribe((event: NavigationStart) => {
        this.route = event.url.split('/')[1]
        this.updateNavigation()
      })
  }

  ngAfterViewInit() {}

  ngOnDestroy(): void {}

  ngOnInit() {
    const user = this.context.user
    this.userName = user.firstName + ' ' + user.lastName
    this.currentLang = this.translate.currentLang
    this.isProvider = this.context.isProvider

    this.initNavigation()
    this.filterSideNavItems()

    this.translate.onLangChange.pipe(untilDestroyed(this)).subscribe(() => {
      this.currentLang = this.translate.currentLang
      this.updateContactLinks()
    })

    this.context.organization$.subscribe((org) => {
      this.organization = org
      this.updateSections(org)
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
        icon: 'dashboard',
        isAllowedForPatients: true
      },
      {
        code: SidenavOptions.ACCOUNTS_PATIENTS,
        navName: _('GLOBAL.PATIENTS'),
        navRoute: 'accounts/patients',
        icon: 'person',
        isAllowedForPatients: false
      },
      {
        code: SidenavOptions.ACCOUNTS_COACHES,
        navName: _('GLOBAL.COACHES'),
        navRoute: 'accounts/coaches',
        icon: 'assignment_ind',
        isAllowedForPatients: false
      },
      {
        code: SidenavOptions.NEW_APPOINTMENT,
        navName: _('GLOBAL.APPOINTMENTS'),
        navRoute: 'schedule/mosaic',
        icon: 'date_range',
        isAllowedForPatients: true,
        isHiddenForProviders: true
      },
      {
        code: SidenavOptions.SCHEDULE_PARENT,
        navName: _('SIDENAV.SCHEDULE'),
        route: 'schedule',
        icon: 'date_range',
        children: [
          {
            code: SidenavOptions.SCHEDULE_LIST,
            navName: _('SIDENAV.SCHEDULE_LIST'),
            navRoute: 'schedule/list',
            icon: 'schedule'
          },
          {
            code: SidenavOptions.SCHEDULE_SCHEDULE,
            navName: _('SIDENAV.SCHEDULE_VIEW'),
            navRoute: 'schedule/view',
            icon: 'schedule'
          }
        ]
      },
      {
        code: SidenavOptions.DIGITAL_LIBRARY,
        navName: _('SIDENAV.LIBRARY'),
        route: 'library',
        navRoute: 'library',
        icon: 'folder',
        badge: 0
      },
      {
        code: SidenavOptions.TEST_RESULTS,
        navName: _('SIDENAV.TEST_RESULTS'),
        route: 'test-results',
        navRoute: 'test-results',
        fontIcon: { fontSet: 'fas', fontIcon: 'fa-vial' },
        isHiddenForProviders: true,
        isAllowedForPatients: true
      },
      {
        code: SidenavOptions.PROFILE_SETTINGS,
        navName: _('SIDENAV.PROFILE_SETTINGS'),
        route: 'profile',
        navRoute: 'profile',
        icon: 'person',
        isAllowedForPatients: true
      },
      {
        navName: _('SIDENAV.RESOURCES'),
        route: 'resources',
        icon: 'help',
        navRoute: 'resources',
        isAllowedForPatients: true,
        children: [
          {
            code: SidenavOptions.RESOURCES_SCHEDULE_SUPPORT_CALL,
            navName: _('SIDENAV.SCHEDULE_SUPPORT_CALL'),
            navLink: 'https://calendly.com/coachcarekjm/supportcall',
            isAllowedForPatients: true,
            icon: 'add_ic_call'
          },
          {
            code: SidenavOptions.RESOURCES_CONTACT,
            navName: _('SIDENAV.CONTACT_SUPPORT'),
            navLink: `https://coachcare.zendesk.com/hc/en-us/requests/new?lang=${this.currentLang}`,
            isAllowedForPatients: true,
            icon: 'email'
          }
        ]
      }
    ]

    this.updateUnread()
  }

  public async logout(): Promise<void> {
    await this.user.logout()
    this.auth.redirect()
  }

  private filterSideNavItems() {
    this.sidenavItems = this.sidenavItems.filter((item) => {
      return this.isProvider
        ? !item.isHiddenForProviders
        : item.isAllowedForPatients
    })

    this.sidenavItems = this.sidenavItems.map((item) => ({
      ...item,
      children: item.children?.filter((childItem) => {
        return this.isProvider
          ? !childItem.isHiddenForProviders
          : childItem.isAllowedForPatients
      })
    }))
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
      idxProviderContact >= 0 && this.sidenavItems.length > 0
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
      }
      return item
    })
  }

  private updateSections(org: SelectedOrganization): void {
    const enabledLibrary = get(org, 'preferences.content.enabled', false)

    const libIdx = findIndex(this.sidenavItems, {
      navName: _('SIDENAV.LIBRARY')
    })

    this.sidenavItems[libIdx] = {
      ...this.sidenavItems[libIdx],
      cssClass: enabledLibrary ? '' : 'hidden'
    }
  }

  private updateUnread(): void {
    const { unreadThreadsCount } = this.messaging.unreadCount$.getValue()
    const messagesIndex = findIndex(this.sidenavItems, { navRoute: 'messages' })

    if (messagesIndex < 0) {
      return
    }

    if (this.sidenavItems[messagesIndex].badge !== unreadThreadsCount) {
      this.sidenavItems[messagesIndex].badge = unreadThreadsCount
      this.sidenavItems[messagesIndex] = Object.assign(
        {},
        this.sidenavItems[messagesIndex]
      )
    }
  }
}
