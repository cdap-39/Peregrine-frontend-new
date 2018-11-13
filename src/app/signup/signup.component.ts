import { Component, OnInit } from '@angular/core';
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {JwtHelper} from "angular2-jwt";
import {ApiService} from "../shared/api.service";
import {Router} from "@angular/router";

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent implements OnInit {

  private signUpForm: FormGroup;
  private sha512: any;
  private loading: string;
  private free: boolean = false;
  private completeSignUp: boolean = false;
  private failSingUp:boolean =  false;

  constructor(private  apiService: ApiService,private router: Router) {
     this.signUpForm = new FormGroup({
        username: new FormControl('', [Validators.required,Validators.email, Validators.minLength(6)]),
        firstName: new FormControl('', [Validators.required, Validators.minLength(2)]),
        lastName: new FormControl('', [Validators.required, Validators.minLength(2)]),
        password: new FormControl('', [Validators.required, Validators.minLength(8)]),
        age: new FormControl('', [Validators.required, Validators.minLength(1)]),
        re_password: new FormControl('', [Validators.required, Validators.minLength(8)]),
      });
  }

  ngOnInit() {
    this.sha512 = require('hash.js/lib/hash/sha/512');
  }
  public onSubmit(){
     console.log(this.signUpForm.valid)
    if(this.signUpForm.valid) {
      console.log(this.signUpForm);
      const user = {
        "username" : this.signUpForm.get('username').value.toString(),
        "password" : this.sha512().update(this.signUpForm.get('username').value + this.signUpForm.get('password').value).digest('hex'),
        "birthday" : this.signUpForm.get('age').value.toString(),
        "payment" : "Free Trail",
        "name" : this.signUpForm.get('firstName').value.toString()+' '+this.signUpForm.get('lastName').value.toString(),
      };
      this.apiService.post('http://localhost:5000/api/signup', user )
     .subscribe((data) => {
         console.log(data._body);
         this.loading = "";
         this.completeSignUp = true;
         this.failSingUp = false;
         // this.router.navigate(['/tool']);
      }, (err) => {
          console.log(err);
          this.loading = "";
          this.failSingUp = true;
          // this.EmptyCredential = true;
     });
    }
  }
  public freeTrail(){
      this.free = true;
  }
  public login(){
    this.router.navigate(['/login']);
  }
  public reset(){
     this.failSingUp = false;
  }
}
