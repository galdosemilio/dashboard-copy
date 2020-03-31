import { Component, Inject, OnDestroy } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { untilDestroyed } from 'ngx-take-until-destroy';

import { CCRFacade } from '@coachcare/backend/store';
import { LanguageService } from '@coachcare/common/services/language.service';
import { differenceWith } from 'lodash';
import { localeList } from './languages.locales';

@Component({
  selector: 'ccr-dialog-language',
  templateUrl: 'languages.dialog.html',
  styleUrls: ['languages.dialog.scss'],
  host: {
    class: 'ccr-dialog ccr-plain'
  }
})
export class LanguagesDialog implements OnDestroy {
  locales: any;
  lang: string;

  colSpan = 1;

  constructor(
    private store: CCRFacade,
    private language: LanguageService,
    public dialogRef: MatDialogRef<LanguagesDialog>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.locales = differenceWith(
      localeList,
      this.language.localesBlacklist,
      (viewValue, value) => viewValue.language.code === value
    );

    this.lang = this.language.get();
    this.store.lang$
      .pipe(untilDestroyed(this))
      .subscribe(lang => (this.lang = lang || this.lang));
  }

  ngOnDestroy() {}

  setLocale(locale: string) {
    this.store.changeLang(locale);
    this.dialogRef.close();
  }
}
