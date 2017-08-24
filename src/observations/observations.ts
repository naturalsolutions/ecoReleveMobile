import { Component,ElementRef } from '@angular/core'
import { IonicPage, NavController, NavParams } from 'ionic-angular'
import {ObsProvider} from '../providers/obs/obs'
import { ProtocolsPage } from '../protocols/protocols'
import {ProtocolsServiceProvider} from '../providers/protocols-service'
import { ObservationPage} from '../observation/observation'
//import {MapComponent} from '../components/map/map'
//import { Subscription } from 'rxjs/Subscription'
//import { MapNotificationService } from '../shared/map.notification.service'


@IonicPage()
@Component({
  selector: 'page-observations',
  templateUrl: 'observations.html',
  providers : [
    ProtocolsServiceProvider//,
    //MapComponent
  ]
})
export class ObservationsPage {

  public obs :any;
  public waypoints :any;
  obsSegment: string= 'listes';
  protocols : any;
  public map : any
  //private subscription: Subscription;

  constructor(
  public navCtrl: NavController, 
  public navParams: NavParams,
  private data : ObsProvider,
  public protocolsService : ProtocolsServiceProvider,
  private el: ElementRef,
  //public map : MapComponent,
  //private NotificationService: MapNotificationService

  ) {
    console.log(' obs page constructor')
    this.loadProtocols()
  }

  ionViewDidLoad() {
    
  }
  ionViewDidEnter(){
    console.log(' obs page enter')
    //this.drawMap()
    this.data.getObs().then((data)=> {
      this.obs = data
      let points= [];
      for (let dt in data) {
        let pos = {}
        pos['latitude'] = parseFloat(data[dt]['latitude'])
        pos['longitude'] = parseFloat(data[dt]['longitude'])
        pos['id'] = data[dt]['id']
        pos['dateObs'] = data[dt]['dateObs'] 
        pos['espece'] = data[dt]['nom_vernaculaire'] 
        points.push(pos)
      }
      this.waypoints = points
     }

    );
    // when map is loaded, add waypoints
    // subscription to notify loading map
    /*this.subscription = this.NotificationService.notifyObservable$.subscribe((res) => {
      let map = res.map
      this.map.addStations(this.waypoints, map)
    })*/
    
  }
  navigateToDetail(protocole,id){
    // get selected protocol
    let protocol = this.protocols.find(x => x.name === protocole);
    console.log(protocol);
    this.navCtrl.push(ObservationPage, {protoObj:protocol, obsId : id});
  }
  newObs(){
    this.navCtrl.push(ProtocolsPage)
  }
  getImage(protocole,finished){
    let src="";
    if(finished){
      switch(protocole) {
          case "avifaune":
              src="avifaune.jpg";
              break;
          case "herpetophaune":
              src="herpeto.jpg";   
              break;
           case "mammophaune":
             src="avifaune.jpg";  //TODO update picto 

          default:
              src="avifaune.jpg";  //TODO update picto 
      }

    } else {
      switch(protocole) {
          case "avifaune":
              src="avifaune_progress.jpg"; //TODO update picto 
              break;
          case "herpetophaune":
              src="avifaune_progress.jpg";   //TODO update picto 
              break;
           case "mammophaune":
             src="avifaune_progress.jpg";  //TODO update picto 

          default:
              src="avifaune_progress.jpg";  //TODO update picto 
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

}


