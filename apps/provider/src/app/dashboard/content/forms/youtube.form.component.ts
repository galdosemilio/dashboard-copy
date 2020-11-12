import { Component, forwardRef, Input } from '@angular/core'
import { FormBuilder, FormGroup, Validators } from '@angular/forms'
import { DomSanitizer } from '@angular/platform-browser'
import { FileExplorerContent } from '@app/dashboard/content/models'
import { BindForm, BINDFORM_TOKEN } from '@app/shared'
import { debounceTime } from 'rxjs/operators'

@Component({
  selector: 'app-content-youtube-form',
  templateUrl: './youtube.form.component.html',
  providers: [
    {
      provide: BINDFORM_TOKEN,
      useExisting: forwardRef(() => YoutubeFormComponent)
    }
  ]
})
export class YoutubeFormComponent implements BindForm {
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
  private patterns: any = {
    full: /^(https?\:\/\/)?(www\.)?youtube.com\/watch\?v=[a-zA-Z0-9\_\-]*(\&t\=\d+s)?$/,
    condensed: /^(https?\:\/\/)?youtu.be\/[a-zA-Z0-9\_\-]*(\?t=\d+)?$/
  }

  constructor(
    private domSanitizer: DomSanitizer,
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
      .subscribe((controls: any) => {
        this.calculateEmbeddedUrl(controls)
      })
  }

  private calculateEmbeddedUrl(controls: any): void {
    try {
      if (!controls.embedUrl || controls.embedUrl === this.embedUrl) {
        return
      }

      this.embedUrl = controls.embedUrl

      let params

      if (this.patterns.full.test(controls.embedUrl)) {
        params = this.processAsDefault(controls.embedUrl)
      } else if (this.patterns.condensed.test(controls.embedUrl)) {
        params = this.processAsCondensed(controls.embedUrl)
      } else {
        throw new Error('Invalid link')
      }

      this.url = this.domSanitizer.bypassSecurityTrustResourceUrl(
        `https://www.youtube.com/embed/${params.id}${
          params.startTime ? '?start=' + params.startTime : ''
        }`
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

  private processAsCondensed(url: string): { id: string; startTime?: number } {
    return {
      id: url.substring(
        url.lastIndexOf('/') + 1,
        url.indexOf('?') > -1 ? url.indexOf('?') : url.length
      ),
      startTime:
        url.indexOf('?') > -1
          ? Number(url.substring(url.indexOf('?'), url.length).split('=')[1])
          : undefined
    }
  }

  private processAsDefault(url: string): { id: string; startTime?: number } {
    const rawParams = url.split('?')[1]
    const params = rawParams.split('&')
    return {
      id: params[0].split('=')[1],
      startTime:
        url.indexOf('&') > -1
          ? Number(params[1].split('=')[1].split('s')[0])
          : undefined
    }
  }
}
