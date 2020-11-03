import { _ } from '@app/shared/utils';

export interface MessageType {
  displayName: string;
  id: string;
  name: string;
  preview?: string;
}

export const MessageTypes: { [key: string]: MessageType } = {
  ['email']: {
    displayName: _('BOARD.EMAIL'),
    id: '1',
    name: 'email',
    preview: './assets/email.png'
  },
  ['notification']: {
    displayName: _('GLOBAL.NOTIFICATION'),
    id: '2',
    name: 'notification',
    preview: './assets/push.png'
  },
  ['sms']: {
    displayName: _('PROFILE.MFA.SMS'),
    id: '3',
    name: 'sms',
    preview: './assets/sms.png'
  },
  ['pkgenrollment']: {
    displayName: _('SEQUENCING.PACKAGE_ENROLLMENT'),
    id: '4',
    name: 'pkgenrollment'
  }
  // ['pkgunenrollment']: {
  //   displayName: _('SEQUENCING.PACKAGE_UNENROLLMENT'),
  //   id: '5',
  //   name: 'pkgunenrollment'
  // }
};
