import { Component, Inject, OnInit } from '@angular/core'
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser'
import { PageSectionInjectableProps } from '@board/pages/shared/model'
import { AppStoreFacade, OrgPrefState } from '@coachcare/common/store'
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
    private domSanitizer: DomSanitizer,
    @Inject(PageSectionInjectableProps)
    private injectedData: PageSectionInjectableProps,
    private org: AppStoreFacade
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

    this.resolveIframeURL()
  }

  public refresh(): void {
    window.location.reload()
  }

  private resolveIframeURL(): void {
    const iframeData = this.data.registrationData
      ? this.data.registrationData
      : { plan: '', billingTerm: '', clinicId: '' }

    let iframeURL =
      environment.ccrApiEnv === 'prod'
        ? `https://www.coachcare.com/ccr-clinic-registration-successful`
        : 'http://localhost:4000/ccr-clinic-registration-successful'

    iframeURL += `?plan=${iframeData.plan}&billingTerm=${iframeData.billingTerm}&clinicId=${iframeData.clinicId}`

    this.iframeURL = this.domSanitizer.bypassSecurityTrustResourceUrl(iframeURL)
  }
}
