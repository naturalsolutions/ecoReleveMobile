interface FloreInterface {
    id : number,
    protocole : string,
    type_inventaire: string,
    nom_vernaculaire: string,
   nom_scientifique: string,

    type_milieu: string,
    abondance_dominance : string,
    strate : string,
    stade : string,
    surface : string,
    effectif: number,
    latitude:number,
    longitude: number,
    dateObs: number,
    projId : number,
    Comments : string,
    images : string,
    taxref_id : number

}
export   class Flore implements FloreInterface {  
        constructor(
          public id: number, 
          public protocole ='',
          public type_inventaire ='',
          public nom_vernaculaire ='',
          public nom_scientifique ='',
          
          public type_milieu ='',
          public abondance_dominance ='',
          public strate ='',
          public stade ='',
          public surface='',
          public effectif=null,
          public latitude= 0,
          public longitude=0,
          public dateObs =0,
          public projId,
          public Comments ='',
          public images,
          public taxref_id=null

        ) {
        } 
}