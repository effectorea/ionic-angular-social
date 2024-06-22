import { Component, OnInit } from '@angular/core';
import {AuthService} from "../../../auth/services/auth.service";

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.scss'],
})
export class UserProfileComponent  implements OnInit {

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
