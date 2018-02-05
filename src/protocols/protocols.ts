import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams,ToastController } from 'ionic-angular';
import {ProtocolsServiceProvider} from '../providers/protocols-service';
import { ObservationPage} from '../observation/observation';
import {Geolocation } from '@ionic-native/geolocation'


@IonicPage()
@Component({
  selector: 'page-protocols',
  templateUrl: 'protocols.html',
  providers : [ProtocolsServiceProvider]
})
export class ProtocolsPage {

  protocols : any;
  projSelect :any = false;
  public projId : any

  constructor(public navCtrl: NavController, public navParams: NavParams, 
    public protocolsService : ProtocolsServiceProvider,private geolocation: Geolocation,
    public toastCtrl: ToastController,
  
  ) {
    this.projId = navParams.get("projId");
    this.loadProtocols()
  }

  ionViewDidLoad() {


  }
  ionViewWillEnter(){
    console.log(' protocols  page will enter')

  }

  ionViewDidEnter(){
    this.geolocation.getCurrentPosition({enableHighAccuracy:true, timeout: 12000, maximumAge: 0}).then(pos => {

    }, (err) => {
      let toast = this.toastCtrl.create({
        message: 'erreur gps',
        duration: 3000,
        position : 'top'
      });
      toast.present();
      
    });

  }

  loadProtocols (){
    this.protocolsService.load()
    .then(data =>{
      this.protocols = data;
    })

  }
  navToObs(id){
    // get selected protocol
    let protocol = this.protocols.find(x => x.id === id);
    console.log(protocol);
    this.navCtrl.push(ObservationPage, {protoObj:protocol, projId : this.projId, 'isEditable' : true});
  }

}
