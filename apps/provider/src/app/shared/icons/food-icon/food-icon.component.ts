import { Component, Input } from '@angular/core';

@Component({
  selector: 'ccr-icon-food',
  templateUrl: './food-icon.component.html'
})
export class FoodIconComponent {
  @Input() fill: string;
  @Input() size = 24;

  constructor() {}
}
