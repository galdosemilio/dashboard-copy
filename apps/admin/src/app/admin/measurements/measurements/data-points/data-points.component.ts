import { Component, OnInit, ViewChild } from '@angular/core'
import { DataPointDatabase, DataPointDataSource } from '@coachcare/backend/data'
import { getterPaginator } from '@coachcare/backend/model'
import { CcrPaginatorComponent } from '@coachcare/common/components'
import { MatDialog } from '@coachcare/material'
import { MeasurementDataPointType } from '@coachcare/sdk'
import { filter } from 'rxjs/operators'
import { EditDataPointTypeDialog } from '../../dialogs'

@Component({
  selector: 'ccr-measurements-data-points',
  templateUrl: './data-points.component.html'
})
export class MeasurementsDataPointsComponent implements OnInit {
  @ViewChild(CcrPaginatorComponent, { static: true })
  paginator: CcrPaginatorComponent

  public columns: string[] = ['id', 'name', 'description', 'actions']
  public source: DataPointDataSource

  constructor(private database: DataPointDatabase, private dialog: MatDialog) {}

  public ngOnInit(): void {
    this.createDataSource()
  }

  public onEdit(dataPointType: MeasurementDataPointType): void {
    console.log({ dataPointType })
    this.dialog
      .open(EditDataPointTypeDialog, {
        data: { dataPointType: dataPointType },
        width: '60vw'
      })
      .afterClosed()
      .pipe(filter((refresh) => refresh))
      .subscribe(() => this.source.refresh())
  }

  private createDataSource() {
    this.source = new DataPointDataSource(this.database)
    this.source.setPaginator(this.paginator, getterPaginator(this.paginator))
    this.source.addDefault({ localeMode: 'all' })
  }
}
