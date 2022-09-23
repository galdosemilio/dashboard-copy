import {
  Component,
  EventEmitter,
  forwardRef,
  Input,
  OnInit,
  Output
} from '@angular/core'
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms'
import { MatDialog } from '@coachcare/material'
import { PackageSelectDialog } from '@app/dashboard/library/content/dialogs'
import {
  FILE_TYPE_MAP,
  FileExplorerContent,
  FileExplorerContentAvailability
} from '@app/dashboard/library/content/models'
import { ContextService, NotifierService } from '@app/service'
import { BindForm, BINDFORM_TOKEN } from '@app/shared'
import { Package } from '@app/shared/components/package-table'
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy'
import { _ } from '@coachcare/backend/shared'
import { resolveConfig } from '@app/config/section/utils'
import { PackageOrganization, PackageOrganizationSingle } from '@coachcare/sdk'

@UntilDestroy()
@Component({
  selector: 'app-content-content-form',
  templateUrl: './content.form.component.html',
  styleUrls: ['./content.form.component.scss'],
  providers: [
    {
      provide: BINDFORM_TOKEN,
      useExisting: forwardRef(() => ContentFormComponent)
    }
  ]
})
export class ContentFormComponent implements BindForm, OnInit {
  @Input() hiddenFields: string[] = []
  @Input() mode: 'digital-library' | 'vault' = 'digital-library'
  @Input()
  set details(d: FileExplorerContent) {
    this._details = d

    this.form.reset()

    if (!d) {
      return
    }

    const patchValue: FileExplorerContent & { availability: string | number } =
      {
        ...d,
        availability: ''
      }

    if (d.isPublic !== undefined) {
      patchValue.availability = d.isPublic
        ? FileExplorerContentAvailability.PUBLIC
        : d.packages?.length
        ? FileExplorerContentAvailability.BY_PACKAGE
        : FileExplorerContentAvailability.PRIVATE
    }

    if (d.type.code === 'file') {
      // The name without extension is calculated
      const nameWithoutExt: string = d.extension
        ? d.name.substring(0, d.name.lastIndexOf('.'))
        : d.name

      patchValue.name = nameWithoutExt
    }

    if (d.organization) {
      this.organization = d.organization
    }

    this.form.patchValue(patchValue)
  }

  get details(): FileExplorerContent {
    return this._details
  }

  @Input()
  set readonlyFields(readonlyFields: string[]) {
    this._readonlyFields = readonlyFields ?? []

    if (this.form) {
      Object.values(this.form.controls).forEach((control) => control.enable())

      this._readonlyFields.forEach((readonlyFieldKey) => {
        this.form.controls[readonlyFieldKey]?.disable()
      })
    }
  }

  get readonlyFields(): string[] {
    return this._readonlyFields
  }

  @Output()
  submit: EventEmitter<void> = new EventEmitter<void>()

  public externalVisibilities = [
    { value: 'dashboard', name: _('BOARD.WELLCORE_DASHBOARD_ONLY') },
    { value: 'prescribery', name: _('BOARD.WELLCORE_DASHBOARD_PRESCRIBERY') }
  ]
  public form: FormGroup
  public hideFirstSection = false
  public organization: any
  public shownPackages: Package[] = []
  public morePackages: boolean = false
  public patientVisibilities = [
    { value: false, name: _('LIBRARY.CONTENT.HIDDEN_FROM_PATIENT') },
    { value: true, name: _('LIBRARY.CONTENT.VISIBLE_TO_PATIENT') }
  ]

  private _details: FileExplorerContent
  public fetchingPackages: boolean
  private _readonlyFields: string[] = []
  private current: any = {
    name: '',
    availability: ''
  }

  constructor(
    private context: ContextService,
    private packageOrganization: PackageOrganization,
    private dialog: MatDialog,
    private formBuilder: FormBuilder,
    private notifier: NotifierService
  ) {
    this.createForm()
  }

  ngOnInit(): void {
    this.context.organization$.pipe(untilDestroyed(this)).subscribe((org) => {
      this.organization = org
    })

    void this.refreshShownPackages()

    this.form.controls.isPublic.setValidators(
      this.mode !== 'vault' ? Validators.required : []
    )
    this.form.controls.availability.setValidators(
      this.mode !== 'vault' ? Validators.required : []
    )

    if (this.hiddenFields.indexOf('name') !== -1) {
      this.form.controls.name.clearValidators()
    }

    if (this.mode === 'vault') {
      const newControl = new FormControl(
        this.details?.isVisibleToPatient ?? false,
        [Validators.required]
      )
      this.form.addControl('isVisibleToPatient', newControl)
    }

    this.hideFirstSection =
      this.hiddenFields.indexOf('name') !== -1 &&
      this.hiddenFields.indexOf('description') !== -1

    const shouldShowExternalVis =
      this.context.isProvider &&
      resolveConfig(
        'DIGITAL_LIBRARY.EXTERNAL_VISIBILITY_OPTIONS_ENABLED',
        this.context.organization
      )

    if (shouldShowExternalVis) {
      return
    }

    this.hiddenFields = [...this.hiddenFields, 'externalVisibility']
  }

  openPackageDialog(): void {
    this.dialog
      .open(PackageSelectDialog, {
        autoFocus: false,
        data: {
          packages: this.form.value.packages
            ? this.form.value.packages.slice()
            : [],
          content: this.details || {}
        },
        width: '80vw'
      })
      .afterClosed()
      .subscribe((packages: Package[]) => {
        if (packages) {
          if (packages.length) {
            this.form.patchValue({ packages: packages })
          } else {
            this.form.patchValue({ availability: '', packages: undefined })
            this.shownPackages = []
            this.morePackages = false
          }
        } else {
          const formPackages: Package[] = this.form.value.packages
          if (!formPackages || !formPackages.length) {
            this.form.patchValue({ availability: '' })
          }
        }

        void this.refreshShownPackages()
      })
  }

  shouldShowAlert(): boolean {
    return this.details ? this.details.type.code === 'folder' : false
  }

  private createForm(): void {
    this.form = this.formBuilder.group({
      name: [
        '',
        [
          Validators.required,
          () => {
            if (!this.details?.extension) {
              return null
            }

            return FILE_TYPE_MAP[this.details.extension]
              ? null
              : { invalidExtension: true }
          }
        ]
      ],
      fullName: ['', []],
      description: ['', []],
      isPublic: ['', []],
      packages: [undefined],
      availability: ['', []],
      externalVisibility: ['dashboard', []]
    })

    this.form.valueChanges
      .pipe(untilDestroyed(this))
      .subscribe((values: any) => {
        const patchValue: any = {}
        let isChangedAvailability = false

        if (values.availability !== this.current.availability) {
          switch (values.availability) {
            case 0:
              patchValue.isPublic = true
              break

            case 1:
              patchValue.isPublic = false
              break

            case 2:
              patchValue.isPublic = false
              break
          }

          if (this.current.availability) {
            isChangedAvailability = true
          }

          this.current.availability = values.availability
          if (values.availability !== 2 && values.packages) {
            patchValue.packages = undefined
            this.shownPackages = []
            this.morePackages = false
          } else if (values.availability === 2 && this.details?.packages) {
            patchValue.packages = this.details?.packages
          }
        }

        if (
          this.current.name !== values.name &&
          this.details &&
          this.details.extension
        ) {
          this.current.name = values.name
          patchValue.fullName = `${values.name}.${this.details.extension}`
        }

        if (Object.keys(patchValue).length) {
          this.form.patchValue(patchValue)
        }

        if (isChangedAvailability && this.current.availability === 2) {
          this.openPackageDialog()
        }
      })
  }

  private async refreshShownPackages(): Promise<void> {
    if (!this.form.value.packages?.length) {
      return
    }

    this.fetchingPackages = true

    try {
      const res = await this.packageOrganization.getAll({
        organization: this.organization.id,
        isActive: true,
        package: this.form.value.packages.map((entry) => entry.id),
        limit: 10
      })

      const packages = res.data.map(
        (r: PackageOrganizationSingle) =>
          new Package(r.package, r, {
            organizationId: this.organization.id
          })
      )

      this.shownPackages = packages
      this.morePackages = res.pagination.next === undefined ? false : true
    } catch (err) {
      this.notifier.error(err)
    } finally {
      this.fetchingPackages = false
    }
  }
}
