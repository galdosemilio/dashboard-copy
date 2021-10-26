import {
  AfterViewInit,
  Component,
  Inject,
  OnInit,
  Renderer2
} from '@angular/core'
import { CCRConfig, CCRPalette } from '@app/config'
import {
  layoutSelector,
  OpenMenu,
  UILayoutState
} from '@app/layout/store/layout'
import { FetchInitiatedCalls } from '@app/layout/store/call'
import { ContextService, EventsService, LanguageService } from '@app/service'
import { Conference } from '@coachcare/sdk'
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy'
import { select, Store } from '@ngrx/store'
import { paletteSelector } from '@app/store/config'
import { applyPalette, configViewLangAttrs } from '../helpers'
import { DOCUMENT } from '@angular/common'
import { LangChangeEvent, TranslateService } from '@ngx-translate/core'

@UntilDestroy()
@Component({
  selector: 'ccr-wellcore-layout',
  templateUrl: './wellcore-layout.component.html'
})
export class WellcoreLayoutComponent implements AfterViewInit, OnInit {
  public lang = 'en'
  public layout?: UILayoutState
  public palette?: CCRPalette
  public panelEnabled = true
  public showVideoRating = false

  constructor(
    private context: ContextService,
    private callNotificationService: Conference,
    @Inject(DOCUMENT) private document: Document,
    private events: EventsService,
    private language: LanguageService,
    private renderer: Renderer2,
    private store: Store<CCRConfig>,
    private translate: TranslateService
  ) {}

  public ngAfterViewInit(): void {
    this.update(this.language.get())
  }

  public ngOnInit(): void {
    this.update(this.translate.currentLang)

    this.store.dispatch(
      new FetchInitiatedCalls({
        account: this.context.user.id,
        organization: this.context.organizationId,
        status: 'in-progress'
      })
    )

    this.createEventListeners()
    this.subscribeToStores()
  }

  public menuOpen($event: Event): void {
    this.store.dispatch(new OpenMenu())
    $event.stopPropagation()
  }

  private createEventListeners(): void {
    this.callNotificationService.listenForCallNotifications()
    this.context.orphanedAccount$.subscribe((isOrphaned) => {
      this.panelEnabled = !isOrphaned
    })

    this.events.listen(
      'videoconferencing.ratingWindow.setState',
      this.setRatingWindowState.bind(this)
    )

    this.translate.onLangChange.subscribe((change: LangChangeEvent) => {
      this.lang = change.lang ?? 'en'
      this.update(change.lang)
    })
  }

  private setRatingWindowState(openState: boolean = false): void {
    this.showVideoRating = openState
  }

  private subscribeToStores(): void {
    this.store
      .pipe(select(layoutSelector), untilDestroyed(this))
      .subscribe((state) => {
        this.layout = state
      })

    this.store
      .pipe(select(paletteSelector), untilDestroyed(this))
      .subscribe((palette) => {
        this.palette = palette
        applyPalette(palette, this.renderer, this.document)
      })
  }

  private update(lang: string): void {
    configViewLangAttrs(this.document, lang, this.language.getDir())
  }
}
