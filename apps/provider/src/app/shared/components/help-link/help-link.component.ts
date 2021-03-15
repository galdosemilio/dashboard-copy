import { Component, Input, OnDestroy, OnInit } from '@angular/core'

@Component({
  selector: 'ccr-help-link',
  templateUrl: './help-link.component.html',
  styleUrls: ['./help-link.component.scss']
})
export class HelpLinkComponent implements OnInit, OnDestroy {
  @Input()
  link
  @Input()
  icon = 'help_outline'

  constructor() {}

  ngOnInit() {}

  ngOnDestroy() {}

  public openLink(): void {
    window.open(this.link, '_blank')
  }
}
