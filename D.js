/**
 * clase que crea varios dados con el mismo números de caras.
 * Ej: 2d4
 * @author Roberto Lozano Sáez
 * @version 0.13, 07/07/19
 * @param {number} num número de dados
 * @param {number} caras caras del dado
 * @class
 */

class D {
	/**
	 * el número de dados
	 */
	num;
	/**
	 * el  número de caras del dado
	 */
	caras;

	constructor(num, caras) {
		//por si acaso viene como string
		this.num = parseInt(num);
		this.caras = parseInt(caras);
	}

	toString() {
		return this.num + "d" + this.caras;
	}

	compareTo(d) {
		if (d instanceof D) {
			if (this.caras < d.caras)
				return -1;
			else
				if (this.caras > d.caras)
					return 1;
				else
					return 0;
		}
		//TODO: si no dado qué devuelvo
		return 0;
	}

	max() {
		return this.num * this.caras;
	}

	min() {
		return this.num;
	}

	/**
	 * Devuelve una tirada normal de los dados
	 * @returns {number} el valor de los dados tirado
	 */
	norm() {
		var numero = 0;
		let signo = this.num > 0 ? 1 : -1;
		//los dados pueden ser negativos
		let abs = this.num * signo;

		for (var i = 0; i < abs; i++) {
			numero += Math.floor(Math.random() * this.caras + 1);
			//TODO: borrar verbose
			//console.log(this.toString()+":"+numero);
		}
		//console.log(numero *signo);

		return numero * signo;
	}

	/**
	 * Tirada con cierta cantidad de dados extra que intercambiar por las tiradas más bajas.
	 * Indicado para crear PJ o PNJ
	 * @param {number} extra numeros de dados extra
	 * @returns {number} el valor de los dados tirado sustituyendo los menores con los dados extra
	 * TODO: ¿Sería interesante con negativos?
	 */
	bonus(extra) {
		if (this.num < 1|| extra<1) return this.norm(); //no tiene sentido con dados negativos
		let total = this.num+extra;
		let arr = [];

		for (let i = 0; i < total; i++) {
			arr.push(Math.floor(Math.random() * this.caras + 1));
		}
		//ordeno el array
		arr.sort((a, b) => a - b);
		console.log(arr);
		//quito los extra más bajos
		arr = arr.slice(extra);
		console.log(arr);

		//sumo las tiradas mayores
		let tiradas = arr.reduce((a, b) => a + b);
		// console.log(tirada);

		return tiradas;
	}

	/**
	 * Devuelvo un nuevo dado, sumando n dados de igual número de caras
	 * @param d el dado a sumar
	 * @return {D} el dado resultado de sumar el número de dados, <code>null</code> si no son del mismo número de caras
	 */
	newSum(d) {
		if (this.caras == d.caras)
			return new D(this.num + d.num, this.caras);
		else return null;

	}


	/**
	 * Suma n dados de igual número de caras, modificando su valor
	 * @param d el dado a sumar
	 * 
	 */
	sum(d) {
		if (this.caras == d.caras)
			this.num += d.num;
	}

}



/**
 * La clase que representa un dado como la suma de varios dados. (Es lo mismo
 * que daño)
 * 
 * @author Rober
 * @version 0.77, 5/12/19
 * 
 */
class Dado {

	/**
	 *Crea an instancia de Dado a traves de un string.
	 * @param {string} dado Un string con el dado
	 * @memberof Dado
	 */
	constructor(dado) {
		//console.log("string inicial:"+dado);
		//TODO: Permitir tambien +-int?

		var regex = /^(\d+d\d+)?([+|-](\d+|(\d+d\d+)))*$/;
		var re = new RegExp(regex);
		let s = dado;
		s = s.toLowerCase();			//en minúsculas
		//Pruebo si la cadena tiene el formato correcto
		// if (!re.test(s)) return "error formato inválido";	//formato inválido


		s = s.replace(" ", "", "gi");	//quito espacios
		s = s.replace("-", "+-", "gi");	//reemplazo - con +-

		/**La cadena que representa el dado*/
		this.dado = "";

		/** El array con los distintos D */
		this.dados = [];

		/** el valor entero del dado */
		this.entero = 0

		// buscar sumandos;
		//console.log("string final:"+s);
		this.buscarSumandos(s);
		let stringDado = "";
		for (let i of this.dados) {

			if (i.num > 0)
				stringDado += "+" + i;
			else if (i.num < 0)
				stringDado += i;
			// stringDado+= i+"+";
		}
		//quita un posible + inicial
		if (stringDado.startsWith("+")) stringDado = stringDado.substring(1);
		stringDado += "+" + this.entero;
		stringDado = stringDado.replace("+0", "");//si es +0 se quita
		this.dado = stringDado;

	}



	// toString() {
	// //TODO:
	// }

	// dadoMax(sumando) {
	// 	let dado = 0;
	// 	let sumandos;
	// 	if (sumando.includes("d")) {
	// 		sumandos = sumando.split("d");
	// 		dado = parseInt(sumandos[0])
	// 				* parseInt(sumandos[1]);

	// 	} else
	// 		dado = parseInt(sumando);

	// 	return dado;

	// }
	/**
	 * Tira del dado de un sumando, bien sea un dado o un entero
	 *
	 * @param {string} sumando
	 * @returns el valor de la suma
	 * @memberof Dado
	 */
	dadoTirado(sumando) {
		let dado = 0;
		let dados = 0
		let caras = 0;
		let sumandos;
		if (sumando.includes("d")) {
			sumandos = sumando.split("d");
			dados = parseInt(sumandos[0]);
			caras = parseInt(sumandos[1]);
			dado = (new D(dados, caras)).norm();

		} else
			dado = parseInt(sumando);

		if (isNaN(dado)) return 0; //por si encuentra un vacio al haber + al principio de this.dado
		return dado;

	}
	/**
	 *Devuelve el mínimo valor de la tirada de dados
	 *
	 * @returns {number} el mínimo
	 * @memberof Dado
	 */
	dadoMin() {
		let _min = 0;
		for (let d of this.dados) {
			_min += d.min();
		}
		return _min + this.entero;
	}

	/**
	 *Devuelve el máximo valor de la tirada de dados
	 *
	 * @returns {number} el máximo
	 * @memberof Dado
	 */
	dadoMax() {
		let _max = 0;
		for (let d of this.dados) {
			_max += d.max();
		}
		return _max + this.entero;
	}

	/**
	 * Baremo para establecer que dado es más alto en general;
	 * suma del mínimo y el máximo
	 * @returns el mínimo más el máximo
	 */
	dadoTotal() {
		return this.dadoMin() + this.dadoMax();
	}

	/**
	 * Devuelve un dado suma del actual y el parámetro
	 * @param {Dado} d El dado que se suma
	 * @returns {Dado} El dado suma de los dos
	 */
	sumaDado(d) {
		return new Dado(this.dado + d.dado);
	}

	/**
	 * convierte una cadena en una lista de dados y un entero global
	 * 
	 * @param dado
	 *            el string del dado
	 */
	buscarSumandos(dado) {
		// si hay un menos hago que sea un + num negativo
		// let _dado = dado.replace("-", "+-");
		let _dado = dado;
		let sumandos;
		if (_dado.includes("+")) {// separo en sumandos
			sumandos = _dado.split("+");
			for (let i = 0; i < sumandos.length; i++) {
				// el dado máximo de cada sumando y el minimo
				this.buscarDado(sumandos[i]);
			}
		}
		else {
			this.buscarDado(_dado);
		}

	}

	/**
	 * Convierte una cadena '#d#' en un dado, si es un entero lo suma al entero
	 * global
	 * 
	 * @see #buscarSumandos(String)
	 * @see D
	 * @param d
	 */
	buscarDado(d) {
		// Intenta por si es un entero
		if (!isNaN(d)) {
			this.entero += parseInt(d);
			return; //si es entero sumo y salgo
		}

		if (d.includes("d")) {
			let sumando = d;
			let sumandos;
			sumandos = sumando.split("d");
			//hago D(dados, caras)
			let _d = new D(parseInt(sumandos[0]),
				parseInt(sumandos[1]));
			// //console.log(this.dados);
			//Busco si existe el dado con ese nº de caras
			for (let i of this.dados) {
				if (i.caras == _d.caras) {
					//si existe lo sumo
					i.sum(_d);
					return;
				}
			}
			//si no existe lo añado
			this.dados.push(_d);
		}

	}


	/**
	 * Una tirada normal de dados
	 *
	 * @returns {number} el resultado de una tirada normal de dados
	 * @memberof Dado
	 */
	tirar() {
		let sumatorio = 0;
		// por cada dado tiro el número de veces
		for (let i of this.dados)
			sumatorio += (new D(i.num, i.caras)).norm();
		//si hay parte entera la sumo
		if (!isNaN(this.entero)) sumatorio += this.entero;
		return sumatorio;

	}

	/**
	 *Tira un dado que se le  ES INNECESARIO. HACER ALGO STATIC
	 *
	 * @param {string|Dado} dado Un string con el valor del dado o un Dado con el que ahcer la tirada
	 * @returns el resultado de tirar un dado
	 * @memberof Dado
	 * TODO: eliminar
	 */
	// tirarDado(dado) {

	// 	//si es un Dado se utiliza el string d
	// 	if (dado instanceof Dado) return tirarDado(dado.dado);

	// 	let total = 0;
	// 	let sumandos;
	// 	if (dado.includes("+")) {// separo en sumandos
	// 		sumandos = dado.split("+");
	// 		// //console.log(sumandos);

	// 		for (let i = 0; i < sumandos.length; i++) {
	// 			// el dado máximo de cada sumando y el minimo
	// 			total += this.dadoTirado(sumandos[i]);
	// 		}
	// 	}

	// 	else {
	// 		total = this.dadoTirado(dado);
	// 	}
	// 	return total;
	// }


	/**
	 * Te da el máximo valor del número de <i>veces</i> que tires los dados
	 * @param veces las veces que se tira el los dados
	 * @param dados El string que representa a los dados a tirar
	 * @return
	 */
	mejor(veces) {
		let valor = 0;
		for (; veces > 0; veces--) {
			let i = this.tirar();
			// //console.log(dados);
			valor = Math.max(valor, i);
			// //console.log("valor:"+valor);	
		}
		return valor;
	}

}


/**
 *Función para testear los resultados de dados siempre positivos
 *
 * @param {Dado} dado dado(s) a lanzar
 * @param {number} veces nº de veces que se lanza
 * @returns Un array con los resultados de la tirada
 * TODO: hacer con un map y permitir negativos
 */
function test(dado, veces) {
	//inicializo
	let resultados = [];
	if (dado.dadoMin() < 0) return "Sólo con dados positivos";
	let max = dado.dadoMax();
	//para que el valor sea el mismo que el índice
	for (let i = 0; i <= max; i++)
		resultados[i] = 0;

	for (let i = 0; i < veces; i++) {
		// Alex intenta entender qué hago aquí
		resultados[dado.tirar()]++;
	}
	return resultados;

}



var d1 = new Dado("3d6");
// console.log(test(d1,100));


var _3d6 = new D(3, 6);
_3d6.bonus(2);
// //console.log(d1.max());
// //console.log(d1.min());
// //console.log(d1.newSum(_2d6)+"");
// //console.log(x);


// let dado1=new Dado("1d10");
// let resultados = [];
// for (let i = 0; i < 10; i++)
// 	resultados[i] = 0;

// for (let i = 0; i < 1000; i++) {
// 	// Alex intenta entender qué hago aquí
// 	resultados[dado1.tirar() - 1]++;
// }


// for (let i = 0; i < 10; i++) {
// 	// Alex intenta entender qué hago aquí
// 	console.log(dado1.tirar());

// }


// Imprimo el número de veces que ha salido cada número
// for (let i = 0; i < 10; i++)
// 	//console.log(i + 1 + ": " + resultados[i]);


// console.log(new Dado("1d5+1d10+6"));
// console.log(new Dado("1d5+1d10+6").dado);
// console.log(new Dado("1d10+3d10"));
// console.log(new Dado("1d10+3d10").dado);
// console.log(new Dado("1d5-4+1d4+6+3"));
// console.log(new Dado("1d5-4+1d4-0+4"));
// console.log(new Dado("1d5-4+1d4+6+3"));
// console.log(new Dado("1d5-4+1d4+6+3").dado);
// console.log(new Dado("2d4-1d3"));
// console.log(new Dado("2d4-1d3").dado);

var regex = /^(\d+d\d+)?([+|-](\d+|(\d+d\d+)))*$/;
var re = new RegExp(regex);
// console.log("1d5+1d10+6" + re.test("1d5+1d10+6"))
// console.log("1d5+1d10+6" + re.test("1d5+1d10+6"))
// console.log("1d5+1d10+6" + re.test("1d5+1d10+6"))
// console.log("1d10+3d10" + re.test("1d10+3d10"))
// console.log("1d10+3d10" + re.test("1d10+3d10"))
// console.log("1d5-4+1d4+6" + re.test("1d5-4+1d4+6"))
// console.log("1d5-4+1d4-0" + re.test("1d5-4+1d4-0"))
// console.log("1d5-4+1d4+0" + re.test("1d5-4+1d4+0"))
// console.log("1d5-4+1d4-0" + re.test("1d5-4+1d4-0"))
// console.log("1d5-4+1d4+66" + re.test("1d5-4+1d4+66"))
// console.log("1d5-4+1d4+6+1d" + re.test("1d5-4+1d4+6+1d"))
// console.log("2d4-1d3" + re.test("2d4-1d3"))
// console.log("pern2d6" + re.test("pern2d6"))
// console.log("1d51d6" + re.test("1d51d6"))
// console.log("2d6" + re.test("2d6"))
// console.log("2d6+" + re.test("2d6+"))



// for( let i=0;i<100;i++)
// 	//console.log(d1.tirar());

console.log(d1.mejor(10, "3d6"));
// //console.log(d1.mejor(1));

// //console.log(d1.dadoMin());
// //console.log(d1.dadoMax());




