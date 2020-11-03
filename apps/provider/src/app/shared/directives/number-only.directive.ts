import { Directive, HostListener, Input } from '@angular/core'

@Directive({
  selector: '[numberOnly]'
})
export class NumberOnlyDirective {
  @Input() numberOnly // pass false to disable it
  @Input() wholeNumber = false

  constructor() {}

  @HostListener('keydown', ['$event'])
  onKeydown(e: KeyboardEvent) {
    if (this.numberOnly !== false) {
      const arr = [
        'Delete',
        'Backspace',
        'Tab',
        'Escape',
        'Return',
        'Down',
        'ArrowDown',
        'Up',
        'ArrowUp',
        'Left',
        'ArrowLeft',
        'Right',
        'ArrowRight'
      ]
      const numbers = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9']
      if (!this.wholeNumber) {
        arr.push('n')
        arr.push('.')
      }

      if (
        arr.indexOf(e.key) !== -1 ||
        // Allow: Ctrl+a or Command+a
        ((e.ctrlKey || e.metaKey) && e.key === 'a') ||
        // Allow: Ctrl+c or Command+c
        ((e.ctrlKey || e.metaKey) && e.key === 'c') ||
        // Allow: Ctrl+x or Command+x
        ((e.ctrlKey || e.metaKey) && e.key === 'x') ||
        // Allow: home, end, left, right, paste
        ['Home', 'End', 'PageDown', 'PageUp', 'Paste'].indexOf(e.key) > -1
      ) {
        // let it happen, don't do anything
        return
      }

      // If not a number, stop the keypress
      if (numbers.indexOf(e.key) < 0) {
        e.preventDefault()
      }
    }
  }
}
