import { Component } from '@angular/core';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {

  body: string = ''

  constructor() {}

  handleCreatingPost(body: string) {
    console.log('EVENT IN HOMEPAGE', body);
    this.body = body
  }

}
