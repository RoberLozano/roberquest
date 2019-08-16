/* Generated from Java with JSweet 2.2.0-SNAPSHOT - http://www.jsweet.org */
/**
 * clase que crea varios dados con el mismo n��meros de caras.</br>
 * Ej: 2d4
 * @author Rober
 * @version 0.13, 21/06/19
 * @param {number} num
 * @param {number} caras
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
		this.num = num;
		this.caras = caras;
	}
	// get num() {
	// 	return num;
	// }
	// void setNum(int num) {
	// 	this.num = num;
	// }
	// int getCaras() {
	// 	return caras;
	// }
	// void setCaras(int caras) {
	// 	this.caras = caras;
	// }
	
	toString() {
		// TODO Auto-generated method stub
		return this.num+"d"+this.caras;
    }
    
	 compareTo( d) {
		// TODO Auto-generated method stub
		if(d instanceof D){
			if(this.caras<d.caras)
				return -1;
			else
				if(this.caras>d.caras)
					return 1;
		}	
		//TODO: si no dado qué devuelvo
		return 1;
	}
	
	max(){
		return this.num*this.caras;
    }
    
	min(){
		return this.num;
	}
	
	norm() {
		var numero = 0;
		let signo = this.num > 0 ? 1 : -1;

		let abs=this.num*signo;

		for (var i = 0; i < abs; i++) {
			numero += Math.trunc( Math.random() * this.caras + 1);
			//TODO: borrar verbose
			console.log(this.toString()+":"+numero);
		}
		console.log(numero *signo);
		
		return numero *signo;
	}
	
	/**
	 * Suma n dados de igual número de caras
	 * @param d el dado a sumar
	 * @return el dado resultado de sumar el número de dados, <code>null</code> si no son del mismo número de caras
	 */
	newSum(d){
		if(this.caras==d.caras)
			return new D(this.num+d.num,this.caras);
		else return null;
		
    }
    
	
	/**
	 * Suma n dados de igual número de caras
	 * @param d el dado a sumar
	 * @return 
	 * 
	 */
	sum(d){
		if(this.caras==d.caras)
        this.num+=d.num;
	}

}



//TODO: HAcer que antes de un - le sume añada un + internamente para que pueda
// 		operar tb restando.
/**
 * La clase que representa un dado como la suma de varios dados. (Es lo mismo
 * que daño)
 * 
 * @author Rober
 * @version 0.77, 24/01/12
 * 
 */

class Dado {

	/**
	 * @param dado
	 *            Un string con el dado
	 */
	constructor(dado) {
		console.log("string inicial:"+dado);
		
		let s=dado;
		s = s.replace(" ", "","gi");
		s = s.replace("-", "+-","gi");
		s = s.toLowerCase();
			/**
			 * La cadena que representa el daño
			 */
		this.dado = "";
		this.dados = [];
		// this._dadoMax = 0;
		// this._dadoMin = 0;
		this.entero = 0

		// buscar sumandos;
		console.log("string final:"+s);
		this.buscarSumandos(s);
		let stringDado = "";
		for ( let i of this.dados) {

			if (i.num > 0)
			stringDado+= "+" + i;
				else if (i.num < 0)
				stringDado+= i;
			// stringDado+= i+"+";
		}
		//quita un posible + inicial
		if (stringDado.startsWith("+")) stringDado= stringDado.substring(1);
		stringDado+="+"+this.entero;
		stringDado=stringDado.replace("+0", "");//si es +0 se quita
		this.dado= stringDado;

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

	dadoTirado(sumando) {
		let dado = 0;
		let dados=0
		let caras = 0;
		let sumandos;
		if (sumando.includes("d")) {
			sumandos = sumando.split("d");
			dados = parseInt(sumandos[0]);
			caras = parseInt(sumandos[1]);
			dado= (new D(dados,caras)).norm();

		} else
			dado = parseInt(sumando);

		if (isNaN(dado)) return 0; //por si encuentra un vacio al haber + al principio de this.dado
		return dado;

	}

	dadoMin() {
		let _min = 0;
		for (let d of this.dados){
			_min+= d.min();
		}
		return _min;
	}

	dadoMax() {
		let _max = 0;
		for (let d of this.dados){
			_max+= d.max();
		}
		return _max;
	}

	dadoTotal() {
		return this.dadoMin() + this.dadoMax();
	}

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
	buscarDado( d) {
		// Intenta por si es un entero
		if( !isNaN(d)){
			this.entero += parseInt(d);
			return; //si es entero sumo y salgo
		}
			
		let sumando = d;
		let sumandos;
		if (sumando.includes("d")) {
			sumandos = sumando.split("d");
			let _d = new D(parseInt(sumandos[0]),
					parseInt(sumandos[1]));
			// console.log(this.dados);
			
			for ( let i of this.dados) {
				if (i.caras == _d.caras) {
					i.sum(_d);
					return;
				}
			}

			this.dados.push(_d);
		}

	}


	tirar() {
		let sumatorio=0;

		for ( let i of this.dados) 
			sumatorio+= (new D(i.num,i.caras)).norm();
		
		if( !isNaN(this.entero)) sumatorio+=this.entero;
		return sumatorio;

	}
	 tirarDado(dado) {

		if(dado instanceof Dado) return tirarDado(dado.dado);

		let total = 0;
		let sumandos;
		if (dado.includes("+")) {// separo en sumandos
			sumandos = dado.split("+");
			// console.log(sumandos);
			
			for (let i = 0; i < sumandos.length; i++) {
				// el dado máximo de cada sumando y el minimo
				total += this.dadoTirado(sumandos[i]);
			}
		}

		else {
			total = this.dadoTirado(dado);
		}
		return total;
	}

	// tirarDado(dado) {

	// 	return tirarDado(dado.dado);
	// }
	
	/**
	 * Te da el máximo valor del número de <i>veces</i> que tires los dados
	 * @param veces las veces que se tira el los dados
	 * @param dados El string que representa a los dados a tirar
	 * @return
	 */
	 mejor( veces, dados=this.dado) {
		let valor=0;
		for(;veces>0;veces--){
			let i=this.tirarDado(dados);
			// console.log(dados);
			valor=Math.max(valor, i);
			// console.log("valor:"+valor);	
		}
		return valor;
	}


}


// var d1= new D(3,6);
// var _2d6 = new D(2,6); 
// console.log(d1.max());
// console.log(d1.min());
// console.log(d1.newSum(_2d6)+"");
// console.log(x);


// let dado1=new Dado("1d10");
// let resultados = [];
// for (let i = 0; i < 10; i++)
// 	resultados[i] = 0;

// for (let i = 0; i < 1000; i++) {
// 	// Alex intenta entender qué hago aquí
// 	resultados[dado1.tirarDado("1d10") - 1]++;
// }


// for (let i = 0; i < 10; i++) {
// 	// Alex intenta entender qué hago aquí
// 	console.log(dado1.tirarDado("1d10"));
	 
// }


// Imprimo el número de veces que ha salido cada número
// for (let i = 0; i < 10; i++)
// 	console.log(i + 1 + ": " + resultados[i]);


console.log(new Dado("1d5+1d10+6"));
console.log(new Dado("1d5+1d10+6").dado);
console.log(new Dado("1d10+3d10"));
console.log(new Dado("1d10+3d10").dado);
console.log(new Dado("1d5-4+1d4+6+3"));
console.log(new Dado("1d5-4+1d4-0+4"));
console.log(new Dado("1d5-4+1d4+6+3"));
console.log(new Dado("1d5-4+1d4+6+3").dado);
console.log(new Dado("2d4-1d3"));
console.log(new Dado("2d4-1d3").dado);
// let d1 = new Dado("1d10-1d3");
// console.log(d1.tirar());

// for( let i=0;i<100;i++)
// 	console.log(d1.tirar());

// console.log(d1.mejor(10, "3d6"));
// console.log(d1.mejor(1));

// console.log(d1.dadoMin());
// console.log(d1.dadoMax());




