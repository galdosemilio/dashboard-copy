import { Component, OnInit } from '@angular/core'
import { Router } from '@angular/router'
import { SDK_HEADERS } from '@coachcare/common/sdk.barrel'

@Component({
  selector: 'ccr-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  constructor(private router: Router) {}

  ngOnInit() {
    // clear headers on start-up
    SDK_HEADERS.values = {}

    if (window.navigator.userAgent.match(/(MSIE|Trident)/)) {
      this.router.navigate(['/unsupported-browser'])
    }
  }
}
