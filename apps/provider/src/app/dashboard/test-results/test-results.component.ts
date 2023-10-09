import { Component, OnInit } from '@angular/core'

@Component({
  selector: 'provider-test-results',
  templateUrl: './test-results.component.html',
  host: { class: 'wellcore-component' }
})
export class TestResultsComponent implements OnInit {
  constructor() {}

  ngOnInit(): void {}
}
