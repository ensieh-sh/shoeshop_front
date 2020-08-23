import {Component, OnInit} from '@angular/core';
import {SocialAuthService} from 'angularx-social-login';
import {ActivatedRoute, Router} from '@angular/router';
import {UserService} from '../../services/user.service';
import {NgForm} from '@angular/forms';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  email: string;
  password: string;
  loginmessage: string;
  userRole: number;


  constructor(private authService: SocialAuthService,
              private router: Router,
              private userService: UserService,
              private route: ActivatedRoute) {
  }

  ngOnInit(): void {
    this.userService.authstate$.subscribe(authstate => {
      if (authstate) {
        this.router.navigateByUrl(this.route.snapshot.queryParams.returnurl || '/profile');
      } else {
        this.router.navigateByUrl('/login');
      }
    });
  }

  signinwithgoogle() {
    this.userService.googlelogin();
  }

  login(form: NgForm) {
    const email = this.email;
    const password = this.password;
    if (form.invalid) {
      return;
    }

    form.reset();
    this.userService.loginuser(email, password);
    this.userService.loginmessage$.subscribe(msg => {
      this.loginmessage = msg;
      setTimeout(() => {
        this.loginmessage = '';
      }, 2000);
    });


  }

}
