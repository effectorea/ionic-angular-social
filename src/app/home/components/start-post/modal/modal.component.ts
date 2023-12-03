import {Component, EventEmitter, OnInit, Output, ViewChild} from '@angular/core';
import {ModalController} from "@ionic/angular";
import {NgForm} from "@angular/forms";

@Component({
  selector: 'app-modal',
  templateUrl: './modal.component.html',
  styleUrls: ['./modal.component.scss'],
})
export class ModalComponent  implements OnInit {

  @ViewChild('form') form: NgForm

  constructor(public modalController: ModalController) { }

  ngOnInit() {}

  onPost() {
    if (!this.form.valid) return
    const body = this.form.value['body']
    this.modalController.dismiss({
      post: {
        body,
        createdAt: new Date()
      }
    }, 'post')

  }

  onDismiss() {
    this.modalController.dismiss(null, 'dismiss')
  }

}
