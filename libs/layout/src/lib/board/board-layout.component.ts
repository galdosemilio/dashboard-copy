import { Component, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core'
import { _, TranslationsObject } from '@coachcare/backend/shared'
import {
  ContextService,
  EventsService,
  LanguageService,
  LayoutService
} from '@coachcare/common/services'
import { LangChangeEvent, TranslateService } from '@ngx-translate/core'
import { Subscription } from 'rxjs'

@Component({
  selector: 'ccr-layout',
  templateUrl: './board-layout.component.html',
  styleUrls: ['./board-layout.component.scss'],
  encapsulation: ViewEncapsulation.None
})
// tslint:disable-next-line:component-class-suffix
export class BoardLayout implements OnInit, OnDestroy {
  isMenuOpened: boolean
  isPanelOpened: boolean
  isPanelEnabled: boolean

  lang: string
  translations: TranslationsObject = {}

  menuSub: Subscription
  panelSub: Subscription
  panelEnabledSub: Subscription

  constructor(
    private translator: TranslateService,
    private context: ContextService,
    private bus: EventsService,
    private language: LanguageService,
    private layout: LayoutService
  ) {}

  ngOnInit() {
    this.lang = this.language.get()
    this.translateTexts()

    this.translator.onLangChange.subscribe((change: LangChangeEvent) => {
      this.lang = change.lang
      this.translateTexts()
    })
    this.bus.register('user.data', this.translateTexts.bind(this))

    this.menuSub = this.layout.menuState.subscribe((v) => {
      this.isMenuOpened = v
    })

    this.panelSub = this.layout.panelState.subscribe((v) => {
      this.isPanelOpened = v
    })

    this.panelEnabledSub = this.layout.isPanelEnabled.subscribe((v) => {
      this.isPanelEnabled = v
    })
  }

  ngOnDestroy() {
    this.menuSub.unsubscribe()
    this.panelSub.unsubscribe()
    this.panelEnabledSub.unsubscribe()
  }

  translateTexts() {
    const user = this.context.user
    const userName = user.id
      ? user.firstName + ' ' + user.lastName.charAt(0)
      : ''

    this.translator
      .get([_('MENU.HELLO')], {
        userName: userName
      })
      .subscribe((translations: TranslationsObject) => {
        this.translations = translations
      })
  }
}
