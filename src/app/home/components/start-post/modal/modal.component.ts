import {Component, EventEmitter, Input, OnDestroy, OnInit, Output, ViewChild} from '@angular/core';
import {ModalController} from "@ionic/angular";
import {NgForm, NgModel} from "@angular/forms";
import {Post} from "../../../models/Post";
import {Subscription, take} from "rxjs";
import {AuthService} from "../../../../auth/services/auth.service";

@Component({
  selector: 'app-modal',
  templateUrl: './modal.component.html',
  styleUrls: ['./modal.component.scss'],
})
export class ModalComponent  implements OnInit, OnDestroy {
  @Input() post?: Post;
  userFullImagePath: string;
  private userImagePathSubscription: Subscription;
  fullName: string = ''

  @ViewChild('form') form: NgForm

  constructor(public modalController: ModalController, private authService: AuthService) { }

  ngOnInit() {
    console.log('Post in modal', this.post);
    this.authService.userFullName.pipe(take(1)).subscribe((userFullName: string) => {
      this.fullName = userFullName
    })
    this.userImagePathSubscription = this.authService.userFullImagePath.subscribe((fullImagePath: string) => {
      this.userFullImagePath = fullImagePath
    })
  }

  onPost() {
    if (!this.form.valid) return
    const body = this.form.value['body']
    this.modalController.dismiss({
      post: {
        body
      }
    }, 'post')
  }

  onDismiss() {
    this.modalController.dismiss(null, 'dismiss')
  }

  ngOnDestroy() {
    this.userImagePathSubscription.unsubscribe()
  }

}
