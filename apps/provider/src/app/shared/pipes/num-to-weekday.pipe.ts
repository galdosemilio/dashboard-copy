import { Pipe, PipeTransform } from '@angular/core'
import { _ } from '@app/shared/utils'

const weekdays = [
  _('DAYS.SUNDAY'),
  _('DAYS.MONDAY'),
  _('DAYS.TUESDAY'),
  _('DAYS.WEDNESDAY'),
  _('DAYS.THURSDAY'),
  _('DAYS.FRIDAY'),
  _('DAYS.SATURDAY')
]

@Pipe({ name: 'ccrNumToWeekday' })
export class NumberToWeekdayPipe implements PipeTransform {
  transform(v: number): string {
    return weekdays[v] ? weekdays[v] : ''
  }
}
