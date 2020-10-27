import { Component, Input } from '@angular/core';

@Component({
  selector: 'ccr-icon-user',
  templateUrl: './user-icon.component.html'
})
export class UserIconComponent {
  @Input() fill: string;
  @Input() size = 40;

  constructor() {}
}
