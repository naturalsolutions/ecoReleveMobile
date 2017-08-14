import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';
import { Storage } from '@ionic/storage';
import _ from 'lodash';


@Injectable()
export class ObsProvider {
    data:any;

  constructor(public http: Http, public storage : Storage) {

  }

  getObs(){
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
        this.data = data;
        console.log(data);
        // order by date
        const myOrderedArray = _.orderBy(data, obs => obs.dateObs, ['desc'])
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
          value.id = maxId.id + 1 ;
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
  getLastObsId(data){
   let max =  _.maxBy(data, function(o) {
     console.log('--------calcul max---------')  
    return o.id; });
    console.log(max.id)
    return max.id || 0 ;
  }

}
