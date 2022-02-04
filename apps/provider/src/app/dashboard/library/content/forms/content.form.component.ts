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
import { ContextService } from '@app/service'
import { BindForm, BINDFORM_TOKEN } from '@app/shared'
import { Package } from '@app/shared/components/package-table'
import {
  PackageDatabase,
  PackageDatasource
} from '@app/shared/components/package-table/services'
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy'
import { _ } from '@coachcare/backend/shared'
import { resolveConfig } from '@app/config/section/utils'

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
  public hasPackages: boolean
  public hideFirstSection = false
  public organization: any
  public packages: Package[] = []
  public shownPackages: Package[] = []
  public patientVisibilities = [
    { value: false, name: _('LIBRARY.CONTENT.HIDDEN_FROM_PATIENT') },
    { value: true, name: _('LIBRARY.CONTENT.VISIBLE_TO_PATIENT') }
  ]
  public set fetchingPackages(fP: boolean) {
    this._fetchingPackages = fP
    if (fP) {
      if (this.form.controls) {
        this.form.controls.availability.disable()
      }
    } else {
      if (this.form.controls) {
        this.form.controls.availability.enable()
      }
    }
  }
  public get fetchingPackages(): boolean {
    return this._fetchingPackages
  }

  private _details: FileExplorerContent
  private _fetchingPackages: boolean
  private _readonlyFields: string[] = []
  private current: any = {
    name: '',
    availability: ''
  }
  private source: PackageDatasource

  constructor(
    private context: ContextService,
    private database: PackageDatabase,
    private dialog: MatDialog,
    private formBuilder: FormBuilder
  ) {
    this.organization = this.context.organization
    this.source = new PackageDatasource(this.context, this.database)
    this.source
      .connect()
      .pipe(untilDestroyed(this))
      .subscribe((packages: Package[]) => {
        this.hasPackages = packages.length > 0
        this.packages = packages
        this.fetchingPackages = false

        this.refreshShownPackages()
      })
    this.createForm()
    this.fetchingPackages = true
  }

  ngOnInit(): void {
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

  openPackageDialog(validate = false): void {
    if (validate && this.form.value.availability !== 2) {
      return
    }

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
          }
        } else {
          const formPackages: Package[] = this.form.value.packages
          if (!formPackages || !formPackages.length) {
            this.form.patchValue({ availability: '' })
          }
        }

        this.refreshShownPackages()
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
              if (this.current.availability !== undefined) {
                this.openPackageDialog()
              }
              break
          }

          this.current.availability = values.availability
          if (values.availability !== 2 && values.packages) {
            patchValue.packages = undefined
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
      })
  }

  private refreshShownPackages(): void {
    if (
      this.form &&
      this.form.value.packages &&
      this.form.value.packages.length
    ) {
      this.shownPackages = this.packages.filter(
        (pkg) => !!this.form.value.packages.find((p) => p.id === pkg.id)
      )
    }
  }
}
