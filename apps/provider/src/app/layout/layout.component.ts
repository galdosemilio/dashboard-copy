import { DOCUMENT } from '@angular/common'
import {
  AfterViewInit,
  Component,
  Inject,
  OnInit,
  Renderer2
} from '@angular/core'
import { select, Store } from '@ngrx/store'
import { LangChangeEvent, TranslateService } from '@ngx-translate/core'
import { Observable } from 'rxjs'
import * as tinycolor from 'tinycolor2'

import { CCRConfig, CCRPalette } from '@app/config'
import { layoutSelector, OpenMenu, UILayoutState } from '@app/layout/store'
import { ContextService, EventsService, LanguageService } from '@app/service'
import { _, TranslationsObject } from '@app/shared'
import { paletteSelector } from '@app/store/config'

@Component({
  selector: 'app-layout',
  templateUrl: './layout.component.html'
})
export class LayoutComponent implements OnInit, AfterViewInit {
  palette: CCRPalette

  lang: string
  layout$: Observable<UILayoutState>
  translations: TranslationsObject = {}

  constructor(
    private renderer: Renderer2,
    private translator: TranslateService,
    private store: Store<CCRConfig>,
    private layout: Store<UILayoutState>,
    private context: ContextService,
    private bus: EventsService,
    private language: LanguageService,
    @Inject(DOCUMENT) private document: any
  ) {
    this.store.pipe(select(paletteSelector)).subscribe((palette) => {
      this.palette = palette
      const primary =
        palette.theme === 'accent' ? palette.accent : palette.primary
      const accent =
        palette.theme === 'accent' ? palette.primary : palette.accent

      this.renderer.setAttribute(
        this.document.body,
        'style',
        `
        --primary: ${primary};
        --primary-contrast: ${this.getContrast(primary)};
        --primary-lighten: ${tinycolor(primary).lighten(26)};
        --primary-lighten-contrast: ${this.getLightContrast(
          tinycolor(primary).lighten(26)
        )};
        --primary-contrast-light: ${this.getLightContrast(
          tinycolor(primary)
        ).lighten(52)};
        --primary-darken: ${tinycolor(primary).darken(26)};
        --primary-a12: ${tinycolor(primary).setAlpha(0.12)};
        --primary-a26: ${tinycolor(primary).setAlpha(0.26)};
        --primary-a40: ${tinycolor(primary).setAlpha(0.4)};
        --primary-a60: ${tinycolor(primary).setAlpha(0.6)};
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
        --sidenav: ${palette.sidenav};
        --sidenav-darken: ${tinycolor(palette.sidenav).darken(5)};
        --sidenav-darkest: ${tinycolor(palette.sidenav).darken(8)};

        --toolbar: ${palette.toolbar === 'accent' ? accent : primary};
        --toolbar-contrast: ${palette.contrast};

        --background: ${palette.background};
        --bg-bar: ${palette.bg_bar};
        --bg-bar-dark: ${tinycolor(palette.bg_bar).darken(50)};
        --bg-panel: ${palette.bg_panel};
        --base: ${palette.base};
        --text: ${palette.text};
        --text-light: ${tinycolor(palette.text).lighten(15)};
        --text-lighter: ${tinycolor(palette.text).lighten(30)};
        --text-lightest: ${tinycolor(palette.text).lighten(60)};
        --disabled: ${palette.disabled};
        `
      )
    })
  }

  ngOnInit() {
    this.layout$ = this.store.pipe(select(layoutSelector))
    this.translator.onLangChange.subscribe((change: LangChangeEvent) => {
      this.update(change.lang)
    })
    this.update(this.translator.currentLang)
    this.bus.register('user.data', this.translateTexts.bind(this))
  }

  ngAfterViewInit() {
    this.update(this.language.get())
  }

  translateTexts() {
    const user = this.context.user
    const userName = user.firstName + ' ' + user.lastName.charAt(0)

    this.translator
      .get([_('MENU.HELLO')], {
        userName: userName
      })
      .subscribe((translations: TranslationsObject) => {
        this.translations = translations
      })
  }

  openMenu() {
    this.layout.dispatch(new OpenMenu())
  }

  private update(lang: string) {
    this.lang = lang
    this.translateTexts()
    this.configViewLangAttrs()
  }

  private configViewLangAttrs() {
    if (document) {
      document.body.classList.remove('ltr', 'rtl')
      document.body.classList.add(this.language.getDir())
      document.documentElement.setAttribute('lang', this.lang)
      document.body.setAttribute('dir', this.language.getDir())
    }
  }

  private getContrast(color: string) {
    // darken the color to raise the readability umbral
    return tinycolor.mostReadable(tinycolor(color).darken(10), [
      '#ffffff',
      '#504c4a'
    ])
  }
  private getLightContrast(color: string) {
    // lighten the color to raise the readability umbral
    return tinycolor.mostReadable(tinycolor(color).lighten(10), [
      '#ffffff',
      '#504c4a'
    ])
  }
}
