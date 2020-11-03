import { Component, Host, OnDestroy, OnInit, SkipSelf } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { BindForm, BindFormDirective } from '@app/shared/directives/bind-form.directive';
import { _ } from '@app/shared/utils';
import { PackageSelectorElement, PackageSelectorProps } from './models';

@Component({
  selector: 'ccr-package-selector',
  styleUrls: ['./package-selector.component.scss'],
  templateUrl: './package-selector.component.html'
})
export class PackageSelectorComponent implements BindForm, OnDestroy, OnInit {
  disabled: boolean = false;
  form: FormGroup;
  hasSelectedPackages: boolean = false;
  packages: PackageSelectorElement[] = [];
  readonly: boolean = false;
  required: boolean = false;
  trackerPackage: PackageSelectorElement = {
    value: ''
  };

  set value(pkgs: string[]) {
    this._value = pkgs;
    this.hasSelectedPackages = pkgs.length > 0;
    this.form.controls.value.patchValue(
      pkgs && pkgs.length ? pkgs.map((pkg) => ({ id: pkg })) : []
    );
  }

  get value(): string[] {
    return this._value;
  }

  private _value: string[] = [];

  constructor(
    @Host()
    @SkipSelf()
    private bindForm: BindFormDirective,
    private builder: FormBuilder,
    private props: PackageSelectorProps
  ) {}

  ngOnDestroy() {}

  ngOnInit() {
    this.form = this.builder.group({
      value: [[]]
    });
    this.bindForm.setControl(this.form.controls.value);

    this.packages = this.props.packages;
    this.trackerPackage = this.props.trackerPackage;
    this.props.events.forcePackageSelection.next(this.props.forcePackageSelection);
  }

  addTrackerPackage(): void {
    const packages = this.value;
    const index =
      packages && packages.length ? packages.indexOf(this.trackerPackage.value) : -1;

    this.value =
      index !== -1
        ? packages.filter((pkgId: string) => this.trackerPackage.value !== pkgId)
        : [...(packages || []), this.trackerPackage.value];
  }

  onClickPackage(value: string): void {
    const packages = this.value;
    let cache = packages || [];
    cache = cache.filter(
      (packageId) =>
        !this.packages.find((pkg: PackageSelectorElement) => pkg.value === packageId)
    );
    this.value = [...cache, value];
  }
}
