import { Directive, OnInit } from '@angular/core'
import { MatPaginator } from '@coachcare/material'
import { MessageType, MessageTypes } from '@app/dashboard/sequencing/models'
import { TableDataSource } from '@app/shared'
import {
  GetSequenceTriggerHistoryRequest,
  NamedEntity,
  PagedResponse,
  TriggerHistoryItem
} from '@coachcare/sdk'
import { from, Observable } from 'rxjs'
import { TriggerHistoryDatabase } from './trigger-history.database'

@Directive()
export class TriggerHistoryDataSource
  extends TableDataSource<
    TriggerHistoryItem,
    PagedResponse<TriggerHistoryItem>,
    GetSequenceTriggerHistoryRequest
  >
  implements OnInit {
  messageTypes: MessageType[] = []

  constructor(
    protected database: TriggerHistoryDatabase,
    private paginator?: MatPaginator
  ) {
    super()
    if (this.paginator) {
      this.addOptional(this.paginator.page, () => ({
        limit: this.paginator.pageSize,
        offset: this.paginator.pageIndex * this.paginator.pageSize
      }))
    }
  }

  ngOnInit(): void {
    this.messageTypes = Object.keys(MessageTypes).map(
      (key) => MessageTypes[key]
    )
  }

  defaultFetch(): PagedResponse<TriggerHistoryItem> {
    return { data: [], pagination: {} }
  }

  fetch(
    request: GetSequenceTriggerHistoryRequest
  ): Observable<PagedResponse<TriggerHistoryItem>> {
    return from(this.database.fetch(request))
  }

  mapResult(result: PagedResponse<TriggerHistoryItem>): TriggerHistoryItem[] {
    const mappedResult = result.data.map((triggerHistoryItem) => ({
      ...triggerHistoryItem,
      payload: {
        ...(triggerHistoryItem.payload.payload || triggerHistoryItem.payload)
      },
      type: {
        ...triggerHistoryItem.trigger.type,
        displayName: this.resolveTypeDisplayName(
          triggerHistoryItem.trigger.type
        )
      }
    }))
    return mappedResult
  }

  private resolveTypeDisplayName(type: NamedEntity): string {
    const messageType = this.messageTypes.find((t) => t.id === type.id)
    return messageType ? messageType.displayName : type.name
  }
}
