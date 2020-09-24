/**
 * Entity
 */

export interface Entity {
  id: string;
}

export interface CodedEntity extends Entity {
  code: string;
}

export interface TitledEntity extends Entity {
  title: string;
}

export interface NamedEntity extends Entity {
  name: string;
}

export interface DescribedEntity extends Entity {
  description: string;
}

export interface ItemEntity extends NamedEntity {
  description: string;
}

export interface ActivityEntity extends ItemEntity {
  isActive: boolean;
}

export interface TracedEntity extends ActivityEntity {
  createdAt: string;
}
