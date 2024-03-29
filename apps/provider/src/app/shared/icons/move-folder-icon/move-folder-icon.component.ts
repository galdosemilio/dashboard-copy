import { Component, Input } from '@angular/core'

@Component({
  selector: 'ccr-icon-move-folder',
  templateUrl: './move-folder-icon.component.html',
  host: {
    class: 'ccr-icon'
  }
})
export class MoveFolderIconComponent {
  @Input()
  fill = ''
  @Input()
  size = 24

  constructor() {}
}
