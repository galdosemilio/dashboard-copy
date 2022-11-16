import {
  Component,
  EventEmitter,
  forwardRef,
  Input,
  OnDestroy,
  OnInit,
  Output
} from '@angular/core'
import {
  ControlValueAccessor,
  FormArray,
  FormBuilder,
  FormGroup,
  NG_VALUE_ACCESSOR,
  Validators
} from '@angular/forms'
import { DeepLinkType } from '@coachcare/sdk'
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy'
import { Subject } from 'rxjs'
import { debounceTime } from 'rxjs/operators'
import {
  SEQUENCE_HOURS,
  SequenceHour,
  SequenceMessage,
  SequenceState,
  StepDelay,
  StepDelays
} from '../../models'

@UntilDestroy()
@Component({
  selector: 'sequencing-step-input',
  templateUrl: './step-input.component.html',
  styleUrls: ['./step-input.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => StepInputComponent),
      multi: true
    }
  ]
})
export class StepInputComponent
  implements ControlValueAccessor, OnDestroy, OnInit
{
  @Input()
  set blocked(blocked: boolean) {
    this._blocked = blocked
  }

  get blocked(): boolean {
    return this._blocked
  }

  @Input() set hardBlocked(hardBlocked: boolean) {
    this._hardBlocked = hardBlocked || false
  }

  get hardBlocked(): boolean {
    return this._hardBlocked
  }

  @Input()
  set serverDelay(serverDelay: string) {
    this._serverDelay = serverDelay
    if (
      this.form &&
      this.form.controls.serverDelay.value !== this._serverDelay
    ) {
      this.form.controls.serverDelay.setValue(this._serverDelay)
    }
  }

  get serverDelay(): string {
    return this._serverDelay
  }

  @Input() firstStep = false
  @Input() index = 0
  @Input() isSelected = true
  @Input() markAsTouched: Subject<void>
  @Input() single = false
  @Input() deepLinkTypes: Array<DeepLinkType>

  @Output() deleted: EventEmitter<void> = new EventEmitter<void>()
  @Output() recalcDelays: EventEmitter<void> = new EventEmitter<void>()
  @Output() selected: EventEmitter<void> = new EventEmitter<void>()

  set page(page: number) {
    this._page = page || 0
    this.minPageIndex = this.page * this.pageSize
    this.maxPageIndex = (this.page + 1) * this.pageSize
  }

  get page(): number {
    return this._page
  }

  currentDelay: string
  currentDelayHour: string
  stepDelays: StepDelay[] = []
  stepHours: SequenceHour[] = SEQUENCE_HOURS
  form: FormGroup
  initialValue: any
  messages: any[] = []
  messagesForm: FormArray
  minPageIndex = 0
  maxPageIndex = 5
  pageSize = 5
  zendeskLink =
    'https://coachcare.zendesk.com/hc/en-us/articles/360035475392-Adding-Actions-to-a-Sequence'

  private _blocked: boolean
  private _filteredHours: SequenceHour[] = []
  private _hardBlocked: boolean
  private _page = 0
  private _serverDelay: string

  constructor(private fb: FormBuilder) {}

  ngOnDestroy(): void {}

  ngOnInit(): void {
    this.resolveStepDelays()
    this.createForm()

    this.markAsTouched.pipe(untilDestroyed(this)).subscribe(() => {
      this.form.markAsTouched()
      Object.keys(this.form.controls).forEach((key) => {
        this.form.controls[key].markAsTouched()
      })
    })
  }

  nextPage(): void {
    ++this.page
  }

  onAddMessage(initialValue: SequenceMessage | null = null): void {
    const messagesControl = this.form.controls.messages as FormArray
    messagesControl.push(this.createMessageGroup(initialValue))
    this.messages.push({})

    if (this.messages.length > this.maxPageIndex) {
      this.nextPage()
    }
  }

  onClick(): void {
    this.selected.emit()
  }

  onDeleteStep() {
    this.form.controls.syncState.patchValue({
      ...this.form.value.syncState,
      deleted: true
    })
    this.deleted.emit()
  }

  prevPage(): void {
    --this.page
  }

  propagateChange(data: any): void {}

  propagateTouched(): void {}

  registerOnChange(fn): void {
    this.propagateChange = fn
  }

  registerOnTouched(fn): void {
    this.propagateTouched = fn
  }

  writeValue(value: SequenceState): void {
    if (value && Object.keys(value).length > 1) {
      this.initialValue = value

      this.form.patchValue({
        id: value.id,
        delay: value.delay || 'no delay',
        delayHour: value.delayHour,
        name: value.name,
        serverDelay: value.serverDelay,
        syncState: value.syncState
      })

      if (
        value.messages &&
        value.messages.length &&
        value.messages.length > this.messages.length
      ) {
        value.messages.forEach((msg) => this.onAddMessage(msg))
      }
    } else {
      this.form.updateValueAndValidity()
    }
  }

  private createMessageGroup(initialValue: any | null = null): FormGroup {
    return this.fb.group({
      message: [
        initialValue && initialValue.message
          ? initialValue.message
          : initialValue,
        Validators.required
      ]
    })
  }

  private createForm(): void {
    this.form = this.fb.group({
      id: [''],
      delay: [this.stepDelays[0].name],
      delayHour: [this.stepHours[0].value],
      messages: this.fb.array([]),
      name: [`Step ${this.index + 1}`, Validators.required],
      serverDelay: [''],
      syncState: [
        {
          deleted: false,
          edited: false,
          inServer: false,
          new: true
        }
      ]
    })

    this.form.valueChanges
      .pipe(untilDestroyed(this), debounceTime(50))
      .subscribe((controls) => {
        this.propagateTouched()

        this.propagateChange({
          ...this.form.value,
          name: controls.name ? controls.name : this.initialValue.name,
          valid:
            this.form.valid ||
            (controls.syncState && controls.syncState.deleted)
        })
      })
  }

  private resolveStepDelays(): void {
    this.stepDelays = Object.keys(StepDelays).map((key) => StepDelays[key])
    if (!this.firstStep) {
      this.stepDelays = this.stepDelays.filter((step) => step.id)
    }
  }
}
