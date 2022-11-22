import {
  Component,
  HostBinding,
  Inject,
  Input,
  OnInit,
  Optional,
  ViewChild
} from '@angular/core'
import { FormControl } from '@angular/forms'
import { MatAutocompleteTrigger } from '@coachcare/material'
import { Router } from '@angular/router'
import { SearchDataSource } from '@coachcare/backend/model'
import { AutocompleterOption } from '@coachcare/backend/shared'
import { ConfigService } from '@coachcare/common/services'
import { APP_SEARCH_SOURCE } from '@coachcare/common/shared'
import { concat, isArray, sortBy } from 'lodash'
import { merge, Observable } from 'rxjs'
import { debounceTime, distinctUntilChanged } from 'rxjs/operators'

@Component({
  selector: 'ccr-search',
  templateUrl: './search.component.html'
})
export class SearchComponent implements OnInit {
  @HostBinding('class.disabled') isDisabled = false
  @Input() fill: string

  @ViewChild(MatAutocompleteTrigger, { static: false })
  trigger: MatAutocompleteTrigger

  searchCtrl: FormControl
  results: Array<AutocompleterOption>

  constructor(
    private router: Router,
    private config: ConfigService,
    @Optional()
    @Inject(APP_SEARCH_SOURCE)
    private datasources: Array<SearchDataSource<any, any, any>>
  ) {
    this.isDisabled = !isArray(datasources)
    this.fill = this.isDisabled
      ? this.config.get('palette.disabled')
      : this.config.get('palette.contrast')
  }

  ngOnInit() {
    if (!this.isDisabled) {
      this.setupDatasources()
    }
    this.setupAutocompleter()
  }

  onSelect(account: AutocompleterOption): void {
    this.results = []
    void this.router.navigate(
      typeof account.value === 'string' ? [account.value] : account.value
    )
  }

  private setupDatasources() {
    const streams: Array<Observable<any>> = []
    this.datasources.forEach(
      (datasource: SearchDataSource<any, any, any>, i) => {
        streams.push(datasource.attach())
      }
    )
    merge(...streams).subscribe((results: Array<AutocompleterOption>) => {
      this.displayResults(concat(this.results, results))
    })
  }

  private setupAutocompleter() {
    this.searchCtrl = new FormControl()
    this.searchCtrl.valueChanges
      .pipe(debounceTime(500), distinctUntilChanged())
      .subscribe((query) => {
        typeof query === 'string'
          ? void this.search(query)
          : this.trigger.closePanel()
      })
  }

  private async search(query: string): Promise<void> {
    this.results = []
    for (const datasource of this.datasources) {
      if (!/^\d+$/.test(query)) {
        datasource.search(query, 5)
        continue
      }

      try {
        const singleData = await datasource.getSingle(query)
        this.results.push(datasource.mapSingle(singleData))
        this.displayResults(this.results)
      } catch (error) {}
    }
  }

  private displayResults(all: Array<AutocompleterOption>) {
    this.results = sortBy(all, 'viewValue')
    if (this.results.length) {
      this.trigger.openPanel()
    } else {
      this.trigger.closePanel()
    }
  }
}
