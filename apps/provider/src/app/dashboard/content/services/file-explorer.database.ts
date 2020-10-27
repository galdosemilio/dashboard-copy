import { Injectable } from '@angular/core';
import { FileExplorerContent } from '@app/dashboard/content/models';
import { ContextService } from '@app/service';
import { CcrDatabase } from '@app/shared';
import {
  ContentSingle,
  CopyContentRequest,
  CreateContentPackageRequest,
  CreateContentRequest,
  DeleteContentPackageRequest,
  Entity,
  GetAllContentPackageResponse,
  GetAllContentRequest,
  GetAllContentResponse,
  GetUploadUrlContentRequest,
  GetUploadUrlContentResponse,
  UpdateContentRequest
} from '@app/shared/selvera-api';
import { from, Observable } from 'rxjs';
import { Content, ContentPackage } from 'selvera-api';

@Injectable()
export class FileExplorerDatabase extends CcrDatabase {
  constructor(
    private content: Content,
    private contentPackage: ContentPackage,
    private context: ContextService
  ) {
    super();
  }

  public copyContent(args: CopyContentRequest): Observable<ContentSingle> {
    return from(
      new Promise<ContentSingle>(async (resolve, reject) => {
        try {
          const entity = await this.content.copy(args);
          const single = await this.content.getSingle(entity);
          resolve(single);
        } catch (error) {
          reject(error);
        }
      })
    );
  }

  public createContent(args: CreateContentRequest): Observable<ContentSingle> {
    return from(
      new Promise<ContentSingle>(async (resolve, reject) => {
        try {
          const entity: Entity = await this.content.create(args),
            content: ContentSingle = await this.content.getSingle(entity);
          resolve(content);
        } catch (error) {
          reject(error);
        }
      })
    );
  }

  public createContentPackage(args: CreateContentPackageRequest): Observable<void> {
    return from(
      new Promise<void>(async (resolve, reject) => {
        try {
          await this.contentPackage.create(args);
          resolve();
        } catch (error) {
          reject(error);
        }
      })
    );
  }

  public deleteContent(args: Entity): Observable<void> {
    return from(
      new Promise<void>(async (resolve, reject) => {
        try {
          await this.content.delete(args);
          resolve();
        } catch (error) {
          reject(error);
        }
      })
    );
  }

  public deleteContentPackage(args: DeleteContentPackageRequest): Observable<void> {
    return from(this.contentPackage.delete(args));
  }

  public fetch(args: GetAllContentRequest): Observable<GetAllContentResponse> {
    return from(this.content.getAll(args));
  }

  public getAllContentPackage(args: Entity): Observable<GetAllContentPackageResponse> {
    return from(this.contentPackage.getAll(args));
  }

  public getUploadUrl(
    args: GetUploadUrlContentRequest
  ): Observable<GetUploadUrlContentResponse> {
    return from(this.content.getUploadUrl(args));
  }

  public updateContent(
    args: UpdateContentRequest,
    opts: any
  ): Observable<FileExplorerContent> {
    return from(
      new Promise<FileExplorerContent>(async (resolve, reject) => {
        try {
          const request = {
            id: args.id,
            parentId: args.parentId,
            name: args.name,
            isPublic: args.isPublic,
            description: args.description || null,
            sortOrder: args.sortOrder
          };
          await this.content.update(request);
          const content: ContentSingle = await this.content.getSingle({ id: args.id });
          resolve({
            ...content,
            isAdmin: await this.context.orgHasPerm(opts.organizationId, 'admin')
          } as FileExplorerContent);
        } catch (error) {
          reject(error);
        }
      })
    );
  }
}
