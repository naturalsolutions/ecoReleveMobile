import { Component,ElementRef } from '@angular/core'
import { IonicPage, NavController, NavParams,PopoverController } from 'ionic-angular'
import {ObsProvider} from '../providers/obs/obs'
import { ProtocolsPage } from '../protocols/protocols'
import {ProtocolsServiceProvider} from '../providers/protocols-service'
import { ObservationPage} from '../observation/observation'
import { Storage } from '@ionic/storage'
import {PopoverHelpPage} from'./popoverHelpPage'
import {ProjectsServiceProvider} from '../providers/projects-service';
import {config }  from '../config';
import * as L from 'leaflet';
//import {MapComponent} from '../components/map/map'
//import { Subscription } from 'rxjs/Subscription'
//import { MapNotificationService } from '../shared/map.notification.service'


@IonicPage()
@Component({
  selector: 'page-observations',
  templateUrl: 'observations.html',
  providers : [
    ProtocolsServiceProvider,
    ProjectsServiceProvider
  ]
})
export class ObservationsPage {

  public obs :any;
  public waypoints :any;
  obsSegment: string= 'listes';
  protocols : any;
  public map : any
  public projId : any
  newObsDisabled = false
  //private subscription: Subscription;

  constructor(
  public navCtrl: NavController, 
  public navParams: NavParams,
  private data : ObsProvider,
  public protocolsService : ProtocolsServiceProvider,
  private el: ElementRef,
  public storage : Storage,
  public projectsService : ProjectsServiceProvider,
  private popoverCtrl: PopoverController,
  //public map : MapComponent,
  //private NotificationService: MapNotificationService

  ) {
    this.projId = navParams.get("projId")
    if(config.disableAfterSync) {
      this.newObsDisabled = navParams.get("isPushed")
    }
    this.loadProtocols()
  }

  ionViewDidLoad() {
    
    
  }
  ionViewDidEnter(){
    console.log(' obs page enter')
    //this.drawMap()
    this.data.getObs(this.projId).then((data)=> {
      // set label to display for each obs
      let points= [];
      for (let dt in data) {
        let label, protocolName;
        protocolName = data[dt]['protocole'];
        label = this.getLabel(protocolName);
        label = label + ': ' +  data[dt]['type_inventaire'] 
        if(label.length>32) {
          label = label.substring(0,28) + '...';
        }
        data[dt]['label'] = label
        let pos = {}
        pos['latitude'] = parseFloat(data[dt]['latitude'])
        pos['longitude'] = parseFloat(data[dt]['longitude'])
        pos['id'] = data[dt]['id']
        pos['dateObs'] = data[dt]['dateObs'] 
        pos['espece'] = data[dt]['nom_vernaculaire'] 
        points.push(pos)
      }
      this.obs = data
      this.waypoints = points
     }
    );
  }

  navigateToDetail(protocole,id,pushed){
    // get selected protocol
    let protocol = this.protocols.find(x => x.name === protocole);
    console.log(protocol, id);
    this.navCtrl.push(ObservationPage, {protoObj:protocol, obsId : id, 'projId' : this.projId, 'isEditable' : !(pushed)});
  }
  newObs(){
    console.log('new obs');
    this.navCtrl.push(ProtocolsPage, {'projId' : this.projId}).then(
      response => {
        console.log('Response ' + response);
      },
      error => {
        console.log('Error: ' + error);
      }
    ).catch(exception => {
      console.log('Exception ' + exception);
    });
  }

  getLabel(protocolName){
    let label
    switch(protocolName) {

      case "Avifaune":
          label="Oiseaux";
          break;
      case "Herpeto":
          label="Reptiles";   
          break;
       case "Mammo":
         label="Mammifères";   
        break;
        case "Batracho":
        label="Reptiles";  
        break;
        case "Chiropteres":
        label="chauves-souris";  
        break;
        case "Flore":
        label="Plantes";  
        break;
        case "Insectes":
        label="Insectes";  
        break;
    }
    return label
  }
  getImage(ob){
    let protocole = ob.protocole;
    let finished = ob.finished;
    let pushed = ob.pushed;
    let src="";
    
    if(pushed){
      switch(protocole) {
          case "Avifaune":
              src="avifaune_sync.png";
              break;
          case "Herpeto":
              src="herpeto_sync.png";   
              break;
           case "Mammo":
             src="mammo_sync.png";   
            break;
            case "Batracho":
            src="batracho_sync.png";  
            break;
            case "Chiropteres":
            src="chiro_sync.png";  //TODO update picto 
            break;
            case "Flore":
            src="flore_sync.png";  
            break;
            case "Insectes":
            src="insect_sync.png";  
            break;
      }

    } 
    
    else if(finished){
      switch(protocole) {
          case "Avifaune":
              src="avifaune.png";
              break;
          case "Herpeto":
              src="herpeto.png";   
              break;
           case "Mammo":
             src="mammo.png";   
            break;
            case "Batracho":
            src="batracho.png";  
            break;
            case "Chiropteres":
            src="chiro.png";  //TODO update picto 
            break;
            case "Flore":
            src="flore.png";  
            break;
            case "Insectes":
            src="insect.png";  
            break;
      }

    } else {
      switch(protocole) {
          case "Avifaune":
              src="avifaune_progress.png";  
          case "Herpeto":
              src="herpeto_progress.png";    
              break;
           case "Mammo":
             src="mammo_progress.png";   
            break;
            case "Batracho":
            src="batracho_progress.png";   
            break;
            case "Chiropteres":
            src="chiro_progress.png";  //TODO update picto 
            break;
            case "Flore":
            src="flore_progress.png";  
            break;
            case "Insectes":
            src="insect_progress.png";  
            break;
      }

    }
    return ('./assets/icones_obs/' + src);
  }
  loadProtocols (){
    this.protocolsService.load()
    .then(data =>{
      this.protocols = data;
    })

  }
  drawMap(){
      let self = this
    setTimeout(function(){ 
        let mapEl = self.el.nativeElement.querySelector('#map')
        if(mapEl){
            //let mapEl = document.getElementById('map');
            self.map = L.map(mapEl);
            L.tileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            //bounds: this._bounds,
            minZoom: 8,
            maxZoom: 16,
            attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
          }).addTo(self.map);
          self.addStations()
          self.addProjectBounds()
        }
    }, 200);


  }
  onSegmentChanged($event) {
    if ($event._value == 'stations') {
        this.drawMap();
     }
  }
  addStations(){
      let list =this.waypoints
      let center : any
      if(list.length>0){
        

      //this.map.setView(center, 14)
        //TODO change icone
        var icon = L.icon({
          iconUrl: 'assets/icon/marker.png',
         // iconAnchor:   [0, 0], // point of the icon which will correspond to marker's location
        //shadowAnchor: [4, 62],  // the same for the shadow
        //popupAnchor:  [-3, -76] // point from which the popup should open relative to the iconAnchor
      })
        let markers = []
        for (let i =0; i<list.length;i++) {
          let waypoint = list[i]
          if(waypoint.latitude && waypoint.longitude){
            var marker = L.marker([waypoint.latitude, waypoint.longitude]);
            marker.bindPopup("<div class='mappopup'><b>" + waypoint.espece + "</b><br>Station #" + waypoint.id +"</div>");
            markers.push(marker)
          }
        }

        var group =  L.featureGroup(markers);
        group.addTo(this.map);
        this.map.fitBounds(group.getBounds());

      } else {
        center = L.latLng(43.2915582, 5.372177)
        this.map.setView(center, 8)
      }
    }
    addProjectBounds(){
      let projId = this.projId
      this.projectsService.getProjById(projId).then(data =>{ 
          if (data) {
            let geometry = data['geometry'];
            if(geometry) {
              var myLayer = L.geoJSON().addTo(this.map);
              myLayer.addData(geometry);
            }
          }
      })
    }
    onHelpClicked(){

      let popover = this.popoverCtrl.create(PopoverHelpPage, {parent : this},{cssClass: 'help-pop'});
      popover.present({
      });
  
    }

    swipe($event) {
      
      if($event.direction === 2 ) {
        if(this.obsSegment =='listes') {
          this.obsSegment = 'stations';
        }
      }
      if($event.direction === 4 ) {
        if(this.obsSegment =='stations') {
          this.obsSegment = 'listes';
        }
      }
    }

}



