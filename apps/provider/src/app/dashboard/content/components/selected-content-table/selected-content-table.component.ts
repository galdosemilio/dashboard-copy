import { Component, Input, ViewEncapsulation } from '@angular/core';
import { FileExplorerContent, FileExplorerEvents } from '../../models';
import { FileExplorerDatasource } from '../../services';

@Component({
  selector: 'app-content-selected-table',
  templateUrl: './selected-content-table.component.html',
  styleUrls: ['./selected-content-table.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class SelectedContentTableComponent {
  @Input() contents: FileExplorerContent[] = [];
  @Input() events: FileExplorerEvents;

  public columns: string[] = ['selector', 'icon', 'name'];

  public onRemoveContent(content: FileExplorerContent): void {
    this.events.contentUnchecked.emit(content);
  }
}
