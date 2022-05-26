import { Component, OnInit } from '@angular/core'
import { ConfigService, ContextService } from '@coachcare/common/services'
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy'
import { get } from 'lodash'

@UntilDestroy()
@Component({
  selector: 'ccr-footer',
  templateUrl: './footer.component.html'
})
export class FooterComponent implements OnInit {
  public clinicName: string
  public company: string
  public currentYear: number
  public linkTerms?: string
  public linkPrivacy?: string
  public linkHipaa?: string
  public linkMsa?: string

  constructor(config: ConfigService, private context: ContextService) {
    this.clinicName = config.get(
      'app.layout.footer.clinic',
      'Configure Clinic Name'
    )
    this.company = config.get('app.layout.footer.company', 'CoachCare')
    this.currentYear = new Date().getFullYear()
  }

  public ngOnInit(): void {
    this.context.organization$.pipe(untilDestroyed(this)).subscribe((org) => {
      const links = get(org, 'mala.custom.links') || {}
      this.linkTerms = links.terms
      this.linkPrivacy = links.privacy
      this.linkHipaa = links.hipaa
      this.linkMsa = links.msa
    })
  }
}
