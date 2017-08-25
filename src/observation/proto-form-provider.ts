import {AvifauneComponent} from './proto-forms/avifaune/avifaune'
import { BatrachofauneComponent } from './proto-forms/batrachofaune/batrachofaune'
import {  HerpetofauneComponent } from './proto-forms/herpetofaune/herpetofaune'
import {  MammofauneComponent } from './proto-forms/mammofaune/mammofaune'


export class AdFormService {

    constructor(){
    }
    getComponent(protoname) {
    let component : any 
    switch (protoname) {
        case 'avifaune':
            component = AvifauneComponent
            break
        case 'batrachofaune':
            component = BatrachofauneComponent
            break
        case 'herpetofaune':
            component = HerpetofauneComponent
            break
        case 'mammofaune':
            component = MammofauneComponent
            break
    }
    return component
  }
}
