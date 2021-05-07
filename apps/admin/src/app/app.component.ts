import { Component, OnInit } from '@angular/core'
import { Router } from '@angular/router'
import { ApiService } from '@coachcare/sdk'
import { environment } from '../environments/environment'

@Component({
  selector: 'ccr-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  constructor(private api: ApiService, private router: Router) {
    this.api.setEnvironment(environment.ccrApiEnv)
  }

  ngOnInit() {
    if (window.navigator.userAgent.match(/(MSIE|Trident)/)) {
      this.router.navigate(['/unsupported-browser'])
    }
  }
}
