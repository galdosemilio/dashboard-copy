import { Component, OnDestroy, OnInit } from '@angular/core'
import { ActivatedRoute, ParamMap } from '@angular/router'
import { resolveConfig } from '@app/config/section'
import { ContextService, EventsService } from '@app/service'
import { get } from 'lodash'
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy'

@UntilDestroy()
@Component({
  selector: 'app-dieter-settings',
  templateUrl: './settings.component.html'
})
export class DieterSettingsComponent implements OnInit, OnDestroy {
  account: string
  components = [
    'profile',
    'addresses',
    'labels',
    'phase-history',
    'devices',
    'forms',
    'sequences',
    'communications',
    'associations',
    'file-vault',
    'login-history',
    'meetings',
    'goals'
  ]
  component = 'profile'
  defaultComponents = [
    'profile',
    'addresses',
    'labels',
    'phase-history',
    'devices',
    'forms',
    'sequences',
    'communications',
    'associations',
    'file-vault',
    'login-history',
    'meetings',
    'goals'
  ]
  associationZendeskLink =
    'https://coachcare.zendesk.com/hc/en-us/articles/360035588992-Changing-a-Patient-Coach-Clinic'

  get section(): string {
    return this.component
  }
  set section(target: string) {
    this.component = target
  }

  constructor(
    private context: ContextService,
    private route: ActivatedRoute,
    private bus: EventsService
  ) {}

  ngOnDestroy() {}

  ngOnInit() {
    this.context.account$
      .pipe(untilDestroyed(this))
      .subscribe((account) => (this.account = account.id))

    this.context.organization$
      .pipe(untilDestroyed(this))
      .subscribe((organization) => {
        const hiddenTabs = resolveConfig(
          'JOURNAL.HIDDEN_SETTINGS_TABS',
          organization
        )
        const showForms =
          get(organization, 'preferences.content.enabled') || false
        const showSequences =
          get(organization, 'preferences.sequences.isActive') || false
        const showFileVault =
          get(organization, 'preferences.fileVault.isActive') || false
        const showCalls = get(
          organization,
          'preferences.comms.videoConferencing.isEnabled',
          false
        )
        this.components = this.defaultComponents.slice()
        if (!showForms) {
          this.components.splice(this.components.indexOf('forms'), 1)
        }
        if (!showSequences) {
          this.components.splice(this.components.indexOf('sequences'), 1)
        }
        if (!showFileVault) {
          this.components.splice(this.components.indexOf('file-vault'), 1)
        }
        if (!showCalls) {
          this.components.splice(this.components.indexOf('communications'), 1)
        }

        if (Array.isArray(hiddenTabs)) {
          this.components = this.components.filter(
            (component) =>
              !hiddenTabs.find((hiddenTab) => hiddenTab === component)
          )
        }
      })
    // component initialization
    this.route.paramMap.subscribe((params: ParamMap) => {
      const s = params.get('s')
      this.section = this.components.indexOf(s) >= 0 ? s : this.component
    })

    this.bus.trigger('right-panel.component.set', 'reminders')
  }
}
