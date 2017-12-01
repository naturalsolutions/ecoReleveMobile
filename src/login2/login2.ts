import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams,AlertController } from 'ionic-angular';
import { FormBuilder, FormGroup,Validators } from '@angular/forms';
import { ProjectsPage } from '../projects/projects';
//import {Headers, Http, RequestOptions} from "@angular/http";
//import {JwtHelper} from "angular2-jwt";
//import {Storage} from "@ionic/storage";
import {AuthService} from "../providers/auth";
//import {JsSHA} from "../../node_modules/jssha"
//import * as JsSHA from 'jssha';
import 'rxjs/add/operator/map';



@IonicPage({
  name : 'login2',
  segment : 'login2'
})
@Component({
  selector: 'page-login',
  templateUrl: 'login2.html',
 // providers : [AuthService
  //]
})
export class LoginPage2 {

  public formModel: FormGroup;
  /*private LOGIN_URL = "http://vps471185.ovh.net/portal/security/login";
  private checkuser_url = "http://vps471185.ovh.net/portal/checkUser";*/
  //private SIGNUP_URL = "http://localhost:3001/users";

  
  // When the page loads, we want the Login segment to be selected
  //authType: string = "login";
  // We need to set the content type for the server
  //contentHeader = new Headers({"Content-Type": "application/x-www-form-urlencoded; charset=UTF-8"});
  //error: string;
  //jwtHelper = new JwtHelper();
  //user: string;

  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams,
    private  builder: FormBuilder,
    // added to auth
    //private http: Http, private storage: Storage,
    private alertCtrl: AlertController,
    private auth: AuthService
  ) {

    
  }

  /*ionViewDidLoad() {
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
  }*/

  /*onSubmit(value) {
    this.navCtrl.push(ProjectsPage)
  }*/
  // added to implement login

//**********************************

  authenticate(credentials) {
    this.auth.checkuser(credentials).then(data =>{
      this.auth.login(data).then(data=>{
        this.navCtrl.setRoot(ProjectsPage);
      })
    });

  }
//****************************************************** */
  /*checkuser(credentials) {

    this.http.post(this.checkuser_url,  'login='+credentials.login, { headers: this.contentHeader })
    .map(res => res.json())
    .subscribe(
      data => {
        credentials.userId = data;
        this.login(credentials)

      },
      err => this.error = err
    );
  }
  login(credentials) {
    let password = credentials.password;
    let userId =  parseInt(credentials.userId);
    credentials.userId = userId;
    credentials.password = this.pwd(password);
    let strParams = 'userId='+userId+'&password='+this.pwd(password);
    let options = new RequestOptions({ headers: this.contentHeader, withCredentials: true });
    
    
    
    this.http.post(this.LOGIN_URL, strParams, options).toPromise()
    .then(response=>{
       console.log(response);
       let headers = response.headers;
       console.log(headers);
       this.navCtrl.setRoot(ProjectsPage)
    })
    .catch(err=>console.log(err));

  }

  signup(credentials) {
    this.http.post(this.SIGNUP_URL, JSON.stringify(credentials), { headers: this.contentHeader })
      .map(res => res.json())
      .subscribe(
        data => this.authSuccess(data.id_token),
        err => this.error = err
      );
  }

 /* logout() {
    this.storage.remove('token');
    this.user = null;
  }

  authSuccess(token) {
    this.error = null;
    this.storage.set('token', token);
    this.user = this.jwtHelper.decodeToken(token).username;
    this.storage.set('profile', this.user);
  }
  pwd(pwd) {
    
    pwd = window.btoa(decodeURI(decodeURIComponent( pwd )));
    var hashObj = new JsSHA('SHA-1', 'B64', 1);
    
    hashObj.update(pwd);
    pwd = hashObj.getHash('HEX');
    return pwd;
  }*/



}
