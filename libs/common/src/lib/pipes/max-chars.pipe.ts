import { Pipe, PipeTransform } from '@angular/core';
import { ConfigService } from '@coachcare/common/services';

@Pipe({
  name: 'maxChars'
})
export class MaxCharsPipe implements PipeTransform {
  maxLength: number;

  constructor(private config: ConfigService) {
    this.maxLength = this.config.get('app.default.noteMaxLenght', 100);
  }

  transform(v: string, charLength: any): any {
    charLength = Number(charLength);
    if (!charLength) {
      return v;
    }
    const ellipsis = v.length > this.maxLength ? '...' : '';
    return v.substr(0, charLength) + ellipsis;
  }
}
