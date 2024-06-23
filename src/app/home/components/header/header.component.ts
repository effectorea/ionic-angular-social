import {Component, OnDestroy, OnInit} from '@angular/core';
import {PopoverController, PopoverOptions} from "@ionic/angular";
import {PopoverComponent} from "./popover/popover.component";
import {Subscription, take} from "rxjs";
import {AuthService} from "../../../auth/services/auth.service";
import {FriendRequestsPopoverComponent} from "./friend-requests-popover/friend-requests-popover.component";
import {FriendRequestInterface} from "../../models/friendRequest";
import {ConnectionProfileService} from "../../services/connection-profile.service";

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnInit, OnDestroy {
  userFullImagePath: string;
  private userImagePathSubscription: Subscription;

  private friendRequestsSubscription: Subscription;

  fullName: string = ''

  constructor(public popoverController: PopoverController, private authService: AuthService, public connectionProfileService: ConnectionProfileService) {
  }

  ngOnInit() {
    this.userImagePathSubscription = this.authService.userFullImagePath.subscribe((fullImagePath: string) => {
      this.userFullImagePath = fullImagePath
    })

    this.friendRequestsSubscription = this.connectionProfileService.getFriendRequests().subscribe((friendRequests: FriendRequestInterface[]) => {
      this.connectionProfileService.friendRequests =
        friendRequests.filter((friendRequest: FriendRequestInterface) => friendRequest.status === 'pending')
    })
    this.authService.userFullName.pipe(take(1)).subscribe((userFullName: string) => {
      this.fullName = userFullName
    })
  }

  async showPopover(event: any) {
    console.log(event);
    const popover = await this.popoverController.create({
      component: PopoverComponent,
      componentProps: {
        userFullImagePath: this.userFullImagePath,
        fullName: this.fullName
      },
      cssClass: 'my-custom-class',
      event: event,
      showBackdrop: false
    } as PopoverOptions);
    await popover.present();
    const {role} = await popover.onDidDismiss()
  }

  async showFriendRequestPopover(event: any) {
    const popover = await this.popoverController.create({
      component: FriendRequestsPopoverComponent,
      cssClass: 'my-custom-class',
      event: event,
      showBackdrop: false
    } as PopoverOptions);
    await popover.present();
    const {role} = await popover.onDidDismiss()
  }

  ngOnDestroy() {
    this.userImagePathSubscription.unsubscribe()
    this.friendRequestsSubscription.unsubscribe()
  }

}
