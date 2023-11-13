import { Component, Inject, OnInit } from '@angular/core'
import { MAT_DIALOG_DATA, MatDialogRef } from '@coachcare/material'
import { Coordinate, PainAreaTypes } from '@coachcare/sdk'

interface PainLocationDialogProps {
  areaType: PainAreaTypes
  coordinates?: Coordinate
}

@Component({
  selector: 'app-dialog-pain-location-dialog',
  templateUrl: './pain-location.dialog.html',
  host: {
    class: 'ccr-dialog'
  }
})
export class PainLocationDialog implements OnInit {
  public areaType: PainAreaTypes
  public coordinates: Coordinate

  constructor(
    @Inject(MAT_DIALOG_DATA) private data: PainLocationDialogProps,
    private dialog: MatDialogRef<PainLocationDialogProps>
  ) {}

  ngOnInit(): void {
    if (this.data) {
      this.areaType = this.data.areaType
      this.coordinates = this.data.coordinates
    }
  }
}
