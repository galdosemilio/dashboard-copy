import { Component, Input, OnInit } from '@angular/core'
import { SequenceState } from '@app/dashboard/sequencing/models/sequence'
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy'
import * as moment from 'moment-timezone'
import { Subject, debounceTime } from 'rxjs'

interface TableStep {
  date: string
  index: number
  name: string
}

@UntilDestroy()
@Component({
  selector: 'ccr-sequence-preview',
  templateUrl: './sequence-preview.component.html'
})
export class SequencePreviewComponent implements OnInit {
  @Input() set states(value: SequenceState[]) {
    this._states = value
    this.refresh$.next()
  }

  get states(): SequenceState[] {
    return this._states
  }

  @Input() set startDate(date: moment.Moment) {
    this._startDate = date
    this.refresh$.next()
  }

  get startDate() {
    return this._startDate
  }

  @Input() set step(value: number) {
    this._step = value
    this.refresh$.next()
  }

  get step() {
    return this._step
  }

  @Input() set repeatable(value: boolean) {
    this._repeatable = value
    this.refresh$.next()
  }

  get repeatable() {
    return this._repeatable
  }

  public columns: string[] = ['step', 'title', 'date']
  public steps: TableStep[]

  private _states: SequenceState[]
  private _startDate: moment.Moment = moment()
  private _step: number = 0
  private _repeatable: boolean = false
  private delayAcc: moment.Moment
  private refresh$ = new Subject<void>()

  ngOnInit(): void {
    this.refresh$
      .pipe(untilDestroyed(this), debounceTime(300))
      .subscribe(() => this.refreshStepInfo())
    this.refresh$.next()
  }

  private refreshStepInfo(): void {
    const stepOptions = this.states.filter((state) => state.name !== 'root')

    const stepsCopy = stepOptions.slice()

    if (this._repeatable) {
      stepsCopy.push(...stepOptions)
    }

    let removedSteps = []

    if (this.step > 0) {
      removedSteps = stepsCopy.splice(0, this.step)
      this.delayAcc = moment(this.startDate).startOf('day')
      for (const step of removedSteps) {
        const duration = this.parseServerDelay(step.serverDelay)

        this.delayAcc = this.delayAcc.add(duration)
      }
    }

    this.steps = stepsCopy.map((state, index) => ({
      index: index + 1,
      name: state.name,
      date: this.calcDelayedDate(
        state.serverDelay,
        stepOptions.length - removedSteps.length,
        index + 1
      )
    }))

    delete this.delayAcc
  }

  private calcDelayedDate(
    serverDelay: string,
    stepOptionsLength: number,
    currentIndex: number
  ): string | undefined {
    const duration = this.parseServerDelay(serverDelay)

    if (!this.delayAcc) {
      this.delayAcc = moment(this.startDate).startOf('day')
    }

    if (duration.toISOString() === 'P0D') {
      this.delayAcc = this.delayAcc.add(1, 'days')
    }

    if (currentIndex === stepOptionsLength + 1) {
      this.delayAcc = moment(this.delayAcc).add(1, 'days').startOf('day')
    }

    if (duration.toISOString() !== 'Invalid date') {
      this.delayAcc = this.delayAcc.add(duration)
    }

    return this.delayAcc.toISOString() > moment().toISOString()
      ? this.delayAcc.toISOString()
      : undefined
  }

  private parseServerDelay(serverDelay: string): moment.Duration {
    const parsedDelay = serverDelay.replace(/\s?days?/, '')
    const duration =
      parsedDelay.length > 7
        ? moment.duration(parsedDelay)
        : moment.duration({
            days: parseInt(parsedDelay, 10)
          })

    return duration
  }
}
