import { Component, OnDestroy } from '@angular/core'
import { MatDialogRef } from '@coachcare/material'
import { TranslateService } from '@ngx-translate/core'
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy'

import { ContextService, LanguageService } from '@app/service'
import { differenceWith, get } from 'lodash'
import { localeList } from './languages.locales'

@UntilDestroy()
@Component({
  selector: 'ccr-dialog-language',
  templateUrl: 'languages.dialog.html',
  host: {
    class: 'ccr-dialog ccr-plain'
  }
})
export class LanguagesDialog implements OnDestroy {
  locales: any
  lang: string

  colSpan = 1

  constructor(
    private context: ContextService,
    private translator: TranslateService,
    private language: LanguageService,
    public dialogRef: MatDialogRef<LanguagesDialog>
  ) {
    this.locales = differenceWith(
      localeList,
      get(this.context.organization, 'mala.localesBlacklist', []),
      (viewValue, value) => viewValue.language.code === value
    )

    this.lang = this.language.get()
    this.translator.onLangChange
      .pipe(untilDestroyed(this))
      .subscribe((change) => (this.lang = change.lang || this.lang))
  }

  ngOnDestroy() {}

  setLocale(locale: string) {
    this.language.set(locale)
    this.dialogRef.close([locale])
  }
}
