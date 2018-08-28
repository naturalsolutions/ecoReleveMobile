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
    hauteur_detection: number,
    latitude:number,
    longitude: number,
    dateObs: number,
    projId : number,
    Comments : string,
    images : string,
    taxref_id : number,
    minimum : number
    
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
          
          public hauteur_detection =null,
          public latitude= 0,
          public longitude=0,
          public dateObs =0,
          public projId,
          public Comments ='',
          public images,
          public taxref_id=null,
          public minimum 
        ) {
        } 
}