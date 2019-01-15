import { Injectable } from '@angular/core';
//import 'rxjs/add/operator/map';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';

@Injectable()
export class ProtocolDataServiceProvider {

    private obsId  = new BehaviorSubject<number>(null);
    getObsId = this.obsId.asObservable()
    private projId  = new BehaviorSubject<number>(null);
    getProjId  = this.projId.asObservable()
    private protocol = new BehaviorSubject<object>({});
    getProtocol = this.protocol.asObservable()
    private segment = new BehaviorSubject<string>('');
    getSegment = this.segment.asObservable()
    private latitude   = new BehaviorSubject<number>(43.2);
    getLatitude = this.latitude.asObservable()
    private longitude = new BehaviorSubject<number>(5.3);
    getLongitude = this.longitude.asObservable()
    private trace = new BehaviorSubject<string>('');
    getTrace = this.trace.asObservable()

    public toto : string ='toto'


    constructor() {
        this.latitude.next(43.2)
        this.longitude.next(5.3)
    }

    setObsId(value: number){
        this.toto = 'tata'
        console.log('service set obs id', value)
        this.obsId.next(value)
        
    }

    setProjId(value: number){
        this.projId.next(value)
    }

    setProtocol(value: object){
        this.protocol.next(value)
    }

    setSegment(value:string){
        this.segment.next(value)
    }

    setLatitude(value: number){
    this.latitude.next(value)
    }

    setLongitude(value: number){
    this.longitude.next(value)
    }
    
    setTrace(value:string){
    this.trace.next(value)
    }

}
