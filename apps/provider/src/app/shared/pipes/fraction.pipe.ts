import { Pipe, PipeTransform } from '@angular/core'

@Pipe({ name: 'fraction' })
export class FractionPipe implements PipeTransform {
  private fractionDeviation = 0.005
  private hardCodedFractions = [
    {
      top: 1 / 2 + this.fractionDeviation,
      bottom: 1 / 2 - this.fractionDeviation,
      displayValue: '1/2'
    },
    {
      top: 1 / 3 + this.fractionDeviation,
      bottom: 1 / 3 - this.fractionDeviation,
      displayValue: '1/3'
    },
    {
      top: 1 / 4 + this.fractionDeviation,
      bottom: 1 / 4 - this.fractionDeviation,
      displayValue: '1/4'
    },
    {
      top: 1 / 6 + this.fractionDeviation,
      bottom: 1 / 6 - this.fractionDeviation,
      displayValue: '1/6'
    },
    {
      top: 1 / 8 + this.fractionDeviation,
      bottom: 1 / 8 - this.fractionDeviation,
      displayValue: '1/8'
    },
    {
      top: 1 / 9 + this.fractionDeviation,
      bottom: 1 / 9 - this.fractionDeviation,
      displayValue: '1/9'
    },
    {
      top: 2 / 3 + this.fractionDeviation,
      bottom: 2 / 3 - this.fractionDeviation,
      displayValue: '2/3'
    }
  ]

  public transform(value: number): string {
    if (!value) {
      return ''
    }

    const hardCodedMatch = this.getHardCodedMatch(value)

    if (hardCodedMatch) {
      return hardCodedMatch
    }

    const rawNumber = value.toString().split('.')

    if (rawNumber.length === 1) {
      return value.toString()
    }

    const fraction = Number(`0.${rawNumber[1]}`)

    const fractionHardCodedMatch = this.getHardCodedMatch(fraction)

    if (fractionHardCodedMatch) {
      return `${
        Number(rawNumber[0]) ? rawNumber[0] + ' ' : ''
      }${fractionHardCodedMatch}`
    }

    const len = fraction.toString().length - 2

    let denominator = Math.pow(10, len)
    let numerator = fraction * denominator

    const divisor = this.greatestCommonDenom(numerator, denominator)

    numerator /= divisor
    denominator /= divisor

    return `${
      Number(rawNumber[0]) ? rawNumber[0] + ' ' : ''
    }${numerator.toFixed()}/${denominator.toFixed()}`
  }

  private greatestCommonDenom(a, b): number {
    if (!b) {
      return a
    }

    a = parseInt(a, 10)
    b = parseInt(b, 10)

    return this.greatestCommonDenom(b, a % b)
  }

  private getHardCodedMatch(value: number): string {
    const match = this.hardCodedFractions.find(
      (fractionObj) => fractionObj.top >= value && fractionObj.bottom <= value
    )

    if (match) {
      return match.displayValue
    }

    return
  }
}
