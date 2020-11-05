import {
  Component,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output
} from '@angular/core'
import { FormArray, FormBuilder, FormControl, FormGroup } from '@angular/forms'
import { NotifierService } from '@app/service'
import { OrganizationEntity } from '@coachcare/npm-api'
import { untilDestroyed } from 'ngx-take-until-destroy'
import { debounceTime } from 'rxjs/operators'
import { Organization } from '@coachcare/npm-api'

@Component({
  selector: 'ccr-child-clinic-picker',
  templateUrl: './child-clinic-picker.component.html',
  styleUrls: ['./child-clinic-picker.component.scss']
})
export class CcrChildClinicPickerComponent implements OnDestroy, OnInit {
  @Input() set organization(org: string) {
    this._organizaton = org

    if (this._organizaton) {
      this.fetchChildOrgs()
    } else {
      this.childOrgs = []
    }
  }

  get organization(): string {
    return this._organizaton
  }

  @Output() select: EventEmitter<OrganizationEntity[]> = new EventEmitter<
    OrganizationEntity[]
  >()

  public childOrgs: OrganizationEntity[] = []
  public form: FormGroup

  private _organizaton: string

  constructor(
    private fb: FormBuilder,
    private notifier: NotifierService,
    private organizationService: Organization
  ) {}

  public ngOnDestroy(): void {}

  public ngOnInit(): void {
    this.createForm()
  }

  private createForm(): void {
    this.form = this.fb.group({
      checkboxArray: this.fb.array([])
    })

    this.form.controls.checkboxArray.valueChanges
      .pipe(debounceTime(100), untilDestroyed(this))
      .subscribe(() => this.emitSelected())
  }

  private emitSelected(): void {
    const selectedClinics = []
    const checkboxArray = this.form.value.checkboxArray

    this.childOrgs.forEach((childOrg, index) => {
      if (checkboxArray[index]) {
        selectedClinics.push(childOrg)
      }
    })

    this.select.emit(selectedClinics)
  }

  private async fetchChildOrgs(): Promise<void> {
    try {
      const response = await this.organizationService.getDescendants({
        organization: this.organization,
        limit: 'all',
        offset: 0
      })
      this.childOrgs = response.data
      this.form.controls.checkboxArray.reset()
      this.childOrgs.forEach(() =>
        (this.form.controls.checkboxArray as FormArray).push(new FormControl())
      )
    } catch (error) {
      this.notifier.error(error)
    }
  }
}
