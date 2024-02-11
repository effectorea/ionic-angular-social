import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {ModalController, ModalOptions} from "@ionic/angular";
import {ModalComponent} from "./modal/modal.component";

@Component({
  selector: 'app-start-post',
  templateUrl: './start-post.component.html',
  styleUrls: ['./start-post.component.scss'],
})
export class StartPostComponent  implements OnInit {

  @Output() create: EventEmitter<any> = new EventEmitter();

  constructor(public modalController: ModalController) { }

  ngOnInit() {

  }

  async openModal() {
    console.log('CREATE POST');
    const modal = await this.modalController.create({
      component: ModalComponent,
      cssClass: 'my-second-custom'
    } as ModalOptions)
    await modal.present()
    const {data} = await modal.onDidDismiss()
    if (!data) return
    this.create.emit(data.post.body)
  }



}
