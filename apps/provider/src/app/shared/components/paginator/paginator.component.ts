import { Component, Input } from '@angular/core';
import { MatPaginator } from '@coachcare/common/material';

@Component({
  selector: 'ccr-paginator',
  templateUrl: './paginator.component.html',
  styleUrls: ['./paginator.component.scss'],
})
export class CcrPaginator extends MatPaginator {
  @Input() inverse: boolean = false;
  @Input() disabled: boolean = false;
}
