import { Component, Input } from '@angular/core';

@Component({
  selector: 'ccr-icon-weight-thresh',
  templateUrl: './weight-thresh-icon.component.html'
})
export class WeightThreshIconComponent {
  @Input() fill: string;
  @Input() size = 24;
}
