import { Component, OnInit } from '@angular/core'
import { ActivatedRoute, ParamMap } from '@angular/router'
import {
  ContextService,
  CurrentAccount,
  EventsService,
  NotifierService
} from '@app/service'
import { _ } from '@app/shared'
import {
  AccountProvider,
  AccSingleResponse,
  AccUpdateRequest,
  Session
} from '@coachcare/sdk'
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy'
import { AccountFormProps } from '../../form/form.component'
import { DeleteAccountDialog } from '../../dialogs'
import { MatDialog } from '@angular/material/dialog'
import { filter } from 'rxjs'

type ProviderProfileSection =
  | 'addresses'
  | 'communications'
  | 'profile'
  | 'security'
  | 'login-history'

@UntilDestroy()
@Component({
  selector: 'app-default-profile',
  templateUrl: './default-profile.component.html',
  styleUrls: ['./default-profile.component.scss']
})
export class DefaultProfileComponent implements OnInit {
  displayOrphanedMessage = false
  profile: AccSingleResponse
  isProvider: boolean
  isPatient: boolean
  isLoading = false
  section: ProviderProfileSection = 'security'
  zendeskLink =
    'https://coachcare.zendesk.com/hc/en-us/sections/360003260532-Profile'

  constructor(
    private account: AccountProvider,
    private session: Session,
    private bus: EventsService,
    private context: ContextService,
    private dialog: MatDialog,
    private notifier: NotifierService,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    this.profile = this.context.user
    this.isProvider = this.context.isProvider
    this.isPatient = this.context.isPatient
    this.bus.trigger('right-panel.component.set', 'notifications')
    this.bus.listen('user.data', (user: CurrentAccount) => {
      this.profile = user
    })

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

  saveProfile(formData: AccountFormProps): void {
    this.isLoading = true

    const updateRequest: AccUpdateRequest = {
      ...formData,
      profile: {
        birthday: formData.birthday
          ? formData.birthday.format('YYYY-MM-DD')
          : undefined,
        height: formData.height || undefined,
        gender: formData.gender || undefined
      },
      phone: formData.phone.phone,
      countryCode: formData.phone.countryCode
    }

    this.account
      .update(updateRequest)
      .then(() => {
        this.notifier.success(_('NOTIFY.SUCCESS.PROFILE_UPDATED'))
        void this.context.updateUser()
        this.isLoading = false
      })
      .catch((err) => {
        this.notifier.error(err)
        this.isLoading = false
      })
  }

  public onOpenDeleteAccountDialog(): void {
    this.dialog
      .open(DeleteAccountDialog, {
        data: {},
        disableClose: true,
        width: '80vw',
        panelClass: 'ccr-full-dialog'
      })
      .afterClosed()
      .pipe(
        untilDestroyed(this),
        filter((isDelete) => isDelete)
      )
      .subscribe(() => this.onDeleteAccount())
  }

  private async onDeleteAccount() {
    try {
      this.isLoading = true
      await this.account.deactivate(this.context.user.id)
      window.location.reload()
    } catch (error) {
      this.notifier.error(error)
    } finally {
      this.isLoading = false
    }
  }
}
