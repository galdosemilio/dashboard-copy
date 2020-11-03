import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'fraction' })
export class FractionPipe implements PipeTransform {
  public transform(value: number): string {
    if (!value) {
      return '';
    }

    const rawNumber = value.toString().split('.');

    if (rawNumber.length === 1) {
      return value.toString();
    }

    const fraction = Number(`0.${rawNumber[1]}`);
    const len = fraction.toString().length - 2;

    let denominator = Math.pow(10, len);
    let numerator = fraction * denominator;

    const divisor = this.greatestCommonDenom(numerator, denominator);

    numerator /= divisor;
    denominator /= divisor;

    return `${rawNumber[0]} ${numerator.toFixed()}/${denominator.toFixed()}`;
  }

  private greatestCommonDenom(a, b): number {
    if (!b) {
      return a;
    }

    a = parseInt(a, 10);
    b = parseInt(b, 10);

    return this.greatestCommonDenom(b, a % b);
  }
}
