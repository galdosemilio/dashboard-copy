import { Pipe, PipeTransform } from '@angular/core'
import { _ } from '@app/shared/utils'

@Pipe({ name: 'accountType' })
export class AccountTypePipe implements PipeTransform {
  transform(value: string): string {
    let result
    if ([2, '2', 'provider'].includes(value)) {
      result = _('GLOBAL.COACH')
    } else if ([3, '3', 'client'].includes(value)) {
      result = _('GLOBAL.PATIENT')
    }
    return result ? result : ''
  }
}
