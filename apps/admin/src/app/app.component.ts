import { Component, OnInit } from '@angular/core'
import { Router } from '@angular/router'

@Component({
  selector: 'ccr-root',
  templateUrl: './app.component.html'
})
export class AppComponent implements OnInit {
  constructor(private router: Router) {}

  ngOnInit() {
    if (window.navigator.userAgent.match(/(MSIE|Trident)/)) {
      void this.router.navigate(['/unsupported-browser'])
    }
  }
}
