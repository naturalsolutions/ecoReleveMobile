import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import {ProtocolsServiceProvider} from '../providers/protocols-service';
import { ObservationPage} from '../observation/observation';


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

  constructor(public navCtrl: NavController, public navParams: NavParams, public protocolsService : ProtocolsServiceProvider) {
    this.projId = navParams.get("projId");
    this.loadProtocols()
  }

  ionViewDidLoad() {


  }
  ionViewWillEnter(){
    console.log(' protocols  page will enter')

  }

  ionViewDidEnter(){
    console.log(' protocols  page did enter')

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
    this.navCtrl.push(ObservationPage, {protoObj:protocol, projId : this.projId});
  }

}
