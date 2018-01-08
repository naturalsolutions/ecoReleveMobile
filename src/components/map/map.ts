import { Component, ElementRef, Output, EventEmitter, Input,Renderer } from '@angular/core'
import { NavController, NavParams,Platform,ViewController } from 'ionic-angular'
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
import L, { circleMarker } from "leaflet"
import  Draw  from 'leaflet-draw';
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
@Input() latitude : number
@Input() longitude:number

@Output() fullsize = new EventEmitter()
  @Output() latEvent = new EventEmitter()
  @Output() lonEvent = new EventEmitter()

  //private mapModel: MapModel
   private _map: any
   public mapEl
   //private _bounds: any
  // latitude : number
  //longitude:number
  markers:any = []
  mapModel :any
  public connectionStatus: String = 'online'


  constructor(
    public navCtrl: NavController, 
    private viewCtrl: ViewController,
    public navParams: NavParams,
    private el: ElementRef,
    private geolocation: Geolocation,
    private NotificationService: MapNotificationService,
    public projectsService : ProjectsServiceProvider,
    public storage : Storage,
    private network :Network,
    public platform :Platform,
    private renderer : Renderer

  ) {

  }

  ngOnInit() {


    this.mapModel = new MapModel()
    let folderName = 'tuilesProj-' + this.projId;
    this.mapModel.initialize({'folder' : folderName })
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
displayfull(){
  //this.renderer.setElementStyle(this.el.nativeElement.querySelector('.header'), 'display', 'none' );
  this.fullsize.emit(true);
  this.renderer.setElementStyle(this.el.nativeElement.querySelector('.map-container'), 'height', '100%');
  this.renderer.setElementStyle(this.el.nativeElement.querySelector('.map-container'), 'width', '100%');
  this.renderer.setElementStyle(this.el.nativeElement.querySelector('.map-container'), 'position', 'fixed');
  this.renderer.setElementStyle(this.el.nativeElement.querySelector('.fullmap'), 'display', 'none');
  this.renderer.setElementStyle(this.el.nativeElement.querySelector('.smallmap'), 'display', 'block');

  this._map._onResize();
}
displaysmall(){
  //this.renderer.setElementStyle(this.el.nativeElement.querySelector('.header'), 'display', '' );
  this.fullsize.emit(false);
  this.renderer.setElementStyle(this.el.nativeElement.querySelector('.map-container'), 'width', '100%');
  this.renderer.setElementStyle(this.el.nativeElement.querySelector('.map-container'), 'height', '250px');
  this.renderer.setElementStyle(this.el.nativeElement.querySelector('.map-container'), 'position', 'relative');
  this.renderer.setElementStyle(this.el.nativeElement.querySelector('.fullmap'), 'display', 'block');
  this.renderer.setElementStyle(this.el.nativeElement.querySelector('.smallmap'), 'display', 'none');
  this._map._onResize();
}
onMapReady() {
  
    console.log(' map : ' + this.projId)
    this.mapEl = this.el.nativeElement.querySelector('.map')
    this._map = L
    .map(this.mapEl, {
      minZoom: 2,
      maxZoom: 18,


      //maxBounds: this._bounds,
    })

    this.mapModel.tileLayer.addTo(this._map);

    if (this.platform.is('cordova')) {
      this.connectionStatus = this.network.type == 'none' ? 'offline' : 'online'
      this.onConnectionStatusChange()
}
   /* L.tileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    //bounds: this._bounds,
    minZoom: 2,
    maxZoom: 18,
   // attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
  }).addTo(this._map);*/
      // get location
      
      if(!this.latitude && (!this.longitude)) {
        this.geolocation.getCurrentPosition().then((position)=> {
          this.latitude = position.coords.latitude
          this.longitude = position.coords.longitude
          this.onMapModelReady()
        })

      } else {
        this.onMapModelReady()
      }



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
            var myLayer = L.geoJSON().addTo(this._map);
            myLayer.addData(geometry);

          }
        }
      }
  })
  }

onMapModelReady() {
    let center = L.latLng(this.latitude, this.longitude)
    this._map.setView(center, 14)
    var icon = L.icon({
      iconUrl: 'assets/icon/picto.png',
      iconSize:     [40, 40], // size of the icon
      //shadowSize:   [50, 64], // size of the shadow
      //iconAnchor:   [22, 94], // point of the icon which will correspond to marker's location
      //shadowAnchor: [4, 62],  // the same for the shadow
      //popupAnchor:  [-3, -76] // point from which the popup should open relative to the iconAnchor
    });

    let  drawnItems =  L.featureGroup();
    drawnItems['name']= 'markeur';
    this._map.addLayer(drawnItems);
    
    let marker = L.marker([this.latitude, this.longitude], {icon: icon}).addTo(drawnItems);
    console.log(Draw)
    var drawControl =  new L.Control.Draw({
      edit: {
      featureGroup: drawnItems,
      remove: false
    },
    draw: false
    // TODO dessin vectoriel
    /*{
      polyline: {
        shapeOptions: {
            color: '#f357a1',
            weight: 10
        }
    },
    polygon: false,
    circle : false,
    marker : false,
    circlemarker : false,
    rectangle : false
    }*/


  });
    
  this._map.addControl(drawControl);
  let that = this;
  this._map.on('draw:edited', function (e) {
    var layers = e.layers;
    layers.eachLayer(function (layer) {
      console.log(layer);
      if(layer['_latlng']){
        let latitude = layer['_latlng'].lat
        let longitude = layer['_latlng'].lng
        that.latEvent.emit(latitude)
        that.lonEvent.emit(longitude)
      }
      //do whatever you want, most likely save back to db
    });
  });
}
goOnline() {

  if (this.platform.is('cordova')) {
    this.mapModel.tileLayer.goOnline()
  }
}

goOffline() {

  if (this.platform.is('cordova')) {
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
