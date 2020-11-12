/**
 * Account Sort
 */

export interface AccSort {
  property: 'createdAt' | 'name'
  dir?: 'asc' | 'desc'
}

export interface AccAccesibleSort {
  property: 'firstName' | 'lastName' | 'email' | 'createdAt' | 'associationDate'
  dir?: 'asc' | 'desc'
}
