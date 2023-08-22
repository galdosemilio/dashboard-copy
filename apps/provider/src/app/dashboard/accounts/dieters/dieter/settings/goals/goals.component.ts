import { Component, OnInit } from '@angular/core'
import { FormBuilder, FormGroup, Validators } from '@angular/forms'
import {
  AccountMeasurementPreferenceType,
  GoalV2,
  GoalCreate,
  GoalEntity,
  GoalTypeId
} from '@coachcare/sdk'

import { ContextService, EventsService, NotifierService } from '@app/service'
import {
  _,
  BindForm,
  FormUtils,
  unitConversion,
  unitConversionDefault
} from '@app/shared'
import { UntilDestroy } from '@ngneat/until-destroy'
import {
  CreateGoalRequest,
  UpdateGoalRequest
} from '@coachcare/sdk/dist/lib/providers/goal2/requests'

interface Goals {
  calorie: number
  weight: number
  dailyHydration: number
  weeklyExercise: number
  dailySleep: number
  dailyStep: number
  triggerWeight: number
}

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
  private goals: GoalEntity[] = []

  constructor(
    private builder: FormBuilder,
    private bus: EventsService,
    private context: ContextService,
    private goalV2: GoalV2,
    private formUtils: FormUtils,
    private notifier: NotifierService
  ) {
    this.measurement = this.context.user.measurementPreference || 'us'

    this.goalsMin = this.convertToRead(this.goalsMin)
    this.goalsMax = this.convertToRead(this.goalsMax)
  }

  public ngOnInit(): void {
    this.dieterId = +this.context.accountId
    this.createForm()
    void this.loadGoals()
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
      const res = await this.goalV2.fetch({ account: `${this.dieterId}` })
      this.goals = res.data
      const data: Goals = {
        calorie: this.goals.find(
          (entry) => entry.type.id === GoalTypeId.calorie
        )?.quantity,
        dailyHydration: this.goals.find(
          (entry) => entry.type.id === GoalTypeId.dailyHydration
        )?.quantity,
        dailySleep: this.goals.find(
          (entry) => entry.type.id === GoalTypeId.dailySleep
        )?.quantity,
        dailyStep: this.goals.find(
          (entry) => entry.type.id === GoalTypeId.dailyStep
        )?.quantity,
        weeklyExercise: this.goals.find(
          (entry) => entry.type.id === GoalTypeId.weeklyExercise
        )?.quantity,
        weight: this.goals.find((entry) => entry.type.id === GoalTypeId.weight)
          ?.quantity,
        triggerWeight: this.goals.find(
          (entry) => entry.type.id === GoalTypeId.triggerWeight
        )?.quantity
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
      this.formUtils.markAsTouched(this.form)
      return
    }

    this.isLoading = true

    try {
      const formValue = this.form.value
      const goals = this.convertToDefault(formValue)
      const createGoals: GoalCreate[] = []
      let hasChangedGoals = false

      for (const [key, value] of Object.entries(goals)) {
        const existingGoal = this.goals.find((entry) => entry.type.code === key)

        if (!existingGoal && value) {
          createGoals.push({
            type: GoalTypeId[key],
            quantity: value
          })
          hasChangedGoals = true
        } else if (existingGoal && existingGoal.quantity !== value) {
          await this.updateGoal({
            id: existingGoal.id,
            quantity: value
          })
          hasChangedGoals = true
        }
      }

      if (createGoals.length) {
        await this.createGoals({
          account: this.dieterId.toString(),
          goals: createGoals
        })
      }

      if (hasChangedGoals) {
        await this.loadGoals()
        this.notifier.success(_('NOTIFY.SUCCESS.PATIENT_GOALS_UPDATED'))
      }
    } catch (err) {
      this.notifier.error(err)
    } finally {
      this.isLoading = false
    }
  }

  private async createGoals(request: CreateGoalRequest) {
    try {
      await this.goalV2.create(request)
    } catch (error) {
      this.notifier.error(error)
    }
  }

  private async updateGoal(request: UpdateGoalRequest) {
    try {
      await this.goalV2.update(request)
    } catch (error) {
      this.notifier.error(error)
    }
  }
}
