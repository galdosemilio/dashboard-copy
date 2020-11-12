import {
  Directive,
  EventEmitter,
  HostListener,
  Input,
  Output
} from '@angular/core'

@Directive({
  selector: '[ccrDetectKey]'
})
export class DetectKeyDirective {
  @Input() detectKey: number // pass the key to detect

  @Output() keyPressed = new EventEmitter<any>()

  constructor() {}

  @HostListener('keydown', ['$event'])
  onKeyDown(e: KeyboardEvent) {
    // TODO support more than one key
    if (this.detectKey) {
      if (e.keyCode === this.detectKey) {
        e.preventDefault()
        this.keyPressed.emit()
      }
    }
  }
}
