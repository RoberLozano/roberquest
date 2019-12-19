class Localizaciones {
    /**
     *Creates an instance of Localizaciones.
     * @param {number} pg Los puntos de golpe del personaje
     * @memberof Localizaciones
     */
    constructor() {
        this.localizaciones = []
        /** Se utiliza para un daño general como desangramiento o succionar PG */
        this.dañoGeneral = 0;
        this.pg //=1
    }

    /**
     *Añade una localización
     *
     * @param {*} loc la localización a añadir
     * @memberof localizaciones
     */
    add(loc) {
        if(this.pg) loc.setPG(pg)
        this.localizaciones.push(loc)
        // console.log(this.localizaciones);
    }

    /**
     *  Actualiza los PG de la localización
     *
     * @param {number} pg
     * @memberof Localizaciones
     */
    actPG(pg) {
        this.pg = pg;
        this.localizaciones.forEach(loc => {
            loc.setPG(pg);
        });
    }


    /**
     *Indica si es una localización final o tien sublocalizaciones
     *
     * @returns {boolean} si es o no final
     * @memberof Localizaciones
     */
    esFinal() { return this.localizaciones.length == 0 }

    /**
     * Da las localizaciones por tirada
     * TODO: definir si tirada de 1d20 o 1d100
     * @param {number} x la tirada
     * @memberof Localizaciones
     */
    darLocalizacion(x) {
        var l;
        console.log("Localizaciones en " + x);
        //Si es final y coincide se devuelve pero ya lo hace el padre
        // if (this.esFinal() && this.max >= x && this.min <= x) {
        //     // l=this;
        //     return this;
        // }

        //si no se da la del hijo que cumpla
        this.localizaciones.forEach(loc => {
            //si miro aqui si es final y la devuelvo me ahorro una llamada a darLocalizacion
            if (loc.esFinal() && loc.max >= x && loc.min <= x) { l = loc; return loc; } //da error si no hago l=loc
            else
                if (loc.max >= x && loc.min <= x)
                    l = loc.darLocalizacion(x); //busca recursiva hasta que sea final
            //    loc.darLocalizacion(x);
            // console.log(`${loc.nombre}, ${loc.min}-${loc.max}`);
        });
        return l;
    }

    sanar(x) {
        if (!this.esFinal()) //si no es final
            x = this.sanarPartes(x);
        if (x > 0) //si queda curación cura los generales
            this.dañoGeneral = (x > this.dañoGeneral) ? 0 : this.dañoGeneral - x;
    }
    /**
     *Sana las sublocalizaciones, ordenandolas por el daño relativo 
     *
     * @param {number} x Los puntos a sanar
     * @returns los puntos que sobran de la curación
     * @memberof Localizaciones
     */
    sanarPartes(x) {
        //se filtran las partes que tengan daño
        let dañadas = this.localizaciones.filter(l => l.daño > 0);
        //Las más dañadas primero (con respecto a los pg que tiene)
        console.log(dañadas.sort((a, b) => (b.daño / b.pg) - (a.daño / a.pg)));

        var curar = x;
        // for(let i=0; curar>0;i++){
        //     curar=dañadas[i].sanar(curar);
        // }
        dañadas.forEach(d => {
            if (curar > 0)
                //se actualiza con lo que queda tras curar la localización
                curar = d.sanar(curar);
        });

        console.log(this.localizaciones);
        return curar;

    }

    /**
    * Daña una localizacion
    *
    * @param {number} pg PG de daño
    * @param {number|Localizacion} localizacion el numero de tirada o una localización
    * @memberof Localizacion
    */
    dañarLocalizacion(pg, localizacion) {
        if (!isNaN(localizacion)) { //si es un numero
            var objetivo = this.darLocalizacion(localizacion);
            objetivo.dañar(pg)
            console.log(objetivo);


        } else {
            //si no es final deberia dañarse una sublocalización
            if (localizacion instanceof Localizacion && localizacion.esFinal())
                localizacion.dañar(pg);

        }

    }

    /**
     *Devuelve el daño de las sublocalizaciones
     * 
     * @returns el daño local si esFinal() o el
     *          total de las sublocalizaciones
     * @link esFinal()
     * @see {@link esFinal()}
     * @memberof Localizaciones
     */
    darDaño() {
        if (this.esFinal()) return this.daño;
        let total = 0;
        this.localizaciones.forEach(l => {
            total += l.darDaño()
        });
        return total;
    }

    //TESTEO
    todasLocalizaciones() {
        //se busca el más bajo y más alto
        let min = Math.min(...this.localizaciones.map(f => f.min))
        let max = Math.max(...this.localizaciones.map(f => f.max))
        console.log(`Probando ${min}-${max}`);

        //Probar que hay una localización para cada posible tirada
        for (var index = min; index <= max; index++) {
            if (!this.darLocalizacion(index)) return false;
            console.log(index + " true");
        }
        return true;
        // Math.min(...data.map(f=>f.rest) )
    }


}



/**
 * La clase de cada localización concreta
 *
 * @class localizacion
 */
class Localizacion extends Localizaciones {
    /**
     *Creates an instance of localizacion.
     * @param {string} nombre el nombre de la localización
     * @param {number} mpg el multiplicador de PG de la localización Ej: 0.25, 3.33, 0.4
     * @param {number} min el valor minimo de tirada para esa localización
     * @param {number} max el valor máximo de tirada para esa localización
     * @param {number} [pa=0] los puntos de armadura naturales
     * @memberof localizacion
     */
    constructor(nombre, mpg, min, max, pa = 0) {
        super();
        this.nombre = nombre;
        this.mpg = mpg;
        this.pa = pa;
        this.min = min;
        this.max = max;
        this.daño = 0;
        this.pg;//??
    }

    /**
     * Pone los PG dependiendo de los de la localizacion padre
     * o el animal
     *
     * @param {number} x
     * @memberof Localizacion
     */
    setPG(x) {
        //TODO: dejar en int?
        this.pg = x * this.mpg;
    }

    /**
     *Daña la localización
     *
     * @param {number} daño PG de daño
     * @memberof Localizacion
     */
    dañar(daño) {
        //se le resta la armadura natural al daño
        var d = daño - this.pa;
        if (d <= 0) return; //Si 0 o negativa sale
        this.daño += d; //si no se suma al daño
    }

    /**
 *Es distinto al sanar de Lozalizaciones porque no cura generales
 *
 * @param {number} x Los puntos que cura
 * @returns {number} los puntos de curación que sobran tras curar la localización
 * @memberof Localizacion
 */
    sanar(x) {
        console.log("Cura con" + x + "el " + this.nombre);

        if (this.esFinal()) {
            let curacion = this.daño - x
            this.daño = (curacion < 0) ? 0 : curacion;
            console.log("Quedan de curacion:" + (-curacion));

            return -curacion; //para que lo que sobra sea positivo
        }
        else
            return this.sanarPartes(x);

    }

}

var humanoide = new Localizaciones();

humanoide.add(new Localizacion("Right Arm", 0.33, 01, 04, 0))
humanoide.add(new Localizacion("Left Arm", 0.33, 05, 08, 0))
humanoide.add(new Localizacion("Abdomen", 0.33, 09, 11, 0))
humanoide.add(new Localizacion("Chest", 0.33, 12, 12, 0))
humanoide.add(new Localizacion("Right Leg", 0.33, 13, 15, 0))
humanoide.add(new Localizacion("Left Leg", 0.33, 16, 18, 0))
humanoide.add(new Localizacion("Head", 0.1, 19, 20, 0))

// console.log(humanoide.darLocalizacion(1))
var l16 = humanoide.darLocalizacion(16);
humanoide.dañarLocalizacion(5, 20);
humanoide.dañarLocalizacion(2, 12);
humanoide.dañarLocalizacion(14, 15);
humanoide.dañarLocalizacion(1, 11);
humanoide.dañarLocalizacion(6, 1);

// console.log(humanoide.darLocalizacion(7))
// console.log(humanoide.darLocalizacion(16))
// console.log(humanoide.darLocalizacion(20))

// console.log(humanoide.esFinal());
