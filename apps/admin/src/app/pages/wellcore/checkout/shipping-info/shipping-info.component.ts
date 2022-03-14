import { Component, Input, OnInit } from '@angular/core'
import { FormGroup } from '@angular/forms'
import { Timezone, TimezoneResponse } from '@coachcare/sdk'
import { UntilDestroy } from '@ngneat/until-destroy'
import { TranslateService } from '@ngx-translate/core'
import { STATES_LIST, WhitelistedSelectorOption } from '../../model'

@UntilDestroy()
@Component({
  selector: 'ccr-wellcore-shipping-info',
  templateUrl: './shipping-info.component.html',
  styleUrls: ['./shipping-info.component.scss']
})
export class WellcoreShippingInfoComponent implements OnInit {
  @Input() formGroup: FormGroup

  constructor(
    private timezone: Timezone,
    private translate: TranslateService
  ) {}

  public lang: string
  public states: WhitelistedSelectorOption[] = STATES_LIST
  public timezones: Array<TimezoneResponse> = this.timezone.fetch()

  public ngOnInit(): void {
    this.lang = this.translate.currentLang.split('-')[0]
  }
}
