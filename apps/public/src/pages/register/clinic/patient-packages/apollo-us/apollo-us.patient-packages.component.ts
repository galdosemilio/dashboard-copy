import { Component, OnInit } from '@angular/core';
import { _ } from '@coachcare/backend/shared';

@Component({
  selector: 'ccr-page-register-clinic-apollous-patient-packages',
  styleUrls: ['./apollo-us.patient-packages.component.scss'],
  templateUrl: './apollo-us.patient-packages.component.html'
})
export class ApolloUSPatientPackagesComponent implements OnInit {
  packages: any[];

  ngOnInit() {
    this.packages = [
      {
        name: _('SECTION.APOLLOUS.PACKAGE.COACH_PLUS'),
        value: 'package1',
        image: '/assets/package-a.png',
        contents: [
          _('SECTION.APOLLOUS.PACKAGE.MOBILE_APP'),
          _('SECTION.APOLLOUS.PACKAGE.BODY_COMPOSITION_SCALE')
        ]
      },
      {
        name: _('SECTION.APOLLOUS.PACKAGE.COACH_PLUS_SERVICE'),
        value: 'package2',
        image: '/assets/package-b.png',
        contents: [
          _('SECTION.APOLLOUS.PACKAGE.MOBILE_APP'),
          _('SECTION.APOLLOUS.PACKAGE.BODY_COMPOSITION_SCALE'),
          _('SECTION.APOLLOUS.PACKAGE.APOLLO_COACHING_SERVICES')
        ]
      }
    ];
  }
}
