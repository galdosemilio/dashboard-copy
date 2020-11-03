import { Component, forwardRef, Injector, Input, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { resolveConfig } from '@app/config/section';
import { ContextService, SelectedOrganization } from '@app/service';
import { BindForm, BINDFORM_TOKEN } from '@app/shared/directives/bind-form.directive';
import { untilDestroyed } from 'ngx-take-until-destroy';
import { SectionProps } from './app-section.props';

@Component({
  selector: 'ccr-app-section',
  templateUrl: './app-section.component.html',
  providers: [
    {
      provide: BINDFORM_TOKEN,
      useExisting: forwardRef(() => AppSectionComponent)
    }
  ]
})
export class AppSectionComponent implements BindForm, OnDestroy, OnInit {
  @Input() section: string;
  @Input() args: any;

  component: any;
  componentInjector: Injector;
  form: FormGroup;
  organization: SelectedOrganization;
  props: any;

  constructor(
    private context: ContextService,
    private fb: FormBuilder,
    private injector: Injector
  ) {}

  ngOnDestroy(): void {}

  ngOnInit(): void {
    this.createForm();
    this.context.organization$
      .pipe(untilDestroyed(this))
      .subscribe((organization: SelectedOrganization) => {
        this.organization = organization;
        this.resolveComponent();
      });
  }

  private createForm(): void {
    this.form = this.fb.group({});
  }

  private resolveComponent(): void {
    const sectionConfig = resolveConfig(this.section, this.organization);
    const configValues = sectionConfig.values || {};
    const providers = [];
    this.props = sectionConfig.props
      ? new sectionConfig.props({ ...configValues, ...this.args })
      : undefined;

    providers.push({
      provide: sectionConfig.props || SectionProps,
      useValue: this.props
    });

    this.componentInjector = Injector.create({
      providers: providers,
      parent: this.injector
    });
    this.component = sectionConfig.component;
  }
}
