import { Component, Input, ViewEncapsulation, OnInit } from '@angular/core'
import { FileExplorerContent, FileExplorerEvents } from '../../models'

@Component({
  selector: 'app-content-selected-table',
  templateUrl: './selected-content-table.component.html',
  styleUrls: ['./selected-content-table.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class SelectedContentTableComponent implements OnInit {
  @Input() contents: FileExplorerContent[] = []
  @Input() events: FileExplorerEvents
  @Input() disabled: boolean = false

  public columns: string[] = ['selector', 'icon', 'name']

  public ngOnInit(): void {
    if (this.disabled) {
      this.columns = ['icon', 'name']
    }
  }

  public onRemoveContent(content: FileExplorerContent): void {
    this.events.contentUnchecked.emit(content)
  }
}
