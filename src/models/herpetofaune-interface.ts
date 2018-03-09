interface HerpetoInterface {
    id : number,
    protocole : string,
    type_inventaire: string,
    nom_vernaculaire: string,
    nom_scientifique: string,
    effectif: number,
    estimated : number,
    type_milieu: string,
    comportement: string,
    sexe: string,
    reproduction: string,
    latitude:number,
    longitude: number,
    dateObs: number,
    remarques : string,
    images : string
}
export   class Herpeto implements HerpetoInterface {  
    constructor(
        public id: number, 
        public protocole ='',
        public type_inventaire ='',
        public nom_vernaculaire ='',
        public nom_scientifique ='',
        public effectif=1,
        public estimated = 0,
        public type_milieu ='',
        public comportement ='',
        public sexe ='',
        public reproduction ='',
        public latitude= 0,
        public longitude=0,
        public dateObs =0,
        public remarques ='',
        public images
    ) {
    } 
}