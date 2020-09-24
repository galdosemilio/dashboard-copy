import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { OrganizationPreference } from '@coachcare/backend/services';
import { _ } from '@coachcare/backend/shared';
import { NotifierService } from '@coachcare/common/services';
import { untilDestroyed } from 'ngx-take-until-destroy';

@Component({
  selector: 'ccr-organizations-colors',
  templateUrl: './colors.component.html'
})
export class ColorsComponent implements OnDestroy, OnInit {
  @Input() colSpan: number;
  @Input() orgId: string;
  @Input() prefs: any;

  public form: FormGroup;
  public toolbarColors = [
    { value: 'primary', viewValue: _('ADMIN.ORGS.SETTINGS.COLOR_PRIMARY') },
    // { value: 'secondary', viewValue: _('ADMIN.ORGS.SETTINGS.COLOR_SECONDARY') },
    { value: 'accent', viewValue: _('ADMIN.ORGS.SETTINGS.COLOR_ACCENT') }
  ];

  constructor(
    private fb: FormBuilder,
    private notifier: NotifierService,
    private organizationPreference: OrganizationPreference
  ) {}

  public ngOnDestroy(): void {}

  public ngOnInit(): void {
    this.createForm();
  }

  private createForm(): void {
    this.form = this.fb.group({
      accent: [''],
      primary: ['', Validators.required],
      secondary: ['', Validators.required],
      toolbar: ['primary', Validators.required]
    });

    this.form.patchValue(this.prefs && this.prefs.color ? this.prefs.color : {});

    this.form.valueChanges.pipe(untilDestroyed(this)).subscribe(() => this.onSubmit());
  }

  private async onSubmit(): Promise<void> {
    try {
      if (this.form.invalid) {
        return;
      }

      const formValue = this.form.value;

      await this.organizationPreference.update({ id: this.orgId, color: formValue });
      this.notifier.success(_('NOTIFY.SUCCESS.SETTINGS_UPDATED'));
    } catch (error) {
      this.notifier.error(error);
    }
  }
}
