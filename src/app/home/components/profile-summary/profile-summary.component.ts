import {Component, OnDestroy, OnInit} from '@angular/core';
import {AuthService} from "../../../auth/services/auth.service";
import {Observable, Subscription, take} from "rxjs";
import {Role} from "../../../auth/models/user.model";
import {gitBranch} from "ionicons/icons";

type BannerColors = {
  colorOne: string
  colorTwo: string
  colorThree: string
}

@Component({
  selector: 'app-profile-summary',
  templateUrl: './profile-summary.component.html',
  styleUrls: ['./profile-summary.component.scss'],
})
export class ProfileSummaryComponent  implements OnInit, OnDestroy {
  bannerColors: BannerColors = {
    colorOne: '#a0b4b7',
    colorTwo: '#dbe7e9',
    colorThree: '#bfd3d6',
  }

  obs$: Subscription;

  constructor(private authService: AuthService) { }

  ngOnInit() {
    this.obs$ = this.authService.userRole.subscribe((role: Role) => {
      console.log('ROLE IS HERE >>>', role);
      this.bannerColors = this.getBannerColors(role)
    })
  }

  private getBannerColors(role: Role): BannerColors {
    switch (role) {
      case "admin":
        return {
          colorOne: '#daa520',
          colorTwo: '#f0e68c',
          colorThree: '#fafad2',
        }
      case "premium":
        return {
          colorOne: '#bc8f8f',
          colorTwo: '#c09999',
          colorThree: '#ddadaf',
        }
      default:
        return this.bannerColors
    }
  }

  ngOnDestroy() {
    this.obs$.unsubscribe()
  }

}
