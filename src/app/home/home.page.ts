import {Component, OnInit} from '@angular/core';
import {AuthService} from "../auth/services/auth.service";

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit{

  body: string = ''

  constructor(private authService: AuthService) {}

  handleCreatingPost(body: string) {
    console.log('EVENT IN HOMEPAGE', body);
    this.body = body
  }

  ngOnInit() {
    this.authService.getUserImageName().subscribe((res) => {
      console.log('USER IMAGE NAAME', res);
    })
  }

}
