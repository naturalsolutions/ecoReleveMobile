import { Injectable } from '@angular/core';
import { Http,Headers } from '@angular/http';
import 'rxjs/add/operator/map';
import { Storage } from '@ionic/storage';
import {AuthService} from "../providers/auth";
import { MapModel } from '../shared/map.model'
import _ from 'lodash';
import * as geojsonBounds from 'geojson-bounds';
import { ToastController  } from 'ionic-angular'
import {config }  from '../config';

@Injectable()
export class ProjectsServiceProvider {
  data:any;
 mapModel = new MapModel()
 toastinstance : any
 serverUrl : any
  contentHeader = new Headers({'Content-Type': 'application/json'});
  constructor(public http: Http, public storage : Storage,private auth: AuthService,  public toastCtrl: ToastController) {
    this.mapModel.parent = this;
  }
  load(){
    if(this.data){
      return Promise.resolve(this.data);
    }

    return new Promise((resolve , reject) =>{
      let url = config.serverUrl;
      url+= 'ecoReleve-Core/projects/?criteria=%5B%5D&page=1&per_page=200&offset=0&order_by=%5B%5D&typeObj=1';
      this.http.get(url, { headers: this.contentHeader , withCredentials: true })
      .map(res => res.json())
      .subscribe(data => {
        this.data = data[1];
        for (let proj in this.data) {
            this.data[proj]['isLoaded'] = false;
            this.data[proj]['isPushed'] = false;
        }
        this.data = _.sortBy(this.data, 'Name');
        resolve(this.data);
      },
      err => {
          //reject(err);
          // Manage authorization if application is killed 
          if(err.status == 403){
            this.auth.authorize(this.auth.AuthToken).then(data=>{
              if(data){
                this.load();
              }
            });
          }
          resolve(null);
      });

    });


  }

  loadGeometry(id){
    let url = config.serverUrl;
    url += 'ecoReleve-Core/projects/'+ id ;

    return new Promise(resolve =>{
      //this.http.get('assets/data/projects.json')
      this.http.get(url , { headers: this.contentHeader , withCredentials: true })
      .map(res => res.json())
      .subscribe(data => {
        if(data){
          let geo = data["geom"];
          if(geo) {
            this.getTiles(id, geo['geometry']);
            resolve(geo);
          } else {
            resolve(false);
          }
        }
        else {
          resolve(false);
        }


      });

    });
  }
  getProj(){

    return new Promise(resolve =>{
      this.storage.get('projects').then((data)=>{
        resolve(data);
      });
    });
  }

  getProjById(id){
    return new Promise(resolve =>{
      this.storage.get('projects').then((data)=>{
        for (let proj in data) {
          if(data[proj]['ID']==id) {
            resolve(data[proj])
          }
        }
      });
    });

  }
  
  saveProject(proj){

    return new Promise(resolve =>{
    this.storage.get('projects').then((data)=>{
      let toStore ; 
      let array = [];
      array.push(proj);
      toStore = array;

      this.storage.set('projects', toStore).then((data)=>{

        resolve(1);
      });
    });
  });
  }


  update(projects){
    this.storage.set('projects', projects).then((data)=>{
    });
  }
  getTiles(id, geo) {
    let folderName = 'tuilesProj-' + id;
    this.mapModel.initialize({'folder' : folderName })
      .then(() => {
         
        if(geo) {
          this.storage.get('tilesLoadedForProj-'+ id).then((data)=>{
              if(!data){
                var extent = geojsonBounds.extent(geo);
                console.log('extent');
                console.log(extent);
                let bbox = {}
                bbox['minLng'] = extent[0] - 0.005;
                bbox['minLat'] = extent[1] - 0.005;
                bbox['maxLng'] = extent[2] + 0.005;
                bbox['maxLat'] = extent[3] + 0.005;
                console.log('minLng: ' + extent[0] + ",minLat: " + extent[1] + " ,maxLng : " +  extent[2] + " ,maxLat: " + extent[3])
                this.storage.set('bboxProj-'+ id, bbox)
                this.downloadTiles(bbox,id)
              }
          });
        }
      })
  }
  toastCreate(){
      this.toastinstance = this.toastCtrl.create({
        message: 'Téléchargement des tuiles carto en cours...',
        position : 'top',
        duration: 5000
        
      });
      this.toastinstance.present();
  }
    
  toastDismisser(){
    if(this.toastinstance) {
      this.toastinstance.dismiss();
    }
  }
  downloadTiles(bbox,id, tilelayer=null){

    this.toastCreate();
    this.mapModel.downloadTiles(bbox,10,17,tilelayer).then(val =>{
    //this.toastDismisser();

    if(val) {
      this.toastinstance = this.toastCtrl.create({
        message: 'Téléchargement réussi.',
        duration: 3000,
        position : 'top',
        cssClass: "tuilesToastOk"
      }).present();
      this.storage.set('tilesLoadedForProj-'+id, true);

    } else {
      this.toastinstance = this.toastCtrl.create({
        message: 'Erreur de téléchargement de tuiles carto.',
        duration: 3000,
        position : 'top',
        cssClass: "tuilesToastError"
      }).present();

      this.storage.set('tilesToLoadForProj-'+id, bbox);

    }

    return(val)
    

  }, error=> {
    this.toastDismisser();
    this.toastinstance = this.toastCtrl.create({
      message: 'Erreur de téléchargement de tuiles carto.',
      duration: 3000,
      position : 'top',
      cssClass: "tuilesToastError"
    }).present();
    this.storage.set('tilesToLoadForProj-'+id, bbox);
    return 0
  });
}
}
