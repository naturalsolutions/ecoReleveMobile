import {AvifauneComponent} from './proto-forms/avifaune/avifaune'

import {  HerpetofauneComponent } from './proto-forms/herpetofaune/herpetofaune'
import {  MammofauneComponent } from './proto-forms/mammofaune/mammofaune'
import {  ChiropteresComponent } from './proto-forms/chiropteres/chiropteres'
import {  FloreComponent } from './proto-forms/flore/flore'
import { InsectesComponent } from './proto-forms/insectes/insectes';  


export class AdFormService {

    constructor(){
    }
    getComponent(protoname) {
    let component : any 
    switch (protoname) {
        case 'Avifaune':
            component = AvifauneComponent
            break
        case 'Herpeto':
            component = HerpetofauneComponent
            break
        case 'Mammo':
            component = MammofauneComponent
            break
        case 'Chiropteres' : 
        component = ChiropteresComponent
            break
        case 'Flore' : 
        component = FloreComponent
            break
        case 'Insectes' : 
        component = InsectesComponent
            break
    }
    return component
  }
}
