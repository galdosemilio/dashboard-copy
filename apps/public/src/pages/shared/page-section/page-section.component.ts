import { Component, Input, OnInit } from '@angular/core';
import { resolveConfig } from '@board/pages/config/section.config';

@Component({
  selector: 'ccr-page-section',
  templateUrl: './page-section.component.html'
})
export class PageSectionComponent implements OnInit {
  @Input() orgId: string;
  @Input() section: string;

  component: any;

  ngOnInit(): void {
    this.component = resolveConfig(this.section, this.orgId);
  }
}
