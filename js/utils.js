function roundTo(precision, num) {
  //redondeamos a gramos  
  return +(Math.round(num + "e+" + precision) + "e-" + precision);
}

function isNumber(value) {
  if (value instanceof Number)
    return true
  else
    return !isNaN(value);
}

function ls(nombre, valor) {
  // body...
  if (valor) {
    localStorage.setItem(nombre, JSON.stringify(valor))
  }
  else {
    return JSON.parse(localStorage.getItem(nombre))
  }
}

/** Escala un valor x entre m1 y M1 a otro valor entre m2 y M2
*  x [m1,M1]->[m2,M2]
* @param {Number} x 
* @param {Number} m1 
* @param {Number} M1 
* @param {Number} m2 
* @param {Number} M2 
*/
function escalar(x, m1, M1, m2, M2) {
  let d1 = M1 - m1;
  let d2 = M2 - m2;
  return (x - m1) * (d2 / d1) + m2;
}

// acts like Array##splice for parent's childNodes
function spliceChildNodes(parent, start, deleteCount /*[, newNode1, newNode2]*/) {
  var childNodes = parent.childNodes;
  var removedNodes = [];

  // If `start` is negative, begin that many nodes from the end
  start = start < 0 ? childNodes.length + start : start

  // remove the element at index `start` `deleteCount` times
  var stop = typeof deleteCount === 'number' ? start + deleteCount : childNodes.length;
  for (var i = start; i < stop && childNodes[start]; i++) {
    removedNodes.push(parent.removeChild(childNodes[start]));
  }

  // add new nodes at index `start`
  if (arguments.length > 3) {
    var newNodes = [].slice.call(arguments, 3);

    // stick nodes in a document fragment
    var docFrag = document.createDocumentFragment();
    newNodes.forEach(function (el) {
      docFrag.appendChild(el);
    });

    // place in `parent` at index `start`
    parent.insertBefore(docFrag, childNodes[start]);
  }

  return removedNodes;
}

function alto() {
  return window.innerHeight
    || document.documentElement.clientHeight
    || document.body.clientHeight;

}

function ancho() {
  return window.innerWidth
    || document.documentElement.clientWidth
    || document.body.clientWidth;
}


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
 * @returns {String} fecha sin hora (pude dar unos minutos menos)
 */
Date.prototype.fecha = function () {
  return this.toISOString().substring(0, 10)
}

/**
 * @returns {String} fecha con hora ("0007-01-01T00:00:00.000") sin Z
 */
Date.prototype.fechahora = function () {
  return this.toISOString().slice(0, -1)
}

/**Busca las diferencias de dos objetos, con respecto al primero
 * 
 * @param {Object} o1 el primer objeto
 * @param {Object} o2 el segundo objeto
 * @param {boolean} verbose false en caso de que no quiera info
 * @param {String} ruta la ruta interna
 * @returns {Number} el número de diferencias
 */
function diferencia(o1, o2,verbose=true,ruta="") {
  let n=0;
  for (k in o1) {
    //si o2[k] no existe saltamos a la siguiente (sumar como diferencia?)
    if((typeof o2[k] === "undefined")) {if(verbose)console.log(`NADA ${ruta} ${k} -> ${o2[k]}`);n++;continue;}
    if(o1[k] instanceof Object){
      n+=diferencia(o1[k],o2[k],verbose,ruta+'/'+k);
    } 
    else
      if (o1[k] != o2[k]) {
        if(verbose)console.log(`${ruta} ${k} ${o1[k]} -> ${o2[k]}`);
        n++
      }  
  }

  return n
}


function sizeJSON(obj) {
  // console.log(JSON.stringify(obj));
  return encodeURI(JSON.stringify(obj)).split(/%..|./).length - 1;
  
}

function probarRnd(f, caras=100,veces=100) {
  let resultados = [];
  for (let i = 0; i < caras; i++)
	resultados[i] = 0;

  let dado= new Dado("1d6")
for (let i = 0; i < veces; i++) {
	// Alex intenta entender qué hago aquí
	resultados[dado.tirar() - 1]++;
}
console.log(resultados);
  
}

/**Muestra lo que tarda en ejecutarse la función f
 * 
 * @param {Function} f Función
 * @param {} a argumentos
 * @returns {Number} milisegundos de ejecucuón
 */
function time(f,a) {
  let t;
  let t0= Date.now()
  f(a);
  t=Date.now()-t0
  console.log(f.name,t);
  return t;
}

/**Devuelve una copia del objeto de su misma clase
 * 
 * @param {Object} o El objeto a copiar
 * @returns la copia del objeto
 */
function copiar(o) {
  let copia;
  // eval(`copia = new ${o.constructor.name}()`); //elegir uno
  copia = (Function('return new ' + o.constructor.name))() 
  for (let key in o) 
    copia[key] = o[key];
  return copia;
}