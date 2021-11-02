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
  FormControl,
  FormGroup,
  NG_VALIDATORS,
  NG_VALUE_ACCESSOR,
  Validators
} from '@angular/forms'
import { ContextService, NotifierService } from '@app/service'
import { _ } from '@app/shared/utils'
import * as moment from 'moment'
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy'
import { Subject } from 'rxjs'
import { debounceTime } from 'rxjs/operators'
import {
  EndingAction,
  EndingActions,
  Sequence,
  SEQUENCE_HOURS,
  SequenceHour,
  SequenceState,
  StepDelay,
  StepDelays
} from '../../models'
import { Transition } from '../../models/sequence-transition'

@UntilDestroy()
@Component({
  selector: 'sequencing-form',
  templateUrl: './sequencing-form.component.html',
  styleUrls: ['./sequencing-form.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => SequencingFormComponent),
      multi: true
    },
    {
      provide: NG_VALIDATORS,
      useExisting: forwardRef(() => SequencingFormComponent),
      multi: true
    }
  ]
})
export class SequencingFormComponent
  implements ControlValueAccessor, OnDestroy, OnInit {
  @Input() set blocked(blocked: boolean) {
    this._blocked = blocked

    if (this.form && this._blocked) {
      this.form.controls.endingAction.disable({ emitEvent: false })
    } else if (this.form) {
      this.form.controls.endingAction.enable({ emitEvent: false })
    }
  }

  get blocked(): boolean {
    return this._blocked
  }

  @Input() markAsTouched: Subject<void>

  @Input() set hardBlocked(hardBlocked: boolean) {
    this._hardBlocked = hardBlocked

    if (this.form && this._hardBlocked) {
      this.form.controls.name.disable({ emitEvent: false })
    } else if (this.form) {
      this.form.controls.name.enable({ emitEvent: false })
    }
  }

  get hardBlocked(): boolean {
    return this._hardBlocked
  }

  @Input() sequence: Sequence

  @Output() loadFinished: EventEmitter<void> = new EventEmitter<void>()

  activeStep: number
  availableStepDelays: StepDelay[][] = []
  delayOutputFormatter: (value) => string = (value) =>
    value ? (value > 1 ? value + ' days' : value + ' day') : ''
  delayInputFormatter: (value) => number | string = (value) =>
    value !== 'no delay'
      ? Number(value.split(' ')[0])
      : _('SEQUENCING.DELAYS.NO_DELAY')
  endingActions: EndingAction[] = []
  initialValue: any
  form: FormGroup
  haltFormListening: boolean
  highestStepIndex = 0
  initialLoad = true
  selectedStepIndex = -1
  state: 'list' | 'reorder' = 'list'
  steps: any[] = []
  stepsIndexes: number[] = []
  stepHoursFilters: SequenceHour[][] = []
  stepServerDelays: string[] = []
  endingActionZendeskLink =
    'https://coachcare.zendesk.com/hc/en-us/articles/360035966752-Understanding-Sequence-Delays'
  addStepZendeskLink =
    'https://coachcare.zendesk.com/hc/en-us/articles/360036270491-Adding-Steps-to-a-Sequence'
  delayZendeskLink =
    'https://coachcare.zendesk.com/hc/en-us/articles/360035966752-Understanding-Sequence-Delays'

  private _blocked: boolean
  private _hardBlocked: boolean

  constructor(
    public context: ContextService,
    private fb: FormBuilder,
    private notifier: NotifierService
  ) {}

  ngOnDestroy(): void {}

  ngOnInit(): void {
    this.resolveEndingActions()
    this.createForm()
    if (this.blocked) {
      this.form.controls.endingAction.disable({ emitEvent: false })
    }

    if (this.hardBlocked) {
      this.form.controls.name.disable({ emitEvent: false })
    }

    this.markAsTouched.pipe(untilDestroyed(this)).subscribe(() => {
      this.form.markAsTouched()
      Object.keys(this.form.controls).forEach((key) => {
        this.form.controls[key].markAsTouched()
      })
    })
  }

  delaySuffixFormat(i: number): string {
    return this.form.value.steps[i].step?.delay !== 'no delay'
      ? this.form.value.steps[i].step?.delay !== '1 day'
        ? _('UNIT.DAYS_DELAY')
        : _('UNIT.DAY_DELAY')
      : ''
  }

  forceDelayRecalculation(): void {
    if (!this.initialLoad) {
      this.resolveStepHourFilters(this.form.value)
      this.resolveStepServerDelays(this.form.value)
      this.form.updateValueAndValidity()
    }
  }

  getActiveStep(): number {
    return this.form && this.form.value.activeStep !== undefined
      ? this.form.value.activeStep
      : undefined
  }

  onAddStep(initialValue: SequenceState | null = null): void {
    const stepsControl = this.form.controls.steps as FormArray

    stepsControl.setValidators((control) => {
      if (
        !control.value ||
        control.value.find(
          (stepObject) => !stepObject.step || !stepObject.step.valid
        )
      ) {
        return { stepValidityError: true }
      }
      return null
    })
    stepsControl.push(
      this.createStepGroup({
        ...initialValue,
        syncState: initialValue
          ? initialValue.syncState
          : {
              deleted: false,
              edited: true,
              inServer: false,
              new: true
            },
        name:
          initialValue && initialValue.name
            ? initialValue.name
            : `Step ${this.steps.length + 1}`,
        valid: true
      } as any)
    )
    this.steps.push({})
    this.selectedStepIndex = this.steps.length - 1
    this.form.patchValue({ activeStep: this.steps.length - 1 })
    this.forceDelayRecalculation()
  }

  onInsertStep(initialValue: SequenceState | null = null, index: number): void {
    const stepsControl = this.form.controls.steps as FormArray

    stepsControl.setValidators((control) => {
      if (
        !control.value ||
        control.value.find(
          (stepObject) => !stepObject.step || !stepObject.step.valid
        )
      ) {
        return { stepValidityError: true }
      }
      return null
    })

    stepsControl.insert(
      index,
      this.createStepGroup({
        ...initialValue,
        syncState: initialValue
          ? initialValue.syncState
          : {
              deleted: false,
              edited: true,
              inServer: false,
              new: true
            },
        name: initialValue && initialValue.name,
        valid: true
      } as any)
    )

    this.steps.splice(index, 0, {})

    const nextStepControl = stepsControl.controls[index + 1]
    nextStepControl.patchValue({
      step: {
        ...nextStepControl.value.step,
        syncState: { ...nextStepControl.value.step.syncState, edited: true }
      }
    })

    this.forceDelayRecalculation()
  }

  onSaveStepOrder(): void {
    this.state = 'list'
  }

  onDelayChanged(value: string, index: number): void {
    if (typeof value !== 'string') {
      return
    }

    const stepValue = {
      ...(this.form.controls.steps as FormGroup).controls[index].value
    }
    const previousDelay = stepValue.step.delay
    stepValue.step.delay = value
    stepValue.step.syncState = {
      ...stepValue.step.syncState,
      edited: stepValue.step.syncState.edited
        ? true
        : previousDelay !== stepValue.step.delay
    }
    ;(this.form.controls.steps as FormGroup).controls[index].patchValue(
      stepValue
    )
    this.forceDelayRecalculation()
  }

  onDelayHourChanged(value: string, index: number): void {
    if (typeof value !== 'string') {
      return
    }
    const stepValue = {
      ...(this.form.controls.steps as FormGroup).controls[index].value
    }
    stepValue.step.delayHour = value
    stepValue.step.syncState = { ...stepValue.step.syncState, edited: true }
    ;(this.form.controls.steps as FormGroup).controls[index].patchValue(
      stepValue
    )
    this.forceDelayRecalculation()
  }

  onDropStep($event: any): void {
    if (
      $event.drag === $event.drop ||
      ($event.drag < $event.drop && $event.drop === $event.drag + 1)
    ) {
      return
    }

    const formValue = this.form.value
    const draggedStep = { ...formValue.steps[$event.drag] }

    this.onStepDeleted($event.drag)
    this.onInsertStep(
      {
        ...draggedStep.step,
        id: '',
        syncState: { ...draggedStep.syncState, new: true, inServer: false }
      },
      $event.drop
    )
  }

  onNameChanged(name: string, index: number): void {
    if (typeof name !== 'string') {
      return
    }

    const stepValue = {
      ...(this.form.controls.steps as FormGroup).controls[index].value
    }
    stepValue.step.name = name
    stepValue.step.syncState = { ...stepValue.step.syncState, edited: true }
    ;(this.form.controls.steps as FormGroup).controls[index].patchValue(
      stepValue
    )
    this.forceDelayRecalculation()
  }

  onReorderSteps(): void {
    this.state = 'reorder'
  }

  onSelectStepInput(index: number): void {
    this.selectedStepIndex = index
  }

  onSetActiveStep(index: number): void {
    if (this.state !== 'list') {
      return
    }

    if (this.form.valid) {
      this.form.controls.activeStep.setValue(index)
    } else {
      this.form.markAsTouched()
      this.markAsTouched.next()
      this.notifier.error(_('NOTIFY.ERROR.FILL_BEFORE_SWITCHING_STEPS'))
    }
  }

  onStepDeleted(index: number): void {
    if (
      (this.blocked && this.form.value.steps[index].step.syncState.inServer) ||
      this.hardBlocked
    ) {
      return
    }

    ;(this.form.controls.steps as FormArray).controls[index].patchValue({
      step: {
        ...(this.form.controls.steps as FormArray).controls[index].value.step,
        syncState: {
          ...(this.form.controls.steps as FormArray).controls[index].value.step
            .syncState,
          deleted: true
        }
      }
    })
    this.form.patchValue({ activeStep: this.activeStep - 1 })
    this.forceDelayRecalculation()
  }

  propagateChange(data: any): void {}

  propagateTouched(): void {}

  registerOnTouched(fn): void {
    this.propagateTouched = fn
  }

  registerOnChange(fn): void {
    this.propagateChange = fn
  }

  validate(control: FormControl) {
    return this.form.valid ? null : { sequence: { valid: false } }
  }

  writeValue(value: Sequence): void {
    if (value) {
      this.initialValue = {
        ...value,
        transitions: (value.transitions as Transition[]).map((t) =>
          Object.assign(
            {},
            {
              ...t,
              syncState: { ...t.syncState }
            }
          )
        )
      }

      this.form.patchValue({
        endingAction: value.hasLoop ? 'repeat' : 'no action',
        id: value.id,
        name: value.name,
        syncState: value.syncState,
        transitions: value.transitions
      })

      value.states.forEach((state) => {
        if (state.name !== 'root') {
          this.onAddStep(state)
        }
      })

      setTimeout(() => {
        this.initialLoad = false
        this.form.updateValueAndValidity()
        this.forceDelayRecalculation()
        this.loadFinished.emit()
      }, 300)
    } else {
      this.initialLoad = false
      this.onAddStep()
    }
  }

  private createStepGroup(
    initialValue: SequenceState | null = null
  ): FormGroup {
    return this.fb.group({ step: [initialValue, Validators.required] })
  }

  private createForm(): void {
    this.form = this.fb.group({
      activeStep: [0],
      endingAction: ['no action', Validators.required],
      id: '',
      name: ['', Validators.required],
      recipients: [[]],
      steps: this.fb.array([]),
      syncState: [
        {
          deleted: false,
          edited: false,
          inServer: false,
          new: true
        }
      ],
      transitions: [[]]
    })

    this.form.valueChanges
      .pipe(untilDestroyed(this), debounceTime(100))
      .subscribe((controls) => {
        this.propagateTouched()
        if (this.activeStep !== controls.activeStep) {
          this.activeStep =
            controls.activeStep !== undefined
              ? controls.activeStep
              : this.activeStep || 0
        }
        let shownIndex = 0

        const rootState = this.sequence
          ? this.sequence.states.find((s) => s.name === 'root')
          : undefined
        this.propagateChange({
          ...controls,
          steps: rootState
            ? [{ step: rootState }, ...controls.steps]
            : controls.steps
        })
        this.form.patchValue(
          {
            syncState: { ...this.form.value.syncState, edited: true }
          },
          { emitEvent: false }
        )

        const steps = controls.steps

        if (steps && steps.length) {
          steps.forEach((step, index) => {
            if (
              !step.step ||
              !step.step.syncState ||
              !step.step.syncState.deleted
            ) {
              this.stepsIndexes[index] = ++shownIndex
            }
          })
          this.highestStepIndex = ++shownIndex
        }

        if (this.form.invalid) {
          this.form.controls.activeStep.disable({ emitEvent: false })
        } else if (this.form.controls.activeStep.disabled) {
          this.form.controls.activeStep.enable()
        }
      })

    this.form.controls.steps.valueChanges
      .pipe(untilDestroyed(this))
      .subscribe((controls) => {
        const currentTransitions = this.form.value.transitions || []

        controls.forEach((stepObject, index) => {
          if (!stepObject || !stepObject.step) {
            return
          }

          const transition = currentTransitions.find(
            (t) => t.to.id === stepObject.step.id
          )
          const initialTransition = this.initialValue
            ? this.initialValue.transitions.find(
                (t) => t.to.id === stepObject.step.id
              )
            : undefined

          if (transition && stepObject.step) {
            transition.syncState.edited = initialTransition
              ? initialTransition.serverDelay !== stepObject.step.serverDelay
              : true
            transition.delay =
              stepObject.step.serverDelay || stepObject.step.delay

            stepObject.step.syncState.edited =
              stepObject.step.syncState.edited || transition.syncState.edited
          }
        })
        this.form.controls.transitions.patchValue(currentTransitions)
      })
  }

  private resolveEndingActions(): void {
    this.endingActions = Object.keys(EndingActions).map(
      (key) => EndingActions[key]
    )
  }

  private resolveStepHourFilters(controls: any): void {
    const allDelays = Object.keys(StepDelays).map((key) => StepDelays[key])
    this.stepHoursFilters = []
    this.availableStepDelays = []
    if (controls && controls.steps && controls.steps.length) {
      let remainingHours = SEQUENCE_HOURS.slice()
      controls.steps.forEach((stepObject, index) => {
        const step = stepObject.step

        if (!step || (step.syncState && step.syncState.deleted)) {
          this.availableStepDelays.push(allDelays.slice())
          this.stepHoursFilters.push(remainingHours.slice())
          return
        }

        if (!remainingHours.length) {
          this.availableStepDelays.push(allDelays.filter((delay) => delay.id))
          const stepValue = {
            ...(this.form.controls.steps as FormGroup).controls[index].value
          }
          const previousDelay = stepValue.step.delay

          stepValue.step.delay =
            stepValue.step.delay && stepValue.step.delay !== 'no delay'
              ? stepValue.step.delay
              : this.availableStepDelays[this.availableStepDelays.length - 1][0]
                  .name
          stepValue.step.syncState = {
            ...stepValue.step.syncState,
            edited: stepValue.step.syncState.edited
              ? true
              : previousDelay !== stepValue.step.delay
          }
          ;(this.form.controls.steps as FormGroup).controls[index].patchValue(
            stepValue
          )
        } else {
          this.availableStepDelays.push(allDelays)
        }

        if (!step || (step.syncState && step.syncState.deleted)) {
          this.stepHoursFilters.push(remainingHours.slice())
          return
        }

        remainingHours =
          step && step.delay && step.delay !== 'no delay'
            ? SEQUENCE_HOURS.slice()
            : remainingHours
        this.stepHoursFilters.push(remainingHours.slice())

        if (step) {
          const stepHourIndex = remainingHours.findIndex(
            (hour) => hour.value === step.delayHour
          )
          if (stepHourIndex > -1) {
            remainingHours.splice(0, stepHourIndex + 1)
          } else if (remainingHours.length) {
            const stepValue = {
              ...(this.form.controls.steps as FormGroup).controls[index].value
            }
            const previousDelay = stepValue.step.delay
            stepValue.step.delayHour = remainingHours[0].value
            stepValue.step.syncState = {
              ...stepValue.step.syncState,
              edited: stepValue.step.syncState.edited
                ? true
                : previousDelay !== stepValue.step.delay
            }
            ;(this.form.controls.steps as FormGroup).controls[index].patchValue(
              stepValue
            )
            remainingHours.splice(0, 1)
          }
        }
      })
    }
  }

  private resolveStepServerDelays(controls: any): void {
    const updatedServerDelays = []
    let currentHour = moment().startOf('day')

    if (controls && controls.steps && controls.steps.length) {
      let previousWasDeleted = false
      controls.steps.forEach((stepObject, index) => {
        let dayAmount
        let hourAmount
        const prevHour = currentHour.clone()
        const step = stepObject.step

        if (!step || (step.syncState && step.syncState.deleted)) {
          updatedServerDelays.push('01:00:00')
          previousWasDeleted = step.syncState && step.syncState.deleted
          return
        }

        if (step.delay) {
          dayAmount = +step.delay.split(/\s/)[0]
          currentHour = currentHour.add(dayAmount, 'days')
        }

        if (step.delayHour) {
          hourAmount = +step.delayHour.split(/\:/)[0]
          if (hourAmount !== undefined && !isNaN(hourAmount)) {
            currentHour = currentHour.set('hour', hourAmount)
          }
        }

        const dayDiff = Math.abs(prevHour.diff(currentHour, 'days'))

        const cache = currentHour.clone()

        const isAfterPrev = currentHour.isSameOrAfter(
          currentHour.clone().set('hour', prevHour.hour()),
          'hour'
        )

        if (step.delay) {
          currentHour = currentHour.subtract(dayAmount, 'days')
        }

        const hourDiff = Math.abs(
          prevHour.diff(
            !step.delay || isAfterPrev
              ? currentHour
              : currentHour.clone().add(1, 'day'),
            'hours'
          )
        )

        currentHour = cache

        updatedServerDelays.push(
          `${dayDiff ? dayDiff + ' days' : ''} ${
            hourDiff
              ? hourDiff > 23
                ? ''
                : hourDiff.toString().padStart(2, '0') + ':00:00'
              : ''
          }`.trim()
        )

        if (previousWasDeleted) {
          updatedServerDelays[updatedServerDelays.length - 2] =
            updatedServerDelays[updatedServerDelays.length - 1]
          previousWasDeleted = false
        }
      })

      this.stepServerDelays = updatedServerDelays

      // We update the step controls manually, in case
      // the step control doesn't exist in the DOM
      const stepControls = this.form.controls.steps as FormArray

      if (stepControls.length) {
        stepControls.controls.forEach((control, index) => {
          const delayStringKey = control.value.step.delay
            ? Object.keys(StepDelays).find(
                (key) => StepDelays[key].name === control.value.step.delay
              )
            : 'no-delay'

          const delayString = delayStringKey
            ? StepDelays[delayStringKey].displayName
            : StepDelays['no-delay'].displayName

          const delayHour = control.value.step.delayHour
            ? SEQUENCE_HOURS.find(
                (hour) => control.value.step.delayHour === hour.value
              ).displayName
            : SEQUENCE_HOURS[0].displayName

          control.patchValue(
            {
              step: {
                ...control.value.step,
                serverDelay: this.stepServerDelays[index],
                delayString: delayString,
                delayHourString: delayHour
              }
            },
            { emitEvent: false }
          )
        })

        this.form.updateValueAndValidity()
      }
    }
  }
}
