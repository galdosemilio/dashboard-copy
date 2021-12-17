import {
  ChangeDetectorRef,
  Component,
  OnDestroy,
  OnInit,
  ViewChild
} from '@angular/core'
import { FormBuilder, FormGroup } from '@angular/forms'
import {
  MatAutocompleteSelectedEvent,
  MatDialog,
  MatSelectChange
} from '@coachcare/material'
import { ActivatedRoute, Router } from '@angular/router'

import {
  LabelsOrganizationDatabase,
  LabelsOrganizationDataSource,
  PackageAssociationElement
} from '@coachcare/backend/data'
import { getterPaginator } from '@coachcare/backend/model'
import { Package, PackageOrganization, PackageSingle } from '@coachcare/sdk'
import { _ } from '@coachcare/backend/shared'
import { CcrPaginatorComponent } from '@coachcare/common/components'
import { PromptDialog, PromptDialogData } from '@coachcare/common/dialogs/core'
import {
  ContextService,
  NotifierService,
  OrganizationParams
} from '@coachcare/common/services'
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy'
import { debounceTime, filter } from 'rxjs/operators'
import { CreateLabelDialogComponent } from '../dialogs'

@UntilDestroy()
@Component({
  selector: 'ccr-organizations-labels-associations',
  templateUrl: './labels-associations.component.html',
  styleUrls: ['./labels-associations.component.scss']
})
export class LabelsAssociationsComponent implements OnDestroy, OnInit {
  @ViewChild(CcrPaginatorComponent, { static: true })
  paginator: CcrPaginatorComponent

  public columns: string[] = [
    'id',
    'title',
    'description',
    'organization',
    'status',
    'actions'
  ]
  public form: FormGroup
  public labels: PackageSingle[] = []
  public loadingLabels = false
  public selectedLabelId: string
  public shownLabels: PackageSingle[] = []
  public source: LabelsOrganizationDataSource

  private params: OrganizationParams

  constructor(
    private cdr: ChangeDetectorRef,
    private context: ContextService,
    private database: LabelsOrganizationDatabase,
    private dialog: MatDialog,
    private fb: FormBuilder,
    private notifier: NotifierService,
    private packageOrganization: PackageOrganization,
    private packageService: Package,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.autocompleteDisplayWith = this.autocompleteDisplayWith.bind(this)
  }

  public ngOnDestroy(): void {}

  public ngOnInit(): void {
    this.subscribeToRoute()
    this.fetchAllLabels()
    this.createForm()
  }

  public async associate(): Promise<void> {
    try {
      this.source.isLoading = true
      this.source.change$.next()
      if (this.params.org) {
        await this.packageOrganization.create({
          organization: this.params.org.id,
          package: this.selectedLabelId
        })
      }
      this.selectedLabelId = ''
      this.paginator.firstPage()
      this.source.refresh()
      this.form.controls.query.enable()
      this.form.controls.query.reset()
    } catch (error) {
      this.notifier.error(error)
    } finally {
      this.source.isLoading = false
      this.source.change$.next()
    }
  }

  public autocompleteDisplayWith(value: any): string {
    const label = this.labels
      ? this.labels.find((l) => l.id === value)
      : undefined
    return label ? label.title : ''
  }

  public clearQueryField(): void {
    this.selectedLabelId = ''
    this.form.controls.query.enable()
    this.form.controls.query.reset()
  }

  public disable(association: PackageAssociationElement): void {
    const data: PromptDialogData = {
      title: _('PROMPT.LABELS.DISABLE'),
      content: _('PROMPT.LABELS.DISABLE_PROMPT'),
      contentParams: { label: association.package.title }
    }

    this.dialog
      .open(PromptDialog, { data })
      .afterClosed()
      .subscribe(async (confirm) => {
        try {
          if (!confirm) {
            this.source.refresh()
            return
          }

          this.source.isLoading = true
          this.source.change$.next()

          if (association.inherited && this.params.org) {
            const entity = await this.packageOrganization.create({
              organization: this.params.org.id,
              package: association.package.id
            })
            await this.packageOrganization.update({
              id: entity.id,
              isActive: false
            })
          } else {
            await this.packageOrganization.update({
              id: association.id,
              isActive: false
            })
          }

          this.paginator.firstPage()
          this.source.refresh()
          this.notifier.success(_('NOTIFY.SUCCESS.PHASE_UPDATED'))
        } catch (error) {
          this.notifier.error(error)
        } finally {
          this.source.isLoading = false
          this.source.change$.next()
        }
      })
  }

  public dissociate(association: PackageAssociationElement): void {
    if (association.inherited) {
      return
    }

    const data: PromptDialogData = {
      title: _('PROMPT.LABELS.DISOCCIATE'),
      content: _('PROMPT.LABELS.DISOCCIATE_PROMPT'),
      contentParams: { label: association.package.title }
    }

    this.dialog
      .open(PromptDialog, { data: data })
      .afterClosed()
      .subscribe(async (confirm) => {
        try {
          if (!confirm) {
            this.source.refresh()
            return
          }

          this.source.isLoading = true
          this.source.change$.next()

          await this.packageOrganization.delete({ id: association.id })

          this.paginator.firstPage()
          this.source.refresh()
        } catch (error) {
          this.notifier.error(error)
        } finally {
          this.source.isLoading = false
          this.source.change$.next()
        }
      })
  }

  public enable(association: PackageAssociationElement): void {
    const data: PromptDialogData = {
      title: _('PROMPT.LABELS.ENABLE'),
      content: _('PROMPT.LABELS.ENABLE_PROMPT'),
      contentParams: { label: association.package.title }
    }

    this.dialog
      .open(PromptDialog, { data: data })
      .afterClosed()
      .subscribe(async (confirm) => {
        try {
          if (!confirm) {
            this.source.refresh()
            return
          }

          this.source.isLoading = true
          this.source.change$.next()

          if (association.inherited && this.params.org) {
            await this.packageOrganization.create({
              organization: this.params.org.id,
              package: association.package.id
            })
          } else {
            await this.packageOrganization.update({
              id: association.id,
              isActive: true
            })
          }

          this.paginator.firstPage()
          this.source.refresh()
          this.notifier.success(_('NOTIFY.SUCCESS.PHASE_UPDATED'))
        } catch (error) {
          this.notifier.error(error)
        } finally {
          this.source.isLoading = false
          this.source.change$.next()
        }
      })
  }

  public onAssociationStatusChange(
    association: PackageAssociationElement,
    $event: MatSelectChange
  ): void {
    if (!$event || !$event.value) {
      return
    }

    switch ($event.value) {
      case 'enabled':
        this.enable(association)
        break

      case 'disabled':
        this.disable(association)
        break

      default:
        break
    }
  }

  public onGoToPhasePage(association: PackageAssociationElement): void {
    this.router.navigate(['/admin/labels/', association.package.id, 'info'])
  }

  public onSelectOption($event: MatAutocompleteSelectedEvent) {
    if ($event && $event.option) {
      this.selectedLabelId = $event.option.value || ''
      this.form.controls.query.disable()
    }
  }

  public showLabelDialog(): void {
    const dialog = this.dialog.open(CreateLabelDialogComponent)
    dialog
      .afterClosed()
      .pipe(filter((result) => result && result.id))
      .subscribe((result) => {
        this.selectedLabelId = result.id
        this.associate()
      })
  }

  private createForm(): void {
    this.form = this.fb.group({ query: [] })

    this.form.controls.query.valueChanges
      .pipe(untilDestroyed(this), debounceTime(500))
      .subscribe(() => {
        this.refreshLabels()
      })

    this.refreshLabels()
  }

  private createSource(): void {
    this.source = new LabelsOrganizationDataSource(this.database)

    this.source.setPaginator(this.paginator, getterPaginator(this.paginator))

    this.source.addDefault({
      organization: this.params.org
        ? this.params.org.id
        : this.context.organizationId,
      status: 'all'
    })
  }

  private async fetchAllLabels(): Promise<void> {
    try {
      this.loadingLabels = true
      const labels = await this.packageService.getAll({
        isActive: true,
        limit: 'all',
        offset: 0
      })
      this.labels = labels.data.sort((prev, next) =>
        Number(prev.id) < Number(next.id)
          ? -1
          : Number(prev.id) > Number(next.id)
          ? 1
          : 0
      )
    } catch (error) {
      this.notifier.error(error)
    } finally {
      this.loadingLabels = false
      this.cdr.detectChanges()
    }
  }

  private refreshLabels(): void {
    const query = this.form.value.query
    const queryRegex = new RegExp(`${query}`, 'gi')
    this.shownLabels = query
      ? this.labels.filter((label) => queryRegex.test(label.title))
      : this.labels.slice()
    this.cdr.detectChanges()
  }

  private subscribeToRoute(): void {
    this.route.data
      .pipe(untilDestroyed(this))
      .subscribe((data: OrganizationParams) => {
        this.params = data
        if (!this.source) {
          this.createSource()
        }
      })
  }
}
