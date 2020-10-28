/* Roberto Lozano Sáez 2019 */

// import { D } from '/D.js';


class Objeto {
  constructor(nombre, peso = 0, valor = 0) {
    this.clase=this.constructor.name;
    console.log(this.clase);
    this.nombre = nombre || "";
    this.peso = peso;
    this.valor = valor;
    this.bonificador = null;
    this.efectos = null;

  }

  get pesa() {
    return this.peso
  }

  setAll(o) {
    // const keys = Object.keys(this);
    // const oKeys = Object.keys(o);

    // const values = Object.values(o);
    for (let key in o) {
      this[key] = o[key];
    }
    // this.nombre = o.nombre;
    // this.peso =   o.peso ;
    // this.valor =  o.valor ;
  }


}

class Objetos extends Objeto {
  constructor(nombre, peso, valor, ctd = 1) {
    super(nombre, peso, valor);
    this.ctd = ctd;
  }

  setAll(o) {
    super.setAll(o);
    // this.nombre = o.nombre;
    // this.peso =   o.peso ;
    // this.valor =  o.valor ;
    this.ctd = o.ctd || 1;
  }

  // devuelve el precio de la cantidad total
  precioTotal() {
    return this.ctd * this.valor;
  }

  get pesa() { return roundTo(4, this.ctd * this.peso); } //roundTo está en index.html


  //incrementar la cantidad, negativos para decrementar
  inc(valor = 1) {
    this.ctd += valor;
  }

}
class Usable extends Objeto {
  constructor(nombre, peso, valor) {
    super(nombre, peso, valor);
  }
  usar() {
    console.log(`${this.nombre} usado`);
  }
}

class Gema extends Usable {
  constructor(nombre, peso, valor, capacidad, pm = 0) {
    super(nombre, peso, valor);
    this.capacidad = capacidad;
    this.pm = pm;
  }
  /**
   * Rellena cierta cantidad de PM
   * @param {number} ctd PM a rellenar
   * @returns los puntos de magia por llenar todavía
   */
  rellenar(ctd) {
    this.pm += ctd;
    if (this.pm > this.capacidad) this.pm = this.capacidad; //evito que se rellene de más
    return this.capacidad - this.pm;

  }
  /**
   * Gasta cierta cantidad de PM
   * @param {number} ctd PM a gastar
   * @returns los puntos de magia que le faltan a la gema
   */
  gastar(ctd) {
    let resto = ctd - this.pm
    this.pm -= ctd;
    if (this.pm < 0) pm = 0; //si son negativos se quedan en 0
    return resto;
  }

}

class Pociones extends Objetos {
  constructor(nombre = "Poción 5 PG", peso = 0.1, valor, efectos = "pj.modificarPuntos(PG,5)", ctd) {
    super(nombre, peso, valor, ctd);
    this.efectos = efectos;

  }
  tomar() {
    console.log("me meto en tomar:" + this.efectos);
    if (this.ctd <= 0) return;
    eval(this.efectos);
    // (pj.inventario.navegar(nav).darObjeto(this)).ctd--;
    if (this.ctd == 1)
      pj.inventario.navegar(nav).sacar(this); //si ya no quedan más se borra
    else
      --this.ctd;
    // 
    pj.save();
  }

}
class Contenedor extends Objeto {
  constructor(nombre, peso, valor, max, multiplicador = 1) {
    super(nombre, peso, valor);
    this.multiplicador = multiplicador;
    this.max = max;
    this.objetos = [];

  }

  setAll(o) {
    this.nombre = o.nombre;
    this.peso = o.peso;
    this.valor = o.valor;
    this.max = o.max;
    // this.objetos= o.objetos ;
    let ot = [];
    for (let ob of o.objetos) {
      //miro los distintos tipos de objetos por una propiedad única
      //TODO: tal vez poner el tipo de clase en una propiedad
      let oo;
      if (ob.hasOwnProperty("pm")) { oo = new Gema(); }
      else
      if (ob.hasOwnProperty("efectos")) { oo = new Pociones(); }
      else
      if (ob.hasOwnProperty("capacidad")) { oo = new Gema(); }
      else
      if (ob.hasOwnProperty("objetos")) { oo = new Contenedor(); }
      else
      if (ob.hasOwnProperty("daño")) { oo = new Arma(); }
      else
      if (ob.hasOwnProperty("ctd")) { oo = new Objetos(); }
      else { oo = new Objeto() }
      oo.setAll(ob);
      ot.push(oo);
    }
    this.objetos = ot;

  }


  get carga() {
    let c = 0;
    for (var o of this.objetos)
      // c+=o.pesoTotal(); //da problemas con los datos de firebase database, terndria que convertir el array en objetos
      c += o.pesa;
    return c * this.multiplicador;
  }

  add(objeto) {
    // if(this.pesoLibre()>=objeto.pesoTotal)
    this.objetos.push(objeto);
    // else (console.log("Demasiado peso")); 
  }

  get pesa() {
    return this.carga + this.peso;
  }

  pesoLibre() {
    return this.max - this.carga;
  }
  darObjeto(objeto) {
    var pos = this.objetos.indexOf(objeto);
    console.log("Encontrado en pos:" + pos);
    if (pos > -1) return this.objetos[pos];

  }

  //saca el objeto en la posición 'objeto' si está
  sacar(objeto) {
    var pos = this.objetos.indexOf(objeto);
    console.log("Encontrado en pos:" + pos);
    if (pos > -1) this.objetos.splice(pos, 1);
  }
  //quita el objeto en la posición 'i' y lo retorna
  sacarIndex(i) {
    var pos = this.objetos[i];
    this.objetos.splice(i, 1);
    return pos;
  }

  sacarTodo() {
    this.objetos = [];
  }

  navegar(indices) {

    if (indices.length == 0) {
      console.log("devuelvo" + this.nombre + " queda: " + indices);
      console.log(this);
      return this;
    }

    if (this.objetos[indices[0]] instanceof Contenedor) {
      let resto = indices.slice(1);
      console.log(resto);
      return this.objetos[indices[0]].navegar(resto)
    }
  }

  //ok
  /**
   * @param {*} objeto el objeto a mover, si es un numero es el índice que ocupa en el contenedor
   * @param {*} otroContenedor el contenedor al que se va a mover
   */
  mover(objeto, otroContenedor) {
    if (typeof objeto === "number") {
      if (objeto < 0 || objeto >= this.objetos.length) return; //si está fuera de indices no hace nada
      objeto = this.sacarIndex(objeto)
    }

    else
      this.sacar(objeto);

    otroContenedor.add(objeto);
  }

  //  /**
  //   * Se da el contenedor que hay en la ruta especificada
  //   * @param {number[]} ruta el array ordenado de la ruta a seguir
  //   */
  //     darContenedorRuta(ruta){
  //         //TODO: hacer comprobaciones d eque la ruta sea de contenedores
  //         if(ruta.length==0) return this;



  //     }

  darContenedores(lista = null) {
    if (lista === null) var lista = [];
    if (this instanceof Contenedor) lista.push(this);
    this.objetos.forEach(element => {
      if (element instanceof Contenedor) {
        // console.log(element.nombre + " es contenedor");
        element.darContenedores(lista);
      }
    });
    return lista;
  }
  /**
   *  Da una lista con todos los objetos de esa clase 
   * buscando recursivamente (dentro de cada contenedor)
   * 
   * @param {class} clase la clase que se quiere buscar
   * @returns
   * @memberof Contenedor
   */
  darClaseRecursiva(clase, lista = null, ) {
    if (lista === null) var lista = [];
    this.objetos.forEach(element => {
      if (element instanceof Contenedor) {
        element.darClaseRecursiva(clase, lista);
      }
      if (element instanceof clase) { lista.push(element); }
    });
    return lista;
  }

  /**
   *  Da una lista con todos los objetos de esa clase en
   * el presente inventario (llevarlo encima)
   *
   * @param {class} clase la clase que se quiere buscar
   * @returns
   * @memberof Contenedor
   */
  darClase(clase) {
    return this.objetos.filter(obj => obj instanceof clase);
  }

  /**
   * 
   * @param {string} texto El texto del que extraer los objetos
   */
  escanear(texto) {
    var lineas = texto.split("\n");
    lineas.forEach(linea => {
      try {
        porLinea(this, linea, "\t")
      } catch (e) {
        console.log("error en linea: " + linea);
      }
    });

    function porLinea(contenedor, linea, separador = ";") {
      if (linea.startsWith(separador) || linea.startsWith("_")) return; // si la linea no tiene nombre se vuelve o si empieza en ___
      var h = linea.split(separador, 3); //nombre,peso,ctd
      let nombre = h[0];
      if (!nombre) return;
      let peso = h[1] ? Number.parseFloat(h[1].replace(',', '.')) : 0;
      let ctd = parseInt(h[2]) || 1;
      var item;

      if (ctd > 1)
        item = new Objetos(h[0], peso, 0, ctd);
      else
        item = new Objeto(h[0], peso);

      contenedor.add(item);
      console.log(item);
    }

  }

  //Guarda el contenedor entero en el firebase
  // guardarFirebase(fbInventario){
  //     fbInventario.child(this.nombre).set(this);
  // }
}

function creaInventario(nombre = "mochila") {
  var contenedor = new Contenedor(nombre, 2, 100, 15);
  for (let i = 0; i < 5; i++) {
    contenedor.add(new Objetos("objetos" + i, i, i));
  }
  for (let i = 0; i < 5; i++) {
    contenedor.add(new Objeto("objeto" + i, i, i));
  }
  //meter un contenedor dentro de otro
  var bolsa = new Contenedor("bolsa", 1, 10, 10);
  for (let i = 0; i < 5; i++) {
    bolsa.add(new Objeto("dentro" + i, i, i));
  }
  contenedor.add(bolsa);

  var bolsita = new Contenedor("bolsita", 1, 1, 5);
  bolsita.add(new Objeto("anillo", 1, 10));
  bolsita.add(new Objeto("cadena", 1, 20));

  bolsa.add(bolsita);

  // bolsita.mover(bolsita.sacarIndex(0), bolsa);
  contenedor.add(new Arma("espada", 1.2, 200));

  return contenedor;
}

class Arma extends Objeto {
  constructor(nombre, peso, valor, ...daños) {
    super(nombre, peso, valor);
    this.daños = daños;
    console.log(this.daños);
    if (this.daños)
      this.index = 0
  }
  set daño(valor) {
    console.log(typeof valor);
    if (typeof valor === 'string') {
      this.daños.forEach((d, i) => {
        console.log(d.dado, i);
        if (d.dado === valor)
          this.index = i;
      });
    }
    else
    if (typeof valor === 'number' && valor >= 0 &&
      valor < this.daños.length) {
      this.index = valor
    }
    else
    if (valor instanceof Daño) {
      //si es daño con el string del dado para que lo busque
      this.daño = valor.dado
    }
    // TODO: hacer string y Daño
    this.dañar()
  }
  get daño() {
    return this.daños[this.index]
  }

  setAll(o) {
    super.setAll(o);
    // this.nombre = o.nombre;
    // this.peso   = o.peso ;
    // this.valor  = o.valor ;
    this.daños = o.daños;
    //cargar cada daño
    this.daños=[]
    //TODO: probar
    o.daños.forEach((d, i) => {
      let da=new Daño(d.dado,d.tipo)
      this.daños.push(da)
    });
  }
  dañar() {
    console.log(this.daños[this.index]);
  }

}


// export {Objeto, Objetos, Arma, Contenedor};



//PROBATURAS

// var array = new Array();
// var contenedor=new Contenedor("bolsa",2,100,15);
// var cz=new Contenedor("zurrón",1,100,15);
// var s;
// for(let i=0;i<10;i++){
//     var o=new Objeto("objeto"+i,i, i);
//     if(i==3) s=o;
//     contenedor.add(o);
// }
//     contenedor.mover(s,cz);
//     contenedor.mover(contenedor.sacarIndex(1),cz);
// var a1= new Arma("arma1",1,1,"1d10");
// var a2 = new Arma();
// a2.setAll(a1);
// a2.nombre="arma2";

// console.log(a1);
// console.log(a2);


// console.log("Carga:"+contenedor.carga + " , Peso libre"+contenedor.pesoLibre());