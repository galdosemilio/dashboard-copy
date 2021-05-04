import { MessagingAccount, MessagingItem } from '@coachcare/sdk'
import * as linkifyHtml from 'linkifyjs/html'

export class MessageContainer implements MessagingItem {
  public messageId: string
  public readonly threadId: string
  public readonly subject: string
  public readonly createdAt: string
  public readonly content: string
  public readonly account: MessagingAccount
  public timestamp: string | null

  public constructor(item: MessagingItem) {
    this.timestamp = null
    Object.assign(this, item)
    this.content = this.content.replace(/\n/g, '<br />')
    this.content = linkifyHtml(this.content, { target: '_blank' })
  }

  get author(): string {
    return this.account.id
  }
}
