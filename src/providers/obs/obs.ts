import { Injectable } from '@angular/core';
import { Http,RequestOptions,Headers } from '@angular/http';
import 'rxjs/add/operator/map';
import { Storage } from '@ionic/storage';
import { AlertController } from 'ionic-angular';
import _ from 'lodash';
import { File } from '@ionic-native/file';
import { Guid } from "guid-typescript";

@Injectable()
export class ObsProvider {
    data:any;
    serverUrl : any;

  constructor(public http: Http, public storage : Storage,private alertCtrl: AlertController
    ,private file: File
    ) {
    this.storage.get('serverUrl').then((data)=>{
      if(data) {
        this.serverUrl = data;
      } else {
        setTimeout(() => {
          this.storage.get('serverUrl').then((data)=>{
            this.serverUrl = data;
          });
        }, 2000);
      }
    });
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
        this.storage.set('observations', list).then(result => {
          resolve(1);
        });

      });
    });

  }
  saveObsList(listToUpate){
    //let obs = null;
    return new Promise(resolve =>{
      this.storage.get('observations').then((data)=>{
        //console.log('-data from storage')
        //console.log(data)
        let list = [];
        let ln = data.length;

        for (let i=0; i<ln ; i++){
          let obs  = data[i];
          for (var k=0;k<listToUpate.length;k++){
            var idObs = listToUpate[k].id;
            var value = listToUpate[k].value;
            if(obs.id==idObs) {
              obs.pushed = true;
              obs.serverId = value.serverId;
              //list.push(obs);
              break;
            }
            
        }


        }


          this.storage.set('observations', data);

          resolve(1)
   
        
      });
    });

  }

  getObsByProtocol(name:string){


  }
  saveObs(value){
    this.storage.get('observations').then((data)=>{
      let guid
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

          guid = Guid.create(); 
          console.log(guid);
          value.id = guid['value'];

          /*

          // new obs, get max id + 1
          let maxId =  _.maxBy(data, function(o) {
          return o.id; });
          if(maxId){
            value.id = maxId.id + 1 ;
          } else {
            value.id = 1;
          }

          */
          
        }
        data.push(value);
        this.storage.set('observations', data);
        console.log('****obs updated****')
        console.log(data)
        //backup obs in csv file
        //this.backupData(data)

      } else {
        // storage is empty
        let array = [];
        guid = Guid.create(); 
        value.id = guid['value'];
        array.push(value);
        this.storage.set('observations', array);
        //backup obs in csv file
        //this.backupData(array)
        
      }
      this.backupObs(value)

      
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
        } else {
          resolve(1);
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
    let url = this.serverUrl;



    return new Promise((resolve,reject) => {
      var jsonData = JSON.stringify(obs);

      var contentHeader = new Headers();
      contentHeader.append('Content-Type', 'application/json');
      //contentHeader.append('Cookie', 'ecoReleve-Core='+this.auth.AuthToken);
      let options = new RequestOptions({ headers: contentHeader,  withCredentials: true });
      
      this.http.post(url +'ecoReleve-Core/protocols', jsonData, options  )
      .map(res => res.json())
      .subscribe(data => {
      this.data = data;
      resolve(data);
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

  getObsByProto(){



  }
  backupObs(value){
    let line
    let protocol = value['protocole']
    // check if backup file exists
    let fileName = protocol + ".csv"
    let path = this.file.externalRootDirectory + '/download/'; // for Android
    //let path = this.file.dataDirectory ; // for Android
    let txt;
    this.file.checkFile(path, fileName).then(
      (file) => {
        // file exists, read file , add a line , write in new file
        console.log("file found" )
        this.generateLineContent(value, protocol).then( data => {
          line = data
          this.file.readAsText(path, fileName).then(text => {
                txt = text +  line   
    
            }).then(x => {
    
              this.file.writeFile(path, fileName, txt, { replace: true })
              .then((stuff) => {
                if (stuff != null) {
                    console.log ('line added to ' + protocol + '.csv')
                } else return Promise.reject('write file')
              }, function(err) {
                console.log("ERROR");
              })
    
            }).catch(err => {});

          })

        
      }
    ).catch(
      (err) => {
        console.log("file not found ")
        // file don't exist, generate it
        // generate header
        let csv
        let header = this.generateHeader(value,protocol)
        this.generateLineContent(value,protocol).then(data => {
          csv = data
          let content = header+ csv
          this.file.writeFile(path, fileName, content, { replace: true })
          .then((stuff) => {
            if (stuff != null) {
               console.log ('line added to ' + protocol + '.csv')
            } else return Promise.reject('write file')
          }, function(err) {
            console.log("ERROR");
          })

        })
      
      }
      );

  }
  backupData(array){
    let objCsv = {}  // final structure : {'proto1 : [obslist], 'proto2' : [obslist] ....}
    for (var i = 0; i < array.length; i++) {
      let obs = array[i]
      let protocol = obs['protocole']
      if ( ! objCsv[protocol]) {
        objCsv[protocol] = []
      }
     
        objCsv[protocol].push(obs)
      

      
    }

    console.log(' to backup ********')
    console.log(objCsv)
    this.convertToCSV(objCsv)


  }
  
  convertToCSV(obj) {

    /*let sortedKeys = this.getSortedKeyForObject(obj)
    let ln = sortedKeys.length

    for (let i = 0; i<ln ; i++ ) {
      let property = sortedKeys[i]
      let csv: any = ''
      let line: any = ''
      let dataProtocol= obj[property];   // array of observations for this proto
      // generate header
      let obs = dataProtocol[0]
      let header = this.generateHeader(obs)

      // generate csv content
      let csvContent = this.generateCsvContent(dataProtocol)
      
      csv = header  + '\r\n' + csvContent 
      this.saveFile(csv, property)


    }*/



   /* for (var property in obj) {
      let csv: any = ''
      let line: any = ''
      let dataProtocol= obj[property];   // array of observations for this proto
      // generate header
      let obs = dataProtocol[0]
      let header = this.generateHeader(obs,protocol)

      // generate csv content
      let csvContent = this.generateCsvContent(dataProtocol)
      
      csv = header  + '\r\n' + csvContent 
      this.saveFile(csv, property)

    }*/

  }

  generateHeader(obs,protocol) {
    
    let line: any = ''
    // get columns names in a array and order it asc 
    let sortedKeys = this.getSortedKeyForObject(obs)
    let ln = sortedKeys.length

    for (let i = 0; i<ln ; i++ ) {
      let property = sortedKeys[i]
      if (line != '') line += ';'
      line += property

    }
    let storageKeyName = protocol + '_csv'
    this.storage.set(storageKeyName, line)  
    line = line +  '\r\n'


    return line

  }
  getSortedKeyForObject(obj) {
    let arrayColumns = []
    for (var property in obj) {
      arrayColumns.push(property)
    }
  
    return arrayColumns.sort();

  }

  generateCsvContent(dataProtocol){
    let csv: any = ''
    let len = dataProtocol.length
    for (var i = 0; i < len; i++) {
      let obs = dataProtocol[i]
       let line = ''
       let sortedKeys = this.getSortedKeyForObject(obs)
       let ln = sortedKeys.length
       for (let j = 0; j<ln ; j++ ) {
        let property = sortedKeys[j]
        if (line != '') line += ';'
        line += obs[property]
  
      }

      csv += line + '\r\n'
    }

    return csv

  }
  generateLineContent(value,protocol){

    return new Promise(resolve =>{
      let line: any = ''
      let storageKeyName = protocol + '_csv'
      this.storage.get(storageKeyName).then((data)=>{
        let columns = data.split(';')
        let ln = columns.length
  
        for (let i = 0; i<ln ; i++ ) {
          let property = columns[i]
          if (line != '') line += ';'
          if(property=="dateObs") {
            let date = value[property]
            let dt = this.setDateFormat(date)
            line += dt
          } else {
            line += value[property] || ' '
          }
        }
  
        line = line + '\r\n'
  
      resolve (line)
  
      }); 

    });



  }
  setDateFormat(date){
    let dt = new Date(date)
    return dt.toLocaleString()
  }
  saveFile(body, protocol) {
    let fileName = protocol + ".csv"
    let path = this.file.externalRootDirectory + '/Download/'; // for Android

    this.file.writeFile(path, fileName, body, { replace: true })
      .then((stuff) => {
        if (stuff != null) {
          //this.socialshare.share('CSV file export', 'CSV export', stuff['nativeURL'], '');
        } else return Promise.reject('write file')
      })

  }

  

}
