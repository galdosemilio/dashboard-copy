import { ChangeDetectorRef, Component, Input, OnInit } from '@angular/core'
import { ExerciseDataSource } from '@app/dashboard/accounts/dieters/services'

@Component({
  selector: 'app-dieter-journal-exercise-table',
  templateUrl: './table.component.html'
})
export class ExerciseTableComponent implements OnInit {
  @Input() columns = ['date', 'activity_type', 'intensity', 'duration', 'notes']
  @Input() source: ExerciseDataSource | null

  constructor(private cdr: ChangeDetectorRef) {}

  ngOnInit() {
    this.cdr.detectChanges()
  }
}
