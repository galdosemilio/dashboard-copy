import { _ } from '@app/shared/utils';

export interface InteractionType {
  id: string;
  displayName: string;
  name: string;
}

export const INTERACTION_SOURCES: { [key: string]: InteractionType } = {
  twilio: {
    id: '1',
    displayName: _('CALL.INTERACTION_TYPES.VIDEO_CALL'),
    name: 'manual'
  },
  manual: {
    id: '2',
    displayName: _('CALL.INTERACTION_TYPES.MANUAL'),
    name: 'manual'
  }
};

export const INTERACTION_TYPES: { [key: string]: InteractionType } = {
  inPerson: {
    id: '1',
    displayName: _('CALL.INTERACTION_TYPES.FACE_TO_FACE'),
    name: 'In-Person Visit'
  },
  externalAudioCall: {
    id: '2',
    displayName: _('CALL.INTERACTION_TYPES.EXTERNAL_AUDIO_CALL'),
    name: 'External audio call'
  },
  externalVideoCall: {
    id: '3',
    displayName: _('CALL.INTERACTION_TYPES.EXTERNAL_VIDEO_CALL'),
    name: 'External video call'
  }
};
