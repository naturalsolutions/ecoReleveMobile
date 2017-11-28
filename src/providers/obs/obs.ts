import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';
import { Storage } from '@ionic/storage';
import { AlertController } from 'ionic-angular';
import _ from 'lodash';


@Injectable()
export class ObsProvider {
    data:any;

  constructor(public http: Http, public storage : Storage,private alertCtrl: AlertController) {

  }

  getObs(projId){
    /*   this.storage.get('avifauneObs').then((data)=>{
    //// console.log('avifaune data');
    //  console.log(data)
    })*/

    /*if(this.data){
      return Promise.resolve(this.data);
    }*/
    this.data = null;
    return new Promise(resolve =>{
      this.storage.get('observations').then((data)=>{
        console.log('obs chargés');
        let projData = _.filter(data, function(obs) { 
          return obs.projId == projId; 
       });


        this.data = projData;
        console.log(projData);
        // order by date
        const myOrderedArray = _.orderBy(projData, obs => obs.dateObs, ['desc'])
        console.log(myOrderedArray);
        resolve(myOrderedArray);
      });

    });
  }
  getObsById(id){
    let obs = null;
    return new Promise(resolve =>{
      this.storage.get('observations').then((data)=>{
        //console.log('-data from storage')
        //console.log(data)
        for (obs of data) {
          //console.log('-- obs:')
          //console.log(obs)
            if(obs.id==id) {
              console.log('returned obs:')
              console.log(obs)
              resolve(obs);
            }
        }    
      });
    });
  }

  saveObsById(id, value){
    let obs = null;
    return new Promise(resolve =>{
      this.storage.get('observations').then((data)=>{
        //console.log('-data from storage')
        //console.log(data)
        let list = [];
        for (obs of data) {
          //console.log('-- obs:')
          //console.log(obs)
            if(obs.id==id) {
              obs = value;
              
            }
            list.push(obs);
        }
        this.storage.set('observations', list);
        resolve(1);  

      });
    });

  }

  getObsByProtocol(name:string){


  }
  saveObs(value){
    this.storage.get('observations').then((data)=>{
      if(data != null){
        // some obs exisits

        // update existing obs
        if(value.id) {
          // if obs exists remove it at update values
          data.splice(_.findIndex(data, function(item) {
          return item.id === value.id;
        }), 1);

        }
        else {
          // new obs, get max id + 1
          let maxId =  _.maxBy(data, function(o) {
          return o.id; });
          if(maxId){
            value.id = maxId.id + 1 ;
          } else {
            value.id = 1;
          }
          
        }
        data.push(value);
        this.storage.set('observations', data);
        console.log('****obs updated****')
        console.log(data)

      } else {
        // storage is empty
        let array = [];
        value.id = 1;
        array.push(value);
        this.storage.set('observations', array);
      }
    });

  }
  deleteObs(id){
    return new Promise(resolve =>{
    this.storage.get('observations').then((data)=>{
      if(data != null){
        if(id) {
          data.splice(_.findIndex(data, function(item) {
          return item.id === id;
        }), 1);
        }
        this.storage.set('observations', data).then((data) => {
            resolve(1);
        })
      }
    });
  })

  }
  deleteObsByProjIdList(list){
    return new Promise(resolve =>{
      this.storage.get('observations').then((data)=>{
        if(data != null){
          for(let i=0;i<list.length;i++) {
            for(let j=0;j<data.length;j++){
              if(data[j]['projId']== list[i]){
                data.splice(j, 1);
                j--;
              }
            }
          }
          this.storage.set('observations', data).then((data) => {
              resolve(1);
          })
        }
      })

    })


  }
  getLastObsId(data){
   let max =  _.maxBy(data, function(o) {
     console.log('--------calcul max---------')  
    return o.id; });
    console.log(max.id)
    return max.id || 0 ;
  }
  pushObs(obs){



    return new Promise((resolve,reject) => {
      var json = JSON.stringify(obs);
      /*

      {"station": {"Name":"test5",
             "StationDate":"21/02/2018",
             "LAT" : "35.00000",
             "LON": "10.5455",
             "FK_Project":10
            },
      "Comments":"this is a test",
      "type_name":"Mammo",
      "nom_vernaculaire":"lapin",
      "comportement": "chasse"
      }



      */
      var params =  obs;
      console.log(params)
      var headers = new Headers();
      headers.append('Content-Type', 'application/json');
      
      this.http.post('http://vps471185.ovh.net/ecoReleve-Core/protocols',
      params)
      .map(res => res.json())
      .subscribe(data => {
      this.data = data;
      resolve(this.data);
      },
      error => this.informAlert('Erreur d\'envoi', error),
      () => console.log("push obs Finished")
      );
      });

  }
  informAlert(tite, data){
    let alert = this.alertCtrl.create({
      title: tite,
      subTitle: data,
      buttons: ['Ok']
    });
    alert.present();
  }

}
