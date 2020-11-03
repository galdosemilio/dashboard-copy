import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { DateNavigatorOutput } from '@app/shared';
import { BehaviorSubject } from 'rxjs';

@Component({
  selector: 'app-dieter-journal-levl',
  templateUrl: './levl.component.html',
  styleUrls: ['./levl.component.scss']
})
export class LevlComponent implements OnInit {
  @Input()
  dates;

  view = 'table';
  timeframe = 'week';
  component = 'levl';

  date$ = new BehaviorSubject<DateNavigatorOutput>({});

  constructor(private route: ActivatedRoute, private router: Router) {}

  ngOnInit() {
    this.route.paramMap.subscribe((params: ParamMap) => {
      const v = params.get('v');
      this.view = ['table', 'chart'].indexOf(v) >= 0 ? v : this.view;
    });
  }

  toggleView() {
    if (this.view === 'chart') {
      this.timeframe = 'week';
    }
    const params = {
      s: this.component,
      v: this.view === 'table' ? 'chart' : 'table'
    };
    this.router.navigate(['.', params], {
      relativeTo: this.route
    });
  }
}
