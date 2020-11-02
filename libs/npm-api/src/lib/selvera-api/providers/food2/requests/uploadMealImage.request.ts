/**
 * POST /food/meal/image
 */

export interface UploadMealImageRequest {
    /** Full filename, with extension, of the uploaded file. */
    filename: string;
}
