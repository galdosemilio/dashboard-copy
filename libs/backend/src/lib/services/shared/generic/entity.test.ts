/**
 * Entity
 */

import { createTestFromValidator, createValidator } from '@coachcare/backend/tests';
import * as t from 'io-ts';
import {
  ActivityEntity,
  CodedEntity,
  DescribedEntity,
  Entity,
  ItemEntity,
  NamedEntity,
  TitledEntity,
  TracedEntity
} from './entity';

export const entity = createValidator<Entity>({
  id: t.string
});

export const codedEntity = createValidator<CodedEntity>({
  ...entity.type.props,
  code: t.string
});

export const titledEntity = createValidator<TitledEntity>({
  ...entity.type.props,
  title: t.string
});

export const namedEntity = createValidator<NamedEntity>({
  ...entity.type.props,
  name: t.string
});

export const describedEntity = createValidator<DescribedEntity>({
  ...entity.type.props,
  description: t.string
});

export const itemEntity = createValidator<ItemEntity>({
  ...namedEntity.type.props,
  description: t.string
});

export const activityEntity = createValidator<ActivityEntity>({
  ...itemEntity.type.props,
  isActive: t.boolean
});

export const tracedEntity = createValidator<TracedEntity>({
  ...activityEntity.type.props,
  createdAt: t.string
});

// Tests

export const entityTest = createTestFromValidator<Entity>('Entity', entity);
