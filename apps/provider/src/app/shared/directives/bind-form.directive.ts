import {
  ChangeDetectorRef,
  Directive,
  EventEmitter,
  Host,
  Inject,
  InjectionToken,
  Input,
  OnDestroy,
  OnInit,
  Output,
  Self,
  SkipSelf
} from '@angular/core'
import { AbstractControl, FormGroup, FormGroupDirective } from '@angular/forms'

export interface BindForm {
  form: FormGroup
}

export const BINDFORM_TOKEN = new InjectionToken<BindForm>('BindFormToken')

@Directive({
  selector: '[bindForm]'
})
export class BindFormDirective implements OnInit, OnDestroy {
  private controlName = null

  @Input()
  set bindForm(value) {
    if (this.controlName && !this.overwriteControl) {
      throw new Error('Cannot change the bindForm on runtime!')
    }
    this.controlName = value
  }

  @Input()
  useParentForm = true
  @Input()
  overwriteControl = false

  @Input()
  initial = {}
  @Output()
  final = new EventEmitter<any>()

  private parentControl

  constructor(
    private cdr: ChangeDetectorRef,
    @Inject(BINDFORM_TOKEN)
    @SkipSelf()
    private parent: BindForm,
    @Inject(FormGroupDirective)
    @Host()
    @SkipSelf()
    private controlContainer: FormGroupDirective,
    @Inject(BINDFORM_TOKEN)
    @Self()
    private child: BindForm
  ) {}

  ngOnInit() {
    let controlExists = false
    this.parentControl = this.useParentForm
      ? this.parent.form
      : this.controlContainer.form

    this.controlName = this.controlName.toString()

    if (!this.controlName) {
      throw new Error(
        'BindForm directive requires a value to be used as the subgroup name!'
      )
    }
    if (this.parentControl.get(this.controlName)) {
      controlExists = true
    }

    if (!this.overwriteControl && controlExists) {
      return console.warn(
        `Control (${this.controlName}) already exists on the parent form!`
      )
    }
    // allow to setup the initial data on creation
    if (this.initial instanceof Object) {
      this.child.form.patchValue(this.initial)
    }
    // add a child control under the unique name
    this.parentControl.setControl(this.controlName, this.child.form)
    this.cdr.detectChanges()
  }

  ngOnDestroy() {
    // allow to recover the data before it's destroyed
    this.final.emit(this.child.form.value)
    // remove the component from the parent
    this.parentControl.removeControl(this.controlName)
  }

  setControl(control: AbstractControl): void {
    if (this.controlName) {
      this.parentControl.setControl(this.controlName, control)
    }
  }
}
