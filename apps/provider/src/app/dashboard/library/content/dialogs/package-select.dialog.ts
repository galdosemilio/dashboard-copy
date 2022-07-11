import { Component, Inject, OnInit } from '@angular/core'
import { MAT_DIALOG_DATA, MatDialogRef } from '@coachcare/material'
import { ContextService } from '@app/service'
import {
  Package,
  PackageSelectEvents
} from '@app/shared/components/package-table/models'
import {
  PackageDatabase,
  PackageDatasource
} from '@app/shared/components/package-table/services'
import { FetchPackagesSegment } from '@coachcare/sdk'

@Component({
  selector: 'app-content-package-select-dialog',
  templateUrl: './package-select.dialog.html'
})
export class PackageSelectDialog implements OnInit {
  public columns = ['title', 'check']
  public contentPackages: Package[] = []
  public events: PackageSelectEvents = new PackageSelectEvents()
  public source: PackageDatasource

  constructor(
    @Inject(MAT_DIALOG_DATA) private data: any,
    private context: ContextService,
    private database: PackageDatabase,
    private dialogRef: MatDialogRef<PackageSelectDialog>
  ) {
    this.source = new PackageDatasource(this.context, this.database)
  }

  async ngOnInit() {
    if (this.data.packages && this.data.packages.length) {
      const allPackages = await this.database
        .fetch({
          organization: this.context.organizationId,
          isActive: true
        })
        .toPromise()
      const packages: Package[] = []
      while (this.data.packages.length) {
        const p: FetchPackagesSegment = this.data.packages.shift()
        const existingPackageAssociation = allPackages.data.find(
          (pkg) => pkg.package.id === p.id
        )

        if (existingPackageAssociation) {
          packages.push(
            new Package({
              ...existingPackageAssociation,
              ...existingPackageAssociation.package,
              checked: true
            })
          )
        }
      }
      this.contentPackages = packages
    }
  }

  onPackagesChange(packages: Package[]): void {
    this.contentPackages = packages
  }

  onSave(): void {
    this.dialogRef.close(this.contentPackages)
  }
}
