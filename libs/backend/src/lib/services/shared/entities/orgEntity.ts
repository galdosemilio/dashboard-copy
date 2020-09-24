/**
 * OrgEntity
 */

export interface OrgEntity {
  /** The organization Id. */
  id: string;
  /** The organization name. */
  name: string;
  /** The organization shortcode. */
  shortcode: string;
  /** The organization hierarchy path. */
  hierarchyPath: Array<string>;
}
