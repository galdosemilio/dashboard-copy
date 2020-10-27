import {
  ChangeDetectionStrategy,
  Component,
  Input,
  OnDestroy,
  OnInit
} from '@angular/core';
import { untilDestroyed } from 'ngx-take-until-destroy';

import { SupplementDataSource } from '@app/dashboard/accounts/dieters/services';

@Component({
  selector: 'app-dieter-journal-supplements-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SupplementsTableComponent implements OnInit, OnDestroy {
  @Input()
  source: SupplementDataSource;

  supplements: Array<string>;

  ngOnInit() {
    this.source.change$.pipe(untilDestroyed(this)).subscribe(() => {
      this.supplements = this.source.columns.length ? this.source.columns.slice(1) : [];
    });
  }

  ngOnDestroy() {
    // this.source.disconnect();
  }
}
