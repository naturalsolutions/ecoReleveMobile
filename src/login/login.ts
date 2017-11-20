import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { FormBuilder, FormGroup,Validators } from '@angular/forms';
import { ProjectsPage } from '../projects/projects';
import {Headers, Http} from "@angular/http";
import {JwtHelper} from "angular2-jwt";
import {Storage} from "@ionic/storage";
import {AuthService} from "../providers/auth";
import 'rxjs/add/operator/map';



@IonicPage({
  name : 'login',
  segment : 'login'
})
@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
})
export class LoginPage {

  public formModel: FormGroup;
  private LOGIN_URL = "http://localhost:3001/sessions/create";
  private SIGNUP_URL = "http://localhost:3001/users";

  auth: AuthService;
  // When the page loads, we want the Login segment to be selected
  authType: string = "login";
  // We need to set the content type for the server
  contentHeader = new Headers({"Content-Type": "application/json"});
  error: string;
  jwtHelper = new JwtHelper();
  user: string;

  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams,
    private  builder: FormBuilder,
    // added to auth
    private http: Http, private storage: Storage
  ) {
    /*this.auth = AuthService;
    
        storage.ready().then(() => {
          storage.get('profile').then(profile => {
            this.user = JSON.parse(profile);
          }).catch(console.log);
        });*/
  }

  ionViewDidLoad() {
    this.formModel = this.builder.group({
        'login': [
          //'', // default value
          //[Validators.required]
        ],
        'password': [
          // '',
          //[Validators.required]
        ]
    });
  }

  onSubmit(value) {
    this.navCtrl.push(ProjectsPage)
  }
  // added to implement login
  authenticate(credentials) {
    this.authType == 'login' ? this.login(credentials) : this.signup(credentials);
  }

  login(credentials) {
    this.http.post(this.LOGIN_URL, JSON.stringify(credentials), { headers: this.contentHeader })
      .map(res => res.json())
      .subscribe(
        data => this.authSuccess(data.id_token),
        err => this.error = err
      );
  }

  signup(credentials) {
    this.http.post(this.SIGNUP_URL, JSON.stringify(credentials), { headers: this.contentHeader })
      .map(res => res.json())
      .subscribe(
        data => this.authSuccess(data.id_token),
        err => this.error = err
      );
  }

  logout() {
    this.storage.remove('token');
    this.user = null;
  }

  authSuccess(token) {
    this.error = null;
    this.storage.set('token', token);
    this.user = this.jwtHelper.decodeToken(token).username;
    this.storage.set('profile', this.user);
  }

}
