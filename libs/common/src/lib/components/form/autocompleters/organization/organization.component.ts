import {
  ChangeDetectorRef,
  Component,
  EventEmitter,
  forwardRef,
  Host,
  Input,
  OnInit,
  Optional,
  Output,
  SkipSelf,
  ViewChild
} from '@angular/core'
import {
  AbstractControl,
  ControlContainer,
  ControlValueAccessor,
  FormControl,
  NG_VALIDATORS,
  NG_VALUE_ACCESSOR
} from '@angular/forms'
import {
  MatAutocompleteSelectedEvent,
  MatAutocompleteTrigger
} from '@coachcare/material'
import {
  NamedEntity,
  OrgAccessRequest,
  OrganizationProvider
} from '@coachcare/sdk'
import { AutocompleterOption } from '@coachcare/common/shared'
import { find, result } from 'lodash'
import { debounceTime, distinctUntilChanged } from 'rxjs/operators'

@Component({
  selector: 'ccr-autocompleter-organization',
  templateUrl: './organization.component.html',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => OrganizationAutocompleterComponent),
      multi: true
    },
    {
      provide: NG_VALIDATORS,
      useExisting: forwardRef(() => OrganizationAutocompleterComponent),
      multi: true
    }
  ],
  // eslint-disable-next-line
  host: {
    class: 'mat-form-field',
    '[class.mat-input-invalid]': '_control?.invalid && _control?.touched',
    '[class.mat-form-field-invalid]': '_control?.invalid && _control?.touched',
    '[class.mat-form-field-disabled]': '_control?.disabled'
  }
})
export class OrganizationAutocompleterComponent
  implements ControlValueAccessor, OnInit {
  @Input() formControlName: string

  @Input() disabled: any
  @Input() initialOrg?: NamedEntity
  @Input() placeholder: string
  @Input() readonly: any
  @Input() required: any
  @Input() tooltip: string

  @Output() change = new EventEmitter<string | null>()

  @ViewChild(MatAutocompleteTrigger, { static: true })
  trigger: MatAutocompleteTrigger

  _control: AbstractControl | undefined
  _input: FormControl
  hasSelected = false
  items: Array<AutocompleterOption> = []
  value: string | null = null

  private initialLoad = false

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
    private organization: OrganizationProvider,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit() {
    // setup the current control
    if (this.parent) {
      const parent = this.parent.control as AbstractControl
      this._control = parent.get(this.formControlName) as AbstractControl
    }

    // setup the autocompleter input
    this._input = new FormControl()
    this._input.valueChanges
      .pipe(debounceTime(500), distinctUntilChanged())
      .subscribe((query) => {
        typeof query === 'string' && query !== ''
          ? this.fetch({ query })
          : this.trigger.closePanel()
      })

    this._input.valueChanges.subscribe((val) => {
      // ensure the seleted value is inside the options
      // this is required on form intialization
      if (val && val.value && !find(this.items, { value: val.value })) {
        this.items.push(val)
      }
      this.hasSelected = val && val.value && val.value.length > 0
    })

    if (this.initialOrg) {
      this._input.setValue(this.initialOrg.name)
    } else {
      this.initialLoad = true
    }
  }

  propagateChange = (data: any) => {}
  propagateTouch = () => {}

  onChange(value: string | null) {
    this.value = value
    this.propagateChange(this.value)
    this.change.emit(this.value)
  }

  /**
   * Control Value Accessor Methods
   */
  writeValue(value: string): void {
    if (value === null) {
      this.reset()
    } else if (typeof value === 'string' && this.value !== value) {
      // FIXME select from DB?
      this.value = value
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
        return { ccrAutocompleterOrganization: 'required' }
      }
    }
    return null
  }

  /**
   * Custom Methods
   */
  onFocusOut() {
    // if (this._input.value === '') {
    //   this.onChange(this.value);
    // }
  }

  displayFn(value: any): string {
    return value
      ? value.viewValue
        ? value.viewValue
        : result(find(this.items, { value }), 'viewValue', '')
      : ''
  }

  reset(args?: Partial<OrgAccessRequest>) {
    this.value = null
    this._input.setValue('')
    this.items = []
    if (args) {
      this.fetch(args)
    }
  }

  // TODO support admin and non-admin queries
  fetch(args: Partial<OrgAccessRequest>): void {
    void this.organization
      .getAll({
        name: args.query,
        limit: 5,
        status: 'active'
      })
      .then((res) => {
        this.items = res.data.map((c) => ({
          value: c.id,
          viewValue: `${c.name}`
        }))
        if (this.items.length && this.initialLoad) {
          this.trigger.openPanel()
        } else {
          this.trigger.closePanel()
        }

        if (this.initialLoad) {
          return
        }

        this.initialLoad = true

        if (this.initialOrg) {
          ;(this
            .trigger as any)._element.nativeElement.value = this.initialOrg.name
          this.propagateChange(this.initialOrg.id)
          this.change.emit(this.initialOrg.id)
          this.hasSelected = true
          this.cdr.detectChanges()
        }
      })
  }

  select(event: MatAutocompleteSelectedEvent): void {
    const item: AutocompleterOption = event.option.value
    this.onChange(item.value)
  }

  remove() {
    this._input.setValue('')
    this.onChange(null)
  }
}
