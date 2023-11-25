import { Component, OnInit } from '@angular/core';
import {PopoverController, PopoverOptions} from "@ionic/angular";
import {PopoverComponent} from "./popover/popover.component";

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent  implements OnInit {

  constructor(public popoverController: PopoverController) { }

  ngOnInit() {}

  async showPopover(event: any) {
    console.log(event);
    const popover = await this.popoverController.create({
      component: PopoverComponent,
      cssClass: 'my-custom-class',
      event: event,
      showBackdrop: false
    } as PopoverOptions);
    await popover.present();
    const {role} = await popover.onDidDismiss()
    console.log(role);

  }

}
