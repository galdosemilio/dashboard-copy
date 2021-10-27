import { Component, OnInit } from '@angular/core'

@Component({
  selector: 'provider-test-results',
  templateUrl: './test-results.component.html',
  styleUrls: ['./test-results.component.scss'],
  host: { class: 'wellcore-component' }
})
export class TestResultsComponent implements OnInit {
  constructor() {}

  ngOnInit(): void {}
}
