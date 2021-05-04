import {
  ChangeDetectorRef,
  Component,
  forwardRef,
  Input,
  OnDestroy,
  OnInit
} from '@angular/core'
import { FormBuilder, FormGroup } from '@angular/forms'
import {
  LabelsOrganizationDatabase,
  LabelsOrganizationDataSource
} from '@coachcare/backend/data'
import { PackageAssociation, PackageData } from '@coachcare/sdk'
import { BindForm, BINDFORM_TOKEN } from '@coachcare/common/directives'
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy'

@UntilDestroy()
@Component({
  selector: 'ccr-organizations-label-selector',
  templateUrl: './label-selector.component.html',
  providers: [
    {
      provide: BINDFORM_TOKEN,
      useExisting: forwardRef(() => LabelSelectorComponent)
    }
  ]
})
export class LabelSelectorComponent implements BindForm, OnDestroy, OnInit {
  @Input() orgId: string
  @Input()
  set packages(pkgs: string[]) {
    if (pkgs && Array.isArray(pkgs)) {
      this._packages = pkgs.slice()
      this.refreshSelectedPackages()
      this.refreshShownPackages()
      if (this.form) {
        this.form.controls.value.setValue(this._packages)
      }
    }
  }

  get packages(): string[] {
    return this._packages
  }

  @Input()
  set readonly(readonly: boolean) {
    this._readonly = readonly
    if (readonly && this.form) {
      this.form.disable()
    } else if (this.form) {
      this.form.enable()
    }
  }
  get readonly(): boolean {
    return this._readonly
  }

  public associations: PackageAssociation[] = []
  public form: FormGroup
  public selectedPackages: PackageData[] = []
  public shownPackages: PackageData[] = []
  public state: 'loading' | 'ready' | 'no-associations' = 'loading'

  private _packages: string[] = []
  private _readonly: boolean
  private source: LabelsOrganizationDataSource

  constructor(
    private cdr: ChangeDetectorRef,
    private database: LabelsOrganizationDatabase,
    private fb: FormBuilder
  ) {}

  public ngOnDestroy(): void {}

  public ngOnInit(): void {
    this.createForm()
    this.createSource()

    if (this.readonly) {
      this.form.disable()
    }

    if (this.packages) {
      this.packages = [...this.packages]
    }
  }

  public addPackage(): void {
    const association = this.associations.find(
      (assoc) => assoc.package.id === this.form.value.selectedAssociation
    )

    if (association) {
      this.packages = [...this.packages, association.package.id]
    }

    this.form.controls.selectedAssociation.reset()
  }

  public removePackage(pkg: PackageData): void {
    this.packages = this.packages.filter((pkgId) => pkgId !== pkg.id)
    this.form.controls.selectedAssociation.reset()
  }

  private createForm(): void {
    this.form = this.fb.group({
      selectedAssociation: [],
      value: []
    })
  }

  private createSource(): void {
    this.source = new LabelsOrganizationDataSource(this.database)
    this.source.addDefault({
      organization: this.orgId,
      isActive: true,
      limit: 'all',
      offset: 0
    })

    this.source
      .connect()
      .pipe(untilDestroyed(this))
      .subscribe((data) => {
        this.associations = data
        this.state = data.length ? 'ready' : 'no-associations'
        this.refreshSelectedPackages()
        this.refreshShownPackages()
        this.cdr.detectChanges()
      })
  }

  private refreshShownPackages(): void {
    this.shownPackages = []

    this.associations.forEach((assoc) => {
      if (!this.selectedPackages.find((pkg) => assoc.package.id === pkg.id)) {
        this.shownPackages.push(assoc.package)
      }
    })
  }

  private refreshSelectedPackages(): void {
    this.selectedPackages = []

    this.packages.forEach((pkgId) => {
      const association = this.associations.find(
        (assoc) => assoc.package.id === pkgId
      )
      if (association) {
        this.selectedPackages.push(association.package)
      }
    })
  }
}
