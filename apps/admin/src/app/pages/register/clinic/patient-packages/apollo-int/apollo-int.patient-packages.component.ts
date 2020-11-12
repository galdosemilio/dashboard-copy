import { Component, OnInit } from '@angular/core'
import { _ } from '@coachcare/backend/shared'

@Component({
  selector: 'ccr-page-register-clinic-apolloint-patient-packages',
  styleUrls: ['./apollo-int.patient-packages.component.scss'],
  templateUrl: './apollo-int.patient-packages.component.html'
})
export class ApolloIntPatientPackagesComponent implements OnInit {
  packages: any[]

  ngOnInit() {
    this.packages = [
      {
        name: _('SECTION.APOLLO_INT.PACKAGE.APOLLO_CARE_BRONE'),
        value: _('SECTION.APOLLO_INT.PACKAGE.UP_TO_25'),
        image: '/assets/package_bronze.png'
      },
      {
        name: _('SECTION.APOLLO_INT.PACKAGE.APOLLO_CARE_SILVER'),
        value: _('SECTION.APOLLO_INT.PACKAGE.UP_TO_75'),
        image: '/assets/package_silver.png'
      },
      {
        name: _('SECTION.APOLLO_INT.PACKAGE.APOLLO_CARE_GOLD'),
        value: _('SECTION.APOLLO_INT.PACKAGE.UNLIMITED_PATIENTS'),
        image: '/assets/package_gold.png'
      }
    ]
  }
}
