import { Component, ElementRef, Output, EventEmitter, Input  } from '@angular/core'
import { NavController, NavParams } from 'ionic-angular'
//import { Subscription } from 'rxjs/Subscription'
import { MapNotificationService } from '../../shared/map.notification.service'
import {ProjectsServiceProvider} from '../../providers/projects-service'
//import { MapModel } from '../../shared/map.model'
import {Geolocation } from '@ionic-native/geolocation'
import L from "leaflet"
import _ from 'lodash'


@Component({
  selector: 'map',
  templateUrl: 'map.html',
  providers : [
    ProjectsServiceProvider
  ]
})

export class MapComponent {

  
@Input() projId : number
  /*@Output() latEvent = new EventEmitter()
  @Output() lonEvent = new EventEmitter()*/

  //private mapModel: MapModel
   private _map: any
   public mapEl
   //private _bounds: any
   latitude : number
  longitude:number
  markers:any = []


  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams,
    private el: ElementRef,
    private geolocation: Geolocation,
    private NotificationService: MapNotificationService,
    public projectsService : ProjectsServiceProvider
  ) {

  }

  ngOnInit() {

    console.log(' map : ' + this.projId)
    this.mapEl = this.el.nativeElement.querySelector('.map')
    this._map = L
    .map(this.mapEl, {
      minZoom: 2,
      maxZoom: 18

      //maxBounds: this._bounds,
    })

    L.tileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    //bounds: this._bounds,
    minZoom: 2,
    maxZoom: 18,
   // attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
  }).addTo(this._map);
      // get location
      this.geolocation.getCurrentPosition().then((position)=> {
        this.latitude = position.coords.latitude
        this.longitude = position.coords.longitude
        this.onMapModelReady()
      })

  let geometry;
  // ajouter emprise de projet
  this.projectsService.getProj().then(data =>{

    for(let proj in data) {
        console.log(data[proj])
        if(data[proj]['ID'] == this.projId ) {
          geometry = data[proj]['geometry'];
          if(geometry) {
            var myLayer = L.geoJSON().addTo(this._map);
            myLayer.addData(geometry);
          }
        }
      }
      
  })


  }




  /*loadMap() {
    console.log('loadind map')
    //this.mapModel = new MapModel()
    //this.mapModel.initialize({
      //layerUrl: this.ignService.layer
    })
      .then(() => {
        this.onMapModelReady()
      })
}*/
    onMapModelReady() {
    let center = L.latLng(this.latitude, this.longitude)
    this._map.setView(center, 14)
    let marker = L.marker([this.latitude, this.longitude]).addTo(this._map);
    /*this._map = L
      .map(this.mapEl, {
        minZoom: 8,
        maxZoom: 18

        //maxBounds: this._bounds,
      })
      .setView(center, 8)

      L.tileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      //bounds: this._bounds,
      minZoom: 8,
      maxZoom: 12,
     // attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(this._map);

    // notify other that map is loaded
    this.NotificationService.notifyOther({map :this._map });

    let marker = L.marker([this.latitude, this.longitude]).addTo(this._map);*/

    //this.mapModel.tileLayer.addTo(this._map);

    /*L.marker(center, { icon: this._icon })
      .bindPopup('Départ')
      .openPopup()
      .addTo(this._map);*/

    /*this._trace = L.geoJSON(this._trace, {
      style: function (feature) {
        return {
          "color": "#4928d9",
          "weight": 8,
          "opacity": 0.8 };
      }*/
        //,
      // onEachFeature: function (feature, layer) {
      //     layer.bindPopup(this.tours[0].title);
      // }
   // }).addTo(this._map)
    //this._map.fitBounds(this._trace.getBounds());

    /*if (this.platform.is('cordova')) {
      this.connectionStatus = this.network.type == 'none' ? 'offline' : 'online'
      this.onConnectionStatusChange()
    }*/
}
}
