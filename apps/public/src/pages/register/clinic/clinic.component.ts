/**
 * Query Parameter options for the registration page
 * @param {String} [creditCard='optional', 'skip'] By default, the credit card page is shown and a card is required.
 *  It can be 'optional' (page shown but card not required) or 'skip' (not shown or enterable at all)
 * @param {Boolean} [hideLanguageSelector] If true, do not showing language selector (default to en-us)
 * @param {Boolean} [hideTitle] If true, hide the "let's build your coachcare platform" title
 * @param {Boolean} [hideSteps] If true, hide the 1-2-3 or 1-2 steps
 * @param {String} [selectedLanguage] Set selected language default (will work regardless of hideLanguageSelector setting)
 */
import { Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_LABEL_GLOBAL_OPTIONS, MatDialog, MatStepper } from '@angular/material';
import { ActivatedRoute } from '@angular/router';
import { resolveConfig } from '@board/pages/config/section.config';
import { ClinicRegisterRequest, Register } from '@coachcare/backend/services';
import { _ } from '@coachcare/backend/shared';
import { CCRFacade } from '@coachcare/backend/store';
import { ConfirmDialog, LanguagesDialog } from '@coachcare/common/dialogs/core';
import {
  ContextService,
  COOKIE_LANG,
  CookieService,
  LanguageService
} from '@coachcare/common/services';
import { AppStoreFacade, OrgPrefState } from '@coachcare/common/store';
import * as moment from 'moment-timezone';
import { untilDestroyed } from 'ngx-take-until-destroy';

@Component({
  selector: 'ccr-page-register-clinic',
  templateUrl: './clinic.component.html',
  styleUrls: ['./clinic.component.scss'],
  providers: [{ provide: MAT_LABEL_GLOBAL_OPTIONS, useValue: { float: 'never' } }],
  host: {
    class: 'ccr-page-content'
  }
})
export class RegisterClinicPageComponent implements OnDestroy, OnInit {
  isLoading = false;
  orgName: Partial<OrgPrefState.State>;
  logoUrl: string;
  hideSteps: boolean;
  hideTitle: boolean;
  showLogo: boolean;

  editable = true;
  paymentRequired: boolean | undefined = true;
  step1: FormGroup;
  step2: FormGroup;

  @ViewChild('top', { static: false })
  top: ElementRef;

  constructor(
    public context: ContextService,
    private cookie: CookieService,
    private dialog: MatDialog,
    private builder: FormBuilder,
    private register: Register,
    private org: AppStoreFacade,
    private language: LanguageService,
    private route: ActivatedRoute,
    private store: CCRFacade
  ) {
    this.org.pref$.subscribe(pref => {
      this.logoUrl = pref.assets && pref.assets.logoUrl ? pref.assets.logoUrl : '/assets/logo.png';
      this.orgName = { displayName: pref.displayName || 'CoachCare' };
    });
  }

  ngOnDestroy() {}

  ngOnInit() {
    const newsletter = !!resolveConfig(
      'REGISTER.NEWSLETTER_CHECKBOX',
      this.context.organizationId,
      true
    );

    const openAssociationAddClient = !!resolveConfig(
      'REGISTER.OPEN_ASSOC_ADD_CLIENT',
      this.context.organizationId,
      true
    );

    const timezone = moment.tz.guess();
    // default to 'en' if the cookie does not have any language set
    const lang = [this.language.get() ? this.language.get() : 'en'];

    this.step1 = this.builder.group(
      {
        organization: this.builder.group({
          openAssociationAddClient: [openAssociationAddClient],
          parentOrganizationId: this.context.organizationId,
          name: ['', Validators.required],
          newsletter: [newsletter],
          address: this.builder.group({
            street: ['', Validators.required],
            city: ['', Validators.required],
            state: [null, Validators.required],
            postalCode: ['', Validators.required],
            country: ['US', Validators.required]
          }),
          isActive: true
        }),
        account: this.builder.group({
          firstName: ['', Validators.required],
          lastName: ['', Validators.required],
          email: ['', [Validators.required, Validators.email]],
          phone: ['', Validators.required],
          timezone: timezone !== '' ? timezone : 'America/New_York',
          preferredLocales: [lang],
          isActive: true
        })
      },
      {
        validator: this.validateStep1
      }
    );

    this.step2 = this.builder.group({
      token: ['']
    });

    this.route.queryParams.pipe(untilDestroyed(this)).subscribe(params => {
      const cookieLang = this.cookie.get(COOKIE_LANG);
      const queryLang =
        params.hasOwnProperty('selectedLanguage') && params.selectedLanguage !== undefined
          ? params.selectedLanguage
          : undefined;
      this.paymentRequired = params.hasOwnProperty('creditCard')
        ? params.creditCard === 'optional'
          ? false
          : params.creditCard === 'skip'
            ? undefined
            : true
        : true;
      this.step2.controls.token.setValidators(this.paymentRequired ? Validators.required : null);
      this.hideSteps =
        params.hasOwnProperty('hideSteps') && params.hideSteps === 'true' ? false : true;

      this.hideTitle =
        params.hasOwnProperty('hideTitle') && params.hideTitle === 'true' ? false : true;

      if (cookieLang) {
        this.store.changeLang(cookieLang);
      } else if (queryLang) {
        this.store.changeLang(queryLang);
      } else {
        setTimeout(() => {
          this.dialog.open(LanguagesDialog, {
            data: {
              title: _('GLOBAL.SELECT_LANGUAGE')
            },
            panelClass: 'ccr-lang-dialog'
          });
        });
      }
    });

    this.showLogo = resolveConfig('REGISTER.SHOW_REGISTER_ICON', this.context.organizationId);
  }

  validateStep1(step1: FormGroup) {
    const organization = step1.get('organization') as FormGroup;
    const address = step1.get('organization.address') as FormGroup;
    const account = step1.get('account') as FormGroup;
    const email = account.controls.email;

    const checker = (group: FormGroup) => {
      return (field: string) => {
        const control = group.get(field) as AbstractControl;
        if (control instanceof FormGroup) {
          return false;
        }
        return control.errors && control.errors.required;
      };
    };

    if (
      Object.keys(account.controls).some(checker(account)) ||
      Object.keys(address.controls).some(checker(address)) ||
      Object.keys(organization.controls).some(checker(organization))
    ) {
      return { message: _('NOTIFY.ERROR.FILL_THE_FORM') };
    }

    if (email.errors && email.errors.email) {
      return { message: _('NOTIFY.ERROR.INVALID_EMAIL') };
    } else if (!/\S+@\S+\.\S+/.test(email.value)) {
      return { message: _('NOTIFY.ERROR.INVALID_EMAIL') };
    }
    return null;
  }

  nextStep(stepper: MatStepper) {
    if (stepper.selectedIndex === 0 && stepper.selectedIndex < stepper._steps.length - 2) {
      // organization and contact info completed
      this.changeStep(stepper, 1);
    } else if (stepper.selectedIndex === stepper._steps.length - 2) {
      this.isLoading = true;
      // submit the form data to the API
      const data: ClinicRegisterRequest = { ...this.step1.value };

      data.organization.contact = {
        firstName: data.account.firstName,
        lastName: data.account.lastName,
        email: data.account.email,
        phone: data.account.phone
      };
      if (this.step2.value.token) {
        data.paymentData = {
          email: data.account.email,
          token: this.step2.value.token
        };
      }

      this.register
        .clinic(data)
        .then(() => {
          this.isLoading = false;
          this.editable = false;
          this.changeStep(stepper, stepper._steps.length - 1);
        })
        .catch((err: string) => {
          this.isLoading = false;
          this.dialog.open(ConfirmDialog, {
            data: {
              title: _('GLOBAL.ERROR'),
              content: err
            }
          });
        });
    }
  }

  changeStep(stepper: MatStepper, step: number) {
    stepper.selectedIndex = step;

    setTimeout(() => {
      if (this.top) {
        this.top.nativeElement.scrollIntoView({
          behavior: 'smooth',
          block: 'start'
        });
      }
    }, 25);
  }
}
