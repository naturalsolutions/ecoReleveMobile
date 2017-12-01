import { Component, ElementRef, Output, EventEmitter, Input  } from '@angular/core'
import { NavController, NavParams,Platform } from 'ionic-angular'
//import { Subscription } from 'rxjs/Subscription'
import { MapNotificationService } from '../../shared/map.notification.service'
import {ProjectsServiceProvider} from '../../providers/projects-service'
import { MapModel } from '../../shared/map.model'
//import { MapModel } from '../../shared/map.model'
import {Geolocation } from '@ionic-native/geolocation'
import * as geojsonBounds from 'geojson-bounds'
import { Storage } from '@ionic/storage'
//import { NetworkService } from '../../shared/network.service';
import { Network } from '@ionic-native/network'
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
  mapModel :any
  public connectionStatus: String = 'online'


  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams,
    private el: ElementRef,
    private geolocation: Geolocation,
    private NotificationService: MapNotificationService,
    public projectsService : ProjectsServiceProvider,
    public storage : Storage,
    private network :Network,
    public platform :Platform
  ) {

  }

  ngOnInit() {


    this.mapModel = new MapModel()
    this.mapModel.initialize({
    })
      .then(() => {
        this.onMapReady()
      })

      this.network.onConnect().subscribe(data =>{
        this.connectionStatus = 'online';
        if(this.mapModel.tileLayer) {
          this.onConnectionStatusChange()
        }
    
      }, error=> {
        console.log(error)
      });
    
      this.network.onDisconnect().subscribe(data =>{
        this.connectionStatus = 'offline';
        if(this.mapModel.tileLayer) {
          this.onConnectionStatusChange()
        }
      }, error=> {
        console.log(error)
      });
}

ionViewDidEnter(){
  

}
onMapReady() {

    console.log(' map : ' + this.projId)
    this.mapEl = this.el.nativeElement.querySelector('.map')
    this._map = L
    .map(this.mapEl, {
      minZoom: 2,
      maxZoom: 18

      //maxBounds: this._bounds,
    })
    this.mapModel.tileLayer.addTo(this._map);

    if (this.platform.is('cordova')) {
      this.connectionStatus = this.network.type == 'none' ? 'offline' : 'online'
      if(this.network.type =='unknown'){
        this.connectionStatus = 'offline';
      }
      this.onConnectionStatusChange()
}
   /* L.tileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    //bounds: this._bounds,
    minZoom: 2,
    maxZoom: 18,
   // attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
  }).addTo(this._map);*/
      // get location
      this.geolocation.getCurrentPosition().then((position)=> {
        this.latitude = position.coords.latitude
        this.longitude = position.coords.longitude
        this.onMapModelReady()
      })


  // add edit control
  
  //TODO

  let geometry;
  // ajouter emprise de projet
  this.projectsService.getProj().then(data =>{

    for(let proj in data) {
        console.log(data[proj])
        if(data[proj]['ID'] == this.projId ) {
          geometry = data[proj]['geometry'];
          if(geometry) {
            this.storage.get(''+this.projId).then((data)=>{
                if(!data){
                  var extent = geojsonBounds.extent(geometry);
                  console.log('extent');
                  console.log(extent);
                  let bbox = {}
                  bbox['minLng'] = extent[0];
                  bbox['minLat'] = extent[1];
                  bbox['maxLng'] = extent[2];
                  bbox['maxLat'] = extent[3];
                  console.log('minLng: ' + extent[0] + ",minLat: " + extent[1] + " ,maxLng : " +  extent[2] + " ,maxLat: " + extent[3])
                  this.mapModel.downloadTiles(bbox,10,17);
                  this.storage.set(''+this.projId, true);

                }
            });

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
goOnline() {
  //this._map.setMinZoom(14)
  //this._map.setMaxZoom(17)
  if (this.platform.is('cordova')) {
    this.mapModel.tileLayer.goOnline()
    //this._map.setMaxBounds(this.mapModel.getCacheTileBounds())
  }
}

goOffline() {
  //this._map.setView([this.mapModel.center.lat, this.mapModel.center.lng], this.mapModel.cacheZoom)
  //this._map.setMinZoom(this.mapModel.cacheZoom)
  //this._map.setMaxZoom(this.mapModel.cacheZoom)
  if (this.platform.is('cordova')) {
   // this._map.setMaxBounds(this.mapModel.getCacheTileBounds())
    setTimeout(() => {
      this.mapModel.tileLayer.goOffline()
    }, 1000)
  }
}
onConnectionStatusChange() {
  if (this.connectionStatus == 'online') {
    this.goOnline()
  } else {
    this.goOffline()
  }
}
}
