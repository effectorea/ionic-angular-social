import { Component, OnInit } from '@angular/core';
import {AuthService} from "../../../../auth/services/auth.service";
import {PopoverController} from "@ionic/angular";

@Component({
  selector: 'app-popover',
  templateUrl: './popover.component.html',
  styleUrls: ['./popover.component.scss'],
})
export class PopoverComponent  implements OnInit {

  constructor(private auth: AuthService, public popoverController: PopoverController) { }

  ngOnInit() {}

  onSignOut() {
    console.log('On signing out')
    this.auth.logout()
    this.popoverController.dismiss()
  }

}
