import { Injectable } from '@angular/core';
import { Http,Headers } from '@angular/http';
import 'rxjs/add/operator/map';
import { Storage } from '@ionic/storage';
import {AuthService} from "../providers/auth";
import { MapModel } from '../shared/map.model'
import _ from 'lodash';
import * as geojsonBounds from 'geojson-bounds';
import { ToastController  } from 'ionic-angular'


@Injectable()
export class ProjectsServiceProvider {
  data:any;
 mapModel = new MapModel()
 toastinstance : any
  contentHeader = new Headers({'Content-Type': 'application/json'});
  constructor(public http: Http, public storage : Storage,private auth: AuthService,  public toastCtrl: ToastController) {

  }
  load(){
    if(this.data){
      return Promise.resolve(this.data);
    }

    return new Promise((resolve , reject) =>{
      //let headers = new Headers({});
      //this.contentHeader.append('Authorization', this.auth.AuthToken);
      //this.contentHeader.append('token', this.auth.AuthToken);
      //this.contentHeader.append('Cookie', 'ecoReleve-Core='+this.auth.AuthToken);
      //console.log(headers);
      //this.http.get('assets/data/projects.json')
      this.http.get('http://vps471185.ovh.net/ecoReleve-Core/projects/?criteria=%5B%5D&page=1&per_page=200&offset=0&order_by=%5B%5D&typeObj=1', { headers: this.contentHeader , withCredentials: true })
      .map(res => res.json())
      .subscribe(data => {
        this.data = data[1];
        for (let proj in this.data) {
            this.data[proj]['isLoaded'] = false;
        }
        resolve(this.data);
      },
      err => {
          //reject(err);
          resolve(null);
      });

    });


  }

  loadGeometry(id){

    return new Promise(resolve =>{
      //this.http.get('assets/data/projects.json')
      this.http.get('http://vps471185.ovh.net/ecoReleve-Core/projects/'+ id, { headers: this.contentHeader , withCredentials: true })
      .map(res => res.json())
      .subscribe(data => {
        //console.log('**** geo data data from ovh********');
        //console.log(data["poly"]);
        let geo = data["geom"];
        //console.log('passed in projects service');

        // Mise en cache des tuiles
        // get bounds for emprise
       /* var extent = geojsonBounds.extent(geo);
        this.mapModel.initialize();
        this.mapModel.downloadTiles(extent)*/
        this.getTiles(id, geo['geometry']);
        resolve(geo);
      });

    });
  }
  getProj(){

    return new Promise(resolve =>{
      this.storage.get('projects').then((data)=>{
       /* const myOrderedArray = _.orderBy(data, proj => proj.ID, ['desc'])
        console.log(myOrderedArray);*/
        resolve(data);
      });
    });
  }
  
  saveProject(proj){

    return new Promise(resolve =>{
    this.storage.get('projects').then((data)=>{
      let toStore ; 
      /*if(data != null){
        // some obs exisits

        // update existing obs
        if(proj.ID) {

          _.remove(data, function(prj) {
            return prj.ID == proj.ID;
        });



        }
        data.push(proj);
        toStore = data;
        //this.storage.set('projects', data);

      } else {
        // storage is empty
        let array = [];
        array.push(proj);
        toStore = array;
        //this.storage.set('projects', array);
      }
      */
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
                bbox['minLng'] = extent[0] - 0.02;
                bbox['minLat'] = extent[1] -0.02;
                bbox['maxLng'] = extent[2] + 0.01 ;
                bbox['maxLat'] = extent[3] + 0.01 ;
                console.log('minLng: ' + extent[0] + ",minLat: " + extent[1] + " ,maxLng : " +  extent[2] + " ,maxLat: " + extent[3])
                this.toastCreate();
                this.mapModel.downloadTiles(bbox,10,17).then(val =>{
                  this.toastDismisser();
                  this.toastinstance = this.toastCtrl.create({
                    message: 'Téléchargement réussi.',
                    duration: 3000,
                    position : 'top',
                    cssClass: "tuilesToastOk"
                  }).present();
                  this.storage.set('tilesLoadedForProj-'+id, true);
                }, error=> {
                  this.toastDismisser();
                  this.toastinstance = this.toastCtrl.create({
                    message: 'Erreur de téléchargement de tuiles carto.',
                    duration: 3000,
                    position : 'top',
                    cssClass: "tuilesToastError"
                  }).present();
                });
              }
          });
        }
      })
  }
  toastCreate(){
      this.toastinstance = this.toastCtrl.create({
        message: 'Téléchargement des tuiles carto en cours...',
        position : 'top'
        
      });
      this.toastinstance.present();
  }
    
  toastDismisser(){
      this.toastinstance.dismiss();
  }
}
