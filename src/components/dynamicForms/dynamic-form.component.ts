import { Component,  Input, Output,EventEmitter,ViewChild,ElementRef }  from '@angular/core';
import { AlertController,ToastController  } from 'ionic-angular';
import { FormGroup }                 from '@angular/forms';

import { FieldControlService }    from './dynamic-form/field-control.service';
import { FieldService } from './dynamic-form/protocol.service';
import {ObsProvider} from '../../providers/obs/obs'
import { Subscription } from 'rxjs/Subscription';
import { CommonService } from '../../shared/notification.service';
import {config } from '../../config';
import { ProtocolDataServiceProvider } from '../../providers/protocol-data-service'
import {MapComponent} from '../map/map'

@Component({
  selector: 'dynamic-form',
  templateUrl: './dynamic-form-component.html',
  providers: [FieldControlService, FieldService , ProtocolDataServiceProvider]
})
export class DynamicFormComponent  {
  
  
  @Output() editSegment = new EventEmitter()
  @Output() updatePos= new EventEmitter()
  @Output() sameStation = new EventEmitter()
  @Output() editMapSize = new EventEmitter()
  @Input() params = {}


  @ViewChild(MapComponent) child: MapComponent
  //@Input() fields: FieldBase<any>[] = [];
  fields: any
  form: FormGroup
  payLoad = ''
  dateObs : any
  latitude : any = 0
  longitude : any = 0
  precision : any = 0
  trace = ""
  public images = []
  
  private obsSaved : boolean = false
  private subscription: Subscription
  private formChanged : boolean = false
  private instance : any

  public segment: string  
  private protocol: any  
  public  obsId : number  
  public projId : number  

  service : any
  mapParams : any = {}


  //segment = 'obligatoire'

  

  constructor(
    private qcs: FieldControlService, 
    service : FieldService, 
    public data : ObsProvider, 
    public commonService: CommonService,
    private alertCtrl: AlertController,
    public toastCtrl: ToastController,
    private protoDataService : ProtocolDataServiceProvider,
    private el: ElementRef,
    

    ) {


      
      this.service = service

     this.dateObs = Date.now();
     
        // get shared protocol data
     
    }

  /*ngOnInit() {
   // this.form = this.qcs.toFormGroup(this.fields);
   
  }*/
  ngAfterViewInit() {
    /*if(this.params){
      this.segment = this.params.segment
    this.protocol = this.params.protocol
    this.obsId = this.params.obsId
    this.projId  = this.params.projId
    }*/

    
  }
  ngOnInit() {

    this.obsId = this.params['obsId']
    this.projId = this.params['projId']
    this.protocol = this.params['protocol']
    this.segment = this.params['segment']
    this.data.getObs(this.projId);
    this.mapParams = {
      projId : this.projId,
      latitude : 0,
      longitude : 0,
      trace :'',
      precision : 0
    }


          // update existing obs
          let protocolId = this.protocol.id

          this.service.loadProtocols(protocolId).then(data => {
            this.fields = data  ; 
            this.form = this.qcs.toFormGroup(this.fields);
            this.segment = 'localisation';

            this.initform()

      
           })
          



   }

   initform(){
    

    if(this.obsId){
      this.instance = this.form.value

      this.data.getObsById(this.obsId).then((obs)=>{

         for(var key in obs) {
           if(this.form.controls[key]) {
            this.form.controls[key].setValue( obs[key])
           }
           if(key=='images'){
            this.images = obs[key]
          }
          if(key=='trace'){
            this.trace = obs[key]
            this.mapParams.trace = obs[key]
          }
        }

        

        this.buildForm()

          // display coordinates
          this.latitude = parseFloat(obs['latitude']);
          this.longitude = parseFloat(obs['longitude']);
          this.mapParams.latitude = this.latitude 
          this.mapParams.longitude = this.longitude
          this.dateObs = obs['dateObs']
          //this.mapPrams.latitude = this.latitude
          //this.mapPrams.longitude = this.longitude
          if(!config.disableLocalisation && (! this.protocol['disableLocalisation'])) {
            this.child.updatePosition(this.latitude,this.longitude)
          }
          

          // get json trace if exists
          /*if(this.instance.trace) {
            this.trace = this.instance.trace
          } else {
            this.trace = null;
          }*/
          //this.mapParams.trace = this.trace
          //this.mapPrams.projId= this.projId


          this.form.valueChanges.subscribe(data => {
            this.formChanged = true;
          })
      });

    } else {
      this.form.valueChanges.subscribe(data => {
        this.formChanged = true;
      })
    
      /*console.log('*** this form  **')
      console.log(this.form)
      console.log(this.fields)
      //this.buildForm()
      for(var key in this.form.controls) {
        let value = this.form.controls[key].value
        this.form.controls[key].setValue(value)
      }*/
       
    }


   // TODO this.projId = this.navParams.data.projId;

    // subscription to notify exit view obsto store data
   this.subscription = this.commonService.notifyObservable$.subscribe((res) => {
     if( (!this.obsId) && (!this.obsSaved)  && (this.formChanged)) {    // && (!this.obsId)
           this.saveCurrent()
     }

  });

    if(config.disableLocalisation || (this.protocol['disableLocalisation'])) {
      this.segment = 'obligatoire';
    }

   }

  onSubmit(segment) {
    //this.payLoad = JSON.stringify(this.form.value);
    //console.log(this.form.value)
        // check if model is valid
        this.form.value.dateObs = this.dateObs
        this.form.value.projId = this.projId
        this.form.value.protocole = this.protocol.name
        this.form.value.label = this.protocol.label

        console.log(this.form.value)
        if ((!this.form.invalid) &&(this.segment =='facultatif')) {

          if((!config.disableLocalisation) && (! this.protocol['disableLocalisation'])){
            if((!this.latitude)||(!this.longitude)) {
              this.presentToast('Coordonnées non renseignées. Erreur GPS', 'top' )
              return
            }
          }


          this.form.value.finished = true;
          this.form.value.images= this.images;
          this.form.value.trace = this.trace
          console.log(this.form.value)
          this.form.value.projId = this.projId;
          this.formUpdateData();

          this.presentToast('Observation enregistrée.', 'top' )
          let latitude = this.latitude
          let longitude = this.longitude
          // update map params
          this.mapParams.longitude = this.longitude
          this.mapParams.latitude = this.latitude

          let fieldsvalue = {}
          let fieldsName = []
          if(config.defautLastObsValue) {
            fieldsName = config['fieldsName']
            fieldsName.forEach(element => {
              if(this.form.value[element]) {
                fieldsvalue[element] = this.form.value[element]
              }
            });
            //fieldsvalues = this.form.value[fieldName]
          }
          if(config.defaultLastStation){
            this.sameStation.emit(true) 
          }
          this.mapParams.trace = ""
          this.reinitform(latitude,longitude,fieldsvalue);
    

        } else {
          if(this.segment =='facultatif'){
            this.presentAlert()
          }
          
        }
  }

updatePosition(lat, lon) {
  if(lat && lon) {
    this.handleLatChange(lat)
    this.handleLonChange(lon) 
    this.protoDataService.setLatitude(lat)
    this.protoDataService.setLongitude(lon)
    this.child.latitude = lat
    this.child.longitude = lon
    this.child.updatePosition(lat,lon)
  }


}

handleLatChange(lat){
  lat = lat.toFixed(5);
  this.form.value.latitude = lat;
  this.latitude = lat;
}

handleLonChange(lon){
  lon = lon.toFixed(5);
  this.form.value.longitude = lon;
  this.longitude = lon;
}
handlePrecisionChange(precision){
  precision = precision.toFixed(1);
  this.precision = precision;

}

setImages(tab){
  this.form.value.images = tab;
  console.log('***images****');
  console.log(this.form.value.images);
}

formUpdateData() {
  let value = this.form.value
  // set date value
  value.dateObs = this.dateObs;
  // set latitude & longitude
 value.latitude = this.latitude;
 value.longitude = this.longitude;
 value.projId = this.projId;
  // set id value if exists 
  if(this.obsId){
     value.id = this.obsId;
  }
  this.data.saveObs(value)
  this.obsSaved = true;
  if( !value.pushed){
    value.pushed = false;
  }
  this.images = [];
}

saveCurrent(){
  let value = this.form.value;
  value.finished = false;
  value.dateObs = this.dateObs
  value.projId = this.projId
  value.protocole = this.protocol.name
  value.label = this.protocol.label
  //let guid = Guid.create();
  value.guid =     
  //console.log(this.guid);*/
  this.formUpdateData();
}

reinitform(latitude,longitude,fieldsvalue){
    
  /*this.formModel.valueChanges.subscribe(data => {
    this.formChanged = true;
  })*/
  for(var key in this.form.value) {
    if((key !='projId') && (key !='protocole')  && (key !='label') && (this.form.controls[key])){
      this.form.controls[key].setValue( null);
    }
     
  }
  this.obsId = 0
  this.trace =  ""
  

  
  if(config.defaultLastStation) {
    // TODO : update val -> obligatoire
    
    //this.parent.segment = 'obligatoire';

    this.editSegment.emit('obligatoire');
    this.form.value.latitude = latitude;
    this.form.value.longitude = longitude;
    // display coordinates
    this.latitude = parseFloat(latitude)
    this.longitude = parseFloat(longitude)

  } else {
    //this.parent.segment = 'localisation';
    this.editSegment.emit('localisation');
    this.updatePos.emit(true);
  

  }
  if(config.defautLastObsValue) {
    //this.form.value[fieldName] = fieldvalue
    for (let key in fieldsvalue) {
      let value = fieldsvalue[key];
      if(this.form.controls[key]){
        this.form.controls[key].setValue( value);
      }
  }
   
    //this.instance[fieldName] = fieldvalue
  }
  
  this.buildForm();
  
  // update date 
  this.dateObs = Date.now();//  Date.now().getTime();
  this.form.value.dateObs = this.dateObs;

  console.log(' initialisation form ')
  console.log(this.form.value)
  

}

buildForm(){
  // set date value
  this.dateObs = Date.now();//  Date.now().getTime();
  //let elem  = this.el.nativeElement.querySelectorAll('.checkbox-icon')
  if(this.form.value.images && (this.form.value.images.length >0)) {
    this.images = this.form.value.images;
  }
  this.form.value.dateObs = this.dateObs;
  // detect form changes to activate "save current obs"
  this.form.valueChanges.subscribe(data => {
    this.formChanged = true;
  })
  
}

presentAlert() {
  let alert = this.alertCtrl.create({
    title: 'Champs requis',
    subTitle: 'Merci de saisir les champs obligatoires.',
    buttons: ['Ok']
  });
  alert.present();
}

deleteImage(image){
  let self = this;
  let alert = this.alertCtrl.create({
    title: 'Suppression de photo',
    message: 'Etes vous sur(e) de supprimer cette photo?',
    buttons: [
      {
        text: 'Annuler',
        role: 'cancel',
        handler: () => {

        }
      },
      {
        text: 'Oui',
        handler: () => {
          self.images.forEach( (item, index) => {
            if(item === image) self.images.splice(index,1);
          });
        }
      }
    ]
  });
  alert.present();
}

presentToast(message, position) {
  let toast = this.toastCtrl.create({
    message: message,
    duration: 2000,
    position : position,
    cssClass: "toast-success"
  });
  toast.present();
}

ngOnDestroy() {
  this.subscription.unsubscribe();
}
/*handleMapSize($event){
  this.editMapSize.emit($event)
}*/
handleTraceChange(json){
  console.log('*****json******')
  console.log(json)
  this.trace = JSON.stringify(json) 
  this.mapParams.trace = JSON.stringify(json) 

}
updateGPS(){
  this.child.updateGPS();
}


}
