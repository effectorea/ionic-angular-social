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

  constructor(private http: HttpClient, private router: Router) { }

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
