/**
 * POST /food/meal/image
 */

export interface UploadMealImageResponse {
    /** URL to upload the file to S3 */
    url: string;
    /** Key of the item being uploaded */
    key: string;
    /** MIME type of the image to upload */
    mimeType: string;
}
