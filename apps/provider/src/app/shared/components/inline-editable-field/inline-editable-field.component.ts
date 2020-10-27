import {
  Component,
  ElementRef,
  EventEmitter,
  forwardRef,
  HostListener,
  Input,
  OnDestroy,
  OnInit,
  Output,
  ViewChild,
  ViewEncapsulation
} from '@angular/core';
import {
  ControlValueAccessor,
  FormBuilder,
  FormGroup,
  NG_VALUE_ACCESSOR
} from '@angular/forms';
import { untilDestroyed } from 'ngx-take-until-destroy';
import { debounceTime } from 'rxjs/operators';

type InlineEditableFieldType = 'text' | 'selector';
type InlineEditableFieldStatus = 'edit' | 'readonly' | 'view';

interface InlineEditableFieldForm {
  value: string;
}

interface SelectorOption {
  displayName: string;
  displayValue: string;
  name: string;
  value: string;
}

@Component({
  selector: 'ccr-inline-editable-field',
  templateUrl: './inline-editable-field.component.html',
  styleUrls: ['./inline-editable-field.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => InlineEditableField),
      multi: true
    }
  ],
  encapsulation: ViewEncapsulation.None
})
export class InlineEditableField implements ControlValueAccessor, OnDestroy, OnInit {
  @HostListener('document:click', ['$event'])
  checkClick($event: any): void {
    if (
      this.status === 'edit' &&
      !this.elementRef.nativeElement.contains($event.target)
    ) {
      this.confirmValue();
    }
  }

  @Input() defaultDisplayValue: string;
  @Input() disabled: boolean;
  @Input() placeholder: string;
  @Input() set selectorOptions(opts: SelectorOption[]) {
    if (opts && opts.length) {
      this._selectorOptions = opts;
      if (this.form) {
        this.resolveSelectorDisplayValue(this.form.value.value);
      }
    }
  }

  get selectorOptions(): SelectorOption[] {
    return this._selectorOptions;
  }
  @Input() type: InlineEditableFieldType;
  @Input() set value(v: string) {
    if (v !== undefined) {
      this._value = v;
      setTimeout(() => this.form.patchValue({ value: v }));
    }
  }

  get value(): string {
    return this._value;
  }

  @Output() change: EventEmitter<string> = new EventEmitter<string>();

  @ViewChild('textField', { static: false }) textField;

  form: FormGroup;
  propagateChange: (value: any) => void;
  propagateOnTouched: (value: any) => void;
  selectorDisplayValue: string;
  status: InlineEditableFieldStatus = 'view';

  private _selectorOptions: SelectorOption[] = [];
  private _value: string;

  constructor(private elementRef: ElementRef, private fb: FormBuilder) {
    this.onValueChanges = this.onValueChanges.bind(this);
    this.selectAllText = this.selectAllText.bind(this);
  }

  ngOnDestroy(): void {}

  ngOnInit(): void {
    this.createForm();

    if (this.value) {
      this.form.patchValue({ value: this.value });
    }
  }

  confirmValue(): void {
    const value = this.form.value.value;

    if (this.type === 'text' && (!value || !value.trim())) {
      return;
    }

    this.change.emit(value);
    this.setFieldMode('view');
  }

  registerOnChange(fn: any): void {
    this.propagateChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.propagateOnTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    if (isDisabled) {
      this.form.disable();
    } else {
      this.form.enable();
    }
  }

  setFieldMode(mode: InlineEditableFieldStatus): void {
    this.status = mode;
    setTimeout(this.selectAllText, 100);
  }

  writeValue(value: any): void {
    if (value) {
      this.form.patchValue({ value });
    }
  }

  private createForm(): void {
    this.form = this.fb.group({
      value: []
    });

    this.form.valueChanges
      .pipe(untilDestroyed(this), debounceTime(300))
      .subscribe(this.onValueChanges);
  }

  private onValueChanges(controls: InlineEditableFieldForm): void {
    if (this.propagateOnTouched) {
      this.propagateOnTouched(controls);
    }

    if (this.propagateChange) {
      this.propagateChange(controls.value);
    }

    this.resolveSelectorDisplayValue(controls.value);
  }

  private resolveSelectorDisplayValue(value: string): void {
    if (this.type === 'selector' && this.selectorOptions && this.selectorOptions.length) {
      const option = this.selectorOptions.find(
        (opt) => (opt.value || opt.name) === value
      );
      if (option) {
        this.selectorDisplayValue = option.displayValue || option.displayName;
      }
    }
  }

  private selectAllText(): void {
    if (this.textField) {
      this.textField.nativeElement.select();
    }
  }
}
