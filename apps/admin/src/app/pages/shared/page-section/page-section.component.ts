import { Component, Injector, Input, OnInit } from '@angular/core';
import { resolveConfig } from '@board/pages/config/section.config';
import { PageSectionInjectableProps } from '../model';

@Component({
  selector: 'ccr-page-section',
  templateUrl: './page-section.component.html'
})
export class PageSectionComponent implements OnInit {
  @Input()
  set compData(compData: any) {
    this._compData = compData;

    if (this.component) {
      this.componentInjector = this.createInjector();
      this.component.data = this._compData;
    }
  }

  get compData(): any {
    return this._compData;
  }

  @Input() orgId: string;
  @Input() section: string;

  public component: any;
  public componentInjector: Injector;

  private _compData: any;

  constructor(private injector: Injector) {}

  public ngOnInit(): void {
    this.component = resolveConfig(this.section, this.orgId);

    if (this.component) {
      this.componentInjector = this.createInjector();
      this.component.data = this.compData;
    }
  }

  private createInjector(): Injector {
    const injector = Injector.create(
      [{ provide: PageSectionInjectableProps, useValue: { data: this.compData } }],
      this.injector
    );

    return injector;
  }
}
