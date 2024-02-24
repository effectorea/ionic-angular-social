import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {Post} from "../models/Post";
import {environment} from "../../../environments/environment";
import {take, tap} from "rxjs";
import {AuthService} from "../../auth/services/auth.service";

@Injectable({
  providedIn: 'root'
})
export class PostService {

  constructor(private http: HttpClient, private authService: AuthService) {
    this.authService.getUserImageName().pipe(
      take(1),
      tap(({imageName}) => {
        const defaultImagePath = 'blank-user-image.jpg'
        this.authService.updateUserImagePath(imageName || defaultImagePath).subscribe()
      })
    ).subscribe()
  }

  private httpOptions: { headers: HttpHeaders } = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json'})
  }

  getSelectedPosts(params: string) {
    return this.http.get<Post[]>(`${environment.baseApiUrl}/feed${params}`)
  }

  createPost(body: string) {
    return this.http.post<Post>(`${environment.baseApiUrl}/feed`, { body }, this.httpOptions).pipe(
      take(1)
    )
  }

  updatePost(postId: number, body: string) {
    return this.http.put(`${environment.baseApiUrl}/feed/${postId}`, { body }, this.httpOptions).pipe(
      take(1)
    )
  }

  deletePost(postId: number) {
    return this.http.delete(`${environment.baseApiUrl}/feed/${postId}`).pipe(
      take(1)
    )
  }
}
