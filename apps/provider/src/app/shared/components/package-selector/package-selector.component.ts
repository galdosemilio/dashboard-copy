import { Component, OnInit, SkipSelf } from '@angular/core'
import { FormBuilder, FormGroup } from '@angular/forms'
import {
  BindForm,
  BindFormDirective
} from '@app/shared/directives/bind-form.directive'
import { PackageSelectorElement, PackageSelectorProps } from './models'

@Component({
  selector: 'ccr-package-selector',
  styleUrls: ['./package-selector.component.scss'],
  templateUrl: './package-selector.component.html'
})
export class PackageSelectorComponent implements BindForm, OnInit {
  public disabled = false
  public forcePackageChoiceId: string
  public forcePackageSelection: boolean
  public form: FormGroup
  public hasSelectedPackages = false
  public packages: PackageSelectorElement[] = []
  public readonly = false
  public required = false
  public trackerPackage: PackageSelectorElement = {
    value: ''
  }

  set value(pkgs: string[]) {
    this._value = pkgs
    this.hasSelectedPackages = pkgs.length > 0
    this.form.controls.value.patchValue(
      pkgs && pkgs.length ? pkgs.map((pkg) => ({ id: pkg })) : []
    )
  }

  get value(): string[] {
    return this._value
  }

  private _value: string[] = []

  constructor(
    @SkipSelf()
    private bindForm: BindFormDirective,
    private builder: FormBuilder,
    private props: PackageSelectorProps
  ) {}

  public ngOnInit(): void {
    this.form = this.builder.group({
      value: [[]]
    })
    this.bindForm.setControl(this.form.controls.value)

    this.packages = this.props.packages
    this.trackerPackage = this.props.trackerPackage
    this.forcePackageChoiceId = this.props.forcePackageChoiceId
    this.forcePackageSelection = this.props.forcePackageSelection
    this.props.events.forcePackageSelection.next(
      this.props.forcePackageSelection
    )

    if (this.forcePackageChoiceId) {
      this.onClickPackage(this.forcePackageChoiceId)
    }
  }

  public addTrackerPackage(): void {
    const packages = this.value
    const index =
      packages && packages.length
        ? packages.indexOf(this.trackerPackage.value)
        : -1

    this.value =
      index !== -1
        ? packages.filter(
            (pkgId: string) => this.trackerPackage.value !== pkgId
          )
        : [...(packages || []), this.trackerPackage.value]
  }

  public onClickPackage(value: string): void {
    const packages = this.value
    let cache = packages || []
    cache = cache.filter(
      (packageId) =>
        !this.packages.find(
          (pkg: PackageSelectorElement) => pkg.value === packageId
        )
    )
    this.value = [...cache, value]
  }
}
