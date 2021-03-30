import { Directive, ElementRef, Input, OnInit } from '@angular/core'
import { AbstractControl, ValidatorFn } from '@angular/forms'
import { uniq } from 'lodash'

interface FixedCharPosition {
  char: string
  position: number
}

export function ccrInputMaskValidator(
  mask: string,
  isRequired = false
): ValidatorFn {
  return (control: AbstractControl): any | null => {
    return (!isRequired && control.value === '') ||
      control.value.length === mask.length
      ? null
      : { invalidMask: true }
  }
}

@Directive({
  selector: '[ccrInputMask]'
})
export class CcrInputMaskDirective implements OnInit {
  @Input() ccrInputMask: string

  private fixedCharPositions: FixedCharPosition[] = []
  private input: HTMLInputElement
  private maskFixedCharsRegex: RegExp
  private maskCharsRegex = new RegExp('[^#]', 'gi')
  private rawValue: string

  constructor(private hostElement: ElementRef) {}

  public ngOnInit(): void {
    this.buildMaskFixedCharsRegex()
    this.input = this.hostElement.nativeElement
    this.input.addEventListener('input', () => {
      this.rawValue = this.unmaskValue(this.input.value)
      this.input.value = this.maskValue(this.rawValue)
    })
  }

  private buildMaskFixedCharsRegex(): void {
    let lastFixedCharPosition = 0
    let maskCopy = this.ccrInputMask

    const fixedChars = this.ccrInputMask.match(this.maskCharsRegex)

    this.fixedCharPositions = fixedChars.reduce((acc, fixedChar, index) => {
      const maskCopyLength = maskCopy.length
      lastFixedCharPosition = maskCopy.indexOf(fixedChar)
      maskCopy = maskCopy.substring(lastFixedCharPosition + 1)

      return [
        ...acc,
        {
          char: fixedChar,
          position:
            lastFixedCharPosition +
            (index > 0 ? this.ccrInputMask.length - maskCopyLength : 0)
        }
      ]
    }, [])

    const uniqueFixedChars = uniq(fixedChars)
    this.maskFixedCharsRegex = new RegExp(
      `[${uniqueFixedChars.length ? '\\' + uniqueFixedChars.join('\\') : ''}]`,
      'gi'
    )
  }

  private maskValue(value: string): string {
    let maskedValue = value

    maskedValue = this.fixedCharPositions
      .filter(
        (fixedCharPos, index) =>
          fixedCharPos.position <= maskedValue.length + index
      )
      .reduce((acc, fixedCharPos) => {
        return (
          acc.substring(0, fixedCharPos.position) +
          fixedCharPos.char +
          acc.substring(fixedCharPos.position)
        )
      }, value)

    return maskedValue.substring(0, this.ccrInputMask.length)
  }

  private unmaskValue(value: string): string {
    return value.replace(this.maskFixedCharsRegex, '')
  }
}
