import { Component, forwardRef, Input } from '@angular/core'
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms'
import { FileExplorerContent } from '@app/dashboard/content/models'
import { BindForm, BINDFORM_TOKEN } from '@app/shared'

@Component({
  selector: 'app-content-hyperlink-form',
  templateUrl: './hyperlink.form.component.html',
  providers: [
    {
      provide: BINDFORM_TOKEN,
      useExisting: forwardRef(() => HyperlinkFormComponent)
    }
  ]
})
export class HyperlinkFormComponent implements BindForm {
  @Input()
  set details(d: FileExplorerContent) {
    if (d) {
      this._details = d
      this.form.patchValue({ url: d.metadata.url })
    }
  }

  get details(): FileExplorerContent {
    return this._details
  }

  @Input() mode: 'digital-library' | 'vault' = 'digital-library'

  @Input()
  readonly: boolean

  public form: FormGroup

  private _details: FileExplorerContent
  private currentURL: string
  private urlPattern = /^(?:http(?:s)?):\/\/[^\.]+\..+$/

  constructor(private formBuilder: FormBuilder) {
    this.createForm()
  }

  private createForm(): void {
    this.form = this.formBuilder.group({
      url: [
        '',
        [
          Validators.required,
          (c: FormControl) =>
            c.value
              ? this.urlPattern.test(c.value)
                ? null
                : { invalidUrl: true }
              : null
        ]
      ],
      metadata: [{}, []]
    })

    this.form.valueChanges.subscribe((controls) => {
      if (this.currentURL !== controls.url) {
        this.currentURL = controls.url
        this.form.patchValue({ metadata: { url: controls.url } })
      }
    })
  }
}
