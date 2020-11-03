import { filter, sortBy } from 'lodash';
import { TimezoneItem, TIMEZONES } from './timezones.const';

export function getTimezonesSelector(lang: string, search?: string | TimezoneItem) {
  const timezones = sortBy(TIMEZONES, `viewValue.${lang}`);
  if (typeof search === 'string') {
    // escape the variables with regex identifiers
    const searchFor = search.replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, '\\$&');
    return filter(timezones, tz => RegExp(searchFor, 'i').test(tz.viewValue[lang]));
  }
  return timezones;
}
