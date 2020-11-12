/**
 * Organization Sort
 */

export interface OrgSort {
  property: 'createdAt' | 'name'
  dir?: 'asc' | 'desc'
}

export interface OrgAccesibleSort {
  property: 'state' | 'name'
  dir?: 'asc' | 'desc'
}
