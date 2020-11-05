import {
  Directive,
  EventEmitter,
  HostListener,
  Input,
  Output
} from '@angular/core'

@Directive({
  selector: '[detectKey]'
})
export class DetectKeyDirective {
  private shiftKeysActive = 0

  @Input() detectKey // pass the key to detect
  @Input() supressOnShiftKeyHold // optional parameter to suppress event emit on shift key hold

  @Output() keyPressed = new EventEmitter()

  constructor() {}

  @HostListener('keydown', ['$event'])
  onKeyDown(e: KeyboardEvent) {
    if (this.detectKey) {
      if (e.key === 'Shift') {
        this.shiftKeysActive++
      }

      // Supress if shift key is being held, if input value is set to 'true'
      if (this.supressOnShiftKeyHold === 'true' && this.shiftKeysActive > 0) {
        return
      }

      if (e.key === this.detectKey) {
        e.preventDefault()
        this.keyPressed.emit()
      }
    }
  }

  // Used only to detect Shift key release.  Since there are two shift keys, we want to track the count of shift keys being pressed, with 0 indicating no shift key hold
  @HostListener('keyup', ['$event'])
  onKeyUp(e: KeyboardEvent) {
    if (this.detectKey && e.key === 'Shift') {
      this.shiftKeysActive--
    }
  }
}
