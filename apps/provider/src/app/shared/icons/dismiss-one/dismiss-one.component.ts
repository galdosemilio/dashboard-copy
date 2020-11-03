import { Component, Input } from '@angular/core';

@Component({
  selector: 'ccr-icon-dismiss-one',
  templateUrl: './dismiss-one.component.html',
  styles: [':host { display: block; }'],
  host: {
    class: 'ccr-icon'
  }
})
export class DismissOneIconComponent {
  @Input()
  fill = '#aba9a8';
  @Input()
  size = 24;

  constructor() {}
}
