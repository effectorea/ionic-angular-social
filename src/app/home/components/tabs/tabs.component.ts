import { Component, OnInit } from '@angular/core';
import {ModalController, ModalOptions} from "@ionic/angular";
import {ModalComponent} from "../start-post/modal/modal.component";

@Component({
  selector: 'app-tabs',
  templateUrl: './tabs.component.html',
  styleUrls: ['./tabs.component.scss'],
})
export class TabsComponent  implements OnInit {

  constructor(public modalController: ModalController) { }

  ngOnInit() {}

  async openModal() {
    console.log();
    const modal = await this.modalController.create({
      component: ModalComponent,
      cssClass: 'my-second-custom'
    } as ModalOptions)
    await modal.present()
    const {role, data} = await modal.onDidDismiss()
    console.log(role, data);

  }

}
