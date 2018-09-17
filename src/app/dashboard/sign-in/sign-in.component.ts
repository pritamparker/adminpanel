import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { AuthenticationService } from '../../_services/authentication.service';
import { Router } from '@angular/router';
@Component({
  selector: 'app-sign-in',
  templateUrl: './sign-in.component.html',
  styleUrls: ['./sign-in.component.css']
})
export class SignInComponent implements OnInit {

  constructor(private __autheticationService: AuthenticationService, private __router: Router) { }

  ngOnInit() {
  }

  loginFormData(res: NgForm) {
    // call auth service no subscribe because all task on auth service  
    this.__autheticationService.login(res.value.username, res.value.password);
  }
}