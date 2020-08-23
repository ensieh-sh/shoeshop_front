import {Component, OnInit} from '@angular/core';
import {SocialAuthService, SocialUser} from 'angularx-social-login';
import {responsemodel, UserService} from '../../services/user.service';
import {Router} from '@angular/router';
import {map} from 'rxjs/operators';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {
  myuser: any;


  constructor(private authService: SocialAuthService,
              private userService: UserService,
              private router: Router) {

  }

  ngOnInit(): void {
    this.userService.userdata$
      .pipe(
        map((user: SocialUser | responsemodel) => {
          if (user instanceof SocialUser || user.type === 'social') {
            return {
              ...user,

            };
          } else {
            return user;
          }
        })
      )
      .subscribe((data: responsemodel | SocialUser) => {
        this.myuser = data;
      });
  }

  logout() {
    this.userService.logout();
  }


}
