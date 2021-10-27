import { Component, Input, OnInit } from '@angular/core'
import { NavigationStart, Router } from '@angular/router'
import { CCRConfig, CCRPalette } from '@app/config'
import { resolveConfig } from '@app/config/section'
import { SidenavOptions } from '@app/config/section/consts'
import { FetchSubaccount } from '@app/layout/store/call/call.action'
import {
  ContextService,
  MessagingService,
  NotifierService,
  PlatformUpdatesService,
  SelectedOrganization
} from '@app/service'
import { _ } from '@app/shared'
import { configSelector } from '@app/store/config'
import { select, Store } from '@ngrx/store'
import { TranslateService } from '@ngx-translate/core'
import { findIndex, get } from 'lodash'
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy'
import { AccountTypeIds, Authentication } from '@coachcare/sdk'
import { SidenavItem } from './sidenav-item/sidenav-item.component'

export interface SidenavOrg {
  id: string
  name: string
}

@UntilDestroy()
@Component({
  selector: 'app-menu',
  templateUrl: './sidenav.component.html'
})
export class SidenavComponent implements OnInit {
  @Input()
  isOpened = false

  _this: SidenavComponent = this
  organization: SelectedOrganization
  sidenavItems: SidenavItem[] = []

  logoSrc = './assets/logo.png'
  palette: CCRPalette
  route: string

  private currentLang: string
  private readonly DEFAULT_STORE_LINK = 'https://store.coachcare.com/'
  private isOrphaned: boolean
  private isProvider = false

  constructor(
    router: Router,
    private authentication: Authentication,
    private context: ContextService,
    private messaging: MessagingService,
    private notifier: NotifierService,
    private platformUpdates: PlatformUpdatesService,
    private store: Store<CCRConfig>,
    private translate: TranslateService
  ) {
    this.fetchStoreLink = this.fetchStoreLink.bind(this)
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

  ngOnInit() {
    this.isProvider =
      this.context.user.accountType.id === AccountTypeIds.Provider

    this.currentLang = this.translate.currentLang
    this.isOrphaned = this.context.isOrphaned

    this.context.orphanedAccount$.subscribe((isOrphaned) => {
      this.isOrphaned = isOrphaned
      this.initNavigation(!this.isOrphaned)
    })

    this.translate.onLangChange.pipe(untilDestroyed(this)).subscribe(() => {
      this.currentLang = this.translate.currentLang
      this.updateContactLinks()
    })

    this.context.organization$.subscribe((org) => {
      // update the video option
      this.updateSections(org)
      // TODO consider logo-mark for md screens
      this.logoSrc =
        org && org.assets && org.assets.logoUrl
          ? org.assets.logoUrl
          : './assets/logo.png'

      this.updateContactLinks()
    })

    // listen event to refresh unread
    this.messaging.unreadCount$
      .pipe(untilDestroyed(this))
      .subscribe(this.updateUnread)

    this.platformUpdates.articles$
      .pipe(untilDestroyed(this))
      .subscribe(this.updateUnread)

    this.store.dispatch(new FetchSubaccount(this.context.organizationId))
  }

  initNavigation(menuEnabled: boolean) {
    this.sidenavItems = !menuEnabled
      ? []
      : [
          {
            code: SidenavOptions.DASHBOARD,
            navName: _('GLOBAL.DASHBOARD'),
            navRoute: 'dashboard',
            icon: 'dashboard',
            isAllowedForPatients: true
          },
          {
            code: SidenavOptions.TEST_RESULTS,
            navName: _('SIDENAV.TEST_RESULTS'),
            route: 'test-results',
            navRoute: 'test-results',
            isAllowedForPatients: true,
            isHiddenForProviders: true,
            fontIcon: { fontSet: 'fas', fontIcon: 'fa-vial' }
          },
          {
            navName: _('SIDENAV.ACCOUNTS'),
            route: 'accounts',
            icon: 'people',
            children: [
              {
                code: SidenavOptions.ACCOUNTS_PATIENTS,
                navName: _('GLOBAL.PATIENTS'),
                navRoute: 'accounts/patients',
                icon: 'person'
              },
              {
                code: SidenavOptions.ACCOUNTS_COACHES,
                navName: _('GLOBAL.COACHES'),
                navRoute: 'accounts/coaches',
                icon: 'assignment_ind'
              },
              {
                code: SidenavOptions.ACCOUNTS_CLINICS,
                navName: _('GLOBAL.CLINICS'),
                navRoute: 'accounts/clinics',
                icon: 'domain'
              }
            ]
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
              },
              {
                code: SidenavOptions.SCHEDULE_AVAILABILITY,
                navName: _('SIDENAV.SCHEDULE_AVAILABLE'),
                navRoute: 'schedule/available',
                icon: 'event_available'
              }
            ]
          },
          {
            code: SidenavOptions.MESSAGES,
            navName: _('SIDENAV.MESSAGES'),
            route: 'messages',
            navRoute: 'messages',
            icon: 'chat',
            isAllowedForPatients: true,
            badge: 0
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
            navName: _('SIDENAV.ALERTS'),
            route: 'alerts',
            icon: 'notifications',
            children: [
              {
                code: SidenavOptions.ALERT_NOTIFICATIONS,
                navName: _('SIDENAV.NOTIFICATIONS'),
                navRoute: 'alerts/notifications',
                icon: 'warning'
              },
              {
                code: SidenavOptions.ALERT_SETTINGS,
                navName: _('SIDENAV.SETTINGS'),
                navRoute: 'alerts/settings',
                icon: 'settings'
              }
            ]
          },
          {
            navName: _('SIDENAV.REPORTS'),
            navRoute: 'reports',
            icon: 'insert_chart',
            children: [
              {
                code: SidenavOptions.REPORT_OVERVIEW,
                navName: _('SIDENAV.OVERVIEW'),
                navRoute: 'reports/overview',
                icon: 'equalizer'
              },
              {
                code: SidenavOptions.REPORT_STATISTICS,
                navName: _('SIDENAV.USER_STATISTICS'),
                navRoute: 'reports/statistics',
                icon: 'timeline'
              },
              {
                code: SidenavOptions.RPM_BILLING,
                navName: _('SIDENAV.RPM'),
                navRoute: 'reports/rpm',
                icon: 'receipt'
              },
              {
                code: SidenavOptions.COMMUNICATIONS,
                navName: _('SIDENAV.COMMUNICATIONS'),
                navRoute: 'reports/communications',
                icon: 'perm_phone_msg'
              },
              {
                code: SidenavOptions.REPORT_CUSTOM,
                navName: _('SIDENAV.CUSTOM_REPORT'),
                navRoute: 'reports/custom',
                icon: 'content_paste'
              }
            ]
          },
          {
            navName: _('SIDENAV.SEQUENCES'),
            navRoute: '/sequences',
            icon: 'playlist_add_track'
          },
          {
            code: SidenavOptions.PROFILE_SETTINGS,
            navName: _('SIDENAV.PROFILE_SETTINGS'),
            route: 'profile',
            navRoute: 'profile',
            icon: 'person',
            isAllowedForPatients: true,
            isHiddenForProviders: true
          },
          {
            code: SidenavOptions.STORE,
            navName: _('SIDENAV.STORE'),
            navLink: this.DEFAULT_STORE_LINK,
            icon: 'shopping_cart',
            isAllowedForPatients: true,
            shouldFetchNavLink: true,
            getNavLink: this.fetchStoreLink
          },
          {
            badge: 10,
            navName: _('SIDENAV.RESOURCES'),
            route: 'resources',
            icon: 'help',
            isAllowedForPatients: true,
            navRoute: 'messages',
            children: [
              {
                badge: 10,
                code: SidenavOptions.RESOURCES_PLATFORM_UPDATES,
                navName: _('SIDENAV.PLATFORM_UPDATES'),
                navRoute: '/resources/platform-updates',
                icon: 'event'
              },
              {
                code: SidenavOptions.RESOURCES_SCHEDULE_SUPPORT_CALL,
                navName: _('SIDENAV.SCHEDULE_SUPPORT_CALL'),
                navLink: 'https://calendly.com/coachcarekjm/supportcall',
                icon: 'add_ic_call',
                isAllowedForPatients: true
              },
              {
                code: SidenavOptions.RESOURCES_CONTACT,
                navName: _('SIDENAV.CONTACT_SUPPORT'),
                navLink: `https://coachcare.zendesk.com/hc/en-us/requests/new?lang=${this.currentLang}`,
                icon: 'email',
                isAllowedForPatients: true
              },
              {
                code: SidenavOptions.RESOURCES_FAQ,
                navName: _('SIDENAV.FAQ_SUPPORT'),
                navLink: `https://coachcare.zendesk.com/hc/en-us/categories/360001031511-Coach-Provider-Dashboard?lang=${this.currentLang}`,
                icon: 'live_help'
              }
              // { navName: _('SIDENAV.MARKETING'), navRoute: 'resources/marketing' },
              // { navName: _('SIDENAV.FAQS'), navRoute: 'resources/faqs' }
            ]
          }
        ]

    this.updateUnread()
    this.updateSections(this.context.organization)
  }

  private updateContactLinks(): void {
    const baseLang = this.currentLang.split('-')[0]

    let idxProviderContactChild
    const providerContactLink = this.context.isOrphaned
      ? undefined
      : get(this.context.organization.mala, 'custom.links.providerContact')
    const providerFaqLink = this.context.isOrphaned
      ? undefined
      : get(this.context.organization.mala, 'custom.links.providerFaq')
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

    const idxProviderFaqChild =
      idxProviderContact && this.sidenavItems.length > 0
        ? this.sidenavItems[idxProviderContact].children.findIndex(
            (child) => child.navName === _('SIDENAV.FAQ_SUPPORT')
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

      if (idxProviderFaqChild > -1) {
        this.sidenavItems[idxProviderContact].children[
          idxProviderFaqChild
        ].navLink = providerFaqLink
          ? providerFaqLink
          : `https://coachcare.zendesk.com/hc/en-us/categories/360001031511-Coach-Provider-Dashboard?lang=${baseLang}`
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
        // only changes the reference when the status changes
        return { ...item }
      }
      return item
    })
  }

  private updateUnread(): void {
    if (!this.context.isOrphaned) {
      const { unreadThreadsCount } = this.messaging.unreadCount$.getValue()

      const m = findIndex(this.sidenavItems, { navRoute: 'messages' })
      if (this.sidenavItems[m].badge !== unreadThreadsCount) {
        this.sidenavItems[m].badge = unreadThreadsCount
        this.sidenavItems[m] = Object.assign({}, this.sidenavItems[m])
      }
    }

    const resourcesItemIndex = findIndex(this.sidenavItems, {
      route: 'resources'
    })

    if (resourcesItemIndex <= -1) {
      return
    }

    this.sidenavItems[resourcesItemIndex].badge = this.isProvider
      ? this.platformUpdates.notSeenArticleAmount
      : 0

    const updatesSubItemIndex = findIndex(
      this.sidenavItems[resourcesItemIndex].children,
      { navRoute: '/resources/platform-updates' }
    )

    if (updatesSubItemIndex <= -1) {
      return
    }

    this.sidenavItems[resourcesItemIndex].children[
      updatesSubItemIndex
    ].badge = this.platformUpdates.notSeenArticleAmount
  }

  async updateSections(org: SelectedOrganization): Promise<void> {
    this.filterSideNavItems()

    let hiddenOptions = this.isProvider
      ? resolveConfig('SIDENAV.HIDDEN_OPTIONS', org)
      : resolveConfig('SIDENAV.PATIENT_HIDDEN_OPTIONS', org)
    const shownOptions =
      (this.isProvider
        ? resolveConfig('SIDENAV.SHOWN_OPTIONS', org, true)
        : resolveConfig('SIDENAV.PATIENT_SHOWN_OPTIONS', org)) || []

    if (Array.isArray(hiddenOptions) && Array.isArray(shownOptions)) {
      hiddenOptions = hiddenOptions.filter(
        (hidden) => !shownOptions.find((shown) => shown === hidden)
      )
    }

    const enabled = get(org, 'preferences.content.enabled', false)
    const rpmEnabled = get(org, 'preferences.rpm.isActive', false)
    const rpmElementIndex = this.sidenavItems.findIndex(
      (item) =>
        item.children &&
        !!item.children.find((child) => child.navName === _('SIDENAV.RPM'))
    )
    const sequencesEnabled = get(org, 'preferences.sequences.isActive', false)
    const sequencesElementIndex = this.sidenavItems.findIndex(
      (item) => item.navName === _('SIDENAV.SEQUENCES')
    )
    const messagingEnabled = get(org, 'preferences.messaging.isActive', false)
    const messagingElementIndex = this.sidenavItems.findIndex(
      (item) => item.navName === _('SIDENAV.MESSAGES')
    )
    const commsEnabled = get(
      org,
      'preferences.comms.videoConferencing.isEnabled',
      false
    )
    const commsElementIndex = this.sidenavItems.findIndex(
      (item) =>
        item.children &&
        !!item.children.find(
          (child) => child.navName === _('SIDENAV.COMMUNICATIONS')
        )
    )
    const idx = findIndex(this.sidenavItems, { navName: _('SIDENAV.LIBRARY') })

    this.sidenavItems = this.sidenavItems.map((item) => ({
      ...item,
      cssClass: '',
      children:
        item.children && item.children.length
          ? item.children.map((child) => ({ ...child, cssClass: '' }))
          : undefined
    }))

    this.sidenavItems[idx] = {
      ...this.sidenavItems[idx],
      cssClass: enabled ? '' : 'hidden'
    }

    if (rpmElementIndex > -1 && !rpmEnabled) {
      const childIndex = this.sidenavItems[rpmElementIndex].children.findIndex(
        (item) => item.navName === _('SIDENAV.RPM')
      )
      this.sidenavItems[rpmElementIndex].children[childIndex] = {
        ...this.sidenavItems[rpmElementIndex].children[childIndex],
        cssClass: 'hidden'
      }
    }

    if (commsElementIndex > -1 && !commsEnabled) {
      const childIndex = this.sidenavItems[
        commsElementIndex
      ].children.findIndex(
        (item) => item.navName === _('SIDENAV.COMMUNICATIONS')
      )
      this.sidenavItems[commsElementIndex].children[childIndex] = {
        ...this.sidenavItems[commsElementIndex].children[childIndex],
        cssClass: 'hidden'
      }
    }

    if (sequencesElementIndex > -1 && !sequencesEnabled) {
      this.sidenavItems[sequencesElementIndex] = {
        ...this.sidenavItems[sequencesElementIndex],
        cssClass: 'hidden'
      }
    }

    if (messagingElementIndex > -1 && !messagingEnabled) {
      this.sidenavItems[messagingElementIndex] = {
        ...this.sidenavItems[messagingElementIndex],
        cssClass: 'hidden'
      }
    }

    if (
      this.sidenavItems &&
      this.sidenavItems.length &&
      Array.isArray(hiddenOptions)
    ) {
      hiddenOptions.forEach((option) => {
        let existingChildrenIndex = -1
        const existingItem = this.sidenavItems.find(
          (item) =>
            (item.code === option && !item.cssClass) ||
            (existingChildrenIndex = item.children
              ? item.children.findIndex(
                  (child) => child.code === option && !child.cssClass
                )
              : -1) > -1
        )

        if (existingItem && existingChildrenIndex === -1) {
          existingItem.cssClass = 'hidden'
        } else if (existingChildrenIndex > -1) {
          existingItem.children[existingChildrenIndex].cssClass = 'hidden'
          if (!existingItem.children.find((child) => !child.cssClass)) {
            existingItem.cssClass = 'hidden'
          }
        }
      })
    }
  }

  onLogoError(event) {
    this.notifier.error(_('NOTIFY.ERROR.LOGO_FAILED'), {
      log: true,
      data: {
        type: 'load-logo',
        functionType: 'onLogoError',
        url: event.target.src,
        organization: this.organization.id,
        message: 'Failed to load the clinic logo'
      }
    })
  }

  private async fetchStoreLink(): Promise<string> {
    try {
      const shouldFetch = resolveConfig(
        'SIDENAV.FETCH_STORE_LINK',
        this.context.organization
      )

      if (!shouldFetch || this.isProvider) {
        return this.DEFAULT_STORE_LINK
      }

      const response = await this.authentication.shopify({
        organization: this.context.organizationId
      })
      return response.url
    } catch (error) {
      this.notifier.error(error)
      return this.DEFAULT_STORE_LINK
    }
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
}
