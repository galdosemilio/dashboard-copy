import { Component, OnInit } from '@angular/core';

const PAGE_CONF_TIMEOUT = 300;

@Component({
  selector: 'ccr-page-download',
  templateUrl: './download.component.html',
  styleUrls: ['./download.component.scss'],
  host: {
    class: 'ccr-page-cover'
  }
})
export class DownloadPageComponent implements OnInit {
  timeout = false;

  constructor() {}

  ngOnInit() {
    setTimeout(() => {
      this.timeout = true;
    }, PAGE_CONF_TIMEOUT);
  }
}
