import { MessageThread } from './message-thread.interface'

export interface SelectMessageThreadEvent {
  index: number
  thread: MessageThread
}
