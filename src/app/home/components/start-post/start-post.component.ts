import { Component, OnInit } from '@angular/core';
import {ModalController, ModalOptions} from "@ionic/angular";
import {ModalComponent} from "./modal/modal.component";

@Component({
  selector: 'app-start-post',
  templateUrl: './start-post.component.html',
  styleUrls: ['./start-post.component.scss'],
})
export class StartPostComponent  implements OnInit {

  constructor(public modalController: ModalController) { }

  ngOnInit() {

  }

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
