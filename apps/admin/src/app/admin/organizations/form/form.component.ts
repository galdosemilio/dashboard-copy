import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { OrganizationsDatabase } from '@coachcare/backend/data';
import { OrganizationSingle } from '@coachcare/backend/services';
import { FormUtils } from '@coachcare/backend/shared';
import { _ } from '@coachcare/backend/shared';
import { NotifierService } from '@coachcare/common/services';

import { OrganizationDialogs, OrganizationParams, OrganizationRoutes } from '@board/services';

@Component({
  selector: 'ccr-organizations-form',
  templateUrl: './form.component.html',
  styleUrls: ['./form.component.scss']
})
export class OrganizationsFormComponent implements OnInit {
  form: FormGroup;
  id: string | undefined;
  item: OrganizationSingle;
  readonly = true;
  colSpan = 2;

  constructor(
    private builder: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private database: OrganizationsDatabase,
    private notifier: NotifierService,
    private dialogs: OrganizationDialogs,
    public routes: OrganizationRoutes
  ) {}

  ngOnInit() {
    // route parameters
    this.route.data.subscribe((data: OrganizationParams) => {
      this.id = data.org ? data.org.id : undefined;
      if (data.org) {
        this.item = data.org;
      }

      // setup the FormGroup
      this.createForm();
      if (this.item) {
        // fill the form
        this.form.patchValue(this.item);
      }

      this.readonly = data.editable ? false : true;
    });
  }

  createForm() {
    // TODO type the object
    this.form = this.builder.group({
      id: this.id,
      name: [null, Validators.required],
      shortcode: null,
      contact: this.builder.group({
        firstName: [null, Validators.required],
        lastName: [null, Validators.required],
        email: [null, Validators.required],
        phone: null
      }),
      address: this.builder.group({
        street: null,
        city: null,
        state: null,
        postalCode: null,
        country: null
      }),
      welcomeEmailAddress: 'no_reply@coachcare.com',
      passwordResetEmailAddress: 'no_reply@coachcare.com',
      openAssociationAddProvider: false,
      openAssociationAddClient: false,
      parentOrganizationId: null,
      isActive: true
    });
  }

  onSubmit() {
    if (this.form.valid) {
      this.database
        .create(this.form.value)
        .then(res => {
          this.notifier.success(_('NOTIFY.SUCCESS.ORG_CREATED'));
          this.router.navigate([this.routes.single(res.id)]);
        })
        .catch(err => this.notifier.error(err));
    } else {
      FormUtils.markAsTouched(this.form);
    }
  }

  onUpdate() {
    if (this.form.valid) {
      const formValue = this.form.value;
      formValue.id = this.id;
      this.database
        .update(FormUtils.pruneEmpty(formValue))
        .then(() => {
          this.notifier.success(_('NOTIFY.SUCCESS.ORG_UPDATED'));
          this.router.navigate([this.routes.single(this.id as string)], {
            queryParams: { updated: new Date().getTime() }
          });
        })
        .catch(err => this.notifier.error(err));
    } else {
      FormUtils.markAsTouched(this.form);
    }
  }

  onCancel() {
    if (!this.id) {
      // create
      this.router.navigate([this.routes.list()]);
    } else {
      // update
      this.router.navigate([this.routes.single(this.id as string)]);
    }
  }

  onActivate() {
    this.dialogs
      .activatePrompt(this.item)
      .then(() => {
        this.item.isActive = true;
        this.form.patchValue({ isActive: true });
        this.notifier.success(_('NOTIFY.SUCCESS.ORG_ACTIVATED'));
      })
      .catch(err => {
        if (err) {
          // non-discarded prompt
          this.notifier.error(err);
        }
      });
  }

  onDeactivate() {
    this.dialogs
      .deactivatePrompt(this.item)
      .then(() => {
        this.item.isActive = false;
        this.form.patchValue({ isActive: false });
        this.notifier.success(_('NOTIFY.SUCCESS.ORG_DEACTIVATED'));
      })
      .catch(err => {
        if (err) {
          // non-discarded prompt
          this.notifier.error(err);
        }
      });
  }
}
