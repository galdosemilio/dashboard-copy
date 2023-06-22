import { DOCUMENT } from '@angular/common'
import {
  Component,
  HostListener,
  Inject,
  OnDestroy,
  OnInit
} from '@angular/core'
import { AppBreakpoints, STORAGE_COACHES_PAGINATION } from '@app/config'
import { CloseMenuFor, ResizeLayout, UIState } from '@app/layout/store'
import {
  ConfigService,
  GestureService,
  MessagingService,
  TimeTrackerService
} from '@app/service'
import { MatDatepickerIntl } from '@coachcare/datepicker'
import { Store } from '@ngrx/store'
import { TranslateService } from '@ngx-translate/core'
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy'
import * as pdfMake from 'pdfmake'
import * as pdfFonts from 'pdfmake/build/vfs_fonts'
import { CallLayoutService } from './layout/call/services/call-layout.service'
import { RecoverCall } from './layout/store/call'

@UntilDestroy()
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnDestroy, OnInit {
  @HostListener('window:beforeunload', ['$event'])
  ccrBeforeUnload(): void {
    this.timeTracker.stashTime()
    this.clearAccountsPaginationCache()
    this.callLayout.storeCallSettings()
  }
  config: AppBreakpoints

  private globalKey = 'GLOBAL'

  constructor(
    private callLayout: CallLayoutService,
    private intl: MatDatepickerIntl,
    private gesture: GestureService,
    private messaging: MessagingService,
    private timeTracker: TimeTrackerService,
    private translate: TranslateService,
    private store: Store<UIState>,
    config: ConfigService,
    @Inject(DOCUMENT) document: HTMLDocument
  ) {
    this.config = config.get('app.screen')
  }

  ngOnDestroy() {}

  ngOnInit() {
    pdfMake.vfs = pdfFonts.pdfMake.vfs
    this.initGlobalServices()
    this.onLangChange()
    this.translate.onLangChange
      .pipe(untilDestroyed(this))
      .subscribe(() => this.onLangChange())

    this.store.dispatch(new RecoverCall())
  }

  public onResize(): void {
    this.store.dispatch(new ResizeLayout())
  }

  public closeMenu(): void {
    // for xs screens, clicking the body closes the menu
    const width = document.body.clientWidth
    if (width <= this.config.md) {
      this.store.dispatch(new CloseMenuFor('md'))
    }
  }

  private clearAccountsPaginationCache(): void {
    window.localStorage.removeItem(STORAGE_COACHES_PAGINATION)
  }

  private initGlobalServices(): void {
    this.gesture.init()
    this.messaging.init()
  }

  private onLangChange() {
    this.translate.get(this.globalKey).subscribe((translations) => {
      this.intl.buttonSubmitText = translations.OK
      this.intl.buttonCancelText = translations.CANCEL
      this.intl.changes.next()
    })
  }
}
