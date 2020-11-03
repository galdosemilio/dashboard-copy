import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@coachcare/common/material';
import { ContextService, NotifierService } from '@app/service';
import {
  OrganizationEntity,
  OrganizationPermission,
} from '@app/shared/selvera-api';
import { _ } from '@app/shared/utils';
import { OrganizationAssociation } from 'selvera-api';

@Component({
  selector: 'app-add-association-dialog',
  templateUrl: './add-association.dialog.html',
  host: { class: 'ccr-dialog' },
})
export class AddAssociationDialog implements OnInit {
  form: FormGroup;
  permissions: Partial<OrganizationPermission> = {
    admin: true,
  };

  constructor(
    private context: ContextService,
    private dialog: MatDialogRef<AddAssociationDialog>,
    private fb: FormBuilder,
    private notify: NotifierService,
    private orgAssociation: OrganizationAssociation
  ) {}

  ngOnInit(): void {
    this.form = this.fb.group({
      organization: [null, Validators.required],
    });
  }

  onSelectOrg(organization: OrganizationEntity): void {
    this.form.patchValue({ organization: organization.id });
  }

  async onSubmit() {
    try {
      await this.orgAssociation.create({
        account: this.context.accountId,
        organization: this.form.value.organization,
      });
      this.notify.success(_('NOTIFY.SUCCESS.ASSOCIATION_CREATED'));
      this.dialog.close(true);
    } catch (error) {
      this.notify.error(error);
    }
  }
}
