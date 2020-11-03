import {
  Entity,
  SequenceTransition,
  SequenceTrigger,
  TriggerLocalization as SelveraTriggerLocalization
} from '@app/shared/selvera-api';
import { SyncState } from './sync-state';

interface Trigger extends SequenceTrigger {
  syncState: SyncState;
}

interface TriggerLocalization extends SelveraTriggerLocalization {
  id?: string;
  syncState: SyncState;
}

export class Transition implements SequenceTransition {
  createdAt: string;
  createdBy: Entity;
  delay?: string;
  delayHour?: string;
  id: string;
  from: Entity;
  serverDelay?: string;
  syncState: SyncState;
  to: Entity;
  triggers: Trigger[];

  constructor(args: any, opts: SyncState = {}) {
    this.createdAt = args.createdAt || '';
    this.createdBy = args.createdBy ? { id: args.createdBy.id || '' } : undefined;
    const splitDelay = args.delay ? args.delay.split(/\s/) : [];
    this.delay =
      splitDelay.length > 2
        ? `${splitDelay[0]} ${splitDelay[1]}`
        : splitDelay.length && splitDelay[0].indexOf(':') === -1
        ? args.delay
        : 0;
    this.delayHour =
      splitDelay.length > 2
        ? `${splitDelay[2]}`
        : splitDelay.length && splitDelay[0].indexOf(':') === -1
        ? ''
        : splitDelay[0];
    this.serverDelay = args.delay || '';
    this.id = args.id || '';
    this.from = args.from ? { id: args.from.id || '' } : undefined;
    this.syncState = {
      new: opts.new || false,
      edited: opts.edited || false,
      deleted: opts.deleted || false,
      inServer: opts.inServer || false
    };
    this.to = args.to ? { id: args.to.id || '' } : undefined;
    this.triggers = this.resolveSequenceTriggers(args.triggers);
  }

  private resolveSequenceTrigger(trigger: any, opts: SyncState = {}): Trigger {
    return {
      id: trigger.id || '',
      type: trigger.type
        ? { id: trigger.type.id || '', name: trigger.type.name || '' }
        : undefined,
      createdAt: trigger.createdAt || '',
      updatedAt: trigger.updatedAt || '',
      localizations:
        trigger.localizations && trigger.localizations.length
          ? trigger.localizations.map((l) => this.resolveTriggerLocalization(l))
          : [],
      payload: trigger.payload
        ? {
            subject: trigger.payload.subject || undefined,
            header: trigger.payload.header || trigger.payload.title || undefined,
            message: trigger.payload.message || trigger.payload.content || undefined,
            content: trigger.payload.message || trigger.payload.content || undefined,
            package: trigger.payload.package || undefined
          }
        : {},
      syncState: {
        new: opts.new || false,
        edited: opts.edited || false,
        deleted: opts.deleted || false,
        inServer: opts.inServer || false
      }
    };
  }

  private resolveSequenceTriggers(triggers: any[] = [], opts: SyncState = {}): Trigger[] {
    return triggers && triggers.length
      ? triggers.map((t) => this.resolveSequenceTrigger(t, opts))
      : [];
  }

  private resolveTriggerLocalization(
    localization: any,
    opts: SyncState = {}
  ): TriggerLocalization {
    return {
      id: localization.id || '',
      createdAt: localization.createdAt || '',
      locale: localization.locale || 'en',
      payload: localization.payload
        ? {
            subject: localization.payload.subject || undefined,
            header:
              localization.payload.header || localization.payload.title || undefined,
            message:
              localization.payload.message || localization.payload.content || undefined
          }
        : {},
      updatedAt: localization.updatedAt || '',
      syncState: {
        new: opts.new || false,
        edited: opts.edited || false,
        deleted: opts.deleted || false,
        inServer: opts.inServer || false
      }
    };
  }
}
