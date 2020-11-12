/**
 * Image Upload
 */

export interface ImageUpload {
  /** New S3 key generated from image upload associated with this meal. When provided, url cannot be present. */
  key?: string
  /** New url of the image associated with this meal. When provided, key cannot be present. */
  url?: string
}
