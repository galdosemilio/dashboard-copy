import {
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
} from '@angular/core';
import {
  AbstractControl,
  ControlContainer,
  ControlValueAccessor,
  FormControl,
  NG_VALIDATORS,
  NG_VALUE_ACCESSOR
} from '@angular/forms';
import {
  MatAutocompleteSelectedEvent,
  MatAutocompleteTrigger
} from '@coachcare/layout';
import {
  Account,
  AccountAccessData,
  AccountTypeId,
  AccountFullData,
  AccListAllRequest,
  AccListRequest
} from '@coachcare/backend/npm-api';
import {
  _,
  AutocompleterOption,
  TranslationsObject
} from '@coachcare/common/shared';
// import { ContextService } from '@coachcare/common/services';
import { TranslateService } from '@ngx-translate/core';
import { find, result } from 'lodash';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';

@Component({
  selector: 'ccr-autocompleter-account',
  templateUrl: './account.component.html',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => AccountAutocompleterComponent),
      multi: true
    },
    {
      provide: NG_VALIDATORS,
      useExisting: forwardRef(() => AccountAutocompleterComponent),
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
export class AccountAutocompleterComponent
  implements ControlValueAccessor, OnInit {
  @Input() formControlName: string;

  @Input() organization: string;
  @Input() accountType: AccountTypeId;
  @Input() disabled: any;
  @Input() placeholder: string;
  @Input() readonly: any;
  @Input() required: any;
  @Input() tooltip: string;
  @Input() strict = false;

  @Output() change = new EventEmitter<string | null>();

  @ViewChild(MatAutocompleteTrigger, { static: false })
  trigger: MatAutocompleteTrigger;

  _control: AbstractControl | undefined;
  _input: FormControl;
  _isAdmin = false;
  _isLoading = true;
  hasSelected = false;
  items: Array<AutocompleterOption> = [];
  value: string | null = null;
  i18n: TranslationsObject;

  get isDisabled() {
    return this.disabled === '' || this.disabled === true;
  }
  get isReadonly() {
    return this.readonly === '' || this.readonly === true;
  }
  get isRequired() {
    return this.required === '' || this.required === true;
  }

  constructor(
    @Optional()
    @Host()
    @SkipSelf()
    private parent: ControlContainer,
    private translator: TranslateService,
    private accounts: Account
  ) {}

  ngOnInit() {
    this.translate();
    this.translator.onLangChange.subscribe(() => this.translate);

    // setup the current control
    if (this.parent) {
      const parent = this.parent.control as AbstractControl;
      this._control = parent.get(this.formControlName) as AbstractControl;
    }

    // setup the autocompleter input
    this._input = new FormControl();
    this._input.valueChanges
      .pipe(debounceTime(500), distinctUntilChanged())
      .subscribe(query => {
        typeof query === 'string' && query !== ''
          ? this.fetch({ query })
          : this.trigger.closePanel();
      });

    this._input.valueChanges.subscribe(val => {
      // ensure the seleted value is inside the options
      // this is required on form intialization
      if (val && val.value && !find(this.items, { value: val.value })) {
        this.items.push(val);
      }
      this.hasSelected = val && val.value && val.value.length > 0;
    });

    // checks if the current user is Admin
    this._isAdmin = true; // this.context.site === 'admin';
    this._isLoading = false;
  }

  propagateChange = (data: any) => {};
  propagateTouch = () => {};

  onChange(value: string | null) {
    this.value = value;
    this.propagateChange(this.value);
    this.change.emit(this.value);
  }

  /**
   * Control Value Accessor Methods
   */
  writeValue(value: string): void {
    if (value === null) {
      this.reset();
    } else if (typeof value === 'string' && this.value !== value) {
      // FIXME select from DB?
      this.value = value;
    }
  }

  registerOnChange(fn: any): void {
    this.propagateChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.propagateTouch = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }

  validate(c: FormControl) {
    if (this.isRequired && !this.isDisabled) {
      if (!c.value) {
        return { ccrAutocompleterAccount: 'required' };
      }
    }
    return null;
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
      : '';
  }

  reset(args?: Partial<AccListAllRequest | AccListRequest>) {
    this.value = null;
    this._input.setValue('');
    this.items = [];
    if (args) {
      this.fetch(args);
    }
  }

  fetch(args: Partial<AccListAllRequest | AccListRequest>): void {
    let request: Promise<any>;
    if (!this.strict && this._isAdmin) {
      request = this.accounts.getAll({
        accountType: this.accountType,
        organization: this.organization,
        limit: 7,
        // TODO add strict here
        ...(args as AccListAllRequest)
      });
    } else {
      request = this.accounts.getList({
        accountType: this.accountType,
        organization: this.organization,
        limit: 7,
        strict: this.strict,
        ...(args as AccListRequest)
      });
    }

    request.then(res => {
      if (res.data.length) {
        // fill the resulting accounts
        this.items = res.data.map((c: AccountAccessData | AccountFullData) => ({
          value: c.id,
          viewValue: `${c.firstName} ${c.lastName}`
        }));
      } else {
        // set the empty message
        let viewValue;
        switch (this.accountType) {
          case AccountTypeId.Admin:
            viewValue = this.i18n['SELECTOR.AUTOCOMPLETE.NO_MATCHING_ADMINS'];
            break;
          case AccountTypeId.Provider:
            viewValue = this.i18n[
              'SELECTOR.AUTOCOMPLETE.NO_MATCHING_PROVIDERS'
            ];
            break;
          case AccountTypeId.Client:
            viewValue = this.i18n['SELECTOR.AUTOCOMPLETE.NO_MATCHING_CLIENTS'];
            break;
          default:
            viewValue = this.i18n['SELECTOR.AUTOCOMPLETE.NO_MATCHING_ACCOUNTS'];
            break;
        }
        this.items = [{ value: null, viewValue, disabled: true }];
      }

      if (this.items.length) {
        this.trigger.openPanel();
      } else {
        this.trigger.closePanel();
      }
    });
  }

  select(event: MatAutocompleteSelectedEvent): void {
    const item: AutocompleterOption = event.option.value;
    this.onChange(item.value);
  }

  remove() {
    this._input.setValue('');
    this.onChange(null);
  }

  private translate() {
    this.translator
      .get([
        _('SELECTOR.AUTOCOMPLETE.NO_MATCHING_ADMINS'),
        _('SELECTOR.AUTOCOMPLETE.NO_MATCHING_PROVIDERS'),
        _('SELECTOR.AUTOCOMPLETE.NO_MATCHING_CLIENTS'),
        _('SELECTOR.AUTOCOMPLETE.NO_MATCHING_ACCOUNTS')
      ])
      .subscribe(translations => (this.i18n = translations));
  }
}
