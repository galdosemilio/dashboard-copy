import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  OnDestroy,
  OnInit
} from '@angular/core'
import { select, Store } from '@ngrx/store'
import { TranslateService } from '@ngx-translate/core'
import { isEmpty } from 'lodash'
import * as moment from 'moment-timezone'
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy'
import { Subject } from 'rxjs'

import {
  AgeDataSource,
  ReportsCriteria,
  StatisticsDatabase
} from '@app/dashboard/reports/services'
import { criteriaSelector, ReportsState } from '@app/dashboard/reports/store'
import { NotifierService } from '@app/service'
import { _, TranslationsObject } from '@app/shared'

@UntilDestroy()
@Component({
  selector: 'app-statistics-patient-stats-age',
  templateUrl: './age.component.html'
})
export class AgeComponent implements OnInit, AfterViewInit, OnDestroy {
  // FIXME receive observable of the connect
  source: AgeDataSource
  translations: TranslationsObject

  // subscription for selector changes
  data: ReportsCriteria

  // refresh trigger
  refresh$ = new Subject<void>()

  constructor(
    private cdr: ChangeDetectorRef,
    private translator: TranslateService,
    private database: StatisticsDatabase,
    private notifier: NotifierService,
    private store: Store<ReportsState>
  ) {}

  ngOnInit() {
    // factors with translatable units
    this.translator.onLangChange.pipe(untilDestroyed(this)).subscribe(() => {
      this.buildTranslations()
    })

    this.source = new AgeDataSource(
      this.notifier,
      this.database,
      this.translator
    )

    this.source.addRequired(this.refresh$, () => ({
      organization: this.data ? this.data.organization : null,
      date: this.data ? moment(this.data.endDate).format('YYYY-MM-DD') : null,
      age: [
        { name: this.translations['REPORTS.AGE_THRESHOLD_0'], threshold: 0 },
        { name: this.translations['REPORTS.AGE_THRESHOLD_18'], threshold: 18 },
        { name: this.translations['REPORTS.AGE_THRESHOLD_25'], threshold: 25 },
        { name: this.translations['REPORTS.AGE_THRESHOLD_35'], threshold: 35 },
        { name: this.translations['REPORTS.AGE_THRESHOLD_45'], threshold: 45 },
        { name: this.translations['REPORTS.AGE_THRESHOLD_55'], threshold: 55 },
        { name: this.translations['REPORTS.AGE_THRESHOLD_65'], threshold: 65 }
      ]
    }))

    this.store
      .pipe(untilDestroyed(this), select(criteriaSelector))
      .subscribe((reportsCriteria: ReportsCriteria) => {
        if (!isEmpty(reportsCriteria)) {
          this.data = reportsCriteria
          this.buildTranslations()
        }
      })
  }

  ngAfterViewInit() {
    if (!this.source.isLoaded && this.data && this.translations) {
      this.refresh$.next()
      this.cdr.detectChanges()
    }
  }

  ngOnDestroy() {
    this.source.disconnect()
  }

  private buildTranslations() {
    this.translator
      .get([
        _('REPORTS.AGE_THRESHOLD_0'),
        _('REPORTS.AGE_THRESHOLD_18'),
        _('REPORTS.AGE_THRESHOLD_25'),
        _('REPORTS.AGE_THRESHOLD_35'),
        _('REPORTS.AGE_THRESHOLD_45'),
        _('REPORTS.AGE_THRESHOLD_55'),
        _('REPORTS.AGE_THRESHOLD_65')
      ])
      .subscribe((translations) => {
        this.translations = translations
        this.refresh$.next()
      })
  }
}
