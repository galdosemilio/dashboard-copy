import { Injectable, Optional } from '@angular/core';
import {
  DateAdapter,
  MatDatepickerIntl,
  MatDatepickerIntlCatalog
} from '@coachcare/datepicker';
import { LangChangeEvent, TranslateService } from '@ngx-translate/core';
import { DatepickerEN } from './datepicker.en';
import { DatepickerES } from './datepicker.es';

@Injectable()
export class DatepickerIntl<D> extends MatDatepickerIntl {
  private _fields: string[];
  private _translations: { [lang: string]: MatDatepickerIntlCatalog };

  constructor(
    private _translator: TranslateService,
    @Optional() private _dateAdapter: DateAdapter<D>
  ) {
    super();
    // index the fields to translate
    this._fields = Object.keys(this).filter(
      name => !name.startsWith('_') && name !== 'changes'
    );

    // create the translations catalogs
    this._translations = {
      en: new DatepickerEN(),
      es: new DatepickerES()
    };

    // keep the translations updated
    this._update(this._translator.currentLang || 'en');
    this._translator.onLangChange.subscribe((change: LangChangeEvent) => {
      this._update(change.lang);
    });
  }

  private _update(lang: string) {
    const translations = this._translations[lang];

    // check if it's a different catalog
    let field = this._fields[0];
    if (this[field] === translations[field]) {
      return;
    }

    for (field of this._fields) {
      if (translations[field]) {
        this[field] = translations[field];
      }
    }
    this._dateAdapter.setLocale(lang);
    this.changes.next();
  }
}
