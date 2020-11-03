/**
 * Interface Manager Profile Model
 */

export interface ManagerProfileModel {
    organization: number | string;
    organizationShortcode: string;
    permissionCreateManager: boolean;
    permissionCreateProvider: boolean;
    permissionCreateClient: boolean;
    permissionAssociation: boolean;
}
