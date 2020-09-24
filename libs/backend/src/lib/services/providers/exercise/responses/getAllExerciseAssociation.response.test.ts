/**
 * GET /measurement/exercise/association
 */

import { createTest, optional } from '@coachcare/backend/tests';
import * as t from 'io-ts';
import { entity } from '../../../shared/index.test';
import { exerciseTypeSingle } from '../../exercise/responses/exerciseType.single.test';
import { GetAllExerciseAssociationResponse } from './getAllExerciseAssociation.response';

export const getAllExerciseAssociationResponse = createTest<GetAllExerciseAssociationResponse>(
  'GetAllExerciseAssociationResponse',
  {
    /** Exercise type-organization id. */
    id: t.string,
    /** A flag indicating whether the association is active or not. */
    isActive: t.boolean,
    /** Associated organization. */
    organization: entity,
    /** Associated exercise type. */
    type: exerciseTypeSingle,
    /** An SVG icon. */
    icon: optional(t.string)
  }
);
