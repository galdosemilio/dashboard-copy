import { Component, forwardRef, Input } from '@angular/core'
import { FormBuilder, FormGroup, Validators } from '@angular/forms'
import { DomSanitizer } from '@angular/platform-browser'
import { FileExplorerContent } from '@app/dashboard/content/models'
import { BindForm, BINDFORM_TOKEN } from '@app/shared'
import { debounceTime } from 'rxjs/operators'
import { LoggingService } from '@app/service/logging.service'

interface FormEmbedControl {
  embedUrl?: string
}

@Component({
  selector: 'app-content-vimeo-form',
  templateUrl: './vimeo.form.component.html',
  providers: [
    {
      provide: BINDFORM_TOKEN,
      useExisting: forwardRef(() => VimeoFormComponent)
    }
  ]
})
export class VimeoFormComponent implements BindForm {
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

  public form: FormGroup
  public url: any

  private _details: FileExplorerContent
  private embedUrl: string
  private pattern: RegExp = /(?:vimeo)\.com.*(?:videos|video|channels|)\/([\d]+)/i

  constructor(
    private domSanitizer: DomSanitizer,
    private logging: LoggingService,
    private formBuilder: FormBuilder
  ) {
    this.createForm()
  }

  private createForm(): void {
    this.form = this.formBuilder.group({
      embedUrl: ['', Validators.required],
      url: [undefined, Validators.required]
    })

    this.form.valueChanges
      .pipe(debounceTime(700))
      .subscribe((controls: FormEmbedControl) => {
        this.calculateEmbeddedUrl(controls)
      })
  }

  private calculateEmbeddedUrl(controls: FormEmbedControl): void {
    try {
      if (!controls.embedUrl || controls.embedUrl === this.embedUrl) {
        return
      }

      this.embedUrl = controls.embedUrl

      let params
      if (this.pattern.test(controls.embedUrl)) {
        params = this.processAsDefault(controls.embedUrl)
      } else {
        void this.logging.log({
          logLevel: 'warn',
          data: {
            type: 'digital-library-add-content',
            functionType: 'vimeo',
            message: 'Failed to calculate vimeo link from embed code',
            vimeoLink: controls.embedUrl
          }
        })

        throw new Error('Invalid link')
      }

      this.url = this.domSanitizer.bypassSecurityTrustResourceUrl(
        `https://player.vimeo.com/video/${params.id}`
      )
      this.form.patchValue({
        url: this.url.changingThisBreaksApplicationSecurity
      })
      this.form.controls.embedUrl.setErrors(null)
    } catch (error) {
      this.url = undefined
      this.form.controls.embedUrl.setErrors({ invalidLink: true })
    }
  }

  private processAsDefault(url: string): { id: string } {
    const parsed = url.match(this.pattern)
    return {
      id: parsed[1]
    }
  }
}
