import {
  ChangeDetectorRef,
  Component,
  OnInit,
  ViewChild,
  ViewEncapsulation
} from '@angular/core'
import { ActivatedRoute, ParamMap } from '@angular/router'
import { resolveConfig } from '@app/config/section/utils'
import {
  ContextService,
  EventsService,
  SelectedOrganization
} from '@app/service'
import { DateNavigator, DateNavigatorOutput } from '@app/shared'
import { Authentication, GoalTypeId } from '@coachcare/sdk'
import { unitOfTime } from 'moment'
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy'

@UntilDestroy()
@Component({
  selector: 'app-dieter-journal',
  templateUrl: './journal.component.html',
  styleUrls: ['./journal.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class DieterJournalComponent implements OnInit {
  private DEFAULT_TIMEFRAME: unitOfTime.DurationConstructor = 'week'
  // controls with their config
  hiddenComponents = []
  components = [
    'food',
    'keys',
    'supplements',
    'water',
    'exercise',
    'metrics',
    'pain',
    'micronutrients'
  ]
  componentsWithTimeframe = ['exercise']
  component = 'food'
  timeframe: unitOfTime.DurationConstructor = this.DEFAULT_TIMEFRAME
  dailyHydrationGoal = 0
  dates: DateNavigatorOutput = {}
  zendeskLink =
    'https://coachcare.zendesk.com/hc/en-us/articles/360020505591-Viewing-a-Patient-Journal'

  hasFoodKeys: number
  hasLevl = false

  @ViewChild(DateNavigator, { static: true })
  dateNavigator: DateNavigator

  constructor(
    private cdr: ChangeDetectorRef,
    private route: ActivatedRoute,
    private authentication: Authentication,
    private context: ContextService,
    private bus: EventsService
  ) {}

  async ngOnInit() {
    this.context.organization$
      .pipe(untilDestroyed(this))
      .subscribe((organization: SelectedOrganization) => {
        const config = resolveConfig('JOURNAL.HIDDEN_TABS', organization)
        this.hiddenComponents = Object.keys(config).length ? config.slice() : []
      })
    this.hasFoodKeys = await this.context.orgHasFoodMode('Key-based')

    void this.route.parent.data.forEach((data: any) => {
      this.dailyHydrationGoal =
        data.goals?.data.find(
          (entry) => entry.type.id === GoalTypeId.dailyHydration
        )?.quantity || 0
    })

    // component initialization
    this.route.paramMap.subscribe((params: ParamMap) => {
      const s = params.get('s')
      this.section = this.components.indexOf(s) >= 0 ? s : this.component
    })

    this.bus.trigger('right-panel.component.set', 'reminders')
  }

  get section(): string {
    return this.component
  }
  set section(target: string) {
    this.timeframe = this.DEFAULT_TIMEFRAME
    this.dateNavigator.updateTimeframe(this.timeframe)
    this.component = target
  }

  public selectedDate(dates: DateNavigatorOutput): void {
    this.dates = dates
    // prevents exception when changing timeframe from child component
    this.cdr.detectChanges()
  }

  public shouldShowTimeframe(component: string) {
    return this.componentsWithTimeframe.indexOf(component) !== -1
  }
}
