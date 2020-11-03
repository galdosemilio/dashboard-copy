import { Overlay, OverlayConfig } from '@angular/cdk/overlay'
import { ComponentPortal } from '@angular/cdk/portal'
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  Input,
  OnDestroy,
  OnInit
} from '@angular/core'
import { FormControl } from '@angular/forms'
import { MatDialog } from '@coachcare/common/material'
import { CCRConfig, CCRPalette } from '@app/config'
import { SidenavOrg } from '@app/layout/sidenav/sidenav.component'
import { ToggleMenu, TogglePanel } from '@app/layout/store'
import {
  callSelector,
  CallState,
  FetchSubaccount,
  OpenCallBrowserSupport,
  OpenCallSettings
} from '@app/layout/store/call'
import { AuthService, ContextService, SelectedOrganization } from '@app/service'
import { _, LanguagesDialog, TranslationsObject } from '@app/shared'
import { configSelector } from '@app/store/config'
import { select, Store } from '@ngrx/store'
import { get } from 'lodash'
import { untilDestroyed } from 'ngx-take-until-destroy'
import { Subscription } from 'rxjs'
import { debounceTime, distinctUntilChanged } from 'rxjs/operators'
import { Organization, User } from 'selvera-api'
import { HelpComponent } from './help'

@Component({
  selector: 'app-topbar',
  templateUrl: './menubar.component.html',
  styleUrls: ['./menubar.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MenubarComponent implements OnDestroy, OnInit {
  @Input()
  translations: TranslationsObject = {}
  @Input()
  selectedLanguage: string
  @Input()
  panelEnabled: boolean

  searchEnabled = true

  // hasPatientAccount: boolean = false;
  logoSrc = './assets/logo.png'
  palette: CCRPalette

  searchCtrl: FormControl
  organization: SelectedOrganization
  organizations: Array<SidenavOrg> = []

  subscriptions: Subscription[]
  callState: CallState
  showHelpButton = false

  constructor(
    public context: ContextService,
    protected dialog: MatDialog,
    private auth: AuthService,
    private cdr: ChangeDetectorRef,
    private orgservice: Organization,
    private overlay: Overlay,
    private store: Store<CCRConfig>,
    private user: User
  ) {
    this.subscriptions = [
      this.store
        .pipe(select(configSelector))
        .subscribe((conf) => (this.palette = conf.palette)),
      this.store.pipe(select(callSelector)).subscribe((callState) => {
        this.callState = callState
        this.cdr.markForCheck()
      })
    ]
  }

  ngOnDestroy() {}

  ngOnInit() {
    this.context.organization$.subscribe((org) => {
      this.organization = org
      // TODO consider logo-mark for md screens
      this.logoSrc =
        org && org.assets && org.assets.logoUrl
          ? org.assets.logoUrl
          : './assets/logo.png'

      this.showHelpButton = !get(org, 'mala.custom.links.providerFaq')
    })

    this.initSearch()
  }

  initSearch() {
    this.context.orphanedAccount$.subscribe((isOrphaned) => {
      this.searchEnabled = !isOrphaned
    })

    this.searchCtrl = new FormControl()
    this.searchCtrl.valueChanges
      .pipe(debounceTime(500), distinctUntilChanged())
      .subscribe((query) => {
        this.searchClinics(query)
      })
  }

  async searchClinics(query: string) {
    if (typeof query === 'string') {
      const orgs = await this.orgservice.getAccessibleList({
        query,
        status: 'active',
        limit: 7
      })
      this.organizations = orgs.data.map((org) => ({
        id: org.organization.id,
        name: org.organization.name
      }))
    }
  }

  selectLanguage() {
    this.dialog.open(LanguagesDialog, {
      panelClass: 'ccr-lang-dialog'
    })
  }

  selectOrg(org: SidenavOrg) {
    if (org.id !== this.organization.id) {
      this.context.organizationId = org.id
      this.store.dispatch(new FetchSubaccount(org.id))
    }
  }

  logout(): void {
    this.user.logout().then(() => {
      this.auth.redirect()
    })
  }

  onOpenCallSettings() {
    if (this.callState.isSupported) {
      this.store.dispatch(new OpenCallSettings())
    } else {
      this.store.dispatch(new OpenCallBrowserSupport())
    }
  }

  onOpenHelp() {
    const positionStrategy = this.overlay.position().global()
    positionStrategy.bottom('2em')
    positionStrategy.right('2em')

    const helpOverlay = this.overlay.create(
      new OverlayConfig({
        hasBackdrop: true,
        positionStrategy: positionStrategy
      })
    )

    helpOverlay.attach(new ComponentPortal(HelpComponent))
    helpOverlay
      .backdropClick()
      .pipe(untilDestroyed(this))
      .subscribe(() => {
        helpOverlay.dispose()
      })
  }

  toggleMenu(e: Event): void {
    this.store.dispatch(new ToggleMenu())
    e.stopPropagation()
  }

  togglePanel(e: Event): void {
    this.store.dispatch(new TogglePanel())
    e.stopPropagation()
  }
}
