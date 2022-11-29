import { TableDataSource } from '@coachcare/backend/model'
import {
  EmailTemplate as SelveraEmailTemplate,
  GetAllEmailTemplatesRequest,
  PagedResponse
} from '@coachcare/sdk'
import { Observable } from 'rxjs'
import { EmailTemplatesDatabase } from './email-templates.database'
import { EmailTemplate } from './model'

export class EmailTemplatesDataSource extends TableDataSource<
  EmailTemplate,
  PagedResponse<SelveraEmailTemplate>,
  GetAllEmailTemplatesRequest
> {
  public showMarker: boolean

  constructor(protected database: EmailTemplatesDatabase) {
    super()
  }

  defaultFetch(): PagedResponse<SelveraEmailTemplate> {
    return { data: [], pagination: {} }
  }

  fetch(
    criteria: GetAllEmailTemplatesRequest
  ): Observable<PagedResponse<SelveraEmailTemplate>> {
    return this.database.fetch(criteria)
  }

  mapResult(result: PagedResponse<SelveraEmailTemplate>): EmailTemplate[] {
    // pagination handling
    this.getTotal(result)

    const mappedResult = result.data.map(
      (element) =>
        new EmailTemplate(element, {
          organizationId: this.criteria.organization
        })
    )

    const nonInheritedTemplates = mappedResult.filter(
      (template) => !template.isInherited
    )

    const shownEmailTemplates = mappedResult.filter(
      (template) =>
        !template.isInherited ||
        !nonInheritedTemplates.some(
          (nonInheritedTemplate) =>
            nonInheritedTemplate.locale === template.locale &&
            nonInheritedTemplate.operation === template.operation &&
            nonInheritedTemplate.category === template.category
        )
    )

    this.showMarker = shownEmailTemplates.some(
      (template) => template.isInherited
    )

    return shownEmailTemplates
  }
}
