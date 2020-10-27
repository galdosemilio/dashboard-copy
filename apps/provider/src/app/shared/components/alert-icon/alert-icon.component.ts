import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { select, Store } from '@ngrx/store';
import { untilDestroyed } from 'ngx-take-until-destroy';

import { CCRConfig } from '@app/config';
import { paletteSelector } from '@app/store/config';

@Component({
  selector: 'ccr-alert-icon',
  templateUrl: './alert-icon.component.html',
  styleUrls: ['./alert-icon.component.scss']
})
export class AlertIconComponent implements OnInit, OnDestroy {
  @Input()
  icon: string;
  @Input()
  size = 24;

  fill: string;

  constructor(private store: Store<CCRConfig>) {}

  ngOnInit() {
    this.store
      .pipe(untilDestroyed(this), select(paletteSelector))
      .subscribe((palette) => (this.fill = palette.primary));
  }

  ngOnDestroy() {}
}
