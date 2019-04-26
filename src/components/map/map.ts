
declare const L: any;

import { Component, ElementRef, Output, EventEmitter, Input, Renderer } from '@angular/core'
import { NavController, NavParams, Platform, AlertController } from 'ionic-angular'
//import "leaflet"
import '../../assets/leaflet/leaflet.js'
import '../../assets/leaflet-draw/leaflet.draw-src.js'
import { ProjectsServiceProvider } from '../../providers/projects-service'
import { MapModel } from '../../shared/map.model'
import { Geolocation } from '@ionic-native/geolocation'
import { Storage } from '@ionic/storage'
import { Network } from '@ionic-native/network'
//import 'leaflet-draw';
import { ProtocolDataServiceProvider } from '../../providers/protocol-data-service'
import { Subscription } from 'rxjs/Subscription';


@Component({
  selector: 'map',
  templateUrl: 'map.html',
  providers: [
    ProjectsServiceProvider, ProtocolDataServiceProvider
  ]
})

export class MapComponent {



  @Input() gpsPickerEvent: boolean
  /*@Input() latitude
  @Input() longitude
  @Input() projId*/
  @Input() mapParams: object = {}
  @Output() fullsize = new EventEmitter()
  @Output() latEvent = new EventEmitter()
  @Output() lonEvent = new EventEmitter()
  @Output() jsonEvent = new EventEmitter()




  //private mapModel: MapModel
  private _map: any
  public mapEl
  //private _bounds: any
  latitude: number = 34
  longitude: number = 5
  projId: any
  markers: any = []
  marker: any = null
  mapModel: any
  public connectionStatus: String = 'online'
  traceLayerId: any
  drawnItems: any = L.featureGroup();
  //private projId

  private trace
  subscription: Subscription
  style: any
  removeCtr: any
  drawControl: any


  constructor(
    public navCtrl: NavController,
    //private viewCtrl: ViewController,
    public navParams: NavParams,
    private el: ElementRef,
    private geolocation: Geolocation,
    //private NotificationService: MapNotificationService,
    public projectsService: ProjectsServiceProvider,
    public storage: Storage,
    private network: Network,
    public platform: Platform,
    private renderer: Renderer,
    private alertCtrl: AlertController,
    //private protoDataService: ProtocolDataServiceProvider

    // private elRef:ElementRef


  ) {

  }

  ngOnInit() {

    console.log(L.Draw.Polygon.prototype, 'la')
    //oooo

    document.addEventListener("click", getEvtType, false);

    function getEvtType(evt) {
      //console.group();

      console.log(evt.target);
      console.log(evt.target.className.indexOf('leaflet-pane'))
      if (evt.target.className.indexOf('leaflet-pane') > -1) {
        evt.stopPropagation();
        console.log('la')
      }

      //document.getElementById("Etype").innerHTML = currEvent;

      //console.groupEnd();
    }


    this.latitude = this.mapParams['latitude']
    this.longitude = this.mapParams['longitude']
    this.projId = this.mapParams['projId']
    this.trace = this.mapParams['trace']
    // get shared protocol data

    /*this.subscription = this.protoDataService.getProjId.subscribe(
      (projId) => {
        this.projId = projId;
      }
    );*/

    /* this.subscription = this.protoDataService.latitude.subscribe(
       (latitude) => {
         this.latitude = latitude;
       }
     );
 
     this.subscription = this.protoDataService.longitude.subscribe(
       (longitude) => {
         this.longitude = longitude;
         
       }
     );*/

    /* this.subscription = this.protoDataService.getTrace.subscribe(
       (trace) => {
         this.trace = trace;
       }
     );*/





  }
  initMap() {
    this.mapModel = new MapModel()
    let folderName = 'tuilesProj-' + this.projId;
    this.mapModel.initialize({ 'folder': folderName })
      .then(() => {
        this.onMapReady()
      })

    this.network.onConnect().subscribe(data => {
      this.connectionStatus = 'online';
      if (this.mapModel.tileLayer) {
        this.onConnectionStatusChange()
      }

    }, error => {
      console.log(error)
    });

    this.network.onDisconnect().subscribe(data => {
      this.connectionStatus = 'offline';
      if (this.mapModel.tileLayer) {
        this.onConnectionStatusChange()
      }
    }, error => {
      console.log(error)
    });

    console.log('before extend ....')
  }

  ngOnChanges() {
    /*
    if(this.gpsPickerEvent) {
      alert('on map comp')
  
      this._map.on('click', function(e) {        
        var popLocation= e.latlng;
        var icon = L.icon({
          iconUrl: 'assets/icon/picto_red2.png',
          iconSize:     [60, 60] 
        });
  
        let marker = L.marker([popLocation], {icon: icon}).addTo(this.drawnItems as any)
        console.log(popLocation)
       
    });
  
    } else {
      this._map.off('click')
    }
    */
  }

  ionViewDidEnter() {


  }
  ngAfterViewInit() {
    this.initMap()
  }
  displayfull() {
    //this.renderer.setElementStyle(this.el.nativeElement.querySelector('.header'), 'display', 'none' );
    this.fullsize.emit(true);
    this.renderer.setElementStyle(this.el.nativeElement.querySelector('.map-container'), 'height', '100%');
    this.renderer.setElementStyle(this.el.nativeElement.querySelector('.map-container'), 'width', '100%');
    this.renderer.setElementStyle(this.el.nativeElement.querySelector('.map-container'), 'position', 'fixed');
    this.renderer.setElementStyle(this.el.nativeElement.querySelector('.fullmap'), 'display', 'none');
    this.renderer.setElementStyle(this.el.nativeElement.querySelector('.smallmap'), 'display', 'block');
    this.renderer.setElementStyle(this.el.nativeElement.querySelector('.smallmap'), 'display', 'block');


    this._map._onResize();
  }
  displaysmall() {
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



    let googleSat = L.tileLayer('http://{s}.google.com/vt/lyrs=s&x={x}&y={y}&z={z}', {
      maxZoom: 25,
      subdomains: ['mt0', 'mt1', 'mt2', 'mt3']
    });
    let layerGroup = L.layerGroup([])

    layerGroup.addLayer(googleSat);
    let layerControl = L.control.layers().addTo(this._map);
    layerControl.addOverlay(layerGroup, "Google satellite");
    this.mapModel.tileLayer.addTo(this._map);


    if (this.platform.is('cordova')) {
      this.connectionStatus = this.network.type == 'none' ? 'offline' : 'online'
      this.onConnectionStatusChange()
    }

    if (!this.latitude && (!this.longitude)) {
      // set map on proj bbox if there is not marker 
      if (!this.marker) {
        this.storage.get('bboxProj-' + this.projId).then(bbox => {
          if (bbox) {
            this._map.fitBounds([[bbox['minLat'], bbox['minLng']], [bbox['maxLat'], bbox['maxLng']]])
          }
        })
      }
      this.geolocation.getCurrentPosition().then((position) => {
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
    this.projectsService.getProj().then(data => {

      for (let proj in data) {
        console.log(data[proj])
        if (data[proj]['ID'] == this.projId) {
          geometry = data[proj]['geometry'];
          if (geometry) {
            var myLayer = L.geoJSON().addTo(this._map);
            myLayer.addData(geometry);

          }
        }
      }
    })

    // reload map tiles for current project if not yet loaded

    this.storage.get('tilesLoadedForProj-' + this.projId).then(data => {
      if (data != true) {
        //this.downloadTilesMsg()
      }
    });
  }

  downloadTilesMsg() {
    let alert = this.alertCtrl.create({
      title: 'Tuiles cartographiques',
      message: 'Voulez-vous relancer le chargement de tuiles cartographiques manquantes pour ce projet?',
      buttons: [
        {
          text: 'Non',
          role: 'cancel',
          handler: data => {
            var key = 'tilesLoadedForProj-' + this.projId
            this.storage.set(key, true);
          }
        },
        {
          text: 'Ok',
          handler: data => {
            this.storage.get('bboxProj-' + this.projId).then(data => {
              if (data) {
                this.projectsService.downloadTiles(data, this.projId, this.mapModel.tileLayer)
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
      iconSize: [60, 60] // size of the icon
    });


    let arrowLayer = L.featureGroup();
    var style = {
      color: '#f44141',
      weight: 6,
      opacity: 1,
      fillOpacity: 1,
      fillColor: '#f44141'
    };

    this.style = style

    this.drawnItems['name'] = 'markeur';
    this._map.addLayer(this.drawnItems);
    this._map.addLayer(arrowLayer);


    let self = this;


    this.marker = L.marker([this.latitude, this.longitude], { icon: icon }).addTo(this.drawnItems as any).on('click', onClick);


    let _this = this;
    var drawControl = new (L as any).Control.Draw({
      edit: {
        featureGroup: this.drawnItems,
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
        circle: false,
        marker: false,
        circlemarker: false,
        rectangle: false
      }
    });

    this.drawControl = drawControl

    function onClick(e) {
      console.log('click');
      // alert(e.latlng);
      //drawnItems['editable'].enable()
      self.el.nativeElement.querySelector('.leaflet-draw-edit-edit').click()
      let isedited = e.target.edited;
      if (isedited) {
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

    this.marker.on('dragend', function (e) {
      console.log('marker dragend event');
    });


    this._map.addControl(drawControl);
    //drawnItems['editable'].enable()
    let that = this;

    // disable remove btn
    let removeCtr = _this.el.nativeElement.querySelector('.leaflet-draw-edit-remove');
    _this.renderer.setElementAttribute(removeCtr, 'disabled', 'disabled');

    this.removeCtr = removeCtr

    console.log(this._map);

    this._map.on((L as any).Draw.Event.CREATED, function (e) {
      var type = e.layerType,
        layer = e.layer;
      layer['name'] = 'trace';
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

        if (L.polylineDecorator) {
          var arrowHead = L.polylineDecorator(layer, {
            patterns: [
              { offset: '100%', repeat: 0, symbol: L.Symbol.arrowHead({ pixelSize: 15, polygon: false, pathOptions: { stroke: true } }) }
            ]
          });
        }



        if (arrowHead) {
          arrowLayer.addLayer(arrowHead);
        }


      }

      if (this.drawnItems) {
        this.drawnItems.addLayer(layer);
      } else {

        // console.log(this._layers)
        for (let key in this._layers) {
          let drawlayer = this._layers[key]
          if (drawlayer['name'] && (drawlayer['name'] == 'markeur')) {
            console.log(this._layers[key]);
            drawlayer.addLayer(layer);
          }

        }
      }


      drawControl.setDrawingOptions({
        polyline: false
      });
      drawControl.draw = false;

      // disable draw mode
      let drawCtr = _this.el.nativeElement.querySelector('.leaflet-draw-draw-polyline');
      _this.renderer.setElementAttribute(drawCtr, 'disabled', 'disabled');
      // activate remove btn
      let removeCtr = _this.el.nativeElement.querySelector('.leaflet-draw-edit-remove');
      _this.renderer.setElementAttribute(removeCtr, 'disabled', null);


    });

    

    this._map.on('draw:drawstart', function (e) {
      //e.stopPropagation();
      console.log(e)
    });
    this._map.on('draw:edited', function (e) {

      var layers = e.layers;
      //var layers = e.target._layers;
      layers.eachLayer(function (layer) {


        if (layer instanceof (L as any).Marker) {

        } else {
          _this.removeRow(arrowLayer);

          if (L.polylineDecorator) {

            var arrowHead = (L as any).polylineDecorator(layer, {
              patterns: [
                { offset: '100%', repeat: 0, symbol: (L as any).Symbol.arrowHead({ pixelSize: 15, polygon: false, pathOptions: { stroke: true } }) }
              ]
            });
            arrowLayer.addLayer(arrowHead);
            arrowLayer.setStyle(style);


          }



        }

        if (layer['_latlng']) {
          let latitude = layer['_latlng'].lat
          let longitude = layer['_latlng'].lng
          that.latEvent.emit(latitude)
          that.lonEvent.emit(longitude)
        }
        if (layer['name'] == 'trace') {
          var json = layer.toGeoJSON();
          _this.jsonEvent.emit(json)
        }




      });
      // activate remoove btn
      let removeCtr = _this.el.nativeElement.querySelector('.leaflet-draw-edit-remove');
      _this.renderer.setElementAttribute(removeCtr, 'disabled', null);

    });
    this._map.on('draw:deletestop', function (e) {

      var elemId = e.target._leaflet_id;

      if (elemId == this.traceLayerId) {
        this.trace = '';
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
    if (this.trace) {

      let trace = JSON.parse(this.trace)

      let traceLayer = L.geoJSON(trace,

      )

      var newLayer = traceLayer.getLayers()[0];
      newLayer['name'] = 'trace'


      newLayer.setStyle(style);
      this.drawnItems.addLayer(newLayer)
      this.traceLayerId = newLayer['_leaflet_id']

      drawControl.setDrawingOptions({
        polyline: false
      });

      if (L.polylineDecorator) {
        var arrowHead = L.polylineDecorator(traceLayer, {
          patterns: [
            { offset: '100%', repeat: 0, symbol: (L as any).Symbol.arrowHead({ pixelSize: 15, polygon: false, pathOptions: { stroke: true } }) }
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

    this.checkTraceLayer()


    console.log('before extend 2')
    L.Draw.Polygon.prototype._updateFinishHandler = function () {
      console.log('extend ....')
      var markerCount = this._markers.length;

      // The first marker should have a click handler to close the polygon
      if (markerCount === 1) {
        this._markers[0].on('click', this._finishShape, this);
      }

      // Add and update the double click handler
      if (markerCount > 2) {
        this._markers[markerCount - 1].on('dblclick', this._finishShape, this);
        // Only need to remove handler if has been added before
        if (markerCount > 3) {
          this._markers[markerCount - 2].off('dblclick', this._finishShape, this);
        }
      }
      /*var markerCount = this._markers.length;
      // The last marker should have a click handler to close the polyline
      if (markerCount > 1) {
        
                              setTimeout(function(){
                                       if ( this._markers === undefined ) {
                                               return;
                                       }
        
                                       this._markers[this._markers.length - 1].on('click', this._finishShape, this);
                               }.bind(this), 75); 
                        }
  
      // Remove the old marker click handler (as only the last point should close the polyline)
      if (markerCount > 2) {
        this._markers[markerCount - 2].off('click', this._finishShape, this);
      }*/
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

  removeRow(arrowLayer) {

    arrowLayer.eachLayer(function (layer) {
      arrowLayer.removeLayer(layer)

    });
  }
  handlegpsPicker() {
    alert('event gps picker')
  }
  ngOnDestroy() {
    // this.subscription.unsubscribe();
  }
  updatePosition(lat, lng) {

    if (this.marker) {
      this.updateMarker(lat, lng)
      return
    } else {
      setTimeout(() => {
        this.updateMarker(lat, lng)
      }, 1000);
    }
  }
  updateMarker(lat, lng) {
    if (this.marker) {
      this.marker.setLatLng([lat, lng]).update();
      this._map.panTo(new L.LatLng(lat, lng), { animate: false });
    } else {
      this.latitude = lat
      this.longitude = lng
      this.onMapModelReady()
    }

  }
  checkTraceLayer() {
    // check if trace layer is added, add it if not
    setTimeout(() => {
      let layers = this.drawnItems._layers
      var length = Object.keys(layers).length;
      if ((length == 1) && (this.mapParams['trace'])) {
        let trace = JSON.parse(this.mapParams['trace'])
        let traceLayer = L.geoJSON(trace)
        var newLayer = traceLayer.getLayers()[0];
        newLayer['name'] = 'trace'
        newLayer.setStyle(this.style);
        this.drawnItems.addLayer(newLayer)
        this.traceLayerId = newLayer['_leaflet_id']

        this.drawControl.setDrawingOptions({
          polyline: false
        });

        // disable  draw btn
        let drawCtr = this.el.nativeElement.querySelector('.leaflet-draw-draw-polyline');
        this.renderer.setElementAttribute(drawCtr, 'disabled', 'disabled');
        this.renderer.setElementAttribute(this.removeCtr, 'disabled', null);
      }
    }, 500)


  }


}
