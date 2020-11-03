import {
  ChangeDetectorRef,
  Component,
  forwardRef,
  Input,
  OnDestroy,
  OnInit
} from '@angular/core'
import {
  ControlValueAccessor,
  FormBuilder,
  FormGroup,
  NG_VALUE_ACCESSOR
} from '@angular/forms'
import { ContextService, NotifierService } from '@app/service'
import { BindForm, BINDFORM_TOKEN } from '@app/shared'
import { untilDestroyed } from 'ngx-take-until-destroy'
import { Subject } from 'rxjs'
import { PackageOrganization } from 'selvera-api'

@Component({
  selector: 'sequencing-package-form',
  templateUrl: './package-form.component.html',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => PackageFormComponent),
      multi: true
    },
    {
      provide: BINDFORM_TOKEN,
      useExisting: forwardRef(() => PackageFormComponent)
    }
  ]
})
export class PackageFormComponent
  implements BindForm, ControlValueAccessor, OnDestroy, OnInit {
  @Input() markAsTouched: Subject<void>
  @Input('isDisabled') set disabled(disabled: boolean) {
    this._disabled = disabled || false

    if (this.form && this._disabled) {
      this.form.disable({ emitEvent: false })
    } else if (this.form) {
      this.form.enable({ emitEvent: false })
    }
  }

  get disabled(): boolean {
    return this._disabled
  }

  isLoading = false
  form: FormGroup
  packages: any[] = [
    {
      id: '100',
      name: 'This is just a package name'
    }
  ]

  private _disabled: boolean

  constructor(
    private cdr: ChangeDetectorRef,
    private context: ContextService,
    private fb: FormBuilder,
    private notify: NotifierService,
    private packageOrganization: PackageOrganization
  ) {}

  ngOnDestroy(): void {}

  ngOnInit(): void {
    this.createForm()
    this.fetchPackages()

    this.markAsTouched.pipe(untilDestroyed(this)).subscribe(() => {
      this.form.markAsTouched()
      Object.keys(this.form.controls).forEach((key) => {
        this.form.controls[key].markAsTouched()
      })
      this.cdr.detectChanges()
    })

    if (this.disabled) {
      this.form.controls.package.disable({ emitEvent: false })
    }
  }

  propagateChange = (data: any) => {}

  registerOnChange(fn): void {
    this.propagateChange = fn
  }

  registerOnTouched(): void {}

  writeValue(value: any): void {
    if (value) {
      this.form.patchValue({
        package: value.package
      })
    }
  }

  private async fetchPackages() {
    try {
      this.isLoading = true
      this.form.disable()
      this.packages = (
        await this.packageOrganization.getAll({
          organization: this.context.organizationId,
          isActive: true,
          limit: 'all'
        })
      ).data.map((packageAssociation) => packageAssociation.package)
      this.cdr.detectChanges()
    } catch (error) {
      this.notify.error(error)
    } finally {
      this.form.enable()
      this.isLoading = false
    }
  }

  private createForm(): void {
    this.form = this.fb.group({
      package: ['']
    })

    this.form.valueChanges
      .pipe(untilDestroyed(this))
      .subscribe((controls) => this.propagateChange(controls))
  }
}
