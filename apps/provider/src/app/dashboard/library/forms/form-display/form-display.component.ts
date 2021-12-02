import { Component, forwardRef, OnDestroy, OnInit } from '@angular/core'
import { FormBuilder, FormGroup } from '@angular/forms'
import { MAT_LABEL_GLOBAL_OPTIONS } from '@coachcare/material'
import { ActivatedRoute, Router } from '@angular/router'
import { Form, FormSubmission } from '@app/dashboard/library/forms/models'
import { FormDisplayService } from '@app/dashboard/library/forms/services'
import { _, BindForm, BINDFORM_TOKEN } from '@app/shared'
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy'
import { debounceTime } from 'rxjs/operators'
import { ContextService } from '@app/service'

interface FormDisplayRouteElement {
  type: 'text' | 'form' | 'submission'
  payload: string | Form | FormSubmission
  destination: string[]
}

@UntilDestroy()
@Component({
  selector: 'app-library-form-display',
  templateUrl: './form-display.component.html',
  styleUrls: ['./form-display.component.scss'],
  providers: [
    {
      provide: BINDFORM_TOKEN,
      useExisting: forwardRef(() => FormDisplayComponent)
    },
    { provide: MAT_LABEL_GLOBAL_OPTIONS, useValue: { float: 'always' } }
  ]
})
export class FormDisplayComponent implements BindForm, OnDestroy, OnInit {
  public form: FormGroup
  public data: Form
  public disableSave = true
  public isProvider = false
  public preview = false
  public routes: FormDisplayRouteElement[] = [
    {
      type: 'text',
      payload: _('LIBRARY.FORMS.ALL_FORMS'),
      destination: ['../']
    }
  ]

  constructor(
    public formDisplay: FormDisplayService,
    private context: ContextService,
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnDestroy() {
    this.formDisplay.togglePreview$.next(false)
  }

  ngOnInit() {
    this.isProvider = this.context.isProvider

    this.route.data.pipe(untilDestroyed(this)).subscribe((data: any) => {
      this.data = data.form

      if (!this.isProvider) {
        this.routes = [
          {
            type: 'form',
            payload: this.data,
            destination: ['./dieter-submissions']
          },
          {
            type: 'text',
            payload: _('LIBRARY.FORMS.VIEW_ANSWERS_TOOLTIP'),
            destination: ['./dieter-submissions']
          }
        ]
        return
      }

      this.routes[1] = {
        type: 'form',
        payload: this.data,
        destination: ['./submissions']
      }

      const routeSegments: string[] = this.router.url.split('/')
      const action: string = routeSegments[4]

      switch (action) {
        case 'edit':
          this.routes[2] = {
            type: 'text',
            payload: _('LIBRARY.FORMS.EDIT_TOOLTIP'),
            destination: ['./edit']
          }
          break
        case 'fill':
          this.routes[2] = {
            type: 'text',
            payload: _('LIBRARY.FORMS.FILL_TOOLTIP'),
            destination: ['./fill']
          }
          break
        case 'submissions':
          this.routes[2] = {
            type: 'text',
            payload: _('LIBRARY.FORMS.VIEW_ANSWERS_TOOLTIP'),
            destination: ['./submissions']
          }
          break
      }

      if (routeSegments.length === 6) {
        this.routes[3] = {
          type: 'text',
          payload: _('LIBRARY.FORMS.VIEW_ANSWER_TOOLTIP'),
          destination: []
        }
      } else if (routeSegments.length > 4) {
        this.routes = this.routes.splice(0, 3)
      }
    })
    this.createForm()
    this.subscribeToEvents()
  }

  goUp(route: FormDisplayRouteElement) {
    this.router.navigate(route.destination, { relativeTo: this.route })
  }

  togglePreview(): void {
    this.preview = !this.preview
    this.formDisplay.togglePreview$.next(this.preview)
  }

  private createForm() {
    this.form = this.formBuilder.group({})
  }

  private subscribeToEvents(): void {
    this.formDisplay.toggleSave$
      .pipe(debounceTime(100))
      .subscribe((enable) => (this.disableSave = !enable))

    this.formDisplay.saved$.pipe(untilDestroyed(this)).subscribe(() => {
      if (!this.isProvider) {
        return
      }

      this.router.navigate(['./'], { relativeTo: this.route })
    })
  }
}
