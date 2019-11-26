/* Roberto Lozano Sáez 2019 */
// class XP {
//     constructor(
//          xp               =0
//         ,fecha            =0
//         ,probabilidad     =0
//         ,fechaXp          =0
//         ,horasEntrenadas  =0
//         ,desentrenado     =0
//         ,supercriticos    =0
//         ,criticos         =0
//         ,especiales       =0
//         ,exitos           =0
//         ,fallos           =0
//         ,pifias           =0
//         )
//     {
//         this.xp                = xp               
//         this.fecha             = fecha 
//         this.probabilidad      = probabilidad 
//         this.fechaXp           = fechaXp 
//         this.horasEntrenadas   = horasEntrenadas 
//         this.desentrenado      = desentrenado 
//         this.supercriticos     = supercriticos 
//         this.criticos          = criticos 
//         this.especiales        = especiales 
//         this.exitos            = exitos 
//         this.fallos            = fallos 
//         this.pifias            = pifias 
//     } 
// }


//debe haber una variable global pj con el personaje
/**
 * 
 */

//Variables globales
const PIFIA = -1;
const FALLO = 0;
const EXITO = 1;
const ESPECIAL = 2;
const CRITICO = 3;
const SUPERCRITICO = 4;


class XP {
    /**
     * 
     * @param {int} xp 
     * @param {Date} fecha 
     * @param {Date} fechaXp 
     * @param {int} horasEntrenadas 
     * @param {*} desentrenado 
     */
    constructor(
        xp = 0
        , fecha = 0
        , fechaXp = 0
        , horasEntrenadas = 0
        , desentrenado = 0
    ) {
        this.xp = xp
        this.fecha = fecha
        this.fechaXp = fechaXp
        this.horasEntrenadas = horasEntrenadas
        this.desentrenado = desentrenado
    }

    /**
* <!-- begin-user-doc -->
* hacer que calcule la probabilidad correcta de subir de nivel
* <!-- end-user-doc -->
*/
    getProbabilidad(valor, fechaAct, bonus = 0) {
        //TODO: hacer que calcule la probabilidad correcta; tal vez pasar a habilidad
        // var bonus=this.tipoBonus;
        //TODO: por si pongo XP distinta para cada raza
        //		int xpNec= this.getPertenece().getAnimal().getXPNecesaria();
        const xpNec = 4;
        if (this.xp < xpNec) return 100;

        if (this.fecha == 0) return valor - (this.xp - xpNec) * 5 - bonus;
        else {
            var fechaSub
            fechaSub = this.fecha
            //los minisegundos son negativos pq es anterior a 1970
            //diferencia en dias
            let diferencia = (-fechaSub.getTime() + fechaAct.getTime()) / 86400000;
            if (diferencia > 7) {
                console.log(("Se subio hace más de una semana"));
                return valor - (this.xp - xpNec) * 5 - bonus;
            }
            else return 100;
        }
    }

    addXP(xp) {
        this.xp += xp;
        // console.log("fechaMundo:"+fechaMundo.toISOString());
        //por si no estuviera definida la variabel global
        if (fechaMundo) this.fechaXp = fechaMundo.toISOString();
    }

    clearXP() { this.xp = 0 }

}


class TipoTirada {
    //TODO: quitar static para que vaya en firefox
    static tirada = ["PIFIA", "FALLO", "EXITO", "ESPECIAL", "CRITICO", "SUPERCRITICO"];
    static get PIFIA() {
        return 0;
    }
    static get FALLO() {
        return 1;
    }
    static get EXITO() {
        return 2;
    }
    static get ESPECIAL() {
        return 3;
    }
    static get CRITICO() {
        return 4;
    }
    static get SUPERCRITICO() {
        return 5;
    }


}


class Habilidad extends XP {
    /**
     * 
     * @param {string} nombre 
     * @param {string} tipo 
     * @param {number} valor 
     */
    constructor(nombre, tipo, valor) {
        super();
        this.nombre = nombre;
        this.tipo = tipo;
        if (isNaN(valor)) valor = 0;
        this.valor = valor;
        //bonificaciones
        this.bvalor = 0;
        this.bcritico = 0;
        this.bespecial = 0;
    }
    //te copia todas las propiedades de un objeto o
    setAll(o) {
        for (let key in o) {
            this[key] = o[key];
            // console.log( this[key] + o[key]);

        }
    }
    /* devuelve el valor actual con todos los modificadores*/
    act() {
        //TODO: hacerlo con bonificaciones y demás
        return this.v; //ahora es lo mismo que v
    }

    // activo una bonificación
    activarBon(b) {
        if (b.activado) return;
        // for (let key in b) {
        //     if(key!="activado)")
        //     this["b"+key] += b[key];
        //   }  
        this.bvalor += b.valor;
        this.bespecial += b.especial;
        this.bcritico += b.critico;

        b.activado = !b.activado;
    }

    // desactivo la bonificación
    desactivarBon(b) {
        if (!b.activado) return;
        this.bvalor -= b.valor;
        this.bespecial -= b.especial;
        this.bcritico -= b.critico;
        b.activado = !b.activado;
    }

    save() {
        //TODO: utiliza la variable global pj, tal vez deberia hacerlo desde Animal
        console.log("personajes" + pj.nombre + ("habilidades") + (this.nombre));
        database.ref("personajes").child(pj.nombre).child("habilidades").child(this.nombre).set(this);

    }

    subir(subida) {
        this.valor += subida;
        this.clearXP();
        if (fechaMundo) this.fecha = fechaMundo;
    }
    /**
     * da el bonificador por tipo de habilidad
     */
    tipoBonus() {
        pj.getCar(this.tipo);
    }

    /**
     * da el valor con las bonificaciones sumada
     * TODO: utiliza la variable global pj, tal vez deberia hacerlo desde Animal
     * o incluso un map golbal de Animales que se acceda por nombre
     */
    get v() { return this.valor + this.bvalor + pj.getCar(this.tipo) }

    //poner posibles bonificaciones en especialñ y crítico
    get e() { return Math.round(this.v * 0.2) + this.bespecial }
    get c() { return Math.round(this.v * 0.05) + this.bcritico }
    get p() { return Math.round(this.v * 0.05) + this.bcritico }


    /**
     * Te devuelve que tipo de tirada se obtiene con t
     * @param {number} t la tirada del dado
     */
    tirada(t) {
        //TODO: soporte para -1,etc en tiradas?
        switch (true) {
            case (t == 7 || t == 77):
                return TipoTirada.SUPERCRITICO;
            case (t == 100):
                return TipoTirada.PIFIA; //calcular otras pifias
            case (t <= this.c):
                return TipoTirada.CRITICO;
            case (t <= this.e):
                return TipoTirada.ESPECIAL;
            case (t <= this.v):
                return TipoTirada.EXITO;
            case (t > this.v):
                return TipoTirada.FALLO;
            default:
                ;
        }
    }

    xpTirada(t) {
        switch (this.tirada(t)) {
            case TipoTirada.SUPERCRITICO:
                this.xp+=4;
                break;
            case TipoTirada.CRITICO:
                this.xp+=3;
                break;
            case TipoTirada.ESPECIAL:
                this.xp+=1;
                break;
            default:
                break;
        }
    }


}

class Hechizo extends Habilidad {
    /**
     * 
     * @param {string} nombre   Nombre del hechizo
     * @param {number} pm       Los puntos de magia que gasta el hechizo
     * @param {number} valor    El %
     * @typedef Efecto          
     * @param {Efecto} efecto   El efecto
     */
    constructor(nombre, pm, valor, efecto) {
        super(nombre, "Magia", valor)
        this.pm = pm;
        this.efecto = efecto;
    }


    /**
     * 
     * @param {number} intensidad   los puntos de intensidad
     * @param {number} duracion     el nº de minutos de duración, 0 si es instantáneo
     * @param {Animal} objetivo     el objetivo del hechizo -en caso de encantar pordría ser objeto
     */
    hacerHechizo(intensidad, duracion, objetivo) {
        this.efecto.fecha = fechaMundo.add("minuto", duracion);
        this.efecto.obj = objetivo;
        objetivo.addEfecto(this.efecto);

    }

}

class BonHabilidad {
    constructor(nombre, valor, especial = 0, critico = 0) {
        this.nombre = nombre;
        this.valor = valor;
        this.especial = especial;
        this.critico = critico;
        this.activado = false;
    }

}

function habilidadesBasicas() {
    // let h={}
    // var h1 = new Habilidad("Correr", "Agilidad", 100);
    // var b1 = new BonHabilidad("Correr",0,10,10);
    // // h1.activarBon(b1);
    // h[h1.nombre]=h1;
    // h["Trepar"]=( new Habilidad("Trepar", "Agilidad", 15));
    // h["Saltar"]=( new Habilidad("Saltar", "Agilidad", 30));
    // h["Esquivar"]=( new Habilidad("Esquivar", "Agilidad", 25));
    // return h;

}

// export {Habilidad, BonHabilidad}; 

// var h1 = new Habilidad("Correr", "Agilidad", 100);
// var b1 = new BonHabilidad("Correr",0,10,10);
// h1.activarBon(b1);
// h1.desactivarBon(b1);

// h1.tirada(100);
// for (let index = 1; index <= 100; index++) {
//     console.log(index + ":" + TipoTirada.tirada[h1.tirada(index) + 1]);
// }
// console.log(TipoTirada.tirada[h1.tirada(77)-h1.tirada(1)+1]);

// var finDeAnio = new Date(776, 11, 31, 23, 59, 59, 999);
// var añoNuevo= new Date(778, 0, 1, 0, 0, 0, 0);

// console.log(finDeAnio);
// console.log(finDeAnio.getTime());
// console.log(añoNuevo);
// console.log(añoNuevo.getTime());

// let xp = new XP(4,finDeAnio,null,null,null);
// console.log(xp.getProbabilidad(100, añoNuevo));


