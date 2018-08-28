
declare const L: any;

import { Component, ElementRef, Output, EventEmitter, Input,Renderer } from '@angular/core'
import { NavController, NavParams,Platform,ViewController,AlertController } from 'ionic-angular'
import  "leaflet"
import {ProjectsServiceProvider} from '../../providers/projects-service'
import { MapModel } from '../../shared/map.model'
import {Geolocation } from '@ionic-native/geolocation'
import { Storage } from '@ionic/storage'
import { Network } from '@ionic-native/network'
import  Draw  from 'leaflet-draw';

import 'leaflet-draw';




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
  traceLayerId : any


  constructor(
    public navCtrl: NavController, 
    //private viewCtrl: ViewController,
    public navParams: NavParams,
    private el: ElementRef,
    private geolocation: Geolocation,
    //private NotificationService: MapNotificationService,
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
  this.renderer.setElementAttribute(this.el.nativeElement.querySelector('.smallmap'), 'isFull', 'true');

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
  this.renderer.setElementAttribute(this.el.nativeElement.querySelector('.smallmap'), 'isFull', 'false');
  this._map._onResize();
}
onMapReady() {
  
    console.log(' map : ' + this.projId)
    this.mapEl = this.el.nativeElement.querySelector('.map')
    this._map = L
    .map(this.mapEl, {
      minZoom: 2,
      maxZoom: 25,


      //maxBounds: this._bounds,
    })

    // disable zoom on double click
    this._map.doubleClickZoom.disable(); 

    let googleSat = L.tileLayer('http://{s}.google.com/vt/lyrs=s&x={x}&y={y}&z={z}',{
      maxZoom: 25,
      subdomains:['mt0','mt1','mt2','mt3']
    });
    let layerGroup = L.layerGroup([])

    layerGroup.addLayer(googleSat);
    let layerControl = L.control.layers().addTo(this._map);
    layerControl.addOverlay(layerGroup , "Google satellite");
    this.mapModel.tileLayer.addTo(this._map);


    if (this.platform.is('cordova')) {
      this.connectionStatus = this.network.type == 'none' ? 'offline' : 'online'
      this.onConnectionStatusChange()
}
      
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
      iconSize:     [60, 60] // size of the icon
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
    //arrowLayer.setStyle(style);
    drawnItems['name']= 'markeur';
    this._map.addLayer(drawnItems);
    this._map.addLayer(arrowLayer);


    let self = this;
    
    
    let marker = L.marker([this.latitude, this.longitude], {icon: icon}).addTo(drawnItems as any).on('click', onClick);



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

  function onClick(e) {
    // alert(e.latlng);
    //drawnItems['editable'].enable()
    self.el.nativeElement.querySelector('.leaflet-draw-edit-edit').click()
     let isedited = e.target.edited;
     if(isedited) {
      //e.target.editing.enable();
      //e.target.editing.save();
      var toolbar;
      for (var toolbarId in drawControl._toolbars) {
          toolbar = drawControl._toolbars[toolbarId];
          if (toolbar instanceof (L as any).EditToolbar) {
              toolbar._modes.edit.handler.enable();
              toolbar._modes.edit.handler.save();
              toolbar._modes.edit.handler.disable();
              break;
          }
      }


     }
   }

   marker.on('dragend', function(e) {
     console.log('marker dragend event');
   });


  this._map.addControl(drawControl);
  //drawnItems['editable'].enable()
  let that = this;

  // disable remove btn
  let removeCtr = _this.el.nativeElement.querySelector('.leaflet-draw-edit-remove');
   _this.renderer.setElementAttribute(removeCtr, 'disabled', 'disabled');
  
    
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

      layer.setStyle(style);


      _this.jsonEvent.emit(json)

      if(L.polylineDecorator ) {
        var arrowHead = L.polylineDecorator(layer, {
          patterns: [
              {offset: '100%', repeat: 0, symbol: L.Symbol.arrowHead({pixelSize: 15, polygon: false, pathOptions: {stroke: true}})}
          ]
        });
      }
      
      

  
     /* var arrowHead = (L as any).polylineDecorator(layer, {
            patterns: [
                {offset: '100%', repeat: 0, symbol: (L as any).Symbol.arrowHead({pixelSize: 15, polygon: false, pathOptions: {stroke: true}})}
            ]
      });*/

      if (arrowHead) {
        arrowLayer.addLayer(arrowHead);
      }
      
      //arrowLayer.setStyle(style);


      //layer.setStyle(function(feature) { return style; });

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

    var layers = e.layers;
    //var layers = e.target._layers;
    layers.eachLayer(function (layer) {

      
      if (layer instanceof ( L as any).Marker){
        
      } else {
        _this.removeRow(arrowLayer);
        
        if(L.polylineDecorator ) {
          
          var arrowHead = (L as any).polylineDecorator(layer, {
            patterns: [
                {offset: '100%', repeat: 0, symbol: (L as any).Symbol.arrowHead({pixelSize: 15, polygon: false, pathOptions: {stroke: true}})}
            ]
          });
          arrowLayer.addLayer(arrowHead);
          arrowLayer.setStyle(style);


        }
        


      }

      if(layer['_latlng']){
        let latitude = layer['_latlng'].lat
        let longitude = layer['_latlng'].lng
        that.latEvent.emit(latitude)
        that.lonEvent.emit(longitude)
      }
      if(layer['name']=='trace') {
        var json = layer.toGeoJSON();
        _this.jsonEvent.emit(json)
      }



  
    });
    // activate remoove btn
    let removeCtr = _this.el.nativeElement.querySelector('.leaflet-draw-edit-remove');
    _this.renderer.setElementAttribute(removeCtr, 'disabled', null);
  
  });
  this._map.on('draw:deletestop', function (e) { 
    var layers = e.target._layers;
    var elemId = e.target._leaflet_id;

    if(elemId == this.traceLayerId ) {
      this.trace ='';
    } else {

    }
    
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
   if(this.trace){

    let trace = JSON.parse(this.trace)

    let traceLayer = L.geoJSON(trace,
      /*{ style: function (f) {
              return f.properties;
      }}*/
  )
  //traceLayer.setStyle(function(feature) { return style; });

    // select the geometry, assuming only 1
  var newLayer = traceLayer.getLayers()[0];
  newLayer['name']='trace'
  /*newLayer['options']['style'] = {
    color: '#f44141', 
    weight: 6,
    opacity: 1,
    fillOpacity: 1,
    fillColor: '#f44141'
  };*/
  //var layerStyle = { fillColor: '#f44141', color: '#f44141', weight: 6,  opacity: 1,  fillOpacity: 1 };
  //newLayer.setStyle(function(feature) { return layerStyle; });

    
  newLayer.setStyle(style);
  drawnItems.addLayer(newLayer)
    this.traceLayerId = newLayer['_leaflet_id']

    drawControl.setDrawingOptions({
      polyline: false
    });
    
    if(L.polylineDecorator) {
      var arrowHead = L.polylineDecorator(traceLayer, {
        patterns: [
            {offset: '100%', repeat: 0, symbol: (L as any).Symbol.arrowHead({pixelSize: 15, polygon: false, pathOptions: {stroke: true}})}
        ]
      });
      arrowLayer.addLayer(arrowHead);
     arrowLayer.setStyle(style);

    }

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
