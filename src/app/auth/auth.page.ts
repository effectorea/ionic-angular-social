import {Component, OnInit, ViewChild} from '@angular/core';
import {NgForm} from "@angular/forms";
import {AuthService} from "./services/auth.service";
import {NewUser} from "./models/newUser.model";
import {Router} from "@angular/router";

@Component({
  selector: 'app-auth',
  templateUrl: './auth.page.html',
  styleUrls: ['./auth.page.scss'],
})
export class AuthPage implements OnInit {
  @ViewChild('form') form: NgForm;

  submissionType: 'login' | 'join' = 'login';

  constructor(private authService: AuthService, private router: Router) { }

  ngOnInit() {}

  onSubmit(): any {
    const { email, password } = this.form.value
    if (!email || !password) return

    if (this.submissionType === 'login') {
      console.log(1, 'handle login', email, password)
      return this.authService.login(email, password).subscribe((token) => {
        this.router.navigateByUrl('/')
        if (token) console.log('This is a token', token);
        if (!token) console.log('NO TOKEN >>>>');

      })
    } else if (this.submissionType === 'join') {
      const { firstName, lastName } = this.form.value
      if (!firstName || !lastName) return
      const newUser: NewUser = {firstName, lastName, email, password}
      return this.authService.register(newUser).subscribe((res) => {
        console.log('This is a user', res);
        this.toggleText()
      })
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
