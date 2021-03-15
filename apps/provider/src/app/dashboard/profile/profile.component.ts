import { Component, OnDestroy, OnInit } from '@angular/core'
import { ActivatedRoute, ParamMap } from '@angular/router'
import { ContextService, EventsService, NotifierService } from '@app/service'
import { _ } from '@app/shared'
import { AccSingleResponse, AccUpdateRequest } from '@coachcare/npm-api'
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy'
import { AccountProvider } from '@coachcare/npm-api'

type ProviderProfileSection =
  | 'communications'
  | 'profile'
  | 'security'
  | 'login-history'

@UntilDestroy()
@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnDestroy, OnInit {
  displayOrphanedMessage = false
  profile: AccSingleResponse
  isSaving = false
  section: ProviderProfileSection = 'security'
  zendeskLink =
    'https://coachcare.zendesk.com/hc/en-us/sections/360003260532-Profile'

  constructor(
    private account: AccountProvider,
    private bus: EventsService,
    private context: ContextService,
    private notifier: NotifierService,
    private route: ActivatedRoute
  ) {}

  ngOnDestroy() {}

  ngOnInit() {
    this.profile = this.context.user

    this.bus.trigger('right-panel.component.set', 'notifications')

    this.route.paramMap
      .pipe(untilDestroyed(this))
      .subscribe((params: ParamMap) => {
        const s = params.get('s') || 'profile'
        this.section = s as ProviderProfileSection
      })

    this.context.orphanedAccount$.subscribe((isOrphaned) => {
      this.displayOrphanedMessage = !!isOrphaned
    })
  }

  saveProfile(formData: any): void {
    this.isSaving = true

    const updateRequest: AccUpdateRequest = {
      ...formData,
      phone: formData.phone.phone,
      countryCode: formData.phone.countryCode
    }

    this.account
      .update(updateRequest)
      .then(() => {
        this.notifier.success(_('NOTIFY.SUCCESS.PROFILE_UPDATED'))
        this.context.updateUser()
        this.isSaving = false
      })
      .catch((err) => {
        this.notifier.error(err)
        this.isSaving = false
      })
  }
}
