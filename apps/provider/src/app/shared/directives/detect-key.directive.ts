import { Directive, EventEmitter, HostListener, Input, Output } from '@angular/core';

@Directive({
  selector: '[detectKey]'
})
export class DetectKeyDirective {
  @Input() detectKey; // pass the key to detect

  @Output() keyPressed = new EventEmitter();

  constructor() {}

  @HostListener('keydown', ['$event'])
  onKeyDown(e: KeyboardEvent) {
    // TODO support more than one key
    console.log(e.key, this.detectKey);
    if (this.detectKey) {
      if (e.key === this.detectKey) {
        e.preventDefault();
        this.keyPressed.emit();
      }
    }
  }
}
