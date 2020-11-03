import {
  Component,
  EventEmitter,
  OnDestroy,
  OnInit,
  Output,
  ViewChild,
  ViewEncapsulation
} from '@angular/core'
import { FormArray, FormBuilder, FormControl, FormGroup } from '@angular/forms'
import { MatMenu } from '@coachcare/common/material'
import { ContextService, NotifierService } from '@app/service'
import { PackageData } from '@app/shared/selvera-api'
import { untilDestroyed } from 'ngx-take-until-destroy'
import { PackageOrganization } from 'selvera-api'

interface PackageFilter {
  pkg: string[]
  ['pkg-filter']: 'any' | 'all'
}

@Component({
  selector: 'ccr-package-filter',
  templateUrl: './package-filter.component.html',
  styleUrls: ['./package-filter.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class PackageFilterComponent implements OnDestroy, OnInit {
  @Output() change: EventEmitter<PackageFilter> = new EventEmitter<
    PackageFilter
  >()
  @ViewChild('menu', { static: true }) menu: MatMenu

  form: FormGroup
  selectedMoreThanOne = false
  packages: PackageData[] = []

  constructor(
    private context: ContextService,
    private fb: FormBuilder,
    private notify: NotifierService,
    private packageOrganization: PackageOrganization
  ) {}

  ngOnDestroy(): void {}

  ngOnInit(): void {
    this.createForm()
    this.fetchPackages()

    this.context.organization$.pipe(untilDestroyed(this)).subscribe(() => {
      this.packages = []
      this.createForm()
      this.fetchPackages()
    })
  }

  onClickAll(): void {
    this.form.controls.granularity.setValue('all')
    this.onCloseMenu()
  }

  onClickAny(): void {
    this.form.controls.granularity.setValue('any')
    this.onCloseMenu()
  }

  onCloseMenu(): void {
    const controls = this.form.value
    const filteredPkgs = this.packages.filter(
      (pkg, index) => controls.packages[index]
    )

    this.change.emit({
      ['pkg-filter']: controls.granularity as any,
      pkg: filteredPkgs.length ? filteredPkgs.map((pkg) => pkg.id) : []
    })
  }

  onDeselectAll(): void {
    Object.keys((this.form.controls.packages as FormArray).controls).forEach(
      (key) => {
        ;(this.form.controls.packages as FormArray).controls[key].setValue(
          false,
          {
            emitEvent: false
          }
        )
      }
    )
    this.onCloseMenu()
  }

  onSelectAll(): void {
    Object.keys((this.form.controls.packages as FormArray).controls).forEach(
      (key) => {
        ;(this.form.controls.packages as FormArray).controls[key].setValue(
          true,
          {
            emitEvent: false
          }
        )
      }
    )
  }

  resetFilters(): void {
    this.onDeselectAll()
  }

  private async fetchPackages() {
    try {
      const associations = (
        await this.packageOrganization.getAll({
          limit: 'all',
          organization: this.context.organizationId
        })
      ).data

      const packages = associations.map((association) => association.package)
      packages.forEach(() =>
        (this.form.controls.packages as FormArray).push(new FormControl(false))
      )

      this.packages = packages
    } catch (error) {
      this.notify.error(error)
    }
  }

  private createForm(): void {
    this.form = this.fb.group({
      toggle: [],
      granularity: ['any'],
      packages: this.fb.array([])
    })

    this.form.valueChanges.subscribe((controls) => {
      let selectedAmount = 0
      if (controls.packages && controls.packages.length) {
        controls.packages.forEach((toggle) => {
          if (toggle) {
            ++selectedAmount
          }
        })
      }
      this.selectedMoreThanOne = selectedAmount > 1
    })

    this.form.controls.toggle.valueChanges
      .pipe(untilDestroyed(this))
      .subscribe((toggle) => {
        ;(this.form.controls
          .packages as FormArray).controls.forEach((control) =>
          control.setValue(toggle)
        )
      })
  }
}
