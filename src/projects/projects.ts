import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController } from 'ionic-angular';
import {ProjectsServiceProvider} from '../providers/projects-service';
import { ProtocolsPage } from '../protocols/protocols'; // TODO to delete
import { ObservationsPage } from '../observations/observations';
import _ from 'lodash';
import 'rxjs/add/observable/forkJoin';




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
  displayMyProjs : boolean = false;

  constructor(public navCtrl: NavController, public navParams: NavParams, 
    public projectsService : ProjectsServiceProvider, private alertCtrl: AlertController
  ) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ProjectsPage');
    this.loadProjects();
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
    } else {
      this.disabled = "disabled";
      this.myProjdisabled = "disabled";

      for (let proj of projects) {
        if(proj.checked) {
          this.disabled = false;
          this.myProjdisabled = false;
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
            let list = [];
            for (let proj of this.loadedProjects) {
              if(proj.checked) {
               list.push(proj.ID)  
              }
            }
            for(let i=0;i<list.length;i++){
              _.remove(this.loadedProjects, function(prj) {
                  return prj.ID == list[i];
              });
            }
            // persistance
            this.projectsService.update(this.loadedProjects);
          }
        }
      ]
    });
    alert.present();

  }

}
