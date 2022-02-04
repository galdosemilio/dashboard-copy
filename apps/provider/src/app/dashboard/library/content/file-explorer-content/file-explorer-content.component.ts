import { Component, Input } from '@angular/core'
import { FileExplorerContent } from '@app/dashboard/library/content/models'

@Component({
  selector: 'app-content-file-explorer-content',
  templateUrl: './file-explorer-content.component.html',
  styleUrls: ['./file-explorer-content.component.scss']
})
export class FileExplorerContentComponent {
  @Input()
  content: FileExplorerContent
}
