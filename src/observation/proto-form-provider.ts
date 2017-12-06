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
        case 'Avifaune':
            component = AvifauneComponent
            break
        case 'Batracho':
            component = BatrachofauneComponent
            break
        case 'Herpeto':
            component = HerpetofauneComponent
            break
        case 'Mammo':
            component = MammofauneComponent
            break
    }
    return component
  }
}