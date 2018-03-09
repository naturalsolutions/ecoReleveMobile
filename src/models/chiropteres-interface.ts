interface ChiropteresInterface {
    id : number,
    protocole : string,
    type_inventaire: string,
    nom_vernaculaire: string,
   nom_scientifique: string,
    effectif: number,
    estimated : number,
    nb_contact : number,
    type_milieu: string,
    comportement: string,
    sexe: string,
    hauteur_detection: string,
    latitude:number,
    longitude: number,
    dateObs: number,
    projId : number,
    remarques : string,
    images : string
}
export   class Chiropteres implements ChiropteresInterface {  
        constructor(
          public id: number, 
          public protocole ='',
          public type_inventaire ='',
          public nom_vernaculaire ='',
          public nom_scientifique ='',
          public effectif=1,
          public nb_contact=null,
          public estimated = 0,
          public type_milieu ='',
          public comportement ='',
          public sexe ='',
          
          public hauteur_detection ='',
          public latitude= 0,
          public longitude=0,
          public dateObs =0,
          public projId,
          public remarques ='',
          public images
        ) {
        } 
}