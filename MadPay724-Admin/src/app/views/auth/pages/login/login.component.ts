import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from 'src/app/core/_services/auth/auth.service';
import { Store } from '@ngrx/store';

import * as fromStore from '../../../../store';



@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  model: any = {};
  returnUrl: any = '';
  constructor(private authService: AuthService, private router: Router,
    private alertService: ToastrService, private route: ActivatedRoute) { }

  ngOnInit() {
    this.model.isremember = true;
    this.model.granttype = 'password';
    this.route.queryParams.subscribe(params => this.returnUrl = params.return);
  }

  login() {
    this.authService.login(this.model).subscribe(next => {
      if (this.returnUrl === null || this.returnUrl === undefined) {
        this.returnUrl = this.authService.getDashboardUrl();
      }
      this.router.navigate([this.returnUrl]);
      this.alertService.success('با موفقیت وارد شدید', 'موفق');
    }, error => {
      this.alertService.error(error, 'خطا در ورود');
    });
  }

}
