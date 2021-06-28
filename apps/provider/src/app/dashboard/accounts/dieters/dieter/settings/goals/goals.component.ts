import { Component, OnDestroy, OnInit } from '@angular/core'
import { FormBuilder, FormGroup, Validators } from '@angular/forms'
import { AccountMeasurementPreferenceType, Goal, Goals } from '@coachcare/sdk'

import { ContextService, EventsService, NotifierService } from '@app/service'
import { _, BindForm, unitConversion, unitConversionDefault } from '@app/shared'
import { UntilDestroy } from '@ngneat/until-destroy'
import { FormUtils } from '@coachcare/common/shared'
import { GoalObject } from '@coachcare/sdk/dist/lib/providers/goal/requests/goalObjectRequest.interface'

@UntilDestroy()
@Component({
  selector: 'app-dieter-goals',
  templateUrl: './goals.component.html',
  styleUrls: ['./goals.component.scss']
})
export class DieterGoalsComponent implements BindForm, OnInit {
  public form: FormGroup
  public isLoading = false
  public goalsMin: Goals = {
    weight: 45000,
    dailyHydration: 0,
    weeklyExercise: 60,
    dailySleep: 360,
    dailyStep: 3000,
    calorie: 0,
    triggerWeight: 0
  }
  public goalsMax: Goals = {
    weight: 226796,
    dailyHydration: 6000,
    weeklyExercise: 1800,
    dailySleep: 600,
    dailyStep: 20000,
    calorie: 3000,
    triggerWeight: 0
  }

  private dieterId: number
  private measurement: AccountMeasurementPreferenceType
  private defaultGoals: Goals = {
    weight: 90718.5,
    dailyHydration: 2720.8,
    weeklyExercise: 500,
    dailySleep: 480,
    dailyStep: 12500,
    calorie: 2000,
    triggerWeight: 0
  }

  constructor(
    private builder: FormBuilder,
    private bus: EventsService,
    private context: ContextService,
    private goal: Goal,
    private notifier: NotifierService
  ) {
    this.measurement = this.context.user.measurementPreference || 'us'

    this.goalsMin = this.convertToRead(this.goalsMin)
    this.goalsMax = this.convertToRead(this.goalsMax)
  }

  public ngOnInit(): void {
    this.dieterId = +this.context.accountId
    this.createForm()
    this.loadGoals()
    this.bus.trigger('right-panel.component.set', 'reminders')
  }

  private createForm(): void {
    this.form = this.builder.group({
      calorie: [
        0,
        [
          Validators.min(this.goalsMin.calorie),
          Validators.max(this.goalsMax.calorie)
        ]
      ],
      dailySleep: [
        0,
        [
          Validators.min(this.goalsMin.dailySleep),
          Validators.max(this.goalsMax.dailySleep)
        ]
      ],
      dailyStep: [
        0,
        [
          Validators.min(this.goalsMin.dailyStep),
          Validators.max(this.goalsMax.dailyStep)
        ]
      ],
      dailyHydration: [
        0,
        [
          Validators.min(this.goalsMin.dailyHydration),
          Validators.max(this.goalsMax.dailyHydration)
        ]
      ],
      weeklyExercise: [
        0,
        [
          Validators.min(this.goalsMin.weeklyExercise),
          Validators.max(this.goalsMax.weeklyExercise)
        ]
      ],
      weight: [
        0,
        [
          Validators.min(this.goalsMin.weight),
          Validators.max(this.goalsMax.weight)
        ]
      ],
      triggerWeight: [
        0,
        [
          Validators.min(this.goalsMin.triggerWeight),
          Validators.max(this.goalsMax.triggerWeight)
        ]
      ]
    })
  }

  private convertToRead(data: Goals): Goals {
    const goals: Goals = {
      calorie: 0,
      dailySleep: 0,
      dailyStep: 0,
      dailyHydration: 0,
      weeklyExercise: 0,
      weight: 0,
      triggerWeight: 0
    }

    for (const key of Object.keys(data)) {
      const value = data[key] ?? this.defaultGoals[key]

      switch (key) {
        case 'dailyHydration':
          goals[key] = Math.round(
            unitConversion(this.measurement, 'volume', value)
          )
          break
        case 'dailySleep':
          goals[key] = Math.round(
            unitConversion(this.measurement, 'duration', value)
          )
          break
        case 'weeklyExercise':
          goals[key] = Math.round(
            unitConversion(this.measurement, 'duration', value)
          )
          break
        case 'weight':
          goals[key] = Math.round(
            unitConversion(this.measurement, 'composition', value)
          )
          break
        default:
          goals[key] = value
          break
      }
    }

    return goals
  }

  private convertToDefault(data: Goals): Goals {
    const goals: Goals = {
      calorie: 0,
      dailySleep: 0,
      dailyStep: 0,
      dailyHydration: 0,
      weeklyExercise: 0,
      weight: 0,
      triggerWeight: 0
    }

    for (const key of Object.keys(data)) {
      switch (key) {
        case 'dailyHydration':
          goals[key] = Math.round(
            unitConversionDefault(this.measurement, 'volume', data[key])
          )
          break
        case 'dailySleep':
          goals[key] = Math.round(
            unitConversionDefault(this.measurement, 'duration', data[key])
          )
          break
        case 'weeklyExercise':
          goals[key] = Math.round(
            unitConversionDefault(this.measurement, 'duration', data[key])
          )
          break
        case 'weight':
          goals[key] = Math.round(
            unitConversionDefault(this.measurement, 'composition', data[key])
          )
          break
        default:
          goals[key] = Math.round(data[key])
          break
      }
    }

    return goals
  }

  private async loadGoals(): Promise<void> {
    this.isLoading = true

    try {
      const res = await this.goal.fetch({ account: `${this.dieterId}` })

      const data: Goals = {
        calorie: res.goal.calorie,
        dailyHydration: res.goal.dailyHydration,
        dailySleep: res.goal.dailySleep,
        dailyStep: res.goal.dailyStep,
        weeklyExercise: res.goal.weeklyExercise,
        weight: res.goal.weight,
        triggerWeight: res.goal.triggerWeight
      }

      const goals = this.convertToRead(data)

      Object.keys(goals).forEach((key) =>
        this.form.get(key).setValue(goals[key])
      )
    } catch (err) {
      this.notifier.error(err)
    } finally {
      this.isLoading = false
    }
  }

  public async onSubmit(): Promise<void> {
    if (this.form.invalid) {
      FormUtils.markAsTouched(this.form)
      return
    }

    const formValue = this.form.value
    const goals = this.convertToDefault(formValue)
    const data = Object.entries(goals).map(
      ([key, value]) => ({ goal: key, quantity: value } as GoalObject)
    )

    this.isLoading = true

    try {
      await this.goal.update({
        account: `${this.dieterId}`,
        goal: data
      })
      this.notifier.success(_('NOTIFY.SUCCESS.PATIENT_GOALS_UPDATED'))
    } catch (err) {
      this.notifier.error(err)
    } finally {
      this.isLoading = false
    }
  }
}
