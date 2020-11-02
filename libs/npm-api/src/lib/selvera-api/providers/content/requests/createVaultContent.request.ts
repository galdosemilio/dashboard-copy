export interface CreateVaultContentRequest {
    /** Account ID */
    account: string;
    /** Extended item description */
    description?: string;
    /** Creator account ID */
    createdBy: string;
    /** Type-specific metadata */
    metadata?: any;
    /** Item name */
    name: string;
    /** Organization ID */
    organization: string;
    /** ID of the parent vault item */
    parent?: string;
    /** Sort order number used for enhanced default sorting */
    sortOrder?: number;
    /** ID of the content type */
    type: string;
}
