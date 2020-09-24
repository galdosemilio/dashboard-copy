/**
 * POST /content/upload
 */

export interface GetUploadUrlContentResponse {
  /** URL to upload the file to. */
  url: string;
  /** Key of the item being uploaded. */
  key: string;
  /** MIME type of the file to upload. */
  mimeType: string;
}
