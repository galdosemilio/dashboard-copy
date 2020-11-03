import { Component, Input } from '@angular/core';

@Component({
  selector: 'ccr-icon-trending-up',
  templateUrl: './trending-up-icon.component.html'
})
export class TrendingUpIconComponent {
  @Input() fill: string;
  @Input() size = 24;

  constructor() {}
}
