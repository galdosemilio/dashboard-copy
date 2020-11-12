import {
  Component,
  EventEmitter,
  forwardRef,
  Host,
  Input,
  OnInit,
  Optional,
  Output,
  SkipSelf
} from '@angular/core'
import {
  AbstractControl,
  ControlContainer,
  ControlValueAccessor,
  FormControl,
  NG_VALIDATORS,
  NG_VALUE_ACCESSOR
} from '@angular/forms'
import { select, Store } from '@ngrx/store'

import { ContextService } from '@coachcare/common/services'
import { OrgPrefSelectors, OrgPrefState } from '@coachcare/common/store'
import { get } from 'lodash'

@Component({
  selector: 'ccr-form-field-consent',
  templateUrl: './consent.component.html',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => ConsentFormFieldComponent),
      multi: true
    },
    {
      provide: NG_VALIDATORS,
      useExisting: forwardRef(() => ConsentFormFieldComponent),
      multi: true
    }
  ],
  // tslint:disable-next-line:use-host-property-decorator
  host: {
    class: 'mat-form-field',
    '[class.mat-input-invalid]': '_control?.invalid && _control?.touched',
    '[class.mat-form-field-invalid]': '_control?.invalid && _control?.touched',
    '[class.mat-form-field-disabled]': '_control?.disabled'
  }
})
export class ConsentFormFieldComponent implements ControlValueAccessor, OnInit {
  @Input() formControlName: string
  @Input() consentRequired: string | undefined

  @Input() disabled: any
  @Input() placeholder: string
  @Input() readonly: any
  @Input() required: any

  @Output() change = new EventEmitter<boolean>()

  _control: AbstractControl | undefined
  value = false

  linkTerms: string
  linkPrivacy: string
  linkDpa: string
  linkMsa: string
  linkHipaa: string

  get isDisabled() {
    return this.disabled === '' || this.disabled === true
  }
  get isReadonly() {
    return this.readonly === '' || this.readonly === true
  }
  get isRequired() {
    return this.required === '' || this.required === true
  }

  constructor(
    @Optional()
    @Host()
    @SkipSelf()
    private parent: ControlContainer,
    private context: ContextService,
    private store: Store<OrgPrefState.State>
  ) {}

  ngOnInit() {
    if (this.formControlName) {
      const parent = this.parent.control as AbstractControl
      this._control = parent.get(this.formControlName) as AbstractControl
    }

    if (this.context.organizationId) {
      this.store
        .pipe(select(OrgPrefSelectors.selectOrgPref))
        .subscribe((pref) => {
          const links: any = get(pref, 'mala.custom.links') || {}
          this.linkTerms = links.terms
          this.linkPrivacy = links.privacy
          this.linkHipaa = links.hipaa
          this.linkMsa = links.msa
          this.linkDpa = links.dpa
        })
    }
  }

  propagateChange = (data: any) => {}
  propagateTouch = () => {}

  onChange(value: boolean) {
    this.value = value
    this.propagateChange(this.value)
    this.change.emit(this.value)
  }

  /**
   * Control Value Accessor Methods
   */
  writeValue(value: boolean): void {
    if (value) {
      this.value = value
      this.onChange(value)
    }
  }

  registerOnChange(fn: any): void {
    this.propagateChange = fn
  }

  registerOnTouched(fn: any): void {
    this.propagateTouch = fn
  }

  setDisabledState(isDisabled: boolean): void {
    this.disabled = isDisabled
  }

  validate(c: FormControl) {
    if (this.isRequired && !this.isDisabled) {
      if (!c.value) {
        return { ccrFieldConsent: 'required' }
      }
    }
    return null
  }
}
