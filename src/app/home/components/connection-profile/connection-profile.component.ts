import {Component, OnDestroy, OnInit} from '@angular/core';
import {BannerColorService} from "../../services/banner-color.service";
import {ConnectionProfileService} from "../../services/connection-profile.service";
import {ActivatedRoute, UrlSegment} from "@angular/router";
import {map, Observable, Subscription, switchMap, take, tap} from "rxjs";
import {User} from "../../../auth/models/user.model";
import {FriendRequest_Status, FriendRequestStatus} from "../../models/friendRequest";
import {environment} from "../../../../environments/environment";

@Component({
  selector: 'app-connection-profile',
  templateUrl: './connection-profile.component.html',
  styleUrls: ['./connection-profile.component.scss'],
})
export class ConnectionProfileComponent  implements OnInit, OnDestroy {

  user: User;
  friendRequestStatus: FriendRequest_Status;
  friendRequestStatusSubscription$: Subscription;
  userSubscription$: Subscription;

  constructor(public bannerColorService: BannerColorService, private connectionProfileService: ConnectionProfileService, private route: ActivatedRoute) { }

  ngOnInit() {
    this.friendRequestStatusSubscription$ = this.getFriendRequestStatus().pipe(
      tap((friendRequestStatus: FriendRequestStatus) => {
        this.friendRequestStatus = friendRequestStatus.status
        this.userSubscription$ = this.getUser().subscribe((user: User) => {
          this.user = user
          const imagePath = user.imagePath ?? 'blank-user-image.jpg'
          this.user['fullImagePath'] = `${environment.baseApiUrl}/feed/image/${imagePath}`
          console.log(22, this.user['fullImagePath']);
        })
      })
    ).subscribe()
  }

  getUser(): Observable<User> {
    return this.getUserIdFromUrl().pipe(
      switchMap((userId: number) => {
        return this.connectionProfileService.getConnectionUser(userId)
      })
    )
  }

  getFriendRequestStatus(): Observable<FriendRequestStatus> {
    return this.getUserIdFromUrl().pipe(
      switchMap((id: number) => {
        return this.connectionProfileService.getFriendRequestStatus(id)
      })
    )
  }

  private getUserIdFromUrl(): Observable<number> {
    return this.route.url.pipe(
      map((urlSegment: UrlSegment[]) => {
        return +urlSegment[0].path
      })
    )
  }

  ngOnDestroy() {
    this.userSubscription$.unsubscribe()
    this.friendRequestStatusSubscription$.unsubscribe()
  }

}
