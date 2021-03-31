class MiHab extends HTMLElement {
    constructor() {
        // If you define a constructor, always call super() first!
        // This is specific to CE and required by the spec.
        super();
        // if (this.hasAttribute('nombre')) console.log('Nombre de MiHab:',this.getAttribute('nombre'));

    }

    get nombre() {
        if (this.hasAttribute('nombre'));
        return this.getAttribute('nombre')
    }

    set nombre(val) {
        // Reflect the value of the open property as an HTML attribute.
        if (val) {
            this.setAttribute('nombre', val + '');
        } else {
            this.removeAttribute('nombre');
        }

    }

    attributeChangedCallback(name, oldValue, newValue) {
        console.log(name+' cambiado');
        this.html();
      }

    html(){
        console.log('Nuevo html'+this.nombre);
        this.innerHTML =
        `nombre <input ng-model="p.getHabilidad('${this.nombre}').nombre value="p.getHabilidad('${this.nombre}').nombre">
        valor <input ng-model="p.habilidades['${this.nombre}'].valor">
        total <input ng-model="p.habilidades['${this.nombre}'].v" value="p.getHabilidad('${this.nombre}').v">
       `
        
    }
    connectedCallback() {
        console.log('CC html'+this.nombre);
        this.innerHTML =
            // `<div>
            // <md-input-container>
            //     <label>Habilidad</label>
            //     <input ng-model="p.habilidades['${this.nombre}'].nombre">
            // </md-input-container>
            // <md-input-container>
            //     <label>Valor</label>
            //     <input type='number' style="width: 4em;" ng-model="p.habilidades['${this.nombre}'].v">
            // </md-input-container>
            // </div>
            // `
            `<md-content  layout-gt-sm="row" layout-padding>
            <div>
              <md-input-container>
                <label>Habilidad</label>
                <input ng-model="p.habilidades['${this.nombre}'].nombre" style="width: 13em;">
              </md-input-container>
        
              <md-input-container>
                <label>Valor</label>
                <input ng-model="p.habilidades['${this.nombre}'].valor"  style="width: 4em;" type="number">
              </md-input-container>

              <md-input-container>
              <label>Total</label>
              <input ng-model="p.habilidades['${this.nombre}'].v"  style="width: 4em;" type="number">
            </md-input-container>

            <md-input-container>
                 <label>Dado</label>
                <span id="dado${this.nombre}"> <img src="img/10_sided_die.svg"></img></span>
                <input  id="iDado${this.nombre}" type='number' style="width: 2.3em;">
            </md-input-container>

            </div>
          </md-content>`



        //   <md-input-container>
        //      <label>Dado</label>
        //     <span id="dado${this.nombre}"> <img src="img/10_sided_die.svg"></img></span>
        //     <input  id="iDado${this.nombre}" type='number' style="width: 2.3em;">
        // </md-input-container>
        // `

        // document.getElementById(`dado${this.nombre}`).addEventListener('click', e => {

        //     document.getElementById(`iDado${this.nombre}`).value = Math.floor(Math.random() * 100 + 1);
        // });
    }
}

class MatAngHabilidad extends HTMLElement {
    constructor(hab = new Habilidad("Habilidad", "Agilidad", 77)) {
        // Always call super first in constructor
        super();

        //BUSCAR FILTRO
        this.filtro = this.getAttribute('filtro');
        this.id = this.getAttribute('id');
        this.clase = this.getAttribute('clase');
        // console.log(('filtro',this.filtro))

        this.habilidad = hab;

        this.wrapper = document.createElement('span');
        this.wrapper.setAttribute('class', 'wrapper');

        this.label = document.createElement('input');
        this.label.setAttribute("type", "text");

        // this.label.classList.add("hab");
        this.label.setAttribute("value", this.habilidad.nombre);
        // this.label.readOnly = true;
        this.label.addEventListener('change', (event) => {
            if (!this.personaje) return;
            console.log(this.personaje.habilidades[event.target.value]);
            // console.log(pj.habilidades[event.target.value]);
            this.setHabilidad(this.personaje.habilidades[event.target.value])
        });

        // input.setAttribute('max', '100');
        this.label.style.width = "7em";
        this.label.setAttribute("onclick", "select()");

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
            this.input.value = Math.floor(Math.random() * 100 + 1); //mal
            this.act(this.input);
        });
        //el input del dado de tirada
        this.mdInputContainer = document.createElement('md-input-container');
        this.mdInputContainer.innerHTML = `
        <label>Dado</label>
        `;

        this.input = document.createElement('input');
        this.input.setAttribute("type", "number");
        // this.input.setAttribute("value", "100");
        this.input.setAttribute("placeholder", "100");
        this.input.setAttribute('min', '1');
        this.input.setAttribute('max', '100');
        this.input.style.width = "2.3em";
        this.input.setAttribute("onfocus", "select()");

        this.input.addEventListener('change', (event) => {
            this.act(this.input);
        });

        // this.mdInputContainer.appendChild(document.createElement('label'));
        this.mdInputContainer.appendChild(this.icon);
        this.mdInputContainer.appendChild(this.input);

        const img = document.createElement('img');
        img.src = 'img/10_sided_die.svg';
        this.icon.appendChild(img);

        this.ok = document.createElement('img');
        let imgUrl;
        if (this.hasAttribute('img')) {
            imgUrl = this.getAttribute('img');
        } else {
            imgUrl = 'img/check.svg';
        }
        // this.ok.src = this.habilidad.ataque ? 'img/sword.svg' : 'img/shield.svg';
        this.ok.src = imgUrl;
        // if (this.habilidad instanceof HabilidadMarcial) this.ok.src = this.habilidad.ataque?'img/sword.svg':'img/shield.svg';
        this.ok.addEventListener('click', (event) => {
            console.log('Evento de xpTirada');
            this.habilidad.xpTirada(this.input.value, this.personaje?.suerte)
        });

        this.appendChild(this.wrapper);
        this.wrapper.appendChild(this.label);
        this.wrapper.appendChild(this.porcentaje);
        this.wrapper.appendChild(this.percent);
        // this.wrapper.appendChild(this.icon);
        this.wrapper.appendChild(this.mdInputContainer);
        this.wrapper.appendChild(this.ok);

        this.setPersonaje(pj);
    }

    lista(id, habilidades) {

        this.label.setAttribute("type", "search");
        let options = "";
        // habilidades.forEach(h => {
        //     // options += `<option value="${h.nombre}"></option>`
        //    
        // });
        if (this.clase)
            options = ` <option ng-repeat='h in p.getClaseHabilidad("${this.clase}")'>{{h.nombre}}</option>`
        else
            options = ` <option ng-repeat='h in p.getHabilidades()'>{{h.nombre}}</option>`



        this.label.innerHTML =
            `<datalist id=${id}>
            ${options}
        </datalist>`
        this.label.setAttribute("list", id);
    }

    setPersonaje(personaje) {
        this.personaje = personaje;
        // let array = this.personaje.getHabilidades(h => (h.constructor.name===this.filtro));
        var array = []
        // array.sort(function (a, b) {
        //     return a.v - b.v;
        // });

        if (this.filtro)
            // this.lista("listaHab" + personaje.nombre, this.personaje.getHabilidades(h => (h.constructor.name===this.filtro)));
            array = this.personaje.getHabilidades(h => (eval(this.filtro)))
        else
            array = this.personaje.getHabilidades()
        console.log(array.map((task) => task.nombre));
        this.lista("listaHab" + this.id, array);
        // this.h = array[0];

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
        else return;
        // this._habilidad= new habilidad.constructor()
        // this._habilidad.setAll(habilidad);
        // console.log(this._habilidad);
        this.label.setAttribute("value", this.habilidad.nombre);
        this.porcentaje.setAttribute("value", this.habilidad.v);
        this.porcentaje.value = this.habilidad.v;

        // this.ok.src = this.habilidad.ataque ? 'img/sword.svg' : 'img/check.svg';
    }

    reset() {
        if (this._habilidad)
            this.habilidad.valor = this._habilidad.valor
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
                input.style.color = "inherit";
                // input.style.color = "initial";
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

//Input de clase
class MatInputCustom extends HTMLElement {
    constructor(clase, lista) {
        super();
        let i = 'input';
        var html = '';

        var scope = angular.element(document.getElementById('app')).scope();
        scope.$apply(function () {
            scope.clase = clase;
        });


        for (let key in clase) {
            if (lista?.includes(key) || !lista) {
                console.log(typeof clase[key]);
                // if (clase[key] instanceof Number) {
                if (typeof clase[key] === 'number') {
                    html += `<${i} type='number' value='${clase[key]}'>`
                } else {
                    html += `${key}<${i}  value='${clase[key]}'>`
                    console.log('por hacer...');
                }
            }
        }

        var div = document.createElement('div');
        div.innerHTML = html;
        this.appendChild(div);

    }
}

customElements.define('mi-hab', MiHab);
customElements.define('in-habilidad', MatAngHabilidad);
customElements.define('in-mat-custom', MatInputCustom);


guerrero(pj, 20);
pj.setHabilidad(new Hechizo('Volar', 6))
pj.act();

// Include app dependency on ngMaterial
var rolApp = angular.module('rolApp', ['ngMaterial', 'ngMessages']);
rolApp.controller('rolController', function ($scope) {

    $scope.listaPersonajes = listaPersonajes();
    console.log($scope.listaPersonajes);
    $scope.p = pj;
    $scope.CP = CP;
    $scope.TH = TipoHabilidades;
    $scope.nombre = {}
    $scope.nombre['nombre'] = 'Nombre'
    $scope.nombre['xp'] = 'xp'
    $scope.nombre['valor'] = 'Valor'
    $scope.nombre['bh'] = 'Bon'
    $scope.nombre['v'] = 'Total'
    $scope.i_shield = 'img/shield.svg'
    $scope.contenedor = pj.inventario;
    $scope.historialContenedor = [pj.inventario]
    $scope.fecha = fechaMundo;


    $scope.cargar = function (c) {
        console.log('HACE EL CHANGE DE ' + c);
        load(c)
        $scope.p = pj;
    }

    $scope.abreContenedor = function (c) {
        console.log(c);
        if (c instanceof Contenedor) {
            $scope.contenedor = c;
            $scope.historialContenedor.push(c);
        }
    }

    $scope.esContenedor = function (c) {
        return (c instanceof Contenedor)
    }



    $scope.atrasInventario = function () {
        if ($scope.historialContenedor.length <= 1) return;
        $scope.historialContenedor.pop()
        $scope.contenedor = $scope.historialContenedor[$scope.historialContenedor.length - 1]
    }

    $scope.orden = function (x) {
        if ($scope.miOrden == x) $scope.miOrden = '-' + x;
        else $scope.miOrden = x
        // console.log($scope.miOrden);
    }
});

function act() {
    var scope = angular.element(document.getElementById('app')).scope();
    scope.$apply(function () {
        scope.p = pj;
        scope.p.act();
    });
}

//carga personaje como parametro url
let s = location.search
const url = new URL(location);
const personaje = url.searchParams.get('pj')
console.log("PERSONAJE url:" + personaje);
// si lo hay se carga
if (personaje) {
    load(personaje);
}
var ONLINE = false;

/**Carga el objeto como el tipo de clase que sea
 * su propiedad .clase
 * 
 * @param {Object} objeto 
 */
function cargar(objeto) {
    if (objeto?.clase) {
        console.log(`pj=new ${objeto.clase}({});`);
        eval(`pj=new ${objeto.clase}({});`);
        pj.setAll(objeto);
        return true; //lo carga bien?
    }
    // console.log("CARGA EL PUTO PERSONAJE:" + pj.nombre);
}

/**Carga on/off line el nombre del PJ
 * 
 * @param {string} nombre 
 */
function load(nombre) {
    if (!nombre) nombre = pj.nombre;
    console.log('LOAD');
    if (ONLINE) {

    } else {
        if (cargar(ls(nombre))) {
            alert(`${pj.nombre} cargado, ${sizeJSON(pj)} bytes`)
            listaPersonajes(pj.nombre);

        }
    }
}

function listaPersonajes(personaje) {
    if (personaje) {
        var mySet = []
        let set = ls('personajes');
        console.log(set);
        if (set) { mySet = new Set(set) }
        mySet.add(personaje);
        console.log(mySet);
        ls('personajes', Array.from(mySet))

    }
    else {
        return ls('personajes');
    }
}
function createHab(contenedorId){
    let html=''
    pj.getHabilidades().forEach(h => {
        html+= ` <mi-hab nombre='${h.nombre}'></mi-hab>`
    });
    document.getElementById(contenedorId).innerHTML=html;
}

dark();

// createHab('habContent');

function dark(params) {
    rolApp
        .config(function ($mdThemingProvider) {
            $mdThemingProvider.theme('default')
                .dark();

        });

    rolApp
        .config(function ($mdThemingProvider) {

            $mdThemingProvider.theme('default')
                .accentPalette('red', {
                    'default': '600', // by default use shade 400 from the pink palette for primary intentions
                    'hue-1': '100', // use shade 100 for the <code>md-hue-1</code> class
                    'hue-2': '600', // use shade 600 for the <code>md-hue-2</code> class
                    'hue-3': 'A100' // use shade A100 for the <code>md-hue-3</code> class
                })
                .primaryPalette('red')
            // If you specify less than all of the keys, it will inherit from the
            // default shades


        });

}

