interface FloreInterface {
    id : number,
    protocole : string,
    type_inventaire: string,
    nom_vernaculaire: string,
   nom_scientifique: string,

    type_milieu: string,
    coef_abondance : string,
    strate : string,
    stade_vegetatif : string,
    surface : string,
    effectif: number,
    latitude:number,
    longitude: number,
    dateObs: number,
    projId : number,
    remarques : string,
    images : string

}
export   class Flore implements FloreInterface {  
        constructor(
          public id: number, 
          public protocole ='',
          public type_inventaire ='',
          public nom_vernaculaire ='',
          public nom_scientifique ='',
          
          public type_milieu ='',
          public coef_abondance ='',
          public strate ='',
          public stade_vegetatif ='',
          public surface='',
          public effectif=null,
          public latitude= 0,
          public longitude=0,
          public dateObs =0,
          public projId,
          public remarques ='',
          public images,

        ) {
        } 
}