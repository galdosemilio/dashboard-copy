import { HttpClient } from '@angular/common/http';
import { InjectionToken } from '@angular/core';
import { TranslateLoader } from '@ngx-translate/core';
import { map as mapArray, merge, template } from 'lodash';
import { forkJoin } from 'rxjs';
import { map } from 'rxjs/operators';

export interface TranslateCatalogs {
  [name: string]: string;
}

export const I18N_CATALOGS = new InjectionToken<TranslateCatalogs>('ccr.i18n.catalogs');

export class TranslateHttpLoader implements TranslateLoader {
  constructor(private http: HttpClient, public catalogs: TranslateCatalogs) {}

  /**
   * Gets the translations from the server
   */
  getTranslation(lang: string): any {
    return forkJoin(
      mapArray(this.catalogs, catalog => {
        const path = template(catalog);
        return this.http.get(path({ lang }));
      })
    ).pipe(map(response => response.reduce(merge)));
  }
}

export function TranslateLoaderFactory(http: HttpClient, catalogs: TranslateCatalogs) {
  return new TranslateHttpLoader(http, catalogs);
}
