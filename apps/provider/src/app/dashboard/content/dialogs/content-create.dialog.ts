import {
  Component,
  forwardRef,
  Inject,
  OnDestroy,
  OnInit,
  ViewChild
} from '@angular/core'
import { FormBuilder, FormGroup, Validators } from '@angular/forms'
import {
  MAT_DIALOG_DATA,
  MAT_LABEL_GLOBAL_OPTIONS,
  MatDialogRef,
  MatStepper
} from '@coachcare/material'
import {
  CONTENT_TYPE_MAP,
  ContentTypeMapItem,
  FileExplorerContent,
  QueuedContent
} from '@app/dashboard/content/models'
import { BINDFORM_TOKEN } from '@app/shared'
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy'

@UntilDestroy()
@Component({
  selector: 'app-content-create-dialog',
  templateUrl: './content-create.dialog.html',
  styleUrls: ['./content-create.dialog.scss'],
  host: { class: 'ccr-dialog' },
  providers: [
    {
      provide: BINDFORM_TOKEN,
      useExisting: forwardRef(() => ContentCreateDialog)
    },
    { provide: MAT_LABEL_GLOBAL_OPTIONS, useValue: { float: 'always' } }
  ]
})
export class ContentCreateDialog implements OnInit, OnDestroy {
  @ViewChild('stepper', { static: true })
  stepper: MatStepper

  public contentTypes: ContentTypeMapItem[] = []
  public extension: string
  public form: FormGroup
  mode: 'digital-library' | 'vault' = 'digital-library'
  public queuedContents: QueuedContent[] = []
  public selectedDestination: Partial<FileExplorerContent>
  public selectorOpts: any = {
    shouldShowRootFolderButton: true
  }
  public showCloseConfirm: boolean
  public supportedContentTypes: string[] = [
    CONTENT_TYPE_MAP.file.code,
    CONTENT_TYPE_MAP.hyperlink.code,
    CONTENT_TYPE_MAP.youtube.code,
    CONTENT_TYPE_MAP.vimeo.code
  ]

  constructor(
    @Inject(MAT_DIALOG_DATA) private data: any,
    private dialogRef: MatDialogRef<ContentCreateDialog>,
    private formBuilder: FormBuilder
  ) {}

  ngOnInit(): void {
    this.mode = this.data.mode || this.mode
    this.selectedDestination = { id: this.data.parent }
    this.createForm()
    this.filterContentTypes()

    this.dialogRef
      .backdropClick()
      .pipe(untilDestroyed(this))
      .subscribe(() => (this.showCloseConfirm = true))
    this.dialogRef
      .keydownEvents()
      .pipe(untilDestroyed(this))
      .subscribe(($event: any) => {
        if ($event.key === 'Escape') {
          this.showCloseConfirm = true
        }
      })
  }

  ngOnDestroy(): void {}

  closeDialog(): void {
    this.dialogRef.close(this.queuedContents)
  }

  dismissDialog(): void {
    this.dialogRef.close()
  }

  getContentTypeName(code: string): string {
    return CONTENT_TYPE_MAP[code] ? CONTENT_TYPE_MAP[code].name : ''
  }

  nextStep(): void {
    this.stepper.next()
  }

  prevStep(): void {
    this.stepper.previous()
  }

  removeQueuedContent(index: number): void {
    this.queuedContents.splice(index, 1)
  }

  resetDialog(): void {
    this.form.reset()
    this.stepper.selectedIndex = 0
  }

  setContentType(code: string): void {
    this.form.controls.contentType.patchValue(code)
    this.nextStep()
  }

  shouldDisableNext(): boolean {
    switch (this.stepper.selectedIndex) {
      case 0:
        return this.form.controls.contentType
          ? this.form.controls.contentType.invalid
          : false
      case 1:
        return this.form.controls.content
          ? this.form.controls.content.invalid
          : false
      default:
        return false
    }
  }

  shouldShowNext(): boolean {
    return this.stepper._steps
      ? this.stepper.selectedIndex < this.stepper._steps.length - 1
      : true
  }

  shouldShowPrev(): boolean {
    return this.stepper._steps
      ? this.stepper.selectedIndex > 0 && this.stepper.selectedIndex < 2
      : false
  }

  stepperChange($event: any): void {
    // If the next page is the final page, the form's data gets queued
    if ($event.selectedIndex === this.stepper._steps.length - 1) {
      const formValue = this.form.value
      this.queuedContents.push(
        Object.assign(
          { ...formValue.content },
          {
            type: Object.assign(
              {},
              {
                ...(CONTENT_TYPE_MAP[formValue.contentType] ||
                  CONTENT_TYPE_MAP.default)
              }
            ),
            destination: this.selectedDestination
          }
        ) as QueuedContent
      )

      this.form.reset()
    }
  }

  private createForm(): void {
    this.form = this.formBuilder.group({
      contentType: ['', Validators.required]
    })
  }

  private filterContentTypes(): void {
    Object.keys(CONTENT_TYPE_MAP).forEach((key: string) => {
      if (
        CONTENT_TYPE_MAP[key].id &&
        this.supportedContentTypes.indexOf(CONTENT_TYPE_MAP[key].code) > -1
      ) {
        this.contentTypes.push(CONTENT_TYPE_MAP[key])
      }
    })
  }
}
