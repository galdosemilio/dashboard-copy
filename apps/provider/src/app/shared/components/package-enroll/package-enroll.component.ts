import { Component, OnInit, SkipSelf } from '@angular/core'
import { FormBuilder, FormGroup } from '@angular/forms'
import {
  Package,
  PackageSelectEvents
} from '@app/shared/components/package-table'
import {
  BindForm,
  BindFormDirective
} from '@app/shared/directives/bind-form.directive'

@Component({
  selector: 'ccr-package-enroll',
  templateUrl: './package-enroll.component.html'
})
export class PackageEnrollComponent implements BindForm, OnInit {
  form: FormGroup

  private _packages: Package[] = []

  set packages(pkgs: Package[]) {
    this._packages = pkgs
    this.form.controls.value.patchValue(this._packages)
  }

  get packages(): Package[] {
    return this._packages
  }
  events: PackageSelectEvents

  constructor(
    @SkipSelf()
    private bindForm: BindFormDirective,
    private fb: FormBuilder
  ) {
    this.events = new PackageSelectEvents()
  }

  ngOnInit(): void {
    this.createForm()
    this.subscribeToEvents()
  }

  private createForm(): void {
    this.form = this.fb.group({
      value: [[]]
    })
    this.bindForm.setControl(this.form.controls.value)
  }

  private subscribeToEvents(): void {
    this.events.packageSelected.subscribe((pkg: Package) => {
      const cache = this.packages.slice()
      cache.push(pkg)
      this.packages = cache
    })
    this.events.packageDeselected.subscribe((pkg: Package) => {
      this.packages = this.packages.filter(
        (pack: Package) => pack.id !== pkg.id
      )
    })
  }
}
