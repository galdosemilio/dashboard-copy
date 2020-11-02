/**
 * Entity
 */

import { Entity, NamedEntity } from '../../common/entities'

export interface TitledEntity extends Entity {
  title: string
}

export interface DescribedEntity extends Entity {
  description: string
}

export interface ItemEntity extends NamedEntity {
  description: string
}

export interface ActivityEntity extends ItemEntity {
  isActive: boolean
}

export interface TracedEntity extends ActivityEntity {
  createdAt: string
}
