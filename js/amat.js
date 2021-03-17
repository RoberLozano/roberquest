class MiHab extends HTMLElement {
    constructor() {
        // If you define a constructor, always call super() first!
        // This is specific to CE and required by the spec.
        super();

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

    connectedCallback() {
        this.innerHTML =
            `
            <md-input-container>
                <label>${this.nombre}</label>
                <input type='number' ng-model="p.habilidades['${this.nombre}'].v">
            </md-input-container>
            <md-input-container>
                <label>Dado</label>
                <span id="dado${this.nombre}"> <img src="img/10_sided_die.svg"></img></span>
                <input  id="iDado${this.nombre}" type='number' style="width: 2.3em;">
            </md-input-container>
            `

        document.getElementById(`dado${this.nombre}`).addEventListener('click', e => {

            document.getElementById(`iDado${this.nombre}`).value = Math.floor(Math.random() * 100 + 1);
        });
    }
}

class InHabilidad extends HTMLElement {
    constructor(hab = new Habilidad("Habilidad", "Agilidad", 77)) {
        // Always call super first in constructor
        super();
        this.habilidad = hab;

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
            // console.log(this.getAttribute('habilidad'));
            // if(input.value>this.getAttribute('habilidad')) input.style.color="red"
            // else input.style.color="black"
        });

        // this.mdInputContainer.appendChild(document.createElement('label'));
        this.mdInputContainer.appendChild(this.icon);
        this.mdInputContainer.appendChild(this.input);

        // Take attribute content and put it inside the info span
        // Insert icon

        const img = document.createElement('img');
        img.src = 'img/10_sided_die.svg';
        this.icon.appendChild(img);


        // this.ok= document.createElement('button');
        // this.ok.classList.add("okay");
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
        habilidades.forEach(h => {
            options += `<option value="${h.nombre}"></option>`
        });
        this.label.innerHTML =
        `<datalist id=${id}>
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
        // this.lista("listaHab" + personaje.nombre, this.personaje.getHabilidades(h => (h instanceof HabilidadMarcial)));
        this.lista("listaHab" + personaje.nombre, this.personaje.getHabilidades());
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

customElements.define('mi-hab', MiHab);
customElements.define('in-habilidad', InHabilidad);

pj.act();
// Include app dependency on ngMaterial
var rolApp = angular.module('rolApp', ['ngMaterial', 'ngMessages']);
rolApp.controller('rolController', function ($scope) {
    $scope.p = pj;
    $scope.CP = CP;
    $scope.TH = TipoHabilidades;
    $scope.nombre = {}
    $scope.nombre['nombre'] = 'Nombre'
    $scope.nombre['xp'] = 'xp'
    $scope.nombre['valor'] = 'Valor'
    $scope.nombre['bh'] = 'Bon'
    $scope.nombre['v'] = 'Total'


    $scope.orden = function (x) {
        if ($scope.miOrden == x) $scope.miOrden = '-' + x;
        else $scope.miOrden = x
        // console.log($scope.miOrden);
    }
});



// rolApp
//     .config(function ($mdThemingProvider) {
//         $mdThemingProvider.theme('default')
//             .dark();

//     });

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


function act() {
    var scope = angular.element(document.getElementById('app')).scope();
    scope.$apply(function () {
        scope.p = pj;
        scope.p.act();
    });


}