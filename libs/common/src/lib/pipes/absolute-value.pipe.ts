import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'abs'
})
export class AbsoluteValuePipe implements PipeTransform {
  transform(v: number): any {
    if (!v) {
      return 0;
    }
    if (v < 0) {
      v = v * -1;
    }
    return v.toFixed(1);
  }
}
