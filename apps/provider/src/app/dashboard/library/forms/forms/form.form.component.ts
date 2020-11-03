import { Component, forwardRef, Input } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Form } from '@app/dashboard/library/forms/models';
import { BINDFORM_TOKEN } from '@app/shared';

@Component({
  selector: 'app-library-form-form',
  templateUrl: './form.form.component.html',
  providers: [
    {
      provide: BINDFORM_TOKEN,
      useExisting: forwardRef(() => FormFormComponent)
    }
  ]
})
export class FormFormComponent {
  public readonly = false;

  @Input()
  edit: boolean;

  @Input()
  set content(f: Form) {
    if (f) {
      this.form.patchValue({
        name: f.name,
        allowAddendum: f.allowAddendum,
        maximumSubmissions: f.maximumSubmissions === 1 ? true : false,
        removableSubmissions: f.removableSubmissions || false
      });

      if (this.edit) {
        const controls = this.form.controls;
        controls.maximumSubmissions.disable();
        controls.allowAddendum.disable();
        controls.removableSubmissions.disable();
      }

      this._form = f;
    } else {
      this.form.reset();
    }
  }

  get content(): Form {
    return this._form;
  }

  public form: FormGroup;

  private _form: Form;

  constructor(private formBuilder: FormBuilder, private route: ActivatedRoute) {
    this.createForm();
  }

  ngOnInit() {
    this.route.data.subscribe((data: any) => {
      this.readonly = data.readonly;
    });
  }

  private createForm(): void {
    this.form = this.formBuilder.group({
      name: ['', Validators.required],
      allowAddendum: [{ value: undefined, disabled: this.edit }, Validators.required],
      maximumSubmissions: [
        { value: undefined, disabled: this.edit },
        Validators.required
      ],
      removableSubmissions: [
        { value: undefined, disabled: this.edit },
        Validators.required
      ]
    });
  }
}
