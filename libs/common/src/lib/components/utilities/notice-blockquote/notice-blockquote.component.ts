import { Component, Input } from '@angular/core'

@Component({
  selector: 'ccr-notice-blockquote',
  templateUrl: './notice-blockquote.component.html',
  styleUrls: ['./notice-blockquote.component.scss']
})
export class CcrNoticeBlockquoteComponent {
  @Input() icon?: string
  @Input() type: 'info' | 'warning' | 'danger' = 'info'
}
