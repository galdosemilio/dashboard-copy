/**
 * ClientData
 */

import { Gender } from './gender';

export interface ClientData {
  /** Date of birth. */
  birthday: string;
  /** Height in centimeters. */
  height: number;
  /** Client gender. */
  gender: Gender;
  /** The BMR number. */
  bmr?: number;
}
