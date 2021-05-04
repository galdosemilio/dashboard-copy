import {
  Component,
  EventEmitter,
  forwardRef,
  Input,
  OnInit,
  Output
} from '@angular/core'
import {
  ControlValueAccessor,
  FormControl,
  NG_VALUE_ACCESSOR
} from '@angular/forms'
import { ContextService, NotifierService } from '@app/service'
import {
  AssociationAccessLevel,
  CoachAssociationPermissionOptions,
  COACH_ASSOCIATION_ACCESS_LEVELS
} from '@app/shared/model'
import { Entity } from '@coachcare/sdk'
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy'

@UntilDestroy()
@Component({
  selector: 'ccr-access-level-selector',
  templateUrl: './access-level-selector.component.html',
  styleUrls: ['./access-level-selector.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => CcrAccessLevelSelectorComponent),
      multi: true
    }
  ]
})
export class CcrAccessLevelSelectorComponent
  implements ControlValueAccessor, OnInit {
  @Input() initialSelection?: CoachAssociationPermissionOptions
  @Input() organization?: Entity

  @Output()
  onSelect: EventEmitter<AssociationAccessLevel> = new EventEmitter<AssociationAccessLevel>()

  public control: FormControl
  public permissionLevels: AssociationAccessLevel[] = Object.values(
    COACH_ASSOCIATION_ACCESS_LEVELS
  )

  private propagateChange: (
    accessLevel: CoachAssociationPermissionOptions
  ) => void = () => {}

  constructor(
    private context: ContextService,
    private notifier: NotifierService
  ) {}

  public ngOnInit(): void {
    this.createForm()

    if (this.initialSelection) {
      this.control.setValue(this.initialSelection ?? 'limited-access')
    }

    if (!this.organization) {
      return
    }

    void this.filterAccessLevels()
  }

  public registerOnChange(fn): void {
    this.propagateChange = fn
  }

  public registerOnTouched(): void {}

  public setDisabledState?(isDisabled: boolean): void {
    if (isDisabled) {
      this.control.disable()
    } else {
      this.control.enable()
    }
  }

  public writeValue(selection: CoachAssociationPermissionOptions): void {
    if (this.control) {
      this.control.setValue(selection ?? 'limited-access')
    }
  }

  private createForm(): void {
    this.control = new FormControl('limited-access')

    this.control.valueChanges
      .pipe(untilDestroyed(this))
      .subscribe((accessLevel) => this.onAccessChange(accessLevel))
  }

  private async filterAccessLevels(): Promise<void> {
    try {
      const hasPhiPermissions = await this.context.orgHasPerm(
        this.organization.id,
        'allowClientPhi'
      )

      if (hasPhiPermissions) {
        return
      }

      this.permissionLevels = this.permissionLevels.filter(
        (permLevel) => !permLevel.perms.allowClientPhi
      )
    } catch (error) {
      this.notifier.error(error)
    }
  }

  private onAccessChange(
    accessLevelValue: CoachAssociationPermissionOptions
  ): void {
    const foundPermLevel = this.permissionLevels.find(
      (permLevel) => permLevel.value === accessLevelValue
    )

    this.onSelect.next(foundPermLevel ?? null)
    this.propagateChange(foundPermLevel?.value)
  }
}
