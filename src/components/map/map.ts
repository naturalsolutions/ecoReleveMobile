import { Component, ElementRef, Output, EventEmitter, Input,Renderer } from '@angular/core'
import { NavController, NavParams,Platform,ViewController,AlertController } from 'ionic-angular'
import * as L from "leaflet"
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

import  Draw  from 'leaflet-draw';
import Polylinedecorator from 'leaflet-polylinedecorator';
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
@Input() trace:string

@Output() fullsize = new EventEmitter()
@Output() latEvent = new EventEmitter()
@Output() lonEvent = new EventEmitter()
@Output() jsonEvent = new EventEmitter()
  //private mapModel: MapModel
   private _map: any
   public mapEl
   //private _bounds: any
  // latitude : number
  //longitude:number
  markers:any = []
  mapModel :any
  public connectionStatus: String = 'online'
  private traceLayerId : any


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
    private renderer : Renderer,
    private alertCtrl: AlertController,
   // private elRef:ElementRef

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

    let googleSat = L.tileLayer('http://{s}.google.com/vt/lyrs=s&x={x}&y={y}&z={z}',{
      maxZoom: 20,
      subdomains:['mt0','mt1','mt2','mt3']
    });
    let layerGroup = L.layerGroup([])

    layerGroup.addLayer(googleSat)
      .addTo(this._map);

    let layerControl = L.control.layers().addTo(this._map);

    layerControl.addOverlay(layerGroup , "Google satellite");
    //L.control.layers(this.mapModel.tileLayer).addTo(this._map);
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

  // reload map tiles for current project if not yet loaded
  let tilesLoaded = this.storage.get('tilesLoadedForProj-'+ this.projId).then(data =>{
    if( data != true ){
      this.downloadTilesMsg()
    }
  });
  }

  downloadTilesMsg(){
    let alert = this.alertCtrl.create({
      title: 'Tuiles cartographiques',
      message: 'Voulez-vous relancer le chargement de tuiles cartographiques manquantes pour ce projet?',
      buttons: [
        {
          text: 'Non',
          role: 'cancel',
          handler: data => {
            var key = 'tilesLoadedForProj-'+ this.projId
            this.storage.set(key, true);
          }
        },
        {
          text: 'Ok',
          handler: data => {
            let bbox = this.storage.get('bboxProj-'+ this.projId).then(data =>{
              if( data){
                let dt = this.projectsService.downloadTiles(data,this.projId, this.mapModel.tileLayer)
              }
            });
            
          }
        }
      ]
    });
    alert.present();
  }

onMapModelReady() {
    let center = L.latLng(this.latitude, this.longitude)
    this._map.setView(center, 14)
    var icon = L.icon({
      iconUrl: 'assets/icon/picto_red2.png',
      iconSize:     [40, 40] // size of the icon
      //shadowSize:   [50, 64], // size of the shadow
      //iconAnchor:   [22, 94], // point of the icon which will correspond to marker's location
      //shadowAnchor: [4, 62],  // the same for the shadow
      //popupAnchor:  [-3, -76] // point from which the popup should open relative to the iconAnchor
    });

    let  drawnItems =  L.featureGroup();
    let  arrowLayer =  L.featureGroup();
    var style = {
      color: '#f44141', 
      weight: 6,
      opacity: 1,
      fillOpacity: 1,
      fillColor: '#f44141'
    };
    arrowLayer.setStyle(style);
    drawnItems['name']= 'markeur';
    this._map.addLayer(drawnItems);
    this._map.addLayer(arrowLayer);



    
    
    let marker = L.marker([this.latitude, this.longitude], {icon: icon}).addTo(drawnItems as any);
    let _this = this;
    let v = Draw
    var drawControl =  new (L as any).Control.Draw({
      edit: {
      featureGroup: drawnItems,
      remove: true
    },
    //draw: false
    draw: {
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
      }
  });








/*var controlDiv = drawControl._toolbars.edit._toolbarContainer;
var removeControlUI = L.DomUtil.create('a', 'leaflet-draw-edit-remove');
controlDiv.append(removeControlUI);
removeControlUI.title = 'Remove All Polygons';
removeControlUI['href'] = '#';
L.DomEvent.addListener(removeControlUI, 'click', function (e) {
  e.preventDefault();
  e.stopPropagation();
  //if(!$(removeControlUI).hasClass("leaflet-disabled") && _this.drawnItems.getLayers().length > 0){
  //  _this.drawnItems.clearLayers();
  //  _this.map.fire('draw:deleted');

  //}
});*/



  /*this._map.on('draw:deletestart', function (e) { 
   var layers = e.layers;


  });
*/
  /*this._map.on('moveend', function (e) { 
        var style = {
      color: '#f44141', 
      weight: 6,
      opacity: 1,
      fillOpacity: 1,
      fillColor: '#f44141'
    };
    arrowLayer.setStyle(style);
  });
  this._map.on('zoomend', function (e) { 
    var style = {
      color: '#f44141', 
      weight: 6,
      opacity: 1,
      fillOpacity: 1,
      fillColor: '#f44141'
    };
    arrowLayer.setStyle(style);
  });*/

  



  this._map.addControl(drawControl);
  let that = this;

  // disable remove btn
  let removeCtr = _this.el.nativeElement.querySelector('.leaflet-draw-edit-remove');
   _this.renderer.setElementAttribute(removeCtr, 'disabled', 'disabled');
  
    

  /*this._map.on('draw:edited', function (e) {
    var layers = e.layers;
    layers.eachLayer(function (layer) {
      console.log(layer);
      if(layer['_latlng']){
        let latitude = layer['_latlng'].lat
        let longitude = layer['_latlng'].lng
        that.latEvent.emit(latitude)
        that.lonEvent.emit(longitude)
      }
    });
  })*/

  this._map.on((L as any).Draw.Event.CREATED, function (e) {
    var type = e.layerType,
    layer = e.layer;
    layer['name']= 'trace';
    this.traceLayerId = e.target._leaflet_id

    if (type != 'marker') {
      console.log('tracé :')
      // get json
     // set style

      var json = layer.toGeoJSON();
      json.properties = {
        color: '#f44141', 
        weight: 6,
        opacity: 1,
        fillOpacity: 1,
        fillColor: '#f44141'
      };



      console.log(json)
      console.log('rotatedmarker')
      console.log(Polylinedecorator)

      _this.jsonEvent.emit(json)

      
      var arrowHead = (L as any).polylineDecorator(layer, {
            patterns: [
                {offset: '100%', repeat: 0, symbol: (L as any).Symbol.arrowHead({pixelSize: 15, polygon: false, pathOptions: {stroke: true}})}
            ]
      });
      arrowLayer.addLayer(arrowHead);
      arrowLayer.setStyle(style);


      layer.setStyle(style);

    }

    drawnItems.addLayer(layer);
    console.log('drawControl'); 
    drawControl.setDrawingOptions({
      polyline: false
  });
    drawControl.draw = false;
    console.log(drawControl); 
    console.log(_this.el);
    // disable draw mode
    let drawCtr = _this.el.nativeElement.querySelector('.leaflet-draw-draw-polyline');
    _this.renderer.setElementAttribute(drawCtr, 'disabled', 'disabled');
    // activate remove btn
    let removeCtr = _this.el.nativeElement.querySelector('.leaflet-draw-edit-remove');
    _this.renderer.setElementAttribute(removeCtr, 'disabled', null);


});


  this._map.on('draw:edited', function (e) {
    console.log('******** edition *********')
    console.log(e)
    var layers = e.layers;
    //var layers = e.target._layers;
    layers.eachLayer(function (layer) {

      
      if (layer instanceof ( L as any).Marker){
        
      } else {
        _this.removeRow(arrowLayer);
        var arrowHead = (L as any).polylineDecorator(layer, {
          patterns: [
              {offset: '100%', repeat: 0, symbol: (L as any).Symbol.arrowHead({pixelSize: 15, polygon: false, pathOptions: {stroke: true}})}
          ]
        });
        arrowLayer.addLayer(arrowHead);
        arrowLayer.setStyle(style);
      }

      if(layer['_latlng']){
        let latitude = layer['_latlng'].lat
        let longitude = layer['_latlng'].lng
        that.latEvent.emit(latitude)
        that.lonEvent.emit(longitude)
      }
      if(layer['name']=='trace') {
        var json = layer.toGeoJSON();
        console.log(json)
        _this.jsonEvent.emit(json)
      }



  
    });
    // activate remoove btn
    let removeCtr = _this.el.nativeElement.querySelector('.leaflet-draw-edit-remove');
    _this.renderer.setElementAttribute(removeCtr, 'disabled', null);
  
  });
  this._map.on('draw:deletestop', function (e) { 
    console.log(e)
    var layers = e.target._layers;
    var elemId = e.target._leaflet_id;

    if(elemId == this.traceLayerId ) {
      this.trace ='';
    } else {
      //alert('Effacement du markeur n\'est pas permis !')
    }
    
    
    /*for (var prop in layers) {
      let layer =  layers[prop];
      if(layer._leaflet_id == elemId){
        alert('markeur !')
      }
      if (layer instanceof ( L as any).Marker){
        console.log('ici')
      }
    }*/
    // activate draw btn
    let drawCtr = _this.el.nativeElement.querySelector('.leaflet-draw-draw-polyline');
    _this.renderer.setElementAttribute(drawCtr, 'disabled', null);
    // disable remove btn
    let removeCtr = _this.el.nativeElement.querySelector('.leaflet-draw-edit-remove');
    _this.renderer.setElementAttribute(removeCtr, 'disabled', 'disabled');
    // delete arrow
    _this.removeRow(arrowLayer);
 
   });

   // if trace exists, add it
   console.log('*** trace ****')
   if(this.trace){

    let trace = JSON.parse(this.trace)

    let traceLayer = L.geoJSON(trace,{ style: function (f) {
              return f.properties;
      }})

    // select the geometry, assuming only 1
  var newLayer = traceLayer.getLayers()[0];
  newLayer['name']='trace'
  newLayer['options']['style'] = {
    color: '#f44141', 
    weight: 6,
    opacity: 1,
    fillOpacity: 1,
    fillColor: '#f44141'
  };

    drawnItems.addLayer(newLayer)
    this.traceLayerId = newLayer['_leaflet_id']

    drawControl.setDrawingOptions({
      polyline: false
    });
    var arrowHead = (L as any).polylineDecorator(traceLayer, {
      patterns: [
          {offset: '100%', repeat: 0, symbol: (L as any).Symbol.arrowHead({pixelSize: 15, polygon: false, pathOptions: {stroke: true}})}
      ]
    });
    arrowLayer.addLayer(arrowHead);
    arrowLayer.setStyle(style);

    // disable  draw btn
    let drawCtr = _this.el.nativeElement.querySelector('.leaflet-draw-draw-polyline');
    _this.renderer.setElementAttribute(drawCtr, 'disabled', 'disabled');
    _this.renderer.setElementAttribute(removeCtr, 'disabled', null);
  
  }





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

removeRow(arrowLayer){

  arrowLayer.eachLayer(function (layer) {
    arrowLayer.removeLayer(layer)

  });
}


}
