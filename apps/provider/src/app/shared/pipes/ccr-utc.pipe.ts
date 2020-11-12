import { Pipe, PipeTransform } from '@angular/core'
import * as moment from 'moment-timezone'

import { ContextService } from '@app/service'

@Pipe({ name: 'ccrUtc' })
export class CcrUtcPipe implements PipeTransform {
  constructor(private context: ContextService) {}

  transform(value: Date | moment.Moment | string | number): moment.Moment {
    return moment.utc(value).tz(this.context.user.timezone)
  }
}
