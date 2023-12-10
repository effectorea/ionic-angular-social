import {Component, OnInit, ViewChild} from '@angular/core';
import {NgForm, NgModel} from "@angular/forms";

@Component({
  selector: 'app-auth',
  templateUrl: './auth.page.html',
  styleUrls: ['./auth.page.scss'],
})
export class AuthPage implements OnInit {
  @ViewChild('form') form: NgForm;

  submissionType: 'login' | 'join' = 'login';

  constructor() { }

  ngOnInit() {
  }

  onSubmit() {
    console.log(this.form.value);
    const { email, password } = this.form.value
    if (!email || !password) return

    if (this.submissionType === 'login') {
      console.log(1, 'handle login', email, password)
    } else if (this.submissionType === 'join') {
      const { firstName, lastName } = this.form.value
      if (!firstName || !lastName) return
      console.log(2, 'handle join', firstName, lastName, email, password)
    }

  }

  toggleText() {
    if (this.submissionType === 'login') {
      this.submissionType = 'join'
    } else if (this.submissionType === 'join') {
      this.submissionType = 'login'
    }
  }

}
