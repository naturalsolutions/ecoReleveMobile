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

  constructor(public navCtrl: NavController, public navParams: NavParams, public protocolsService : ProtocolsServiceProvider) {
    this.loadProtocols()
  }

  ionViewDidLoad() {


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
    this.navCtrl.push(ObservationPage, {protoObj:protocol});
  }

}
