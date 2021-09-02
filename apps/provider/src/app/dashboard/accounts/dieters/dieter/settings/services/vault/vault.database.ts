import { Injectable } from '@angular/core'
import { FileExplorerContent } from '@app/dashboard/content/models'
import { ContextService } from '@app/service'
import { CcrDatabase } from '@app/shared'
import {
  ContentPackage,
  ContentSingle,
  CreateVaultContentRequest,
  CreateContentPackageRequest,
  DeleteContentPackageRequest,
  Entity,
  FileVault,
  GetAllContentPackageResponse,
  GetAllVaultContentRequest,
  GetAllVaultContentResponse,
  GetDownloadUrlResponse,
  GetUploadUrlContentRequest,
  GetUploadUrlContentResponse,
  UpdateVaultContentRequest
} from '@coachcare/sdk'
import { from, Observable } from 'rxjs'

@Injectable()
export class VaultDatabase extends CcrDatabase {
  constructor(
    private fileVault: FileVault,
    private contentPackage: ContentPackage,
    private context: ContextService
  ) {
    super()
  }

  public createContent(
    args: CreateVaultContentRequest
  ): Observable<ContentSingle> {
    return from(
      new Promise<ContentSingle>(async (resolve, reject) => {
        try {
          const entity: Entity = await this.fileVault.create(args),
            content: ContentSingle = await this.fileVault.getSingle(entity)
          resolve(content)
        } catch (error) {
          reject(error)
        }
      })
    )
  }

  public createContentPackage(
    args: CreateContentPackageRequest
  ): Observable<void> {
    return from(
      new Promise<void>(async (resolve, reject) => {
        try {
          await this.contentPackage.create(args)
          resolve()
        } catch (error) {
          reject(error)
        }
      })
    )
  }

  public deleteContent(args: Entity): Observable<void> {
    return from(
      new Promise<void>(async (resolve, reject) => {
        try {
          await this.fileVault.delete(args)
          resolve()
        } catch (error) {
          reject(error)
        }
      })
    )
  }

  public deleteContentPackage(
    args: DeleteContentPackageRequest
  ): Observable<void> {
    return from(this.contentPackage.delete(args))
  }

  public fetch(
    args: GetAllVaultContentRequest
  ): Observable<GetAllVaultContentResponse> {
    return from(this.fileVault.getAll(args))
  }

  public getAllContentPackage(
    args: Entity
  ): Observable<GetAllContentPackageResponse> {
    return from(this.contentPackage.getAll(args))
  }

  public getDownloadUrl(args: Entity): Observable<GetDownloadUrlResponse> {
    return from(this.fileVault.getDownloadUrl(args))
  }

  public getUploadUrl(
    args: GetUploadUrlContentRequest
  ): Observable<GetUploadUrlContentResponse> {
    return from(this.fileVault.getUploadUrl(args))
  }

  public updateContent(
    args: UpdateVaultContentRequest,
    opts: any
  ): Observable<FileExplorerContent> {
    return from(
      new Promise<FileExplorerContent>(async (resolve, reject) => {
        try {
          const request = {
            id: args.id,
            parent: args.parent,
            name: args.name,
            description: args.description || null,
            sortOrder: args.sortOrder,
            isVisibleToPatient: args.isVisibleToPatient
          }
          await this.fileVault.update(request)
          const content: ContentSingle = await this.fileVault.getSingle({
            id: args.id
          })
          resolve({
            ...content,
            isAdmin: await this.context.orgHasPerm(opts.organizationId, 'admin')
          } as FileExplorerContent)
        } catch (error) {
          reject(error)
        }
      })
    )
  }
}
