// class Material{
// /**
//  *Creates an instance of Material.
//  * @param {*} nombre
//  * @param {*} pa puntos de armadura
//  * @param {number} [mPr=5] multiplicador de los puntos de resistencia
//  * @memberof Material
//  */
// constructor(nombre, pa,mPr=5){
//     this.nombre=nombre
//     this.pa=pa
//     this.mPr=mPr
//  }

// }

class Material {
    constructor(nombre, pa, peso, precio) {
        this.nombre = nombre;
        this.peso = peso;
        this.precio = precio;
        this.pa = pa;
    }
}

class Calidad {
    constructor(nombre, pa, peso, precio) {
        this.nombre = nombre;
        this.peso = peso;
        this.precio = precio;
        this.pa = pa;
    }
}

class TipoArmadura {
    constructor(
        nombre
        , pa
        , precio
        , pinicial
        , pmul
        , rigida
        , metal
    ) {
        this.nombre = nombre
        this.pa = pa
        this.precio = precio
        this.pinicial = pinicial
        this.pmul = pmul
        this.rigida = rigida
        this.metal = metal

    }
}


//TODO hacerla por capas?
class Armadura {
    constructor(piezas) {
        this.capas = 0; //capas de armaduras, acolchada, malla, peto, etc...
        this.piezas = piezas;
    }
    /**
     * Devuelve las piezas que cubren esa localización
     *
     * @param {string} localizacion la localización 
     * @memberof Armadura
     */
    daPiezas(localizacion) {
        let lista = [];
        this.piezas.forEach(p => {
            let l = (p.daLoc(localizacion))
            console.log(l);
            if (l) { lista.push((l)) }
        });

        // en que tiene un orden mayor recibe el impacto antes
        lista.sort(function (a, b) { return b.orden - a.orden });
        return lista;

    }

    atacar(daño, tipo, localizacion) {
        let d = daño;
        let lista = daPiezas(localizacion);
        if (lista.length < 1) return daño;
        lista.forEach(l => {
            if (d = 0) return 0;
            d = l.atacar(d, tipo);
        });
        return d;
    }
}

/**
 *
 *
 * @class Pieza
 */
class Pieza {

    constructor(localizaciones, orden = 0, material, tipo, ) {
        this.localizaciones = [];
        //por cada nombre de localizacion se crea una  
        localizaciones.forEach(l => {
            // this.localizaciones.push(new LocPieza(l, tipo.pa + material.pa, material.mPr))
            this.localizaciones.push(new LocPieza(l, 5, 5, orden))
        });
    }


    /**
     * Devuelve la localizacion por el nombre
     *
     * @param {string} nombre de la localización
     * @returns la LocPieza con esa localización
     * @memberof Pieza
     */
    daLoc(nombre) {
        let loc = false;
        this.localizaciones.forEach(l => {
            console.log(l.nombre + ":" + nombre);
            if (l.nombre == nombre) loc = l;
        });

        return loc;
    }

}


class LocPieza {
    constructor(localizacion, pa, mPr = 5, orden = 0) {
        this.nombre = localizacion;
        // this.pa = pa;
        this.pr = pa * mPr //TODO
        //el orden de las capas (0 lo más pegado al cuerpo)
        this.orden = orden;
    }

    get pa() {
        return Math.round(this.pr / mPr); //devuelve los puntos de resistancia entre su multiplicador
    }

    atacar(daño, tipo) {
        if (daño <= this.pa)
            return 0;
        else {
            let d = daño - this.pa; 5
            this.pr = this.pr - daño; //se restan PR
            return d;
        }
    }

}

Array.prototype.lado = function (lado) {
    let copia = []
    this.forEach(element => {
        element += " " + lado;
        copia.push(element)
    });
    return copia;
}






let daPiezas = a.daPiezas("Pecho");

//Materiales
const Hierro = new Material("Hierro", 1, 1, 0);
const Acero = new Material("Acero", 1, 1.5, 1);
const AcEnano = new Material("Acero Enano", 0.77, 13, 3);
const AcElfico = new Material("Acero Élfico", 0.55, 20, 2);
const AcLigero = new Material("Acero Ligero", 0.9, 1.5, 1);
const AcPesado = new Material("Acero Pesado", 1.25, 1.3, 2);

//Fluctuacion del Mithril
const Mithril = new Material("Mithril", 0.25, 10000, 6);
const MithrilNegro = new Material("Mithril Negro", 0.25, 30000, 7);

//Materiales de Cuero
const Normal = new Material("Normal", 1, 1, 0);
const Excelente = new Material("Excelente", 1, 10, 1);
const Unicornio = new Material("Unicornio", 1, 50000, 7);


const Cuero = new TipoArmadura("Cuero", 1, 20, false, 1.5, 0.1, false);
const CueroDuro = new TipoArmadura("Cuero Duro", 2, 20, true, 3, 0.2, false);
const Cuirbouilli = new TipoArmadura("Cuirbouilli", 3, 45, true, 3, 0.2, false);
const Bezanteada = new TipoArmadura("Bezanteada", 4, 70, false, 4.5, 0.3, false);
const CotaAnillos = new TipoArmadura("Anillos", 5, 110, false, 6, 0.4, true);
const Lamelar = new TipoArmadura("Lamelar", 6, 200, true, 10, 0.75, true);
const Escamas = new TipoArmadura("Escamas", 6, 120, true, 12, 0.8, true);
const Brigandina = new TipoArmadura("Brigandina", 7, 120, true, 13.5, 0.9, true);
const CotaMalla = new TipoArmadura("Malla", 7, 240, false, 12, 0.8, true);
const Coraza = new TipoArmadura("Coraza", 8, 270, true, 15, 1, true);

// partes para crear distintas armaduras
let capucha = ["Craneo", "Cuello"];
let chaleco = ["Pecho", "Abdomen"];
let manga = ["Hombro", "Codo", "Brazo Superior", "Antebrazo"];
manga = manga.lado('I')

let blusa = new Pieza(chaleco);


let cota = new Pieza(chaleco, 1);
let coraza = new Pieza(chaleco, 2)
let a = new Armadura([cota, blusa, coraza]);


// var cabeza = new Localizacion("Cabeza", 0.333, 1, 9, 0)
var brazoD = []
// var brazoI = (new Localizacion("Brazo I", 0.25, 27, 43, 0))
// //TODO:Habría que hacer subLocalización?
// var pecho = (new Localizacion("Pecho", 0.4, 44, 58, 0))

// var abdomen = (new Localizacion("Abdomen", 0.333, 59, 72, 0))
// var piernaD = (new Localizacion("Pierna D", 0.333, 73, 86, 0))
// var piernaI = (new Localizacion("Pierna I", 0.333, 87, 100, 0))

// cabeza.add(new Localizacion("Craneo", 1, 1, 4, 0))
// cabeza.add(new Localizacion("Cara", 1, 5, 7, 0))
// cabeza.add(new Localizacion("Cuello", 1, 8, 9, 0))

brazoD = brazoD.concat("Hombro D")
brazoD = brazoD.concat("Biceps D")
brazoD = brazoD.concat("Antebrazo D")
brazoD = brazoD.concat("Codo D")
brazoD = brazoD.concat("Mano D")

// chaleco y dos mangas
todo = brazoD.concat(chaleco, manga, brazoD.lado('I'))

// brazoI.add(new Localizacion("Hombro I", 1, 27, 30, 0))
// brazoI.add(new Localizacion("Biceps I", 1, 31, 35, 0))
// brazoI.add(new Localizacion("Antebrazo I", 1, 36, 40, 0))
// brazoI.add(new Localizacion("Codo I", 1, 41, 41, 0))
// brazoI.add(new Localizacion("Mano I", 1, 42, 43, 0))

// abdomen.add(new Localizacion("Vientre", 1, 59, 65, 0))
// abdomen.add(new Localizacion("Cadera D", 1, 66, 68, 0))
// abdomen.add(new Localizacion("Ingle", 1, 69, 69, 0))
// abdomen.add(new Localizacion("Cadera I", 1, 70, 72, 0))

// piernaD.add(new Localizacion("Muslo Superior D", 1, 73, 77, 0))
// piernaD.add(new Localizacion("Muslo Inferior D", 1, 78, 80, 0))
// piernaD.add(new Localizacion("Rodilla D", 1, 81, 81, 0))
// piernaD.add(new Localizacion("Pierna Inf D", 1, 82, 85, 0))
// piernaD.add(new Localizacion("Pie D", 1, 86, 86, 0))

// piernaI.add(new Localizacion("Muslo Superior I", 1, 87, 91, 0))
// piernaI.add(new Localizacion("Muslo Inferior I", 1, 92, 94, 0))
// piernaI.add(new Localizacion("Rodilla I", 1, 95, 95, 0))
// piernaI.add(new Localizacion("Pierna Inf I", 1, 96, 99, 0))
// piernaI.add(new Localizacion("Pie I", 1, 100, 100, 0))

// this.cuerpo.add(cabeza);
// this.cuerpo.add(brazoD);
// this.cuerpo.add(brazoI);
// this.cuerpo.add(pecho);
// this.cuerpo.add(abdomen);
// this.cuerpo.add(piernaD);
// this.cuerpo.add(piernaI);

// console.log(brazoD);
// console.log(todo);
