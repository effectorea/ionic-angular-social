import {Component, EventEmitter, Input, OnInit, Output, ViewChild} from '@angular/core';
import {ModalController} from "@ionic/angular";
import {NgForm, NgModel} from "@angular/forms";
import {Post} from "../../../models/Post";

@Component({
  selector: 'app-modal',
  templateUrl: './modal.component.html',
  styleUrls: ['./modal.component.scss'],
})
export class ModalComponent  implements OnInit {
  @Input() post?: Post;

  @ViewChild('form') form: NgForm

  constructor(public modalController: ModalController) { }

  ngOnInit() {
    console.log('Post in modal', this.post);
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

}
