import {Component, OnInit} from '@angular/core';
import {PopoverController} from "@ionic/angular";
import {ConnectionProfileService} from "../../../services/connection-profile.service";
import {FriendRequestInterface} from "../../../models/friendRequest";
import {User} from "../../../../auth/models/user.model";
import {take, tap} from "rxjs";
import {environment} from "../../../../../environments/environment";

@Component({
  selector: 'app-friend-requests-popover',
  templateUrl: './friend-requests-popover.component.html',
  styleUrls: ['./friend-requests-popover.component.scss'],
})
export class FriendRequestsPopoverComponent implements OnInit {

  constructor(private popoverController: PopoverController, public connectionProfileService: ConnectionProfileService) {
  }

  ngOnInit() {
    this.connectionProfileService.friendRequests.map((friendRequest: FriendRequestInterface) => {
      const creatorId = (friendRequest as any).creator.id
      if (friendRequest && creatorId) {
        this.connectionProfileService.getConnectionUser(creatorId).pipe(
          take(1),
          tap((user: User) => {
            friendRequest['fullImagePath'] = `${environment.baseApiUrl}/feed/image/${user?.imagePath || 'blank-user-image.jpg'}`
          })
        ).subscribe(() => {
          console.log(this.connectionProfileService.friendRequests);
        })
      }
    })
  }

  async respondToFriendRequest(id: number, statusResponse: 'accepted' | 'declined') {
    const handledFriendRequest: FriendRequestInterface =
      this.connectionProfileService.friendRequests.find((friendRequest) => friendRequest.id === id)
    this.connectionProfileService.friendRequests = this.connectionProfileService.friendRequests.filter((friendRequest) => friendRequest.id !== handledFriendRequest.id)
    if (this.connectionProfileService?.friendRequests.length === 0) {
      await this.popoverController.dismiss()
    }
    return this.connectionProfileService.respondToFriendRequest(id, statusResponse).pipe(
      take(1)
    ).subscribe()
  }

}
