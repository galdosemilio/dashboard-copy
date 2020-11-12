import { Pipe, PipeTransform } from '@angular/core'

import { ConfigService } from '@app/service'

@Pipe({
  name: 'maxChars'
})
export class MaxCharsPipe implements PipeTransform {
  maxLength: number

  constructor(private config: ConfigService) {
    this.maxLength = this.config.get('app.default.noteMaxLenght', 100)
  }

  transform(v: string, charLength: any): any {
    if (!charLength) {
      return v
    }
    charLength = Number(charLength) || this.maxLength
    const ellipsis = v.length > charLength ? '...' : ''
    return v.substr(0, charLength) + ellipsis
  }
}
