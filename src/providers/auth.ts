import {Injectable, Inject} from '@angular/core';
import {Http, Headers,RequestOptions} from '@angular/http';
import { AlertController } from 'ionic-angular';
import {Storage} from "@ionic/storage";
import {JwtHelper} from "angular2-jwt";
import * as JsSHA from 'jssha';
import 'rxjs/add/operator/map';



@Injectable()

export class AuthService {
  isLoggedin: boolean;
  AuthToken;
  contentHeader = new Headers({"Content-Type": "application/x-www-form-urlencoded; charset=UTF-8"});
  error: string;
  jwtHelper = new JwtHelper();

  private LOGIN_URL = "http://vps471185.ovh.net/portal/security/login";
  private checkuser_url = "http://vps471185.ovh.net/portal/checkUser";

  
  constructor(public http: Http,private storage: Storage, private alertCtrl: AlertController) {
      this.http = http;
      this.isLoggedin = false;
      this.AuthToken = null;
  }
  
  storeUserCredentials(token) {
      //window.localStorage.setItem('token', token);
      this.storage.set('token', token);
      this.useCredentials(token);
      
  }
  
  useCredentials(token) {

      if(token) {
        this.isLoggedin = true;
        this.AuthToken = token;
      } 
      return  this.isLoggedin;
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
  
          },
          err => {
            this.alertError();
            resolve(false);
          }
        );
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
            this.alertError();
            resolve(false);

          }
        );
          
        });
      }
  
  authenticate(user) {
      var creds = "name=" + user.name + "&password=" + user.password;
      var headers = new Headers();
      headers.append('Content-Type', 'application/x-www-form-urlencoded');
      
      return new Promise(resolve => {
          this.http.post('http://localhost:3333/authenticate', creds, {headers: headers}).subscribe(data => {
              if(data.json().success){
                  this.storeUserCredentials(data.json().token);
                  resolve(true);
              }
              else
                  resolve(false);
          });
      });
  }
  alertError(){
    let alert = this.alertCtrl.create({
      title: "Erreur d'authentification",
      message: "L'authentification' a échoué. Merci de vérifier votre connexion internet et/ou de contacter l'administrateur.",
      buttons: [
        {
          text: 'OK'
        }
      ]
    });
  }
  /*adduser(user) {
      var creds = "name=" + user.name + "&password=" + user.password;
      var headers = new Headers();
      headers.append('Content-Type', 'application/x-www-form-urlencoded');
      
      return new Promise(resolve => {
          this.http.post('http://localhost:3333/adduser', creds, {headers: headers}).subscribe(data => {
              if(data.json().success){
                  resolve(true);
              }
              else
                  resolve(false);
          });
      });
  }
  
  getinfo() {
      return new Promise(resolve => {
          var headers = new Headers();
          this.loadUserCredentials();
          console.log(this.AuthToken);
          headers.append('Authorization', 'Bearer ' +this.AuthToken);
          this.http.get('http://localhost:3333/getinfo', {headers: headers}).subscribe(data => {
              if(data.json().success)
                  resolve(data.json());
              else
                  resolve(false);
          });
      })
  }*/
  
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