import { Component, OnInit, ViewChild } from '@angular/core'
import { FormBuilder, FormGroup, Validators } from '@angular/forms'
import { Subject, debounceTime, filter } from 'rxjs'
import {
  CellularDeviceHistoryDataSource,
  CellularDeviceHistoryDatabase
} from '@coachcare/backend/data'
import { getterPaginator } from '@coachcare/backend/model'
import { CcrPaginatorComponent } from '@coachcare/common/components'
import { CellularDeviceHistory } from '@coachcare/sdk'

@Component({
  selector: 'ccr-cellular-device-history',
  templateUrl: './list.component.html'
})
export class CellularDeviceHistoryComponent implements OnInit {
  @ViewChild(CcrPaginatorComponent, { static: true })
  paginator: CcrPaginatorComponent

  public form: FormGroup
  public source: CellularDeviceHistoryDataSource
  public data: Array<CellularDeviceHistory>
  private refresh$ = new Subject<void>()
  public columns = [
    'id',
    'firstName',
    'lastName',
    'deviceId',
    'deviceName',
    'associatedAt',
    'removedAt'
  ]

  constructor(
    private builder: FormBuilder,
    private database: CellularDeviceHistoryDatabase
  ) {}

  ngOnInit() {
    this.createForm()
    this.createSource()
  }

  private createForm(): void {
    this.form = this.builder.group({
      imei: [null, Validators.required]
    })

    this.form.controls.imei.valueChanges
      .pipe(debounceTime(500))
      .subscribe(() => {
        this.data = []
        this.paginator.pageIndex = 0
        this.refresh$.next()
      })
  }

  private createSource(): void {
    this.source = new CellularDeviceHistoryDataSource(this.database)
    this.source.setPaginator(this.paginator, getterPaginator(this.paginator))

    this.source.addRequired(
      this.refresh$.pipe(filter(() => this.form.valid)),
      () => ({
        id: this.form.value.imei
      })
    )

    this.source.connect().subscribe((data) => (this.data = data))
  }
}
