import { Inject, Injectable } from '@angular/core';
import { APP_CONFIG, AppConfig } from '@coachcare/common/shared';
import { get, set } from 'lodash';

import * as momentNs from 'moment-timezone';
const moment = momentNs;

/**
 * Config Service
 */
@Injectable()
export class ConfigService {
  /**
   * Inject Initial Config
   */
  constructor(@Inject(APP_CONFIG) private config: AppConfig) {
    this.config = config;
  }

  get(path: string, defaultValue: any = {}) {
    return get(this.config, path, defaultValue);
  }

  set(path: string, value: any) {
    return set(this.config, path, value);
  }

  /**
   * Resolve the initial date for a form
   */
  getInitialDate() {
    const start = get(this.config, 'default.startTime', {
      hours: 8,
      minutes: 0,
      seconds: 0
    });
    const initial = moment(start);
    if (initial.isBefore(moment(), 'minutes')) {
      const day = initial.day();
      const add = day > 0 && day < 5 ? 1 : 6 - day + 2;
      initial.add(add, 'day');
    }
    return initial;
  }
}
