import { Component, OnInit } from '@angular/core';
import {BannerColorService} from "../../services/banner-color.service";
import {ConnectionProfileService} from "../../services/connection-profile.service";
import {ActivatedRoute} from "@angular/router";
import {take} from "rxjs";

@Component({
  selector: 'app-connection-profile',
  templateUrl: './connection-profile.component.html',
  styleUrls: ['./connection-profile.component.scss'],
})
export class ConnectionProfileComponent  implements OnInit {

  constructor(public bannerColorService: BannerColorService, private connectionProfileService: ConnectionProfileService, private route: ActivatedRoute) { }

  ngOnInit() {
    this.getUser()
  }

  getUser() {
    this.connectionProfileService.getConnectionUser(this.getUserIdFromUrl()).pipe(take(1)).subscribe((user) => {
      console.log('Connection user', user);
    })
  }

  private getUserIdFromUrl(): number {
    return +this.route.snapshot.paramMap.get('id')
  }

}
