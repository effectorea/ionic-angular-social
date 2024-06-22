import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {Observable} from "rxjs";
import {User} from "../../auth/models/user.model";
import {environment} from "../../../environments/environment";
import {FriendRequestInterface, FriendRequestStatus} from "../models/friendRequest";

@Injectable({
  providedIn: 'root'
})
export class ConnectionProfileService {

  friendRequests: FriendRequestInterface[];

  private httpOptions: { headers: HttpHeaders } = {
    headers: new HttpHeaders({'Content-Type': 'application/json'})
  }

  constructor(private http: HttpClient) {
  }

  getConnectionUser(id: number): Observable<User> {
    return this.http.get<User>(`${environment.baseApiUrl}/user/${id}`)
  }

  getFriendRequestStatus(id: number): Observable<FriendRequestStatus> {
    return this.http.get<FriendRequestStatus>(`${environment.baseApiUrl}/user/friend-request/status/${id}`)
  }

  addConnectionUser(id: number): Observable<FriendRequestInterface | { error: string }> {
    return this.http.post<FriendRequestInterface | { error: string }>(`${environment.baseApiUrl}/user/friend-request/send/${id}`,
      {}, this.httpOptions)
  }

  getFriendRequests(): Observable<FriendRequestInterface[]>{
    return this.http.get<FriendRequestInterface[]>(`${environment.baseApiUrl}/user/friend-request/me/received-requests`)
  }

  respondToFriendRequest(id: number, statusResponse: 'accepted' | 'declined'): Observable<FriendRequestInterface> {
    return this.http.put<FriendRequestInterface>(`${environment.baseApiUrl}/user/friend-request/response/${id}`,
      {
        status: statusResponse
      }, this.httpOptions)
  }

}
