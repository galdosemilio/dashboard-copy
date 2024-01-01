import { DOCUMENT } from '@angular/common'
import { Component, Inject, OnDestroy, OnInit, Renderer2 } from '@angular/core'
import { LanguageService } from '@coachcare/common/services'
import { select, Store } from '@ngrx/store'
import { LangChangeEvent, TranslateService } from '@ngx-translate/core'
import { Subscription } from 'rxjs'
import tinycolor from 'tinycolor2'

import { AppPalette, updateFavIcon } from '@coachcare/common/shared'
import { OrgPrefSelectors, OrgPrefState } from '@coachcare/common/store'

@Component({
  selector: 'ccr-plain-layout',
  templateUrl: './plain-layout.component.html',
  styleUrls: ['./plain-layout.component.scss']
})
// eslint-disable-next-line @angular-eslint/component-class-suffix
export class PlainLayout implements OnInit, OnDestroy {
  lang: string
  logoUrl: string
  displayName: string | undefined
  palette: AppPalette
  subs: Array<Subscription> = []
  mala: any

  constructor(
    @Inject(DOCUMENT) private document: any,
    private renderer: Renderer2,
    private translator: TranslateService,
    private language: LanguageService,
    private store: Store<OrgPrefState.State>
  ) {
    this.store
      .pipe(select(OrgPrefSelectors.selectOrgPref))
      .subscribe((pref) => {
        this.displayName = pref.displayName
        this.logoUrl = pref.assets.logoUrl
        this.mala = pref.mala
        const palette = (this.palette = pref.assets.color)
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
        // FIXME base text disabled uniform or not?
      })
  }

  ngOnInit() {
    this.update(this.language.get())

    this.subs[0] = this.translator.onLangChange.subscribe(
      (change: LangChangeEvent) => {
        this.update(change.lang)
      }
    )
  }

  ngOnDestroy() {
    this.subs.forEach((s) => s.unsubscribe())
  }

  private update(lang: string) {
    this.lang = lang
    if (document) {
      try {
        document.body.setAttribute('dir', this.language.getDir())
        document.documentElement.setAttribute('lang', lang)
      } catch (e) {}
    }
  }

  private getContrast(color: string) {
    // darken the color to raise the readability umbral
    return tinycolor.mostReadable(tinycolor(color).darken(25), [
      '#ffffff',
      '#504c4a'
    ])
  }
}
