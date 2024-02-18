import { Injectable } from '@angular/core';
import {NewUser} from "../models/newUser.model";
import {BehaviorSubject, catchError, from, map, Observable, of, switchMap, take, tap} from "rxjs";
import {Role, User} from "../models/user.model";
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {Router} from "@angular/router";
import {environment} from "../../../environments/environment";
import { Preferences } from '@capacitor/preferences';
import {UserResponse} from "../models/userResponse.model";
import {jwtDecode} from "jwt-decode";

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private user$ = new BehaviorSubject<User>(null)

  private httpOptions: { headers: HttpHeaders } = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json'
    })
  }

  get userStream(): Observable<User> {
    return this.user$.asObservable();
  }

  get userFullName(): Observable<string> {
    return this.user$.asObservable().pipe(
      switchMap((user: User) => {
        if (!user) return of(null)
        return of(`${user.firstName} ${user.lastName}`)
      })
    );
  }

  // get imageFullPath(): Observable<string> {
  //   return this.user$.asObservable().pipe(
  //     switchMap((user: User) => {
  //       if
  //     })
  //   )
  // }

  get isUserLoggedIn(): Observable<boolean> {
    return this.user$.asObservable().pipe(
      switchMap((user) => {
        const isUserAuthenticated = user !== null
        return of(isUserAuthenticated)
      })
    )
  }

  get userRole(): Observable<Role> {
    return this.user$.asObservable().pipe(
      switchMap((user: User) => {
        if (user) return of(user.role)
        if (!user) return of(null)
      })
    )
  }

  get userId(): Observable<number> {
    return this.user$.asObservable().pipe(
      switchMap((user: User) => {
        if (user) return of(user.id)
        if (!user) return of(null)
      })
    )
  }

  get userFullImagePath(): Observable<string> {
    return this.user$.asObservable().pipe(
      switchMap((user: User) => {
        const doesAuthorHaveImage = !!user?.imagePath
        let fullImagePath = this.getDefaultFullImagePath()
        if (doesAuthorHaveImage) {
          fullImagePath = this.getFullImagePath(user.imagePath)
        }
        return of(fullImagePath)
      })
    )
  }

  constructor(private http: HttpClient, private router: Router) { }

  getDefaultFullImagePath() {
    return `${environment.baseApiUrl}/feed/image/blank-user-image.jpg`
  }

  getFullImagePath(imageName: string) {
    return `${environment.baseApiUrl}/feed/image/${imageName}`
  }

  getUserImage() {
    return this.http.get(`${environment.baseApiUrl}/user/image`).pipe(take(1))
  }

  getUserImageName(): Observable<{ imageName: string }> {
    return this.http.get<{imageName: string}>(`${environment.baseApiUrl}/user/imageName`).pipe(take(1))
  }

  updateUserImagePath(imagePath: string): Observable<User> {
    return this.user$.pipe(
      take(1),
      map((user: User) => {
        user.imagePath = imagePath
        this.user$.next(user)
        return user
      })
    )
  }

  uploadUserImage(formData: FormData): Observable<{ modifiedFileName: string }> {
    return this.http.post<{ modifiedFileName: string }>(`${environment.baseApiUrl}/user/upload`, formData).pipe(
      take(1)
    )
  }

  register(newUser: NewUser): Observable<User> {
    return this.http.post<User>(`${environment.baseApiUrl}/auth/register`, newUser, this.httpOptions).pipe(
      take(1)
    )
  }

  login(email: string, password: string): Observable<{ token: string }> {
    return this.http.post<{token: string}>(`${environment.baseApiUrl}/auth/login`, {email, password}, this.httpOptions).pipe(
      take(1),
      tap((res: {token: string}) => {
        Preferences.set({
          key: 'token', value: res.token
        })
        const decodedToken: UserResponse = jwtDecode(res.token)
        console.log(decodedToken);
        this.user$.next(decodedToken.user)
      })
    )
  }

  isTokenInStorage(): Observable<boolean> {
    return from(Preferences.get({key: 'token'})).pipe(
      map((data: { value: string }) => {
        if (!data || !data.value) return null;

        const decodedToken: UserResponse = jwtDecode(data.value)
        console.log('Decoded token', decodedToken);
        const jwtExpirationInMsSinceUnixEpoch = decodedToken.exp * 1000;
        const isExpired = new Date() > new Date(jwtExpirationInMsSinceUnixEpoch)
        if (isExpired) return null;
        if (decodedToken.user) {
          this.user$.next(decodedToken.user)
          return true
        }
      })
    )
  }

  logout(): void {
    this.user$.next(null);
    Preferences.remove({key: 'token'}).then(() => this.router.navigateByUrl('/auth'))
  }
}
