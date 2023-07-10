import {
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
  ViewChild,
  ViewEncapsulation
} from '@angular/core'
import { FormArray, FormBuilder, FormControl, FormGroup } from '@angular/forms'
import { MatMenu } from '@coachcare/material'
import { ContextService, NotifierService } from '@app/service'
import { _ } from '@app/shared/utils'
import { PackageData } from '@coachcare/sdk'
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy'
import { PackageOrganization } from '@coachcare/sdk'

export type PackageFilterType = 'any' | 'all'

export interface PackageFilter {
  pkg: PackageData[]
  ['pkg-filter']: PackageFilterType
}

@UntilDestroy()
@Component({
  selector: 'ccr-package-filter',
  templateUrl: './package-filter.component.html',
  styleUrls: ['./package-filter.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class PackageFilterComponent implements OnInit {
  @Input() mode: 'single' | 'multiple' = 'multiple'
  @Input() confirmText = _('MENU.SEARCH')
  @Input() filter: PackageFilterType[] = ['all', 'any']
  @Input() initialPackages: PackageData[] = []

  @Output()
  change: EventEmitter<PackageFilter> = new EventEmitter<PackageFilter>()
  @ViewChild('menu', { static: true }) menu: MatMenu

  form: FormGroup
  selectedMoreThanOne = false
  packages: PackageData[] = []

  get isAllowedAny() {
    return this.filter.includes('any')
  }

  get isAllowedAll() {
    return this.filter.includes('all')
  }

  constructor(
    private context: ContextService,
    private fb: FormBuilder,
    private notify: NotifierService,
    private packageOrganization: PackageOrganization
  ) {}

  public ngOnInit(): void {
    this.createForm()
    void this.fetchPackages()

    this.context.organization$.pipe(untilDestroyed(this)).subscribe(() => {
      this.packages = []
      this.createForm()
      void this.fetchPackages()
    })
  }

  public onClickAll(): void {
    this.form.controls.granularity.setValue('all')
    this.onCloseMenu()
  }

  public onClickAny(): void {
    this.form.controls.granularity.setValue('any')
    this.onCloseMenu()
  }

  public onCloseMenu(): void {
    const controls = this.form.value
    const filteredPkgs = this.packages.filter(
      (pkg, index) => controls.packages[index]
    )

    this.change.emit({
      ['pkg-filter']: controls.granularity as any,
      pkg: filteredPkgs.length ? filteredPkgs : []
    })
  }

  public onDeselectAll(refresh = true): void {
    Object.values((this.form.controls.packages as FormArray).controls).forEach(
      (control) =>
        control.setValue(false, {
          emitEvent: false
        })
    )

    if (!refresh) {
      return
    }

    this.onCloseMenu()
  }

  public onSelectAll(): void {
    Object.values((this.form.controls.packages as FormArray).controls).forEach(
      (control) =>
        control.setValue(true, {
          emitEvent: false
        })
    )
  }

  public packageClickHandler(index: number): void {
    if (this.mode === 'multiple') {
      return
    }

    const pkgFormArray: FormArray = this.form.get('packages') as FormArray

    pkgFormArray.controls.forEach((arrayControl, idx) => {
      if (index === idx) {
        return
      }

      arrayControl.setValue(false, { emitEvent: false })
    })
  }

  public resetFilters(refresh = true): void {
    this.onDeselectAll(refresh)
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
      const pkgsFormArray = this.form.controls.packages as FormArray

      packages.forEach((p) =>
        pkgsFormArray.push(
          new FormControl(
            this.initialPackages.find((entry) => entry.id === p.id)
              ? true
              : false
          )
        )
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

      if (!controls.packages?.length) {
        return
      }

      controls.packages.forEach((toggle) => {
        if (!toggle) {
          return
        }

        ++selectedAmount
      })

      this.selectedMoreThanOne = selectedAmount > 1
    })

    this.form.controls.toggle.valueChanges
      .pipe(untilDestroyed(this))
      .subscribe((toggle) => {
        ;(this.form.controls.packages as FormArray).controls.forEach(
          (control) => control.setValue(toggle)
        )
      })
  }
}
