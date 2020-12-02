import {
  ChangeDetectorRef,
  Component,
  EventEmitter,
  OnDestroy,
  OnInit,
  ViewChild
} from '@angular/core'
import { FormBuilder, FormGroup, Validators } from '@angular/forms'
import { ActivatedRoute, ParamMap, Router } from '@angular/router'
import { ClosePanel, OpenPanel, UILayoutState } from '@app/layout/store'
import { ContextService, NotifierService } from '@app/service'
import { _ } from '@app/shared'
import { Store } from '@ngrx/store'
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy'
import { Subject, Subscription } from 'rxjs'
import { debounceTime } from 'rxjs/operators'
import { Sequence as SelveraSequenceService } from '@coachcare/npm-api'
import { SequencingFormComponent } from '../form'
import { Sequence } from '../models'
import { SequenceSyncer } from '../utils'

type SequenceComponentSection = 'edit' | 'enrollees' | 'refreshing'

@UntilDestroy()
@Component({
  selector: 'sequencing-sequence',
  templateUrl: './sequence.component.html',
  styleUrls: ['./sequence.component.scss']
})
export class SequenceComponent implements OnDestroy, OnInit {
  @ViewChild(SequencingFormComponent, { static: false })
  sequencingForm: SequencingFormComponent

  form: FormGroup
  hardBlocked = false
  hasEnrollees: boolean
  hasSteps: boolean
  isAdmin: boolean
  isLoading: boolean
  section: SequenceComponentSection = 'edit'
  sequence: Sequence

  markAsTouched$: Subject<void> = new Subject<void>()

  private formSubscription: Subscription
  private onFormLoadFinish$: EventEmitter<void> = new EventEmitter<void>()

  constructor(
    private cdr: ChangeDetectorRef,
    private context: ContextService,
    private fb: FormBuilder,
    private notify: NotifierService,
    private route: ActivatedRoute,
    private router: Router,
    private seq: SelveraSequenceService,
    private store: Store<UILayoutState>,
    private syncer: SequenceSyncer
  ) {}

  ngOnDestroy(): void {
    this.store.dispatch(new OpenPanel())
  }

  ngOnInit(): void {
    this.store.dispatch(new ClosePanel())
    this.route.paramMap
      .pipe(untilDestroyed(this))
      .subscribe((params: ParamMap) => {
        const s = params.get('s') || 'edit'
        this.section = s as SequenceComponentSection
      })

    this.onFormLoadFinish$
      .pipe(debounceTime(500), untilDestroyed(this))
      .subscribe(() => this.onFormLoadFinish())

    this.form = this.fb.group({ sequence: [null, Validators.required] })
    this.subscribeToForm()
    this.fetchResolvedData()
    this.fetchAdminPermissions()
  }

  public deleteSequence(): void {
    // for now, this method does nothing
  }

  public onFormLoadFinish(): void {
    if (this.sequencingForm && this.syncer.selectedStepCache !== undefined) {
      this.sequencingForm.onSetActiveStep(this.syncer.selectedStepCache)
      delete this.syncer.selectedStepCache
    }
  }

  public async saveSequence() {
    try {
      if (this.form.invalid) {
        this.form.markAsTouched()
        this.markAsTouched$.next()
        this.notify.error(_('NOTIFY.ERROR.INVALID_SEQUENCE_FIELDS'))
        return
      }

      this.isLoading = true
      const formValue = this.form.value
      this.syncer.selectedStepCache = this.sequencingForm
        ? this.sequencingForm.getActiveStep()
        : undefined
      this.hardBlocked = true
      this.cdr.detectChanges()
      const syncerResponse = await this.syncer.sync(formValue)
      this.notify.success(_('NOTIFY.SUCCESS.SEQUENCE_SAVED'))
      const sequence = new Sequence(
        await this.seq.getSequence({
          id:
            this.sequence && this.sequence.id
              ? this.sequence.id
              : syncerResponse.response.sequence.id,
          organization: this.context.organizationId,
          status: 'active',
          full: true
        }),
        { inServer: true }
      )
      this.section = 'refreshing'
      this.sequence = undefined
      this.cdr.detectChanges()
      this.sequence = sequence
      this.router.navigate(['/sequences/sequence', sequence.id, { s: 'edit' }])
      this.form = this.fb.group({ sequence: [null, Validators.required] })
      this.subscribeToForm()
      this.form.controls.sequence.setValue(sequence)
      this.section = 'edit'
    } catch (error) {
      this.notify.error(error)
    } finally {
      this.hardBlocked = false
      this.isLoading = false
    }
  }

  private async fetchAdminPermissions() {
    try {
      const isAdmin = await this.context.orgHasPerm(
        this.context.organizationId,
        'admin',
        false
      )
      this.isAdmin = isAdmin || false
    } catch (error) {
      this.notify.error(error)
    }
  }

  private fetchResolvedData(): void {
    this.route.data.pipe(untilDestroyed(this)).subscribe(async (data) => {
      if (this.sequence) {
        this.form.controls.sequence.setValue(this.sequence)
        return
      }

      this.sequence = data.sequence
      this.form.controls.sequence.setValue(this.sequence)
      if (this.sequence) {
        const response = await this.seq.getTimeframedSeqEnrollment({
          organization: this.context.organizationId,
          sequence: this.sequence.id,
          limit: 1,
          offset: 0,
          status: 'all'
        })

        this.hasEnrollees = response.data.length > 0
      }
    })
  }

  private subscribeToForm(): void {
    if (this.formSubscription) {
      this.formSubscription.unsubscribe()
    }

    this.formSubscription = this.form.valueChanges
      .pipe(untilDestroyed(this))
      .subscribe((controls) => {
        this.hasSteps =
          controls.sequence &&
          controls.sequence.steps &&
          controls.sequence.steps.length
      })
  }
}
