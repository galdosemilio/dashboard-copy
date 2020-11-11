import {
  Component,
  Input,
  OnDestroy,
  OnInit,
  ViewEncapsulation
} from '@angular/core'
import { MatDialog } from '@coachcare/material'
import {
  ActivatedRoute,
  ActivatedRouteSnapshot,
  NavigationEnd,
  Router
} from '@angular/router'
import { _ } from '@coachcare/backend/shared'
import { ContextService } from '@coachcare/common/services'
import { Subscription } from 'rxjs'
import { filter, map } from 'rxjs/operators'

import { LanguagesDialog } from '@coachcare/common/dialogs/core'
import { get } from 'lodash'
import { PlainLayoutConfig } from '../plain-layout.config'

@Component({
  selector: 'ccr-plain-base',
  templateUrl: './base.component.html',
  styleUrls: ['./base.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class BaseComponent implements OnInit, OnDestroy {
  headerLink = false
  logoOverrideClass = ''
  subs: Array<Subscription> = []
  orgId: string

  linkSupport: string
  linkTerms: string
  linkPrivacy: string
  linkDpa: string
  linkMsa: string
  linkHipaa: string

  @Input() lang: string
  @Input() logoUrl: string
  @Input() displayName: string
  @Input() mala: any

  constructor(
    private activatedRoute: ActivatedRoute,
    private context: ContextService,
    private router: Router,
    protected dialog: MatDialog
  ) {
    // listen the current route data
    this.subs[0] = this.router.events
      .pipe(
        filter((event) => event instanceof NavigationEnd),
        map(() => this.activatedRoute.snapshot),
        map((route) => {
          while (route.firstChild) {
            route = route.firstChild
          }
          return route
        })
      )
      .subscribe((route: ActivatedRouteSnapshot) => {
        const config: PlainLayoutConfig = route.data.layout || {}
        this.headerLink = config.headerLink ? true : false
      })
  }

  ngOnInit() {
    this.orgId = this.context.organizationId || ''

    if (this.mala) {
      this.linkTerms = get(this.mala, 'custom.links.terms')
      this.linkPrivacy = get(this.mala, 'custom.links.privacy')
      this.linkSupport = get(this.mala, 'custom.links.providerContact')
      this.linkHipaa = get(this.mala, 'custom.links.hipaa')
      this.linkMsa = get(this.mala, 'custom.links.msa')
      this.linkDpa = get(this.mala, 'custom.links.dpa')
    }
  }

  ngOnDestroy() {
    this.subs.forEach((s) => s.unsubscribe())
  }

  selectLanguage() {
    this.dialog.open(LanguagesDialog, {
      data: {
        title: _('GLOBAL.SELECT_LANGUAGE')
      },
      panelClass: 'ccr-lang-dialog'
    })
  }
}
