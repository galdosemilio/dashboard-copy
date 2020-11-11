import {
  Component,
  EventEmitter,
  forwardRef,
  Input,
  OnDestroy,
  OnInit,
  Output
} from '@angular/core'
import { FormBuilder, FormGroup, Validators } from '@angular/forms'
import { MatDialog } from '@coachcare/material'
import { PackageSelectDialog } from '@app/dashboard/content/dialogs'
import {
  FILE_TYPE_MAP,
  FileExplorerContent
} from '@app/dashboard/content/models'
import { ContextService } from '@app/service'
import { BindForm, BINDFORM_TOKEN } from '@app/shared'
import { Package } from '@app/shared/components/package-table'
import {
  PackageDatabase,
  PackageDatasource
} from '@app/shared/components/package-table/services'
import { untilDestroyed } from 'ngx-take-until-destroy'

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
export class ContentFormComponent implements BindForm, OnInit, OnDestroy {
  @Input() hiddenFields: string[] = []
  @Input() mode: 'digital-library' | 'vault' = 'digital-library'
  @Input()
  set details(d: FileExplorerContent) {
    this._details = d

    this.form.reset()

    if (d) {
      const patchValue = {
        ...d,
        availability:
          d.isPublic !== undefined
            ? d.isPublic
              ? 0
              : d.packages && d.packages.length
              ? 2
              : 1
            : ''
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
    } else {
      this.form.reset()
    }
  }

  get details(): FileExplorerContent {
    return this._details
  }

  @Input()
  readonlyFields: string[] = []

  @Output()
  submit: EventEmitter<void> = new EventEmitter<void>()

  public form: FormGroup
  public hasPackages: boolean
  public hideFirstSection = false
  public organization: any
  public packages: Package[] = []
  public shownPackages: Package[] = []
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

  ngOnDestroy(): void {}

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

    this.hideFirstSection =
      this.hiddenFields.indexOf('name') !== -1 &&
      this.hiddenFields.indexOf('description') !== -1
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
            return this.details && this.details.extension
              ? FILE_TYPE_MAP[this.details.extension]
                ? null
                : { invalidExtension: true }
              : null
          }
        ]
      ],
      fullName: ['', []],
      description: ['', []],
      isPublic: ['', []],
      packages: [undefined],
      availability: ['', []]
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
              if (
                this.current.availability !== undefined &&
                this.current.availability !== null
              ) {
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
