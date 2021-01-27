import { Component, Inject, OnInit } from '@angular/core'
import { SafeResourceUrl } from '@angular/platform-browser'
import { PageSectionInjectableProps } from '@board/pages/shared/model'
import { AppStoreFacade, OrgPrefState } from '@coachcare/common/store'
import { TranslateService } from '@ngx-translate/core'
import { environment } from 'apps/admin/src/environments/environment'
import { LastStepComponentProps } from '../model'

@Component({
  selector: 'ccr-page-register-clinic-default-last-step',
  templateUrl: './default.last-step.component.html'
})
export class DefaultLastStepComponent implements OnInit {
  public data: LastStepComponentProps = {
    onlyFirstParagraph: false,
    showGoogleTagManager: false
  }
  public iframeURL: SafeResourceUrl
  public orgName: Partial<OrgPrefState.State>
  public showGoogleTagManager: boolean

  constructor(
    @Inject(PageSectionInjectableProps)
    private injectedData: PageSectionInjectableProps,
    private org: AppStoreFacade,
    private translate: TranslateService
  ) {
    this.org.pref$.subscribe((pref) => {
      this.orgName = { displayName: pref.displayName || 'CoachCare' }
    })
  }

  public ngOnInit(): void {
    this.data = this.injectedData.data

    this.showGoogleTagManager = this.data
      ? this.data.showGoogleTagManager
      : false

    if (!this.showGoogleTagManager) {
      return
    }

    this.resolveRedirectURL()
  }

  public refresh(): void {
    window.location.reload()
  }

  private resolveRedirectURL(): void {
    const currentLang = this.translate.currentLang.split('-')[0]
    const urlData = this.data.registrationData
      ? this.data.registrationData
      : { plan: '', billingTerm: '', clinicId: '' }

    let url =
      environment.ccrApiEnv === 'prod'
        ? `https://www.coachcare.com/ccr-clinic-registration-successful/`
        : 'https://test.www.coachcare.com/ccr-clinic-registration-successful/'

    url += `?plan=${urlData.plan}&billingTerm=${urlData.billingTerm}&clinicId=${urlData.clinicId}&lang=${currentLang}`

    window.location.href = url
  }
}
