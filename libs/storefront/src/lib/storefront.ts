import { DOCUMENT } from '@angular/common'
import { Component, Inject, OnInit, Renderer2, ViewChild } from '@angular/core'
import { select, Store } from '@ngrx/store'
import * as tinycolor from 'tinycolor2'
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy'
import { filter } from 'rxjs/operators'

import { CCRState } from '@coachcare/backend/store'
import { OrgPrefSelectors } from '@coachcare/common/store'

import { CurrentSpreeStore, StorefrontService } from './services'
import { User } from '@coachcare/sdk'
import { AuthService } from '@coachcare/common/services'
import { NavigationEnd, Router } from '@angular/router'
import { updateFavIcon } from '@coachcare/common/shared'

@UntilDestroy()
@Component({
  selector: 'ccr-storefront',
  templateUrl: './storefront.html',
  styleUrls: ['./storefront.scss']
})
export class Storefront implements OnInit {
  public currentStore: CurrentSpreeStore
  public logoUrl: string
  public isLoading = true
  public error: string
  public itemCount = 0

  public get companyUrl(): string {
    return this.currentStore?.public_metadata?.company_url
  }

  public get companyUrlLabel(): string {
    return this.currentStore?.public_metadata?.company_url_label
  }

  @ViewChild('sidebar') sidebar

  constructor(
    @Inject(DOCUMENT) private document: any,
    private storefront: StorefrontService,
    private store: Store<CCRState.State>,
    private renderer: Renderer2,
    private user: User,
    private auth: AuthService,
    private router: Router
  ) {
    this.store
      .pipe(
        untilDestroyed(this),
        select(OrgPrefSelectors.selectOrgPref),
        filter((pref) => !!pref)
      )
      .subscribe((pref) => {
        this.logoUrl = pref.assets.logoUrl
        const palette = pref.assets.color
        const primary =
          palette.theme === 'accent' ? palette.accent : palette.primary
        const accent =
          palette.theme === 'accent' ? palette.primary : palette.accent

        updateFavIcon(pref.assets.faviconUrl)

        this.renderer.setAttribute(
          this.document.body,
          'style',
          `
          --primary: ${primary};
          --primary-contrast: ${this.getContrast(primary)};
          --primary-lighten: ${tinycolor(primary).lighten(26)};
          --primary-darken: ${tinycolor(primary).darken(26)};
          --primary-a12: ${tinycolor(primary).setAlpha(0.12)};
          --primary-a26: ${tinycolor(primary).setAlpha(0.26)};
          --primary-a60: ${tinycolor(primary).setAlpha(0.6)};
          --primary-a80: ${tinycolor(primary).setAlpha(0.8)};
          --accent: ${accent};
          --accent-contrast: ${this.getContrast(accent)};
          --accent-lighten: ${tinycolor(accent).lighten(26)};
          --accent-a12: ${tinycolor(accent).setAlpha(0.12)};
          --accent-a26: ${tinycolor(accent).setAlpha(0.26)};
          --warn: ${palette.warn};
          --warn-contrast: ${this.getContrast(palette.warn)};
          --warn-lighten: ${tinycolor(palette.warn).lighten(26)};
          --warn-a12: ${tinycolor(palette.warn).setAlpha(0.12)};
          --warn-a26: ${tinycolor(palette.warn).setAlpha(0.26)};
          --contrast: ${palette.contrast};
          --contrast-darken: ${tinycolor(palette.contrast).darken(8)};
          --contrast-darkest: ${tinycolor(palette.contrast).darken(16)};
          --sidenav: ${palette.sidenav};
          --sidenav-darken: ${tinycolor(palette.sidenav).darken(5)};
          --sidenav-darkest: ${tinycolor(palette.sidenav).darken(8)};

          --toolbar: ${
            palette.toolbar === 'accent' ? palette.accent : palette.primary
          };
          --toolbar-contrast: ${palette.contrast};
          --panel: ${
            palette.toolbar === 'accent' ? palette.accent : palette.primary
          };
          --panel-contrast: ${palette.contrast};

          --bg-bar: ${palette.bg_bar};
          --bg-panel: ${palette.bg_panel};
          --base: ${palette.base};
          --text: ${palette.text};
          --disabled: ${palette.disabled};
          `
        )
      })
    this.router.events
      .pipe(
        untilDestroyed(this),
        filter(
          (event) => event instanceof NavigationEnd && this.sidebar?.opened
        )
      )
      .subscribe(() => {
        this.sidebar.close()
      })
  }

  ngOnInit() {
    void this.storefront.init()

    this.storefront.initialized$
      .pipe(
        untilDestroyed(this),
        filter((res) => !!res)
      )
      .subscribe(() => {
        this.isLoading = false
      })

    this.storefront.error$
      .pipe(
        untilDestroyed(this),
        filter((error) => !!error)
      )
      .subscribe((error) => {
        this.error = error.message
        this.isLoading = false
      })
    this.storefront.cart$
      .pipe(
        untilDestroyed(this),
        filter((cart) => !!cart)
      )
      .subscribe((cart) => {
        this.itemCount = cart.isComplete ? 0 : cart.lineItems.length
      })
    this.storefront.store$
      .pipe(
        untilDestroyed(this),
        filter((store) => !!store)
      )
      .subscribe((store) => {
        this.currentStore = store
      })
  }

  public async logout() {
    await this.user.logout()
    this.auth.logout()
  }

  private getContrast(color: string) {
    // darken the color to raise the readability umbral
    return tinycolor.mostReadable(tinycolor(color).darken(25), [
      '#ffffff',
      '#504c4a'
    ])
  }
}
