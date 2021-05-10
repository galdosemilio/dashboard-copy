import { Component, OnInit } from '@angular/core'
import { Router } from '@angular/router'

@Component({
  selector: 'ccr-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  constructor(private router: Router) {}

  ngOnInit() {
    if (window.navigator.userAgent.match(/(MSIE|Trident)/)) {
      this.router.navigate(['/unsupported-browser'])
    }
  }
}
