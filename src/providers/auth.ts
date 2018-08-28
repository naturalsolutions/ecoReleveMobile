import {Injectable} from '@angular/core';
import {Http, Headers,RequestOptions} from '@angular/http';
import { AlertController } from 'ionic-angular';
import {Storage} from "@ionic/storage";
import {JwtHelper} from "angular2-jwt";
import * as JsSHA from 'jssha';
import 'rxjs/add/operator/map';
import {config }  from '../config';



@Injectable()

export class AuthService {
  isLoggedin: boolean;
  AuthToken;
  contentHeader = new Headers({"Content-Type": "application/x-www-form-urlencoded; charset=UTF-8"});
  error: string;
  jwtHelper = new JwtHelper();

  private LOGIN_URL = config.serverUrl +    "portal/security/login";
  private checkuser_url = config.serverUrl +  "portal/checkUser";
  private authorizeUrl = config.serverUrl + "portal/authorize";

  
  constructor(public http: Http,private storage: Storage, private alertCtrl: AlertController) {
      this.http = http;
      this.isLoggedin = false;
      this.AuthToken = null;
  }
  
  storeUserCredentials(token) {
      //window.localStorage.setItem('token', token);
      this.storage.set('token', token);
      this.isLoggedin = true;
      this.AuthToken = token;
     // this.useCredentials(token);
      
  }
  
  useCredentials(token) {

      if(token) {
            this.isLoggedin = true;
            this.AuthToken = token;
        } else {
                this.isLoggedin = false;
        }

          return this.isLoggedin;
  }
 /* useCredentials(token) {
    
          if(token) {
              this.authorize(token).then(data => {
                if(data) {
                    this.isLoggedin = true;
                    this.AuthToken = token;
                } else {
                    this.isLoggedin = false;
                }
                return this.isLoggedin;
    
              });
          } else {
              return false;
          }
  }*/
  authorize(token){
     // let contentHeader = new Headers({"Content-Type": "application/x-www-form-urlencoded; charset=UTF-8"});
    let options = new RequestOptions({ headers: this.contentHeader, withCredentials: true });
    return new Promise(resolve => {
        this.http.post(this.authorizeUrl,  'token=' + token, options)
        .map(res => res.json())
        .subscribe(
          data => {
            this.isLoggedin = true;
            this.AuthToken = token;
            resolve(true);
  
          },
          err => {
            this.alertError("Erreur d'authentification","Merci de vérifier votre login et/ou mot de passe");
            resolve(false);
          }
        );
    });
  }
  
  loadUserCredentials() {
      //var token = this.storage.get('token');
      return new Promise(resolve => {  
      this.storage.get('token')
      .then(
          (value) => { 
              resolve(this.useCredentials(value));
            },
          (error) => { 
              resolve (false); 
        }
       );
      //return this.useCredentials(token);
    });
  }
  
  destroyUserCredentials() {
      this.isLoggedin = false;
      this.AuthToken = null;
      this.storage.remove('token');
      //window.localStorage.clear();
  }
  checkuser(credentials) {
    return new Promise(resolve => {
        this.http.post(this.checkuser_url,  'login='+credentials.login, { headers: this.contentHeader })
        .map(res => res.json())
        .subscribe(
          data => {
            credentials.userId = data;
            resolve(credentials);
  
          }
        ),
        err=> {
          //reject(err);
          // Manage authorization if application is killed 
          if(err.status == 401){
            this.alertError("Erreur d'authentification","Merci de vérifier votre login et/ou mot de passe")
          }
          resolve(null);
      }
    });
  }
  login(credentials) {
    return new Promise(resolve => {
        let password = credentials.password;
        let userId =  parseInt(credentials.userId);
        credentials.userId = userId;
        credentials.password = this.pwd(password);
        let strParams = 'userId='+userId+'&password='+this.pwd(password);
        let options = new RequestOptions({ headers: this.contentHeader, withCredentials: true });
        
        
        
        this.http.post(this.LOGIN_URL, strParams, options)
        .map(res => res.json())
        .subscribe(
          data => {
            this.storeUserCredentials(data.token);
            resolve(data);
            //this.login(credentials)
    
          },
          err => {
            this.alertError("Erreur d'authentification", "L'authentification' a échoué. Merci de vérifier votre connexion internet et/ou de contacter l'administrateur.");
            resolve(false);

          }
        );
          
        });
      }
  
  alertError(title, message){
    this.alertCtrl.create({
      title: title,
      message: message,
      buttons: [
        {
          text: 'OK'
        }
      ]
    });
  }
  
  logout() {
      this.destroyUserCredentials();
  }
  pwd(pwd) {
    
    pwd = window.btoa(decodeURI(decodeURIComponent( pwd )));
    var hashObj = new JsSHA('SHA-1', 'B64', 1);
    
    hashObj.update(pwd);
    pwd = hashObj.getHash('HEX');
    return pwd;
  }
}