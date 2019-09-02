/* Roberto Lozano Sáez 2019 */

// import { D } from '/D.js';



class Objeto {
    constructor(nombre, peso=0, valor=0) {
        this.nombre = nombre || "";
        this.peso = peso ;
        this.valor = valor ;

    }

    setAll(o){
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

    pesa(){return this.peso};
    
}

class Objetos extends Objeto{
    constructor(nombre, peso, valor, ctd=1) {
        super(nombre, peso, valor);
        this.ctd=ctd;
        this.pesoTotal=this.ctd*this.peso;
    }

    setAll(o){
        super.setAll(o);
        // this.nombre = o.nombre;
        // this.peso =   o.peso ;
        // this.valor =  o.valor ;
        this.ctd=     o.ctd||1;
        this.act();
    }

    // devuelve el precio de la cantidad total
    precioTotal(){
        return this.ctd*this.valor;
    }

    pesa(){return this.ctd*this.peso;}
    

    act(){
        this.pesoTotal=this.ctd*this.peso;
    }

    //incrementar la cantidad, negativos para decrementar
    inc(valor=1){
        this.ctd+=valor;
        this.act();
    }

}

class Contenedor extends Objeto {
    constructor(nombre, peso, valor, max, multiplicador=1) {
        super(nombre, peso, valor);
        this.multiplicador =multiplicador;
        this.max= max;
        this.objetos=new Array();

    }

    setAll(o){
        this.nombre = o.nombre;
        this.peso =   o.peso ;
        this.valor =  o.valor ;
        this.max =    o.max ;
        // this.objetos= o.objetos ;
        let ot = [];
        for(let ob of o.objetos){
            //miro los distintos tipos de objetos por una propiedad única
            //TODO: tal vez poner el tipo de clase en una propiedad
            let oo;
            if(ob.hasOwnProperty("objetos"))    {oo = new Contenedor();}
            else
            if(ob.hasOwnProperty("daño"))       {oo = new Arma();}
            else
            if(ob.hasOwnProperty("ctd"))        {oo = new Objetos();}
            else                                {oo = new Objeto()}
            oo.setAll(ob);
            ot.push(oo);
        }
        this.objetos= ot ;
  
    }

    
    get carga() {
        let c=0;
        for( var o of this.objetos)
        // c+=o.pesoTotal(); //da problemas con los datos de firebase database, terndria que convertir el array en objetos
         c+=o.peso;
        return c*this.multiplicador;
    }

    add(objeto) {
        // if(this.pesoLibre()>=objeto.pesoTotal)
            this.objetos.push(objeto);
        // else (console.log("Demasiado peso"));
        
      }

    pesa(){
        return this.carga+this.peso;
    }

    pesoLibre(){
        return this.max-this.carga;
    }
    //saca el objeto en la posición 'objeto' si está
    sacar(objeto){
        var pos=this.objetos.indexOf(objeto);
        console.log("Encontrado en pos:"+pos);
          if(pos>-1)  this.objetos.splice(pos, 1);
    }
    //quita el objeto en la posición 'i' y lo retorna
    sacarIndex(i){
        var pos=this.objetos[i];
        this.objetos.splice(i, 1);
        return pos;
    }

    sacarTodo(){
        this.objetos=new Array();
    }

    //ok
    /**
     * 
     * @param {*} objeto el objeto a mover, si es un numero es el índice que ocupa en el contenedor
     * @param {*} otroContenedor el contenedor al que se va a mover
     */
    mover(objeto, otroContenedor){
        if(typeof objeto ==="number" ){
            if(objeto<0||objeto>= this.objetos.length) return; //si está fuera de indices no hace nada
            objeto=this.sacarIndex(objeto)
        }

        else
            this.sacar(objeto);
        
    	otroContenedor.add(objeto);
    }

    darContenedores(lista=null){
        if(lista===null) var lista=[];
        if (this instanceof Contenedor) lista.push(this);
        this.objetos.forEach(element => {
            if(element instanceof Contenedor){
                console.log(element.nombre + " es contenedor");
                element.darContenedores(lista);
            }
        });
        return lista;
    }

    darClase(clase){
        return this.objetos.filter( obj => obj instanceof clase) ;
    }
    
    //Guarda el contenedor entero en el firebase
    // guardarFirebase(fbInventario){
    //     fbInventario.child(this.nombre).set(this);
    // }
}

function creaInventario(nombre="mochila"){
 var contenedor=new Contenedor(nombre,2,100,15);
 for(let i=0;i<5;i++){
     contenedor.add(new Objetos("objetos"+i,i, i));
 }
 for(let i=0;i<5;i++){
    contenedor.add(new Objeto("objeto"+i, i, i));
}
//meter un contenedor dentro de otro
var bolsa= new Contenedor("bolsa",1,10,10);
for(let i=0;i<5;i++){
    bolsa.add(new Objeto("dentro"+i, i, i));
}
contenedor.add(bolsa);

var bolsita = new Contenedor("bolsita",1,1,5);
bolsita.add(new Objeto("anillo", 1, 10));
bolsita.add(new Objeto("cadena", 1, 20));

bolsa.add(bolsita);

// bolsita.mover(bolsita.sacarIndex(0), bolsa);
contenedor.add(new Arma("espada",1.2,200));



return contenedor;
}

class Arma extends Objeto{
    constructor(nombre, peso, valor, daño="1d8") {
        super(nombre, peso, valor);
        this.daño=daño;
    }

    setAll(o){
        super.setAll(o);
        // this.nombre = o.nombre;
        // this.peso   = o.peso ;
        // this.valor  = o.valor ;
         this.daño   = o.daño;
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