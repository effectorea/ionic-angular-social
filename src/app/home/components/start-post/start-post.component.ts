import {Component, EventEmitter, OnDestroy, OnInit, Output} from '@angular/core';
import {ModalController, ModalOptions} from "@ionic/angular";
import {ModalComponent} from "./modal/modal.component";
import {Subscription} from "rxjs";
import {AuthService} from "../../../auth/services/auth.service";

@Component({
  selector: 'app-start-post',
  templateUrl: './start-post.component.html',
  styleUrls: ['./start-post.component.scss'],
})
export class StartPostComponent  implements OnInit, OnDestroy {
  userFullImagePath: string;
  private userImagePathSubscription: Subscription;

  @Output() create: EventEmitter<any> = new EventEmitter();

  constructor(public modalController: ModalController, private authService: AuthService) { }

  ngOnInit() {
    this.userImagePathSubscription = this.authService.userFullImagePath.subscribe((fullImagePath: string) => {
      this.userFullImagePath = fullImagePath
    })
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

  ngOnDestroy() {
    this.userImagePathSubscription.unsubscribe()
  }


}
