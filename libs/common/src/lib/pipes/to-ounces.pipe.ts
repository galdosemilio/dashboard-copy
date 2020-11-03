import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'toOunces'
})
export class ToOuncesPipe implements PipeTransform {
  // Convert milliliters to ounces
  transform(value: number): any {
    const converted = value * 0.033814;
    return converted.toFixed(0);
  }
}
