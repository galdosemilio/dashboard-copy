import { Pipe, PipeTransform } from '@angular/core';
import { ContextService } from '@coachcare/common/services';

import * as momentNs from 'moment-timezone';
const moment = momentNs;

@Pipe({ name: 'ccrUtc' })
export class UtcPipe implements PipeTransform {
  constructor(private context: ContextService) {}

  transform(
    value: string | number | momentNs.Moment | Date | void | undefined | null
  ): momentNs.Moment {
    const date = moment.utc(value ? value : undefined);
    return this.context.user.timezone ? date.tz(this.context.user.timezone) : date;
  }
}
