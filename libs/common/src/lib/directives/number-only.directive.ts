import { Directive, HostListener, Input } from '@angular/core';

@Directive({
  selector: '[ccrNumberOnly]'
})
export class NumberOnlyDirective {
  @Input() ccrNumberOnly: any; // pass false to disable it
  @Input() wholeNumber = false;

  constructor() {}

  @HostListener('keydown', ['$event'])
  onKeyDown(event: any) {
    if (this.ccrNumberOnly !== false) {
      const e = event as KeyboardEvent;
      let arr = [46, 8, 9, 27, 13, 110, 190];
      if (this.wholeNumber) {
        arr = [46, 8, 9, 27, 13];
      }
      if (
        arr.indexOf(e.keyCode) !== -1 ||
        // Allow: Ctrl+A
        (e.keyCode === 65 && e.ctrlKey) ||
        // Allow: Ctrl+C
        (e.keyCode === 67 && e.ctrlKey) ||
        // Allow: Ctrl+X
        (e.keyCode === 88 && e.ctrlKey) ||
        // Allow: home, end, left, right
        (e.keyCode >= 35 && e.keyCode <= 39)
      ) {
        // let it happen, don't do anything
        return;
      }

      // Ensure that it is a number and stop the keypress
      if (
        (e.shiftKey || (e.keyCode < 48 || e.keyCode > 57)) &&
        (e.keyCode < 96 || e.keyCode > 105)
      ) {
        e.preventDefault();
      }
    }
  }
}
