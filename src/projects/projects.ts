import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController } from 'ionic-angular';
import {ProjectsServiceProvider} from '../providers/projects-service';
import {ObsProvider} from '../providers/obs/obs'
import { ObservationsPage } from '../observations/observations';
import _ from 'lodash';
import 'rxjs/add/observable/forkJoin';
import * as moment from 'moment';


@IonicPage()
@Component({
  selector: 'page-projects',
  templateUrl: 'projects.html',
    providers : [ProjectsServiceProvider
    ]
})
export class ProjectsPage {

  projects : any;
  loadedProjects : any;
  checkproj :any;
  projectsSegment: string= 'myproj';
  disabled:any = 'disabled';
  myProjdisabled:any = 'disabled';
  syncdisabled:any = 'disabled';
  displayMyProjs : boolean = false;

  constructor(public navCtrl: NavController, public navParams: NavParams, 
    public projectsService : ProjectsServiceProvider, private alertCtrl: AlertController,
    public data : ObsProvider
  ) {

  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ProjectsPage');
    this.loadProjects();
    console.log(this.navCtrl)
  }

  loadProjects (){

    /*
    // projects from server
    var p1 = new Promise((resolve, reject) => {
      this.projectsService.load()
      .then(data =>{
        this.projects = data;
        return Promise.resolve(1);
  
      })
    });
    // local projects
    var p2 = new Promise((resolve, reject) => {
      this.projectsService.getProj().then(data =>{
        
              this.loadedProjects = data;
              if(!this.loadedProjects) {
                this.projectsSegment = 'allproj';
                this.displayMyProjs = false;
                this.myProjdisabled = false;
              } else {
                this.displayMyProjs = true;
              }
              return Promise.resolve(1);
      })
    });

    var source = Rx.Observable.forkJoin(
      p1,
      p2
    );
    
    var subscription = source.subscribe(
      function (x) {
          for (let serverProj in this.projects) {
            for (let localProj in this.projects) {
              if(serverProj['ID'] == localProj['ID']){
                serverProj['isLoaded'] = true;
              }
            }
        }
        console.log('loaded from server :');
        console.log(this.projects);
      },
      function (err) {
        console.log('Error: %s', err);
      },
      function () {
        console.log('Completed');
      });
    
    */
    /*
      this.projectsService.getProj().then(data =>{
        
              this.loadedProjects = data;
              if(!this.loadedProjects) {
                this.projectsSegment = 'allproj';
                this.displayMyProjs = false;
                this.myProjdisabled = false;
              } else {
                this.displayMyProjs = true;
              }
              return Promise.resolve(this.loadedProjects);
      })
      .then( res => {
        this.projectsService.load()
        .then(data =>{
          this.projects = data;
          return Promise.resolve(this.projects);
    
        })

      })
      .then(res => {
        console.log('je suis à la fin');
        for(let i=0; i<this.projects.length;i++) {

            for(let j=0; j<this.loadedProjects.length;j++) {
              if(this.loadedProjects[j]['ID'] == this.projects[i]['ID']){
                this.projects[i]['isLoaded'] = true;
              }
            }


        }
        
        
       /* for (let serverProj in this.projects) {
          for (let localProj in this.projects) {
            if(serverProj['ID'] == localProj['ID']){
              serverProj['isLoaded'] = true;
            }
          }
        }
      console.log('loaded from server :');
      console.log(this.projects);



      });

    */

        let p1= new Promise((resolve, reject) => {
          this.projectsService.getProj().then(data =>{
            
                  this.loadedProjects = data;
                  if(!this.loadedProjects) {
                    this.projectsSegment = 'allproj';
                    this.displayMyProjs = false;
                    this.myProjdisabled = false;
                    this.syncdisabled = false;
                  } else {
                    this.displayMyProjs = true;
                  }
                  resolve(this.loadedProjects);
          })
        })
          
      let p2= new Promise((resolve, reject) => {
            this.projectsService.load()
            .then(data =>{
              this.projects = data;
              resolve(this.projects);
        
            })
      })


      Promise.all([p1,p2]).then(value => {
        console.log(value);
        
        for (let serverProj in this.projects) {
          for (let localProj in this.loadedProjects) {
            if(this.projects[serverProj]['ID'] == this.loadedProjects[localProj]['ID']){
              this.projects[serverProj]['isLoaded'] = true;
            }
          }
        }
        console.log('loaded from server :');
        console.log(this.projects);

      });

  }
    navToProtocols(id){
    // get selected protocol
    //let pro = this.protocols.find(x => x.id === id);
      this.navCtrl.push(ObservationsPage, {projId : id});
  }
  onSegmentChanged($event){
    if (($event._value == 'myproj')) {
      this.displayMyProjs = true;
      this.myProjdisabled = 'disabled';
      this.syncdisabled = 'disabled';
    } else {
      this.displayMyProjs = false;
      if(!this.projects) {
        // no data from server, try to recoonect, else display alert
        this.reloadDataFromServer();
      }
    }
    
  }
  reloadDataFromServer(){
    this.projectsService.load()
    .then(data =>{
        this.projects = data;
        if (!data){
          // no data, alert
          let alert = this.alertCtrl.create({
            title: 'Erreur de récupération de projet(s)',
            message: 'Le téléchargement de projets a échoué. Merci de vérifier votre connexion internet et/ou de contacter l\'administrateur.',
            buttons: [
              {
                text: 'OK'
              }
            ]
          });
          alert.present();
        }
    })

  }
  checkedDone(proj, type) {
    let projects =this.projects ;
    if(type=="local") {
      projects = this.loadedProjects ;
    }  
    if(proj.checked){
      this.disabled = false;
      this.myProjdisabled = false;
      this.syncdisabled = false;
    } else {
      this.disabled = "disabled";
      this.myProjdisabled = "disabled";
      this.syncdisabled ="disabled";

      for (let proj of projects) {
        if(proj.checked) {
          this.disabled = false;
          this.myProjdisabled = false;
          this.syncdisabled =false;
        }
      }
    }
    console.log(projects);
  }

  ImportProjects(){
    // load checked projects
    // 1- for each checked project load geometry
    let nbToload = 0;
    let loaded = 0 ;
    for (let proj of this.projects) {
      if(proj.checked) {
        nbToload+=1;
      }
    }
    let list = [];
    for (let proj of this.projects) {
      if(proj.checked) {
        let id = proj.ID;
        proj.image = "./assets/icones_projects/pas_synchro.png";
        this.projectsService.loadGeometry(id).then(data =>{
          if(data){
            proj.geometry = data;
          } else {
            proj.geometry = null;
          }
          proj['isLoaded'] = true;
          //proj.checked = false;
          list.push(proj);
          loaded+=1;
          if(loaded == nbToload) {
            // update loaded projects list

            if(this.loadedProjects){
              let tab  = _.concat(this.loadedProjects, list);
              this.loadedProjects = tab;
              this.projectsService.update(tab);

            } else {
              this.loadedProjects =list;
              this.projectsService.update(list);
            }
            
            
            //this.loadedProjects = list;
             // disable selected projects list ( for loaded projects)
            this.disableChecked(this.loadedProjects);
            //this.projectsService.update(this.loadedProjects);
            //this.refreshTabs(list);
            this.displayAlert(loaded);
          }
          /*this.projectsService.saveProject(proj).then(data =>{
            loaded+=1;
            if(loaded == nbToload) {
              this.displayAlert(loaded);
              this.refreshTabs();
            }
          });*/
        })
      }
    }
  }
  disableChecked(list){
    for (let proj of list) {
      proj.checked = false;
    }
  }
 /* refreshTabs(data) {
        // local projects
        this.projectsService.getProj().then(data =>{
          this.loadedProjects = data;
          console.log('*** loaded ****')
          console.log(this.loadedProjects)
        })
  }*/
  displayAlert(loaded){
    let alert = this.alertCtrl.create({
      title: 'Téléchargement de projet(s)',
      message: 'Téléchargement ou mise à jour de ' + loaded + ' projet(s) ' + ' réussi. ',
      buttons: [
        {
          text: 'OK'
        }
      ]
    });
    alert.present();
  }
  deleteSelected(){

    let  alert = this.alertCtrl.create({
      title: 'Suppression de projet(s)',
      message: 'Etes vous sur(e) de supprimer le(s) projet(s) sélectionné(s)?',
      buttons: [
        {
          text: 'Annuler',
          role: 'cancel',
          handler: () => {
            console.log('Cancel clicked');
          }
        },
        {
          text: 'Oui',
          handler: () => {
             //supprimer proj en local, mettre à jour liste et update local storage
            let listProj = [];
            let listObs = [];
            let promises = [];
            for (let proj of this.loadedProjects) {
              if(proj.checked) {
                listProj.push(proj.ID)  
              }
            }
            promises.push(this.data.deleteObsByProjIdList(listProj));
            

            
            // fin de suppression
            Promise.all(promises).then(value => {
              
              for(let i=0;i<listProj.length;i++){
                  _.remove(this.loadedProjects, function(prj) {
                    return prj.ID == listProj[i];
                 });

              }
              // persistance
            this.projectsService.update(this.loadedProjects);
            this.myProjdisabled = 'disabled';
            this.syncdisabled = 'disabled';
              
              this.informAlert('Suppression de données', 'Le(s) projet(s) sélectionnées et leurs donnée(s) associée(s) ont bien été supprimé(s) avec succès.')

            })
          }
        }
      ]
    });
    alert.present();

  }
  pushData(event){
    let  alert = this.alertCtrl.create({
      title: 'Synchronisation de données',
      message: 'Etes vous sur(e) de vouloir synchroniser les données pour le(s) projet(s) sélectionné(s)?',
      buttons: [
        {
          text: 'Annuler',
          role: 'cancel',
          handler: () => {
            console.log('Cancel clicked');
          }
        },
        {
          text: 'Oui',
          handler: () => {
             //supprimer proj en local, mettre à jour liste et update local storage
            let list = [];
            for (let proj of this.loadedProjects) {
              if(proj.checked) {
               list.push(proj.ID)  
              }
            }
            /*for(let i=0;i<list.length;i++){
              _.remove(this.loadedProjects, function(prj) {
                  return prj.ID == list[i];
              });
            }*/
            for(let projID of list ){
              // promises for all selected  projects
              let projPromises = [];
              // for each id proj load data
              this.data.getObs(projID).then((obs)=> {
                // set label to display for each obs
                
                let promises = [];

                for (let dt in obs) {
                      if(! obs[dt]['serverId']){
                      let observation = obs[dt];
                      observation['station'] = {}

                    observation['station']['LAT'] = parseFloat(obs[dt]['latitude']);
                    observation['station']['LON'] = parseFloat(obs[dt]['longitude']);
                    observation['station']['FK_Project'] = obs[dt]['projId'];
                    observation['type_name'] = obs[dt]['protocole'];
                    let dateObs =  obs[dt]['dateObs'];
                    var obsdate = moment(dateObs);
                    var day = obsdate.date();
                    var month = obsdate.month (); 
                    var year = obsdate.year();
                    observation['station']['StationDate'] =  day + "/"+ (month+1) + "/"  + year;
                    observation['station']['Name'] = 'test';

                    let p= new Promise((resolve, reject) => {
                      this.data.pushObs(observation).then(data =>{
                        console.log('*** id serveur obs :');
                        console.log(data);
                          obs[dt]['serverId']= data['id']; 
                          obs[dt]['pushed']= true; 
                          console.log(obs);
                          this.data.saveObsById(obs[dt]['id'],obs[dt]);
                            resolve(data['id']);
                        })
                      })
                      promises.push(p);
                      projPromises.push(p);

                    }
                }

                Promise.all(promises).then(value => {
                  console.log('promises');
                  console.log(value);
                  let projName ;
                  for(let j=0; j<this.loadedProjects.length;j++) {
                    if(this.loadedProjects[j]['ID'] == projID){
                      this.projects[j]['isLoaded'] = true;
                      projName = this.projects[j]['Name'];
                      this.projects[j]['image'] = "./assets/icones_projects/synchro.png";
                    }
                  }
                  // persistance, MAJ
                  this.projectsService.update(this.loadedProjects);
                  if(value.length){
                    this.informAlert('Envoi de données', 'Le(s)' + value.length + ' observations du projet  "' + projName + '" ont été envoyées avec succès.')
                  } else {
                    this.informAlert('Envoi de données', 'Pas d\' observations à envoyer pour le projet  "' + projName + '".')
                  }
                })

               })

               Promise.all(projPromises).then(value => {
                this.syncdisabled = 'disabled';
                //this.informAlert('Envoi de données', 'fin de synchronisation avec succès.')

              })   


            }

          }
        }
      ]
    });
    alert.present();
    
  }
  informAlert(tite, data){
    let alert = this.alertCtrl.create({
      title: tite,
      subTitle: data,
      buttons: ['Ok']
    });
    alert.present();
  }

  deleteObs(id){
    return new Promise(resolve =>{
      this.data.deleteObs(id).then((data)=>{
        resolve(1);  
      });
    });
  }

}
