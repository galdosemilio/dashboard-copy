import { Component, OnDestroy, OnInit } from '@angular/core'
import { MatDialog } from '@coachcare/material'
import { ActivatedRoute } from '@angular/router'
import {
  EmailTemplatesDatabase,
  EmailTemplatesDataSource
} from '@coachcare/backend/data'
import { _ } from '@coachcare/backend/shared'
import { ContextService } from '@coachcare/common/services'
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy'
import { EmailTemplateDialogComponent } from './dialogs'

@UntilDestroy()
@Component({
  selector: 'ccr-organizations-email-template',
  templateUrl: './email-template.component.html'
})
export class EmailTemplateComponent implements OnDestroy, OnInit {
  orgId: string
  source: EmailTemplatesDataSource

  constructor(
    private context: ContextService,
    private database: EmailTemplatesDatabase,
    private dialog: MatDialog,
    private route: ActivatedRoute
  ) {}

  ngOnDestroy(): void {}

  ngOnInit(): void {
    this.source = new EmailTemplatesDataSource(this.database)
    this.source.addDefault({ organization: this.context.organizationId })

    this.route.data.pipe(untilDestroyed(this)).subscribe((data) => {
      this.source.addDefault({
        organization: data.org.id || this.context.organizationId
      })
      this.source.refresh()
      this.orgId = data.org.id || this.context.organizationId
    })
  }

  onCreateEmailTemplate(): void {
    this.dialog
      .open(EmailTemplateDialogComponent, {
        data: { orgId: this.orgId },
        width: '60vw'
      })
      .afterClosed()
      .pipe(untilDestroyed(this))
      .subscribe((refresh) => {
        if (refresh) {
          this.source.refresh()
        }
      })
  }
}
