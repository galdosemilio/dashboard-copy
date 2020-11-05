import { Component, Input } from '@angular/core'

@Component({
  selector: 'ccr-rpm-dependency-icon',
  templateUrl: './rpm-dependency-icon.component.html',
  styleUrls: ['./rpm-dependency-icon.component.scss']
})
export class RPMDependencyIconComponent {
  @Input()
  size = 24

  @Input()
  text = ''
}
