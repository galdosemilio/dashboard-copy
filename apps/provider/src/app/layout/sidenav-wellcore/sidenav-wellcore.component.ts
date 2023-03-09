import { Component, Input, OnInit } from '@angular/core'
import { NavigationStart, Router } from '@angular/router'
import { CCRConfig } from '@app/config'
import { SidenavOptions } from '@app/config/section/consts'
import { FetchSubaccount } from '@app/layout/store/call/call.action'
import {
  ContextService,
  MessagingService,
  SelectedOrganization
} from '@app/service'
import { _ } from '@app/shared'
import { Store } from '@ngrx/store'
import { TranslateService } from '@ngx-translate/core'
import { findIndex, get } from 'lodash'
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy'
import { SidenavItem } from '../sidenav/sidenav-item/sidenav-item.component'
import { filter } from 'rxjs/operators'

export interface SidenavOrg {
  id: string
  name: string
}

@UntilDestroy()
@Component({
  selector: 'app-menu-wellcore',
  templateUrl: './sidenav-wellcore.component.html'
})
export class SidenavWellcoreComponent implements OnInit {
  @Input()
  isOpened = false

  public _this: SidenavWellcoreComponent = this
  public route: string
  public sidenavItems: SidenavItem[] = []

  private currentLang: string
  private isProvider = false
  private hasStoreLink = false

  constructor(
    private context: ContextService,
    private messaging: MessagingService,
    private router: Router,
    private store: Store<CCRConfig>,
    private translate: TranslateService
  ) {
    this.updateUnread = this.updateUnread.bind(this)
  }

  public ngOnInit(): void {
    this.router.events
      .pipe(filter((event) => event instanceof NavigationStart))
      .subscribe((event: NavigationStart) => {
        this.route = event.url.split('/')[1]
        this.updateNavigation()
      })

    this.currentLang = this.translate.currentLang
    this.isProvider = this.context.isProvider
    this.hasStoreLink = !!this.context.organization.preferences.storeUrl

    this.initNavigation()
    this.filterSideNavItems()
    this.subscribeToEvents()

    this.store.dispatch(new FetchSubaccount(this.context.organizationId))
  }

  private initNavigation(): void {
    this.sidenavItems = [
      {
        code: SidenavOptions.DASHBOARD,
        navName: _('GLOBAL.DASHBOARD'),
        navRoute: 'dashboard',
        icon: 'grid_view',
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
        code: SidenavOptions.TEST_RESULTS,
        navName: _('SIDENAV.TEST_RESULTS'),
        route: 'test-results',
        navRoute: 'test-results',
        fontIcon: { fontSet: 'fas', fontIcon: 'fa-vial' },
        isHiddenForProviders: true,
        isAllowedForPatients: true
      },
      {
        code: SidenavOptions.ACCOUNT,
        navName: _('SIDENAV.ACCOUNT'),
        route: 'profile',
        navRoute: 'profile',
        icon: 'people',
        isAllowedForPatients: true,
        children: [
          {
            code: SidenavOptions.ACCOUNT_OVERVIEW,
            navName: _('SIDENAV.OVERVIEW'),
            navRoute: 'profile',
            icon: 'analytics',
            queryParams: { s: 'overview' },
            isAllowedForPatients: true,
            isHiddenForProviders: true
          }
        ]
      },
      {
        code: SidenavOptions.DIGITAL_LIBRARY,
        navName: _('SIDENAV.LIBRARY'),
        route: 'library',
        navRoute: 'library',
        icon: 'folder',
        isAllowedForPatients: true,
        badge: 0
      },
      {
        navName: _('SIDENAV.RESOURCES'),
        route: 'resources',
        icon: 'auto_stories',
        navRoute: 'resources',
        isAllowedForPatients: true,
        children: [
          {
            code: SidenavOptions.RESOURCES_CONTACT,
            navName: _('SIDENAV.CONTACT_SUPPORT'),
            navLink: `https://coachcare.zendesk.com/hc/en-us/requests/new?lang=${this.currentLang}`,
            isAllowedForPatients: true,
            icon: 'email'
          }
        ]
      },
      {
        navName: _('SIDENAV.STORE'),
        route: 'store',
        icon: 'shopping_cart',
        navRoute: 'store',
        isAllowedForPatients: false,
        isHiddenForProviders: true
      }
    ]

    this.updateUnread()
  }

  private filterSideNavItems(): void {
    // Apply Store link filter
    const storeSidenavItem = this.sidenavItems.find(
      (item) => item.navRoute === 'store'
    )
    storeSidenavItem.isAllowedForPatients = this.hasStoreLink

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

  private subscribeToEvents(): void {
    this.translate.onLangChange.pipe(untilDestroyed(this)).subscribe(() => {
      this.currentLang = this.translate.currentLang
      this.updateContactLinks()
    })

    this.context.organization$.subscribe((org) => {
      this.updateSections(org)
      this.updateContactLinks()
    })

    // listen event to refresh unread
    this.messaging.unreadCount$
      .pipe(untilDestroyed(this))
      .subscribe(this.updateUnread)
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

    if (idxProviderContact > -1) {
      if (idxProviderContactChild > -1) {
        this.sidenavItems[idxProviderContact].children[
          idxProviderContactChild
        ].navLink = providerContactLink
          ? providerContactLink
          : `https://coachcare.zendesk.com/hc/en-us/requests/new?lang=${baseLang}`
      }
    }
  }

  private updateNavigation(): void {
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
