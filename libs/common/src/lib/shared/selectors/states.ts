import { filter, sortBy } from 'lodash';
import { STATES, StateSegment } from './states.const';

export function getStatesSelector(lang: string, search?: string | StateSegment) {
  const states = sortBy(STATES, `viewValue.${lang}`);
  if (typeof search === 'string') {
    // escape the variables with regex identifiers
    const searchFor = search.replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, '\\$&');
    return filter(states, state => RegExp(searchFor, 'i').test(state.viewValue[lang]));
  }
  return states;
}
