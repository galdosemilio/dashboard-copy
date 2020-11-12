import { Component, OnInit } from '@angular/core'

import { ContextService, SelectedOrganization } from '@app/service'
import { get } from 'lodash'

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html'
})
export class FooterComponent implements OnInit {
  currentYear = new Date().getFullYear()
  organization: SelectedOrganization
  linkTerms: string
  linkPrivacy: string
  linkMsa: string
  linkHipaa: string

  constructor(private context: ContextService) {}

  ngOnInit() {
    this.context.organization$.subscribe((org) => {
      const links: any = get(org, 'mala.custom.links') || {}
      this.organization = org
      this.linkTerms = links.terms
      this.linkPrivacy = links.privacy
      this.linkHipaa = links.hipaa
      this.linkMsa = links.msa
    })
  }
}
