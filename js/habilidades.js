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
  getProbabilidad(valor, fechaAct, bonus = 0, xpNec = 4) {
    //TODO: hacer que calcule la probabilidad correcta; tal vez pasar a habilidad
    // var bonus=this.tipoBonus;
    //TODO: por si pongo XP distinta para cada raza
    //		int xpNec= this.getPertenece().getAnimal().getXPNecesaria();

    // const xpNec = 4;
    if (this.xp < xpNec) return 100;

    // if (this.fecha == 0) return valor - (this.xp - xpNec) * 5 - bonus;

    if (this.fecha == 0) return Math.min(100, valor) - (this.xp - xpNec) * 5 - bonus;
    else {
      var fechaSub
      fechaSub = this.fecha
      //los minisegundos son negativos pq es anterior a 1970
      //diferencia en dias
      let diferencia = (-fechaSub.getTime() + fechaAct.getTime()) / 86400000;
      if (diferencia >= 7) {
        // console.log(("Se subio hace más de una semana"));
        Math.min(100, valor) - (this.xp - xpNec) * 5 - bonus;
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


// var TIRADA = {
//   PIFIA: {name: "PIFIA", value: -1, code: "P"},
//   FALLO: {name: "FALLO", value: 1, code: "F"},
//   EXITO: {name: "EXITO", value: 2, code: "N"},
//   ESPECIAL: {name: "ESPECIAL", value: 3, code: "E"},
//   CRITICO: {name: "CRITICO", value: 4, code: "C"},
//   SUPERCRITICO: {name: "SUPERCRITICO", value: 5, code: "SC"},

// };


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
    /** Bonificación por tipo de habilidad*/
    this.bh = 0;
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

  // save() {
  //     //TODO: utiliza la variable global pj, tal vez deberia hacerlo desde Animal
  //     console.log("personajes" + pj.nombre + ("habilidades") + (this.nombre));
  //     database.ref("personajes").child(pj.nombre).child("habilidades").child(this.nombre).set(this);

  // }

  subir(subida) {
    subida = parseInt(subida);
    if (isNumber(subida)) {
      this.valor += subida;
      this.clearXP();
      if (fechaMundo && subida > 0) this.fecha = fechaMundo;
    }
  }

  subible() {
    return this.getProbabilidad(this.valor, fechaMundo, this.bh);

  }

  //TODO: Modificar para que no requiera de pj

  /**
   * da el bonificador por tipo de habilidad
   */
  // tipoBonus() {
  //     pj.getCar(this.tipo);
  // }

  /**
   * da el valor con las bonificaciones sumada
   * TODO: utiliza la variable global pj, tal vez deberia hacerlo desde Animal
   * o incluso un map golbal de Animales que se acceda por nombre
   */
  get v() { return this.valor + this.bvalor + this.bh }


  //poner posibles bonificaciones en especialñ y crítico
  get e() { return Math.round(this.v * 0.2) + this.bespecial }
  get c() { return Math.round(this.v * 0.05) + this.bcritico }
  get p() { return Math.min(100, 101 - Math.round((100 - this.v) * 0.05)) }


  /**
   * Te devuelve que tipo de tirada se obtiene con t
   * @param {number} t la tirada del dado
   */
  tirada(t, suerte = []) {

    if (t == 100)
      return TipoTirada.PIFIA; //la pifia siempre es pifia

    if (suerte.length > 0) {
      // console.log("SUERTE"+suerte);
      let mejor = this.tirada(t);
      suerte.forEach(valor => {
        // let v= parseInt(valor)+parseInt(t);//si no concatena el hdp
        let v = +valor + (+t) //así parece q suma
        let x = this.tirada(v);
        // console.log(` mejor=${mejor}, tirada(${v})=${x}`);
        if (x > mejor) mejor = x;
      });
      return mejor;
    }
    //TODO: soporte para -1,etc en tiradas?
    switch (true) {
      case (t == 7 || t == 77):
        return TipoTirada.SUPERCRITICO;
      case (t >= this.p):
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

  xpTirada(t, suerte = []) {
    // console.log(t);
    let tir = this.tirada(t, suerte);
    // console.log(tir);
    this.xpTipoTirada(tir, +t);
  }

  /**Añade la XP (solo hasta los porcentajes) de la tirada
   * 
   * @param {TipoTirada} tir el grado de éxito
   * @param {Number} dado el numero en 1d100
   */
  xpTipoTirada(tir, dado) {
    console.log(tir, dado);
    switch (tir) {
      case TipoTirada.SUPERCRITICO:
        this.xp += 4;
        console.log("Sube SUPERCRITICO:" + dado);
        break;
      case TipoTirada.CRITICO:
        if (dado && dado < 11)
          { this.xp += 3;
            console.log("Sube CRITICO:" + dado);
          }
        else if (dado && dado < 21)
          { this.xp += 1;
            console.log("Sube como ESPECIAL:" + dado);
          }
        break;
      case TipoTirada.ESPECIAL:
        if (dado && dado < 21) {
          this.xp += 1;
          console.log("Sube ESPECIAL:" + dado);
        }
        break;
      default: console.log("NO SUBE NADA");
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

class HechizoReal extends Hechizo
{}

class Arte extends Habilidad{
  constructor(nombre='Intensidad', valor,pm=0,intensidad=0,gastados=0) {
    super(nombre, "Magia", valor)
    this.pm = pm;
    this.intensidad = intensidad;
    this.gastados = gastados;
  }


  /**
   * @returns {Hechizo} devuelve el hechizo asociado al arte
   */
  get hechizo(){
    return this.h;
  }

  /**
   * @param {HechizoReal} hechizo adjunta un hechizo al arte
   */
  set hechizo(hechizo){
    if(hechizo instanceof HechizoReal)
      this.h=hechizo;
  }

    /**
   * @returns la penalización al hechizo
   */
     penalizacion() {
      var pm = +this.pm.value
      if (pm == 0) return 0;
      let v = this.habilidad.tirada(this.input.value);
  
      if (v == TipoTirada.EXITO)
        return pm * 5;
      else return 0;
  
    }

/**
 * 
 * @param {TipoTirada} tipoTirada el drado de éxito de la tirada
 * @returns 0 si no se modifica el hechizo, objeto con intensidad, gastados, penalizacion
 */
  act(tipoTirada) {

    if (this.pm == 0) return 0;
    let gastados = 0
    let intensidad = 0
    let penalizacion=0

    switch (tipoTirada) {
      case (TipoTirada.SUPERCRITICO):
        intensidad = 5;
        break;
      case (TipoTirada.CRITICO):       
        intensidad = 3;
        break;
      case (TipoTirada.ESPECIAL):       
        intensidad = 1;
        break;
      case (TipoTirada.EXITO):
        penalizacion= this.pm * 5
        break;
      case (TipoTirada.FALLO):
        intensidad = 0
        break;
      default:
        ;
    }

    if (intensidad < pm) {
      gastados = (pm - intensidad)
      intensidad = pm;
    }
    else if (intensidad >= pm) {
      gastados = 0 //o 1?
      intensidad = pm + (intensidad - pm);
    }

    var result = { intensidad: intensidad, gastados: gastados, penalizacion: penalizacion };
    if(this.hechizo){
      this.hechizo[this.nombre].intensidad=intensidad;
      this.hechizo[this.nombre].gastados=gastados;
      this.hechizo[this.nombre].penalizacion= penalizacion;
    }
    return result;
  }

  
}

class HabilidadMarcial extends Habilidad {
  constructor(nombre, tipo, valor, ataque = true, localizacion = null, arma = null) {
    super(nombre, tipo, valor);
    // this.nombre = nombre
    // this.tipo = tipo
    // this.valor = valor

    this.ataque = ataque
    this.localizacion = localizacion
    this.arma = arma
  }

  //Overrides

  /**
* da el valor con las bonificaciones sumada
* TODO: utiliza la variable global pj, tal vez deberia hacerlo desde Animal
* o incluso un map golbal de Animales que se acceda por nombre
*/
  get v() { return (this.arma?.bonificador) ? this.valor + this.bvalor + this.bh + this.arma.bonificador.valor : this.valor + this.bvalor + this.bh }

  // get v(){ return (this.arma?.bonificador)?this.valor + this.bvalor + this.bh +this.arma.bonificador.valor: super.v}

  // //poner posibles bonificaciones en especialñ y crítico
  get e() { return (this.arma?.bonificador) ? Math.round(this.v * 0.2) + this.bespecial + this.arma.bonificador.especial : Math.round(this.v * 0.2) + this.bespecial }
  get c() { return (this.arma?.bonificador) ? Math.round(this.v * 0.05) + this.bcritico + this.arma.bonificador.critico : Math.round(this.v * 0.05) + this.bcritico }
  //  get p() { return 100 } //TODO: hacer la formula de pifia

  // get v(){
  //     if(!this.arma || this.arma.bonificador) return super.v
  // }


}

class Tecnica extends HabilidadMarcial {
  constructor(nombre, tipo, valor, pf = 1, ataque = true, localizacion = null, arma = null) {
    super(nombre, tipo, valor, ataque, localizacion, arma);
    this.pf = pf
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

class MyCounter extends HTMLElement {
  constructor() {
    super();
    this.habilidad = new Habilidad("Correr", "Agilidad", 100);

    const style = `
        * {
          font-size: 100%;
        }
  
        span {
          width: 3rem;
          display: inline-block;
          text-align: center;
        }
       
        button {
          width: 64px;
          height: 64px;
          border: none;
          border-radius: 10px;
          background-color: seagreen;
          color: white;
        }
      `;

    //   const html = `
    //   <span id="habilidad">${this.count}%</span>
    //     <button id="dec">-</button>
    //     <span id="dado">${this.count}</span>
    //     <button id="inc">+</button>
    //   `;

    const html = `
      <div id="grupo${this.habilidad.nombre}" class="input-group-prepend">
        <span id="lb${this.habilidad.nombre}" class="input-group-text col-6">${this.habilidad.nombre}: ${this.habilidad.v}%</span>
        <span class="input-group-text dado"  id="dado"> <img src="img/10_sided_die.svg"></img></span>
        <input id="iDados" type="number" style="width: 2.3em;>
        <button id="btOK">OK</button>
      </div>
        `

    this.attachShadow({ mode: 'open' });
    // this.shadowRoot.innerHTML = `
    // ${html}
    // `;
    this.shadowRoot.innerHTML = `
        <style>
          ${style}
        </style>
        ${html}
        `;

    this.dado = this.shadowRoot.getElementById('dado');

    this.InputHabilidads = this.shadowRoot.getElementById('iDados');
    //   this.buttonDec = this.shadowRoot.getElementById('dec');
    //   this.spanValue = this.shadowRoot.getElementById('dado');

    //  console.log(this.getAttribute("valor"));

    this.rd = this.rd.bind(this);
  }

  set(habilidad) {
    this.habilidad = habilidad;
    this.shadowRoot.innerHTML = `<div id="grupo${this.habilidad.nombre}" class="input-group-prepend">
    <span id="lb${this.habilidad.nombre}" class="input-group-text col-6">${this.habilidad.nombre}: ${this.habilidad.v}%</span>
    <span class="input-group-text dado"  id="dado"> <img src="img/10_sided_die.svg"></img></span>
    <input id="iDados" type="number" style="width: 2.3em;">
    <button id="btOK">OK</button>
  </div>
    `
    this.dado = this.shadowRoot.getElementById('dado');
    this.connectedCallback();

  }

  rd() {
    this.InputHabilidads.value = Math.round(Math.random() * 100);
  }

  connectedCallback() {
    this.dado.addEventListener('click', this.rd);
  }

  disconnectedCallback() {
    this.dado.removeEventListener('click', this.rd);
  }
}


// Create a class for the element
// class InputHab extends HTMLElement {
//   constructor() {
//     // Always call super first in constructor
//     super();
//     this.habilidad = new Habilidad("Habilidad", "Agilidad", 77);
//     this.shadow = this.attachShadow({ mode: 'open' });

//     // Create a shadow root
//     this.inicializar();
//   }

//   set h(habilidad) {
//     this.habilidad = habilidad;
//     this.inicializar();
//   }
//   get h() {
//     this.inicializar()
//     return this.habilidad;
//   }

//   inicializar() {


//     // Create spans
//     const wrapper = document.createElement('span');
//     wrapper.setAttribute('class', 'wrapper');

//     const porcentaje = document.createElement('input');
//     porcentaje.setAttribute("id", "porcentaje");
//     porcentaje.setAttribute("type", "number");
//     porcentaje.setAttribute("value", this.habilidad.v);
//     porcentaje.setAttribute('min', '0');
//     porcentaje.setAttribute('max', '9999');
//     porcentaje.style.width = "3em";
//     porcentaje.style.textAlign = "right";
//     porcentaje.style.borderStyle = "none";

//     const percent = document.createElement('span');
//     percent.innerHTML = "<b>% </b>"

//     const icon = document.createElement('span');
//     icon.setAttribute('class', 'icon');
//     icon.addEventListener('click', (event) => {
//       input.value = Math.round(Math.random() * 100);
//       this.act(input);
//       // console.log(this.getAttribute('habilidad'));
//       // if(input.value>this.getAttribute('habilidad')) input.style.color="red"
//       // else input.style.color="black"
//     });
//     icon.setAttribute('tabindex', 0);


//     // const label = document.createElement('label');
//     // ;
//     // label.setAttribute("for", "porcentaje");
//     // label.appendChild(document.createTextNode(this.habilidad.nombre));
//     // label.style.width = "700px";


//     const label = document.createElement('input');
//     label.setAttribute("type", "text");
//     label.setAttribute("value", this.habilidad.nombre);
//     label.readOnly = true;
//     // input.setAttribute('max', '100');
//     label.style.width = "7em";



//     const input = document.createElement('input');
//     input.setAttribute("type", "number");
//     input.setAttribute("value", "100");
//     input.setAttribute('min', '0');
//     input.setAttribute('max', '100');
//     input.style.width = "2.3em";


//     input.addEventListener('change', (event) => {
//       this.act(input);
//       // console.log(this.getAttribute('habilidad'));
//       // if(input.value>this.getAttribute('habilidad')) input.style.color="red"
//       // else input.style.color="black"
//     });

//     // Take attribute content and put it inside the info span
//     // Insert icon
//     let imgUrl;
//     if (this.hasAttribute('img')) {
//       imgUrl = this.getAttribute('img');
//     } else {
//       imgUrl = 'img/10_sided_die.svg';
//     }

//     const img = document.createElement('img');
//     img.src = imgUrl;
//     icon.appendChild(img);

//     // Create some CSS to apply to the shadow dom
//     const style = document.createElement('style');
//     // console.log(style.isConnected);

//     style.textContent = `
//         .wrapper {
//           position: relative;
//         }
//         *{
//           font-size: 110%;
//           border-style: none;
//         }
//         img {
//           width: 2rem;
//         }

//         .icon {
//           position: relative;
//           /* Adjust these values accordingly */
//           vertical-align: middle;

//         }
//       `;

//     // Attach the created elements to the shadow dom
//     this.icon = icon;
//     this.input = input;

//     this.shadow.innerHTML = ""
//     this.shadow.appendChild(style);
//     // console.log(style.isConnected);
//     this.shadow.appendChild(wrapper);
//     wrapper.appendChild(label);
//     wrapper.appendChild(porcentaje);
//     wrapper.appendChild(percent);
//     wrapper.appendChild(icon);
//     wrapper.appendChild(input);
//   }

//   setHabilidad(habilidad) {
//     this.habilidad = habilidad;
//     this.inicializar();
//   }

//   act(input) {
//     let v = this.habilidad.tirada(input.value);

//     switch (v) {
//       case (TipoTirada.SUPERCRITICO):
//         input.style.color = "red";
//         break;
//       case (TipoTirada.CRITICO):
//         console.log("CRITICO");
//         input.style.color = "red";
//         break;
//       case (TipoTirada.ESPECIAL):
//         console.log("ESPECIAL");
//         input.style.color = "green";
//         break;
//       case (TipoTirada.EXITO):
//         console.log("EXITO");
//         input.style.color = "black";
//         break;
//       case (TipoTirada.FALLO):
//         console.log("FALLO");
//         input.style.color = "grey";
//         break;
//       default:
//         ;
//     }
//   }
// }

class InputHabilidad extends HTMLElement {
  constructor(hab = new Habilidad("Habilidad", "Agilidad", 77)) {
    // Always call super first in constructor
    super();
    this.habilidad = hab;
    this.shadow = this.attachShadow({ mode: 'open' });

    this.wrapper = document.createElement('span');
    this.wrapper.setAttribute('class', 'wrapper');

    this.label = document.createElement('input');
    this.label.setAttribute("type", "text");

    this.label.classList.add("hab");
    this.label.setAttribute("value", this.habilidad.nombre);
    // this.label.readOnly = true;
    this.label.addEventListener('change', (event) => {

      console.log(this.personaje.habilidades[event.target.value]);
      // console.log(pj.habilidades[event.target.value]);
      this.setHabilidad(this.personaje.habilidades[event.target.value])
      // console.log(this.getAttribute('habilidad'));
      // if(input.value>this.getAttribute('habilidad')) input.style.color="red"
      // else input.style.color="black"
    });


    // input.setAttribute('max', '100');
    this.label.style.width = "7em";

    this.porcentaje = document.createElement('input');
    this.porcentaje.setAttribute("id", "porcentaje");
    this.porcentaje.setAttribute("type", "number");
    this.porcentaje.value = this.habilidad.v;
    // this.porcentaje.setAttribute("value", this.habilidad.v);
    this.porcentaje.setAttribute('min', '0');
    this.porcentaje.setAttribute('max', '9999');
    this.porcentaje.style.width = "3em";
    this.porcentaje.style.textAlign = "right";
    this.porcentaje.style.borderStyle = "none";

    this.percent = document.createElement('span');
    this.percent.innerHTML = "<b>% </b>"

    this.icon = document.createElement('span');
    this.icon.setAttribute('class', 'icon');
    this.icon.addEventListener('click', (event) => {

      this.input.value =  Math.floor(Math.random() * 100 + 1); //mal
      // this.input.value = Math.round(Math.random() * 100); //mal
      this.act(this.input);
      // console.log(this.getAttribute('habilidad'));
      // if(input.value>this.getAttribute('habilidad')) input.style.color="red"
      // else input.style.color="black"
    });

    // const label = document.createElement('label');
    // ;
    // label.setAttribute("for", "porcentaje");
    // label.appendChild(document.createTextNode(this.habilidad.nombre));
    // label.style.width = "700px";


    //el input del dado de tirada
    this.input = document.createElement('input');
    this.input.setAttribute("type", "number");
    // this.input.setAttribute("value", "100");
    this.input.setAttribute("placeholder", "100");
    this.input.setAttribute('min', '1');
    this.input.setAttribute('max', '100');
    this.input.style.width = "2.3em";


    this.input.addEventListener('change', (event) => {
      this.act(this.input);
      // console.log(this.getAttribute('habilidad'));
      // if(input.value>this.getAttribute('habilidad')) input.style.color="red"
      // else input.style.color="black"
    });

    // Take attribute content and put it inside the info span
    // Insert icon
    let imgUrl;
    if (this.hasAttribute('img')) {
      imgUrl = this.getAttribute('img');
    } else {
      imgUrl = 'img/10_sided_die.svg';
    }

    const img = document.createElement('img');
    img.src = imgUrl;
    this.icon.appendChild(img);

    // Create some CSS to apply to the shadow dom
    const style = document.createElement('style');
    console.log(this.style.isConnected);

    // this.ok= document.createElement('button');
    // this.ok.classList.add("okay");
    this.ok = document.createElement('img');

    this.ok.src = this.habilidad.ataque ? 'img/sword.svg' : 'img/shield.svg';
    //  this.ok.src = 'img/check.svg';
    // if (this.habilidad instanceof HabilidadMarcial) this.ok.src = this.habilidad.ataque?'img/sword.svg':'img/shield.svg';
    this.ok.addEventListener('click', (event) => {
      console.log('Evento de xpTirada');
      this.habilidad.xpTirada(this.input.value, this.personaje?.suerte)
    });


    style.textContent = `
          .wrapper {
            position: relative;
          }
          *{
            font-size: 100%;
            border-style: none;
          }
          img {
            width: 1.7rem;
            vertical-align: text-top; 
            transition: .5s ease;
          }
          img:hover{
            opacity: 0.9;
            filter: none;
          }
          img:active {
            -webkit-transform: rotate(360deg);
                    transform: rotate(360deg);
          }
          img:active {
            //width: 2rem;
            transition: .1s ease;
          }
          .button{
            display:inline-block;
            width: 30px;
            height: 30px;
            }
          .button.okay{
            background:url('img/check.svg');
             
            }
          .icon {
            position: relative;
            /* Adjust these values accordingly */
            vertical-align: top;  
          }
        `;

    // Attach the created elements to the shadow dom

    // this.shadow.innerHTML=""
    this.shadow.appendChild(style);
    // console.log(style.isConnected);
    this.shadow.appendChild(this.wrapper);
    this.wrapper.appendChild(this.label);
    this.wrapper.appendChild(this.porcentaje);
    this.wrapper.appendChild(this.percent);
    this.wrapper.appendChild(this.icon);
    this.wrapper.appendChild(this.input);
    this.wrapper.appendChild(this.ok);


    // Create a shadow root
  }

  lista(id, habilidades) {
    this.label.setAttribute("type", "search");
    let options = "";
    habilidades.forEach(h => {
      options += `<option value="${h.nombre}"></option>`
    });
    this.label.innerHTML = `  <datalist id=${id}>
    ${options}
  </datalist>`
    this.label.setAttribute("list", id);
  }

  setPersonaje(personaje) {
    this.personaje = personaje;

    let array = this.personaje.getHabilidades(h => (h instanceof HabilidadMarcial));

    array.sort(function (a, b) {
      return a.v - b.v;
    });
    console.log(array.reverse());
    // this.lista("listaHab"+personaje.nombre,this.personaje.getHabilidades());
    this.lista("listaHab" + personaje.nombre, this.personaje.getHabilidades(h => (h instanceof HabilidadMarcial)));
    this.h = array[0];


  }

  set h(habilidad) {
    this.setHabilidad(habilidad);
    // this.habilidad = habilidad;
    // this.label.setAttribute("value", this.habilidad.nombre);
    // this.porcentaje.setAttribute("value", this.habilidad.v);
  }
  get h() {
    return this.habilidad;
  }

  setHabilidad(habilidad) {
    if (habilidad) this.habilidad = habilidad;
    this.label.setAttribute("value", this.habilidad.nombre);
    this.porcentaje.setAttribute("value", this.habilidad.v);
    this.porcentaje.value = this.habilidad.v;
    this.ok.src = this.habilidad.ataque ? 'img/sword.svg' : 'img/check.svg';
  }

  act(input) {

    let v;
    if (this.personaje?.suerte?.length > 0)
      v = this.habilidad.tirada(input.value, this.personaje.suerte);
    else
      v = this.habilidad.tirada(input.value);

    switch (v) {
      case (TipoTirada.SUPERCRITICO):
        input.style.color = "red";
        break;
      case (TipoTirada.CRITICO):
        console.log("CRITICO");
        input.style.color = "red";
        break;
      case (TipoTirada.ESPECIAL):
        console.log("ESPECIAL");
        input.style.color = "green";
        break;
      case (TipoTirada.EXITO):
        console.log("EXITO");
        input.style.color = "black";
        break;
      case (TipoTirada.FALLO):
        console.log("FALLO");
        input.style.color = "grey";
        break;
      default:
        ;
    }
  }
}

class InputSubirHabilidad extends InputHabilidad {

  constructor(hab = new Habilidad("Habilidad", "Agilidad", 77)) {
    super(hab);
    this.porcentaje.value = hab.subible()
    if (this.hasAttribute('dado')) {
      let dd = this.getAttribute('dado');
      this.DADO = new Dado(dd);
    } else
      this.DADO = new Dado('1d6');

    this.dado = document.createElement('span');
    this.dado.setAttribute('class', 'icon');
    this.dado.addEventListener('click', (event) => {
      let c = [1, 13]
      if (c.includes(parseInt(this.input.value))) {
        this.input.style.color = "blue";
        this.inputdado.value = this.DADO.dadoMax() + this.DADO.tirar()
      }
      else
        this.inputdado.value = this.DADO.tirar();

      // probarRnd((new Dado('1d6')).tirar,6,1000);
      // this.act(this.inputdado);
      // console.log(this.getAttribute('habilidad'));
      // if(input.value>this.getAttribute('habilidad')) input.style.color="red"
      // else input.style.color="black"
    });

    this.inputdado = document.createElement('input');
    this.inputdado.setAttribute("type", "number");
    // this.input.setAttribute("value", "100");
    this.inputdado.setAttribute("placeholder", "6");
    this.inputdado.setAttribute('min', '0');
    this.inputdado.setAttribute('max', this.MAX_DADO * 2);
    this.inputdado.style.width = "1.8em";

    //Imagen del dado de 6
    const img = document.createElement('img');
    img.src = 'img/6_sided_die.svg';
    this.dado.appendChild(img);

    //SOBREESCRIBIR OK para que haga otra cosa el click
    var new_element = this.ok.cloneNode(true);
    this.ok.parentNode.replaceChild(new_element, this.ok);
    this.ok = new_element;

    this.ok.addEventListener('click', (event) => {
      console.log("SUBIR");
      this.habilidad.subir(this.inputdado.value);
      tablaHabilidades();
      let id;
      //si se ha definido como modal al darle a ok se cierra
      if (this.hasAttribute('modal')) {
        id = this.getAttribute('modal');
        console.log('MODAL ');
        $('#' + id).modal('close');
      }
      //solo para modal$('#modal').modal('close');

    });
    this.wrapper.insertBefore(this.dado, this.ok);
    this.wrapper.insertBefore(this.inputdado, this.ok);

  }
  //sobrescribir act()
  act(input) {
    // let v = this.habilidad.tirada(input.value);
    let iv = parseInt(input.value)
    let v = this.habilidad.subible();
    let sc = [7, 77];

    if (sc.includes(iv)) {
      // console.log('sube x2');
      input.style.color = "red";
      this.inputdado.value = this.DADO.dadoMax() * 2
    }
    else
      if (iv > v) { input.style.color = "green"; }
      else { input.style.color = "grey"; }


  }
  // override
  setHabilidad(habilidad) {
    if (habilidad) this.habilidad = habilidad;
    this.label.setAttribute("value", this.habilidad.nombre);
    this.porcentaje.setAttribute("value", this.habilidad.subible());
    this.porcentaje.value = this.habilidad.subible();
    this.percent.innerHTML = '⇈⇧⇑'//"<span style='font-size: 20px;'>⇈⇧</span>"
    this.ok.src = 'img/check.svg';
  }

  /**Cambia el dado con el que se sube
   * @param {Strinf} dd el dado como string
   */
  setDado(dd) {
    this.DADO = new Dado(dd);
  }

}

class InputArte extends InputHabilidad {
  constructor(habilidad) {
    super(habilidad);
    this.pm = document.createElement('input');
    this.pm.setAttribute("id", "pm");
    this.pm.setAttribute("type", "number");
    this.pm.value = 0;
    this.pm.setAttribute('min', '0');
    this.pm.setAttribute('max', '99');
    this.pm.style.width = "2em";
    this.pm.style.textAlign = "right";
    this.pm.style.color = "blue";
    this.pm.style.fontWeight = "700";

    this.pm.style.borderStyle = "none";

    // this.wrapper.appendChild();
    this.wrapper.insertBefore(this.pm, this.icon);

  }


  act(input) {
    super.act(input)
    // console.log(this.pmGastados());
    this.intensidad(input)
  }

  /**
   * @returns los PM que se gasta con el tipo de tirada
   */
  pmGastados() {
    let v = this.habilidad.tirada(this.input.value);
    if (+this.pm.value == 0) return 0;
    switch (v) {
      case (TipoTirada.SUPERCRITICO):
        this.pm.color = "red";
        return +this.pm.value + 5;
        break;
      case (TipoTirada.CRITICO):
        console.log("CRITICO");
        this.pm.color = "red";
        return +this.pm.value + 3;
        break;
      case (TipoTirada.ESPECIAL):
        console.log("ESPECIAL");
        this.pm.color = "green";
        return +this.pm.value + 1;
        break;
      case (TipoTirada.EXITO):
        return +this.pm.value
        break;
      case (TipoTirada.FALLO):
        console.log("FALLO");
        this.pm.color = "grey";
        return 1;
        break;
      default:
        ;
    }
  }

  /**
   * @returns los PM de intensidad del Arte
   */
  intensidad(input) {
    let v;
    if (this.personaje?.suerte?.length > 0)
      v = this.habilidad.tirada(input.value, this.personaje.suerte);
    else
      v = this.habilidad.tirada(input.value);
    var pm = +this.pm.value
    if (pm == 0) return 0;
    let gastados = 0
    let intensidad = 0
    switch (v) {
      case (TipoTirada.SUPERCRITICO):
        this.pm.color = "red";
        intensidad = 5;
        break;
      case (TipoTirada.CRITICO):
        console.log("CRITICO");
        this.pm.color = "red";
        intensidad = 3;
        break;
      case (TipoTirada.ESPECIAL):
        console.log("ESPECIAL");
        this.pm.color = "green";
        intensidad = 1;
        break;
      case (TipoTirada.EXITO):
        break;
      case (TipoTirada.FALLO):
        intensidad = 0
        return 0;
        break;
      default:
        ;
    }

    if (intensidad < pm) {
      gastados = (pm - intensidad)
      intensidad = pm;
      this.pm.style.color = 'blue';
    }
    else if (intensidad >= pm) {
      gastados = 0 //o 1?
      intensidad = pm + (intensidad - pm);
      this.pm.style.color = 'red'; //pq puedes subir puntos si te interesa no gastas

    }

    console.log('intensidad', intensidad, 'gastados', gastados, 'penalizacion', this.penalizacion());
    var result = { intensidad: intensidad, gastados: gastados, penalizacion: this.penalizacion() };
    console.log(result);
    return intensidad;
  }

  /**
   * @returns la penalización al hechizo
   */
  penalizacion() {
    var pm = +this.pm.value
    if (pm == 0) return 0;
    let v = this.habilidad.tirada(this.input.value);

    if (v == TipoTirada.EXITO)
      return pm * 5;
    else return 0;

  }
}

class InputHechizo extends InputHabilidad {
  constructor() {
    super();
    this.pm = document.createElement('input');
    this.pm.setAttribute("id", "pm");
    this.pm.setAttribute("type", "number");
    this.pm.value = 0;
    this.pm.setAttribute('min', '0');
    this.pm.setAttribute('max', '99');
    this.pm.style.width = "2em";
    this.pm.style.textAlign = "right";
    this.pm.style.color = "blue";
    this.pm.style.fontWeight = "700";

    this.pm.style.borderStyle = "none";

    // this.wrapper.appendChild();
    this.wrapper.insertBefore(this.pm, this.icon);

    this.label.style.width = "13em"; //los hechizos son más largos


  }

  //override
  setPersonaje(personaje) {
    this.personaje = personaje;

    let array = this.personaje.getHabilidades(h => (h instanceof Hechizo));

    array.sort(function (a, b) {
      return a.v - b.v;
    });
    console.log(array.reverse());
    // this.lista("listaHab"+personaje.nombre,this.personaje.getHabilidades());
    // this.lista("listaHab" + personaje.nombre, this.personaje.getHabilidades(h => (h instanceof Hechizo)));
    this.lista("listaHab" + personaje.nombre, array);

    this.h = array[0];

  }

  //override
  setHabilidad(habilidad) {
    // super.setHabilidad(habilidad);
    if (habilidad) this.habilidad = habilidad;
    this.label.setAttribute("value", this.habilidad.nombre);
    this.porcentaje.setAttribute("value", this.habilidad.v);
    this.porcentaje.value = this.habilidad.v;
    this.ok.src = this.habilidad.ataque ? 'img/sword.svg' : 'img/check.svg';
    this.pm.value = habilidad.pm;
  }

}

// Define the new element

customElements.define('input-habilidad', InputHabilidad);
// customElements.define('input-hechizo', InputHechizo);

customElements.define('input-arte', InputArte);
customElements.define('input-subir', InputSubirHabilidad);

customElements.define('my-counter', MyCounter);

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


