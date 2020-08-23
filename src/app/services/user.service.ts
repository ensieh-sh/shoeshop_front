import {Injectable} from '@angular/core';
import {GoogleLoginProvider, SocialAuthService, SocialUser} from 'angularx-social-login';
import {HttpClient} from '@angular/common/http';
import {environment} from '../../environments/environment';
import {BehaviorSubject, Observable} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  auth = false;
  private SERVER_URL = environment.SERVER_URL;
  private user;
  loginmessage$ = new BehaviorSubject<string>(null);
  authstate$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(this.auth);
  userdata$: BehaviorSubject<SocialUser | responsemodel> = new BehaviorSubject<SocialUser | responsemodel>(null);
  userRole: number;



  constructor(private  authService: SocialAuthService,
              private httpClient: HttpClient) {
    authService.authState.subscribe((user: SocialUser) => {
      if (user != null) {
        this.httpClient.get(`${this.SERVER_URL}/users/validate/${user.email}`).subscribe((res: { status: boolean, user: object }) => {
          //  No user exists in database with Social Login
          if (!res.status) {
            // Send data to backend to register the user in database so that the user can place orders against his user id
            this.registeruser({
              email: user.email,
              fname: user.firstName,
              lname: user.lastName,
              password: '123456'
            }, user.photoUrl, 'social').subscribe(response => {
              if (response.message === 'Registration successful') {
                this.auth = true;
                this.userRole = 555;
                this.authstate$.next(this.auth);
                this.userdata$.next(user);
              }
            });

          } else {
            this.auth = true;
            // @ts-ignore
            this.userRole = res.user.role;
            this.authstate$.next(this.auth);
            // @ts-ignore
            this.userdata$.next(res.user);
            console.log(this.userdata$);
          }
        });

      }
    });
  }


// login with email and password
  loginuser(email: string, password: string) {
    this.httpClient.post(this.SERVER_URL + '/auth/login', {email, password})
      .subscribe((data: responsemodel) => {
        this.auth = data.auth;
        this.authstate$.next(this.auth);
        this.userdata$.next(data);
        console.log(this.userdata$.getValue());
      });
  }

  // google authentication
  googlelogin() {
    this.authService.signIn(GoogleLoginProvider.PROVIDER_ID);
  }

  //  logout
  logout() {
    this.authService.signOut();
    this.auth = false;
    this.authstate$.next(this.auth);
    // this.userdata$.next(null);
  }
  registeruser(formData: any, photoUrl?: string, typeOfUser?: string): Observable<{ message: string }> {
    const {fname, lname, email, password} = formData;
    console.log(formData);
    return this.httpClient.post<{ message: string }>(this.SERVER_URL + '/auth/register', {
      email,
      lname,
      fname,
      typeOfUser,
      password,
      photoUrl: photoUrl || null
    });
  }

}


// tslint:disable-next-line:class-name
export interface responsemodel {
  token: string;
  auth: boolean;
  email: string;
  username: string;
  fname: string;
  lname: string;
  photoUrl: string;
  userid: number;
  type: string;
  role: number;
}

