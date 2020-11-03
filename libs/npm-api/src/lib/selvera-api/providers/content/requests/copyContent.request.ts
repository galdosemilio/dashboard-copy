export interface CopyContentRequest {
    /** Content item ID to copy. */
    id: string;
    /** Target organization ID. */
    organization: string;
    /** ID of the target parent content item. */
    parentId?: string;
    /** Content copy permission mode. Defaults to 'private'. */
    mode?: 'private' | 'public' | 'with-packages';
}
