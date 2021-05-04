import {
  Component,
  forwardRef,
  Inject,
  OnDestroy,
  OnInit,
  ViewChild,
  ViewEncapsulation
} from '@angular/core'
import { FormBuilder, FormGroup, Validators } from '@angular/forms'
import { MAT_DIALOG_DATA, MatDialogRef, MatStepper } from '@coachcare/material'
import { ContextService, NotifierService } from '@app/service'
import { BINDFORM_TOKEN, bufferedRequests } from '@app/shared'
import { _ } from '@app/shared/utils'
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy'
import { FileExplorerRoute } from '../../file-explorer-table'
import { FileExplorerContent, FileExplorerEvents } from '../../models'
import { FileExplorerDatabase, FileExplorerDatasource } from '../../services'
import { OrganizationPermission, OrganizationWithAddress } from '@coachcare/sdk'

interface ContentBatchCopyDialogProps {
  datasource: any
  initialRoutes?: FileExplorerRoute[]
  organization: any
  selectedContents?: FileExplorerContent[]
}

@UntilDestroy()
@Component({
  selector: 'app-content-copy-dialog',
  templateUrl: './content-batch-copy.dialog.html',
  styleUrls: ['./content-batch-copy.dialog.scss'],
  host: { class: 'ccr-dialog' },
  encapsulation: ViewEncapsulation.None,
  providers: [
    {
      provide: BINDFORM_TOKEN,
      useExisting: forwardRef(() => ContentBatchCopyDialog)
    }
  ]
})
export class ContentBatchCopyDialog implements OnDestroy, OnInit {
  @ViewChild('stepper', { static: true }) stepper: MatStepper

  public set checkedContents(contents: FileExplorerContent[]) {
    this._checkedContents = contents
    this.form.patchValue({ selectedContents: this._checkedContents })
  }

  public get checkedContents(): FileExplorerContent[] {
    return this._checkedContents
  }

  public datasource: FileExplorerDatasource
  public events: FileExplorerEvents
  public form: FormGroup
  public hiddenColumns: string[] = [
    'index',
    'actions',
    'availability',
    'createdAt',
    'description'
  ]
  public hiddenFormFields: string[] = ['name', 'description']
  public initialRoutes: FileExplorerRoute[] = []
  public organization: any
  public targetOrganizationPerms: Partial<OrganizationPermission> = {
    admin: true
  }
  public selectedContent: FileExplorerContent
  public selectorOpts: any = {
    disableForeignContent: true,
    shouldShowRootFolderButton: true
  }
  public status: 'ready' | 'processing' = 'ready'

  private _checkedContents: FileExplorerContent[] = []

  constructor(
    private context: ContextService,
    @Inject(MAT_DIALOG_DATA) private data: ContentBatchCopyDialogProps,
    private database: FileExplorerDatabase,
    private dialogRef: MatDialogRef<ContentBatchCopyDialog>,
    private fb: FormBuilder,
    private notifier: NotifierService
  ) {
    this.createForm()
  }

  public ngOnDestroy(): void {}

  public ngOnInit(): void {
    this.organization = this.data.organization
    this.initialRoutes = this.data.initialRoutes || []

    this.events = new FileExplorerEvents()
    this.datasource = new FileExplorerDatasource(
      this.context,
      this.notifier,
      this.database
    )

    this.datasource.addDefault(this.data.datasource.criteria)

    this.subscribeToEvents()

    if (this.data.selectedContents && this.data.selectedContents.length) {
      this.data.selectedContents.forEach((content) => {
        this.events.contentChecked.emit(content)
      })
    }
  }

  public closeDialog(): void {
    this.dialogRef.close()
  }

  public goToNextStep(): void {
    this.stepper.next()
  }

  public isOnLastStep(): boolean {
    return this.stepper && this.stepper.steps
      ? this.stepper.selectedIndex >= this.stepper.steps.length - 1
      : false
  }

  public nextButtonIsDisabled(): boolean {
    return (
      this.form.controls.targetFolder.invalid ||
      this.form.controls.selectedContents.invalid ||
      (this.stepper.selectedIndex === 2 &&
        this.form.controls.overrideDetails.invalid)
    )
  }

  public onSelectedContent(content: FileExplorerContent): void {
    if (!content) {
      return
    }
    this.selectedContent = content
    this.form.patchValue({ targetFolder: content.id })
  }

  public async onSubmit(): Promise<void> {
    try {
      if (this.form.invalid) {
        return
      }

      this.status = 'processing'

      const formValue = this.form.value

      const promises = this.checkedContents.map((content) =>
        this.datasource.copyContent({
          to: formValue.targetFolder,
          content: content,
          overrideDetails: formValue.overrideDetails,
          organizationId: formValue.targetOrganization
        })
      )

      await bufferedRequests(promises)

      this.notifier.success(_('NOTIFY.SUCCESS.CONTENT_CLONED'))

      this.dialogRef.close(true)
    } catch (error) {
      this.notifier.error(error)
    } finally {
      this.status = 'ready'
    }
  }

  public selectOrganization(organization: OrganizationWithAddress): void {
    console.log({ organization })
    if (!organization || !organization.id) {
      return
    }
    this.form.controls.targetOrganization.patchValue(organization.id)
  }

  private createForm(): void {
    this.form = this.fb.group({
      selectedContents: ['', Validators.required],
      targetFolder: [''],
      overrideDetails: ['', Validators.required],
      targetOrganization: ['', Validators.required]
    })
  }

  private subscribeToEvents(): void {
    this.events.contentChecked
      .pipe(untilDestroyed(this))
      .subscribe(
        (content) => (this.checkedContents = [...this.checkedContents, content])
      )

    this.events.contentUnchecked
      .pipe(untilDestroyed(this))
      .subscribe(
        (content) =>
          (this.checkedContents = this.checkedContents.filter(
            (con) => con.id !== content.id
          ))
      )
  }
}
