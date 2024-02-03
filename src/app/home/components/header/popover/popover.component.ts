import { Component, OnInit } from '@angular/core';
import {AuthService} from "../../../../auth/services/auth.service";

@Component({
  selector: 'app-popover',
  templateUrl: './popover.component.html',
  styleUrls: ['./popover.component.scss'],
})
export class PopoverComponent  implements OnInit {

  constructor(private auth: AuthService) { }

  ngOnInit() {}

  onSignOut() {
    console.log('On signing out')
    this.auth.logout()
  }

}
