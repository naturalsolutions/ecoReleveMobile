interface BatrachofauneInterface {
    id : number,
    protocole : string,
    type_inventaire: string,
    nom_vernaculaire: string,
    effectif: number,
    type_milieu: string,
    comportement: string,
    sexe: string,
    reproduction : string,
    latitude:number,
    longitude: number,
    dateObs: number
}
export   class Batrachofaune implements BatrachofauneInterface {  
        constructor(
          public id: number, 
          public protocole ='',
          public type_inventaire ='',
          public nom_vernaculaire ='',
          public effectif=null,
          public type_milieu ='',
          public comportement ='',
          public sexe ='',
          public reproduction ='',
          public latitude= 0,
          public longitude=0,
          public dateObs =0
        ) {
        } 
}