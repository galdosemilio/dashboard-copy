import { formatNumber } from '@angular/common';
import { Inject, LOCALE_ID, Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'numberFormat'
})
export class NumberFormatPipe implements PipeTransform {
  constructor(@Inject(LOCALE_ID) private _locale) {}

  transform(value: any, digitsInfo?: string, locale?: any): string | null {
    if (value === null || value === '' || value !== value) {
      return null;
    }

    locale = locale || this._locale;
    const num = this.strToNumber(value);

    return formatNumber(num, locale.lang, digitsInfo);
  }

  strToNumber(value: number | string): number {
    // Convert strings to numbers
    if (typeof value === 'string' && !isNaN(Number(value) - parseFloat(value))) {
      return Number(value);
    }
    if (typeof value !== 'number') {
      throw new Error(`${value} is not a number`);
    }
    return value;
  }
}
