//import
// import {Habilidad, BonHabilidad} from './habilidades';
// import {Objeto, Objetos, Arma, Contenedor} from './inventario';

var fechaMundo = new Date(778, 0, 1, 0, 0, 0, 0);

const FUE = "FUE"
const CON = "CON"
const TAM = "TAM"
const INT = "INT"
const POD = "POD"
const DES = "DES"
const ASP = "ASP"

const Agilidad = "Agilidad"
const Comunicación = "Comunicación"
const Conocimiento = "Conocimiento"
const Magia = "Magia"
const Manipulación = "Manipulación"
const Percepción = "Percepción"
const Sigilo = "Sigilo"

const PF = "PF"
const PG = "PG"
const PM = "PM"

const CP = ["FUE", "CON", "TAM", "INT", "POD", "DES", "ASP"];

const TipoHabilidades =
  ["Agilidad"
    , "Comunicación"
    , "Conocimiento"
    , "Magia"
    , "Manipulación"
    , "Percepción"
    , "Sigilo"]




//Store information about your firebase so we can connect

//!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
//IMPORTANT: REPLACE THESE WITH YOUR VALUES (these ones won't work)
//!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!

//TODO: cambiar a un proyecto propio
var config = {
  apiKey: "AIzaSyAuYTgzpd8BydHMLmx4mNhDb-bKGYVZfNo",
  authDomain: "compras-rls777.firebaseapp.com",
  databaseURL: "https://compras-rls777.firebaseio.com/",
  projectId: "compras-rls777",
  storageBucket: "compras-rls777.appspot.com",
};

//!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
//!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!

//initialize your firebase
firebase.initializeApp(config);
var database = firebase.database();

class Efecto {
  // constructor(nombre, efecto, obj, fecha = 0) {
  constructor(nombre, efecto, fecha = 0) {
    this.nombre = nombre;
    this.efecto = efecto;
    // this.obj = obj;
    this.fecha = fecha;
  }

  setAll(o) {
    for (let key in o) {
        this[key] = o[key];
        // console.log( this[key] + o[key]);    
    }
}

  ok() {
    // let diferencia=0
    //   if(this.fecha==0) diferencia=0
    //   else{
    //     var fechaSub
    //     fechaSub=this.fecha
    //     console.log("fin:"+ fechaSub);
    //     console.log("act:"+ fechaAct);
    //     //los minisegundos son negativos pq es anterior a 1970
    //     //diferencia en dias
    //     diferencia = ( -fechaSub.getTime() + fechaAct.getTime() )/ 86400000 ;
    //   }	
    //   console.log("diferencia:"+ diferencia);
    //   return diferencia;

    // console.log(this.nombre+" fin:"+ this.fecha);
    // console.log(this.nombre+" act:"+ fechaMundo);
    return fechaMundo <= this.fecha;

  }

}

class Bon {
  constructor(
    {
      FUE = 0,
      CON = 0,
      TAM = 0,
      INT = 0,
      POD = 0,
      DES = 0,
      ASP = 0,

      Agilidad = 0
      , Comunicación = 0
      , Conocimiento = 0
      , Magia = 0
      , Manipulación = 0
      , Percepción = 0
      , Sigilo = 0

      , PF = 0
      , PG = 0
      , PM = 0
    }

  ) {
    //Características
    this.FUE = FUE
    this.CON = CON
    this.TAM = TAM
    this.INT = INT
    this.POD = POD
    this.DES = DES
    this.ASP = ASP

    //Habilidades
    this.Agilidad = Agilidad
    this.Comunicación = Comunicación
    this.Conocimiento = Conocimiento
    this.Magia = Magia
    this.Manipulación = Manipulación
    this.Percepción = Percepción
    this.Sigilo = Sigilo

    //Puntos
    this.PF = PF
    this.PG = PG
    this.PM = PM


  }
}
// class Animal{
//     constructor(
//       {
//         nombre="Anónimo",
//         peso =60, //en kg

//         FUE=10,
//         CON=10,
//         TAM=10,
//         INT=10,
//         POD=10,
//         DES=10,
//         ASP=10
//       }

//     ) {
//       this.car= {}
//       this.nombre =   nombre
//       this.peso =     peso
//       this.car.FUE =  FUE
//       this.car.CON =  CON
//       this.car.TAM =  TAM
//       this.car.INT =  INT
//       this.car.POD =  POD
//       this.car.DES =  DES
//       this.car.ASP =  ASP

//       this.bonificacion = new Bon({}); 
//       this.inventario= creaInventario("Cuerpo");
//       this.efectos=[];
//       // this.backup = null
//       this.act();     
//     }

//     getCar(car){
//       return this.car[car]+ this.bonificacion[car];
//     }

//     set(car, valor){
//       this.car[car]=valor;
//       this.act();
//     }

//     cambiaformas(forma2){
//       this.forma2= forma2;
//     }

//     setAll(o){
//       for (let key in o) {
//           this[key] = o[key];
//           console.log(this[key]);


//           if(key=="inventario"){
//           this.inventario = new Contenedor();
//           this.inventario.setAll(o[key]);
//           }
//         }
//   }

//     //Positivos, negativos y secundarios
//     P(car){ return this.getCar(car)-10}
//     N(car){ return 10-this.getCar(car)}
//     S(car){ return Math.round((this.getCar(car)-10)/2)}
//     SN(car){ return Math.round((10-this.getCar(car))/2)}

//     act(){
//       this.car.Agilidad     = this.P("DES") + this.S("FUE") + this.SN("TAM")
//       this.car.Comunicación = this.P("INT") + this.P("ASP")
//       this.car.Conocimiento = this.P("INT")
//       this.car.Magia        = this.P("INT") + this.P("POD")
//       this.car.Manipulación = this.P("DES") + this.S("FUE") + this.P("INT")
//       this.car.Percepción   = this.P("CON")
//       this.car.Sigilo       = this.P("DES") + this.S("FUE") + this.N("TAM")

//       this.car.PF = (this.getCar(FUE) + this.getCar(CON))
//       this.car.PG = Math.round((this.getCar(TAM) + this.getCar(CON))/2)
//       this.car.PM = Math.round((this.getCar(INT) + this.getCar(POD))/2)


//     }

//     pesoTotal(){
//       return this.peso + this.inventario.pesoTotal();
//     }

//     save(){
//       database.ref("personajes").child(this.nombre).set(this);
//     }

//     aplicar(efecto){
//       // el efecto sólo se debería aplicar en las bonificaciones
//       // a no ser que sea permanente (algo muy raro)
//       var obj= efecto.obj

//        if(efecto.ok(fechaMundo))
//         eval(efecto.efecto);
//     }

//   aplicarEfectos() {
//     if (this.backup == null) {
//       let copy = new Animal({});
//       copy.setAll(this);
//       this.backup = copy;
//       // console.log("backup");
//       // console.log(this.backup);
//       // console.log("END backup");
//     }
//     else {
//       this.setAll(this.backup);
//       console.log("cargo el buckup");

//     }

//     for (let e of this.efectos) {

//       if (e.ok()) {
//         console.log(e.nombre + " aplicado");
//         this.aplicar(e);
//       }
//     }
//   }

//     addEfecto(efecto){
//       this.efectos.push(efecto);
//     }

//     // sanar(tipoPuntos, valor){
//     //   this.car[tipoPuntos]+= valor;
//     // }

// }

class Animal {
  constructor(
    {
      nombre = "Anónimo",
      peso = 60, //en kg

      FUE = 10,
      CON = 10,
      TAM = 10,
      INT = 10,
      POD = 10,
      DES = 10,
      ASP = 10
    }

  ) {
    this.car = {}
    this.nombre = nombre
    this.peso = peso
    this.FUE = FUE
    this.CON = CON
    this.TAM = TAM
    this.INT = INT
    this.POD = POD
    this.DES = DES
    this.ASP = ASP

    this.bonificacion = new Bon({});
    this.inventario = creaInventario("Cuerpo");
    this.habilidades = {}
    this.efectos = [];
    // this.backup = null
    this.act();
  }

  getCar(car) {
    return this[car] + this.bonificacion[car];
  }

  /**
   * Pone una bonificacion, acumulativa si es un string con + o -
   * o total si es un número
   * @param {string} car Nombre de la característica
   * @param {*} valor "+5"/"-2" o un número si es el valor final
   */
  sb(car, valor) {
    if (typeof valor === 'string' && (valor.startsWith("+") || valor.startsWith("-")))
      this.bonificacion[car] += parseInt(valor);
    else
      this.bonificacion[car] = valor;
    this.act();
  }

  setMaxPuntos(){
    this.PF = (this.getCar(FUE) + this.getCar(CON))
    this.PG = Math.round((this.getCar(TAM) + this.getCar(CON)) / 2)
    this.PM = Math.round((this.getCar(INT) + this.getCar(POD)) / 2)
  }
/**
 * 
 * @param {string} tipo PF,PG,PM
 * @param {*} valor el valor a subir o bajar, "max", por defecto, para dejarlo en el máximo de puntos, vale cualquier string
 */
  modificarPuntos(tipo, valor="max"){
    //si es un numero se le añade (positivo o negativo)
    if(typeof valor === 'number' ){
      this[tipo]+=valor;
      return;
    }
    this[tipo]=this.getMaxPuntos(tipo);

  }

  /**
   * Devueleve el valor máximo del tipo de punto pasado
   * @param {string} puntos PF,PG,PM
   */
  getMaxPuntos(puntos){
    switch (puntos) {
      case PF: return (this.getCar(FUE) + this.getCar(CON));
      case PG: return  Math.round((this.getCar(TAM) + this.getCar(CON)) / 2);
      case PM: return  Math.round((this.getCar(INT) + this.getCar(POD)) / 2);
      default:
        console.log('No hay puntos ' + puntos+ '.');
    }

  }

/**
 * Modifica una característica base y actualiza
 * @param {string} car La caracteristica: FUE,PM, etc...
 * @param {number} valor El nuevo valor
 */
  set(car, valor) {
    this[car] = valor;
    this.act();
  }

/**
 * 
 * @param {Habilidad} h la habilidad que se añadirá/sobrescribirá
 */
  setHabilidad(h) {
    if (h instanceof Habilidad) {
      //Machaca lo que haya
      this.habilidades[h.nombre] = h;
      //no guardar por ahora, sino con el personaje entero
      // h.save();
    }
  }
/**
 * 
 * @param {*} h La Habilidad h, o el nombre (string) de la habilidad
 */
  saveHabilidad(h){
    if (h instanceof Habilidad) {
      // console.log(h);
      this.habilidades[h.nombre] = h;
      console.log("guardando: personajes"+this.nombre+("habilidades")+(h.nombre));
      database.ref("personajes").child(this.nombre).child("habilidades").child(h.nombre).set(h);
    }
    else
    if (typeof h === 'string'){
      h=this.habilidades[h.nombre];
      console.log("guardando por nombre: personajes"+this.nombre+("habilidades")+(h.nombre));
      database.ref("personajes").child(this.nombre).child("habilidades").child(h.nombre).set(h);
    }

  }


  getHabilidad(nombre) {
    return this.habilidades[nombre];
  }

  cambiaformas(forma2) {
    this.forma2 = forma2;
  }
/**
 * Copia toda la información de un objeto, sea de la misma clase
 * o no, si tiene las mismas propiedades
 * @param {*} o El objeto del cual se copia todo
 */
  setAll(o) {
    for (let key in o) {
      this[key] = o[key];
      // console.log(this[key]);

      if (key == "inventario") {
        this.inventario = new Contenedor();
        this.inventario.setAll(o[key]);
      }

      //TODO: Parece que va
      if (key == "efectos") {
        this.efectos=[];
        o["efectos"].forEach(element => {
          let e= new Efecto()
          e.setAll(element);
          this.addEfecto(e);
        });

      }

      //TODO: Parece que va
      if (key == "habilidades") {
        // this.habilidades = {}
        for (let k in o[key]) {
          // console.log("setAll habilidades"+k);
          let h = new Habilidad();
          h.setAll(o[key][k])
          // console.log(h);
          this.habilidades[h.nombre] = h;
        }

      }

    }
  }

  print() {
    for (let key in this) {
      console.log(key + ":" + this[key]);
    }
  }

  printCar() {
    //in para los putos índices, o no
    for (let i in CP) {
      console.log(CP[i] + ":" + this.getCar(CP[i]));
    }
  }

  //Positivos, negativos y secundarios
  P(car) { return this.getCar(car) - 10 }
  N(car) { return 10 - this.getCar(car) }
  S(car) { return Math.round((this.getCar(car) - 10) / 2) }
  SN(car){ return Math.round((10 - this.getCar(car)) / 2) }

  /**
   * actualiza el valor de los tipo de habilidades
   */
  act() {
    this.Agilidad = this.P("DES") + this.S("FUE") + this.SN("TAM")
    this.Comunicación = this.P("INT") + this.P("ASP")
    this.Conocimiento = this.P("INT")
    this.Magia = this.P("INT") + this.P("POD")
    this.Manipulación = this.P("DES") + this.S("FUE") + this.P("INT")
    this.Percepción = this.P("CON")
    this.Sigilo = this.P("DES") + this.S("FUE") + this.N("TAM")

  }


  pesoTotal() {
    return this.peso + this.inventario.pesoTotal();
  }

  /**
   * guarda en firebase
   */
  save() { //creo que da referencias cíclicas
    database.ref("personajes").child(this.nombre).set(this);
    console.log("GUARDADO:"+this.nombre);
    
  }

  aplicar(efecto) {
    // el efecto sólo se debería aplicar en las bonificaciones
    // a no ser que sea permanente (algo muy raro)
    // var obj = efecto.obj
    if (efecto.ok(fechaMundo)) 
      eval(efecto.efecto);
  }
//TODO: mirar si quitar lo del backup
  aplicarEfectos() {
    let log = ""
    if (this.backup == null) {
      let copy = new Animal({});
      copy.setAll(this);
      this.backup = copy;
      console.log("BACKUP");

      this.backup.print();
      // console.log("backup");
      // console.log(this.backup);
      // console.log("END backup");
    }
    else {
      this.setAll(this.backup);
      console.log("cargo el backup");
      this.printCar()

    }

    this.bonificacion = this.bonificacion = new Bon({});

    for (let e of this.efectos) {

      if (e.ok()) {
        console.log("*******" + e.nombre + " aplicado " + e.fecha+" en " +this.nombre );
        log += e.nombre + " aplicado " + e.fecha.toLocaleString() + "<br>";
        this.aplicar(e);
        // this.printCar();
        // this.print();

      }
    }
    return log;
  }

  addEfecto(efecto) {
    this.efectos.push(efecto);
  }

  // sanar(tipoPuntos, valor){
  //   this.car[tipoPuntos]+= valor;
  // }

}
//Bonificación en Animal



/**
 * Modifica una fecha.
 * 
 * @param interval  One of: año, mes, dia, segundo,...
 * @param units  Numero de unidades a añadir o restar, si negativas.
 */
Date.prototype.mod = function (interval, units) {
  var ret = new Date(this.valueOf()); //don't change original date

  switch (interval.toLowerCase()) {
    case 'año': ret.setFullYear(ret.getFullYear() + units); break;
    case 'mes': ret.setMonth(ret.getMonth() + units); break;
    case 'semana': ret.setDate(ret.getDate() + 7 * units); break;
    case 'dia': ret.setDate(ret.getDate() + units); break;
    case 'hora': ret.setTime(ret.getTime() + units * 3600000); break;
    case 'minuto': ret.setTime(ret.getTime() + units * 60000); break;
    case 'segundo': ret.setTime(ret.getTime() + units * 1000); break;
    default: ret = undefined; break;//en default undefined o pasar la original?
  }
  return ret;
}


/**
 * variable global con el personaje sobre
 * el que se harán todas las acciones en la página
 */
var pj = new Animal({});

/**
 * variable global con el personaje sobre
 * el que recaerán las acciones del pj,
 * como un ataque, pasar un objeto, sanar, etc
 */
var pnj;

let a = new Animal({ nombre: "Animal A" });
// for(i of CP){
//   a[i]=7;
// }


// console.log(a);
let v = new Animal({ FUE: 13, DES: 7 });
// let v=new Bon({FUE:1, DES: 2, Agilidad:20, PF:3});
// console.log(v);
// a.bonificacion=v;
// a.set(DES, 30);
// console.log(a);
// console.log(DES+a.getCar(DES));
// console.log("Agi"+a.getCar("Agilidad"));


// database.ref("personajes").child(a.nombre).set(a);

//cargo el personaje desde firebase
// firebase.database().ref("personajes").child(a.nombre).once('value').then(function(snapshot) {
//   var recuperado = snapshot.val() ;
//   console.log(recuperado);

// });


// pj.setAll(recuperado);
// pj.act();
// pj.save();
// console.log("Animal Recuperado");
// console.log("carga:"+pj.inventario.pesoTotal());
// console.log(pj);


// v.setAll(pj);
// v.nombre="BACKUP"
// console.log(v);
// console.log(fechaMundo);

var añoMas = new Date(778, 9, 1, 1, 0, 0, 0);
var finDeAnio = new Date(776, 11, 31, 23, 59, 59, 999);
fechaMundo = añoMas;


// efNombre = new Efecto("cambiarNombre", `this.nombre="Activo"`, null, fechaMundo.add("año", 4));
// efFuerza = new Efecto("fuerza", `this.sb(FUE,"+5")`,  fechaMundo.add("dia", 4));
// efDes = new Efecto("des", `this.DES+=5`,  fechaMundo.add("dia", 4));
// efTam = new Efecto("tamaño", `this.sb(TAM,5)`,   fechaMundo.add("dia", 4));
// efAsp = new Efecto("aspecto", `this.ASP=18`,   fechaMundo.add("dia", 4));
// efReflex = new Efecto("Reflejos felinos", `this.DES+=5; this.sb(Agilidad,'+5') `,   fechaMundo.add("dia", 4));
// efPermanente = new Efecto("Permanente", `this.ASP+=5; this.sb(Comunicación,'+5') `);

// // pj.addEfecto(efNombre)

// pj.addEfecto(efFuerza)
// pj.addEfecto(efDes)
// pj.addEfecto(efTam)
// pj.addEfecto(efAsp)
// pj.addEfecto(efReflex)
// pj.addEfecto(efPermanente)

// pj.aplicarEfectos()

// console.log("4 años despues");
// let fechas=fechaMundo.mod("año", 1);
// pj.aplicarEfectos()

// //salvar personaje


// console.log(pj);

// console.log(pj.backup);






