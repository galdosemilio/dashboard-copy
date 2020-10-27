import { Component, Input } from '@angular/core';

@Component({
  selector: 'ccr-rpm-scale-icon',
  templateUrl: './rpm-scale-icon.component.html',
  styleUrls: ['./rpm-scale-icon.component.scss']
})
export class RPMScaleIconComponent {
  @Input()
  size: number = 24;

  @Input()
  text: string = '';
}
