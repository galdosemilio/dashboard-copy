import { Component } from '@angular/core';

@Component({
  selector: 'ccr-page-unsupported-browser',
  templateUrl: './unsupported-browser.component.html',
  styleUrls: ['./unsupported-browser.component.scss']
})
export class UnsupportedBrowserPageComponent {
  public supportedBrowsers = [
    {
      name: 'Google Chrome',
      url: 'https://www.google.com/chrome/',
      image: './assets/browsers/chrome.png'
    },
    {
      name: 'Mozilla Firefox',
      url: 'https://www.mozilla.org/firefox/new/',
      image: './assets/browsers/firefox.png'
    },
    {
      name: 'Edge',
      url: 'https://www.microsoft.com/windows/microsoft-edge',
      image: './assets/browsers/edge.png'
    }
  ];
}
