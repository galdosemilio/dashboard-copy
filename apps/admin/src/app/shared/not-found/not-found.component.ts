import { Component, OnInit } from '@angular/core'

@Component({
  selector: 'ccr-page-notfound',
  templateUrl: './not-found.component.html',
  styleUrls: ['./not-found.component.scss'],
  host: {
    class: 'ccr-page-cover'
  }
})
export class NotFoundPageComponent implements OnInit {
  constructor() {}

  ngOnInit() {}
}
