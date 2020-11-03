import { Component, DoCheck, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ContextService, SelectedOrganization } from '@app/service';
import { BindForm, BindFormDirective } from '@app/shared/directives/bind-form.directive';
import { untilDestroyed } from 'ngx-take-until-destroy';
import { AccountIdentifier, AccountIdentifiersProps } from './models';
import { AccountIdentifierSyncer } from './utils';

interface GroupedIdentifiers {
  organization: SelectedOrganization;
  identifiers: AccountIdentifier[];
}

@Component({
  selector: 'app-account-identifiers',
  templateUrl: './account-identifiers.component.html',
  styleUrls: ['./account-identifiers.component.scss']
})
export class AccountIdentifiersComponent implements BindForm, DoCheck, OnDestroy, OnInit {
  set identifiers(identifiers: AccountIdentifier[]) {
    const groupedIdentifiers: GroupedIdentifiers[] = [];
    this._identifiers = identifiers;
    identifiers.forEach((ident) => {
      const matchingGroup = groupedIdentifiers.find(
        (group) => group.organization.id === ident.organization.id
      );
      if (matchingGroup) {
        matchingGroup.identifiers.push(ident);
      } else {
        groupedIdentifiers.push({
          organization: ident.organization,
          identifiers: [ident]
        });
      }
    });
    this.groupedIdentifiers = groupedIdentifiers.filter(
      (groupedIdentifier) => groupedIdentifier.identifiers.length
    );
  }
  get identifiers(): AccountIdentifier[] {
    return this._identifiers;
  }
  focusedIdentifier: AccountIdentifier;
  form: FormGroup;
  groupedFocusedIdentifiers: AccountIdentifier[] = [];
  groupedForms: FormGroup[] = [];
  groupedIdentifiers: GroupedIdentifiers[] = [];

  private _identifiers: AccountIdentifier[] = [];

  constructor(
    private accIdentifierSyncer: AccountIdentifierSyncer,
    private bindForm: BindFormDirective,
    private context: ContextService,
    private fb: FormBuilder,
    private props: AccountIdentifiersProps
  ) {}

  ngDoCheck(): void {
    if (this.form.controls.identifiers.touched) {
      const missingRequired = this.identifiers.find(
        (identifier: AccountIdentifier) => identifier.required && !identifier.value
      );

      if (missingRequired) {
        const groupIndex = this.groupedIdentifiers.findIndex(
          (group) =>
            !!group.identifiers.find(
              (identifier) => identifier.name === missingRequired.name
            )
        );
        if (groupIndex > -1) {
          const form = this.groupedForms[groupIndex];
          form.controls.value.markAsTouched();
          form.controls.name.patchValue(missingRequired.name);
          form.controls.value.markAsTouched();
        }
      }
    }
  }

  ngOnDestroy(): void {}

  async ngOnInit() {
    this.form = this.fb.group({
      name: [],
      value: [],
      identifiers: [
        [],
        (control) => {
          return control.value.find(
            (identifier: AccountIdentifier) => identifier.required && !identifier.value
          )
            ? { validIdentifiers: false }
            : null;
        }
      ]
    });
    this.bindForm.setControl(this.form.controls.identifiers);

    this.form.valueChanges.pipe(untilDestroyed(this)).subscribe((controls) => {
      if (!this.focusedIdentifier || controls.name !== this.focusedIdentifier.name) {
        this.focusedIdentifier = this.identifiers.find(
          (idn) => idn.name === controls.name
        );
        this.form.controls.identifiers.markAsUntouched();
        this.form.controls.value.markAsUntouched();
        this.form.controls.value.setValidators(
          this.focusedIdentifier.required ? [Validators.required] : []
        );
        this.form.patchValue({ value: this.focusedIdentifier.value });
      } else {
        this.focusedIdentifier.dirty = controls.value !== this.focusedIdentifier.value;
        this.focusedIdentifier.value = controls.value
          ? controls.value.trim()
          : controls.value;
        this.form.controls.identifiers.patchValue(this.identifiers);
      }
    });

    this.accIdentifierSyncer.identifiers = this.props.identifiers.map(
      (identifier) =>
        new AccountIdentifier(identifier, { organization: this.context.organization })
    );
    this.identifiers = await this.accIdentifierSyncer.getUserIdentifiers(
      this.props.account
    );
    this.generateGroupedForms();
  }

  private generateGroupedForms() {
    this.groupedForms = [];
    this.groupedIdentifiers.forEach((group: GroupedIdentifiers, index: number) => {
      const groupedForm = this.fb.group({
        name: [],
        value: [],
        identifiers: [
          [],
          (control) => {
            return control.value.find(
              (identifier: AccountIdentifier) => identifier.required && !identifier.value
            )
              ? { validIdentifiers: false }
              : null;
          }
        ],
        index: [index]
      });
      this.groupedForms.push(groupedForm);
      groupedForm.valueChanges.pipe(untilDestroyed(this)).subscribe((controls) => {
        const form = this.groupedForms[controls.index];
        let focusedIdentifier = this.groupedFocusedIdentifiers[controls.index];
        if (!focusedIdentifier || controls.name !== focusedIdentifier.name) {
          this.groupedFocusedIdentifiers[controls.index] = this.identifiers.find(
            (idn) => idn.name === controls.name
          );
          focusedIdentifier = this.groupedFocusedIdentifiers[controls.index];
          form.controls.identifiers.markAsUntouched();
          form.controls.value.markAsUntouched();
          form.controls.value.setValidators(
            focusedIdentifier.required ? [Validators.required] : []
          );
          form.patchValue({
            value: focusedIdentifier.value
          });
        } else {
          focusedIdentifier.dirty = controls.value !== focusedIdentifier.value;
          focusedIdentifier.value = controls.value
            ? controls.value.trim()
            : controls.value;
          this.form.controls.identifiers.patchValue(this.identifiers);
        }
      });
      groupedForm.patchValue({ name: group.identifiers[0].name });
    });
  }
}
