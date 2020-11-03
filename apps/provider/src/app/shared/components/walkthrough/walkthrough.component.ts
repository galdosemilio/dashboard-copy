import { Component, Input } from '@angular/core';
import { WalkthroughService } from '@app/service';

@Component({
  selector: 'ccr-walkthrough',
  templateUrl: './walkthrough.component.html',
  styleUrls: ['./walkthrough.component.scss']
})
export class WalkthroughComponent {
  @Input() guide: string;
  @Input() autoClose: boolean = true;

  constructor(private walkthrough: WalkthroughService) {}

  public openDialog(): void {
    this.walkthrough.openWalkthrough(this.guide, { shouldAutoClose: this.autoClose });
  }
}
