var ws;//el worksheet
var pe //perosnaje excel
var last; //el último personaje;


function Upload() {
  //Reference the FileUpload element.
  var fileUpload = document.getElementById("fileUpload");

  //Validate whether File is valid Excel file.
  var regex = /^([a-zA-Z0-9\s_\\.\-:])+(.xls|xlsx|xlsm|)$/;
  // if (regex.test(fileUpload.value.toLowerCase())) {
  if (true) {

    if (typeof (FileReader) != "undefined") {
      var reader = new FileReader();

      //For Browsers other than IE.
      if (reader.readAsBinaryString) {
        reader.onload = function (e) {
          ProcessExcel(e.target.result);
        };
        reader.readAsBinaryString(fileUpload.files[0]);
      } else {
        //For IE Browser.
        reader.onload = function (e) {
          var data = "";
          var bytes = new Uint8Array(e.target.result);
          for (var i = 0; i < bytes.byteLength; i++) {
            data += String.fromCharCode(bytes[i]);
          }
          ProcessExcel(data);
        };
        reader.readAsArrayBuffer(fileUpload.files[0]);
      }
    } else {
      alert("This browser does not support HTML5.");
    }
  } else {
    alert("Please upload a valid Excel file.");
  }
};
function ProcessExcel(data) {
  //Read the Excel File data.
  var workbook = XLSX.read(data, {
    type: 'binary'
  });

  //Fetch the name of First Sheet.
  var firstSheet = workbook.SheetNames[0];
  console.log(workbook.SheetNames);

  //Read all rows from First Sheet into an JSON array.
  // var excelRows = XLSX.utils.sheet_to_row_object_array(workbook.Sheets[firstSheet]);
  ws = workbook.Sheets[firstSheet];
  // console.log('B1');
  // console.log(ws['agilidad']);

  // console.log(XLSX.utils.decode_cell('B1'));
  let s = XLSX.utils.decode_cell('A1');
  let e = XLSX.utils.decode_cell('B8');

  var range = { s, e };
  // var range = { s: { c: 0, r: 0 }, e: { c: 0, r: 4 } };

  // for (var R = range.s.r; R <= range.e.r; ++R) {
  //     for (var C = range.s.c; C <= range.e.c; ++C) {
  //         var cell_address = { c: C, r: R };
  //         var data = XLSX.utils.encode_cell(cell_address);
  //         console.log(ws[data]?.v)
  //     }
  // }

  //HOJA 2

  // try {
  //   let hoja2 = workbook.Sheets['Hoja2']
  //   ws=hoja2;
  //   console.log('Hay hoja 2');
  //   info()
  //   ws = workbook.Sheets[firstSheet];
  // } catch (e) {
  //   console.log(e);
  //   ws = workbook.Sheets[firstSheet];
  // }
  info();
  //HABILIDADES
  h(21, 86, false);
  pe.act();

  tipo = Conocimiento; //idiomas
  h(22, 86, false, 'M', 'N', 'O', false);

  tipo = Manipulación;
  ws = workbook.Sheets['Técnicas'];
  tecnicas()


  ws = workbook.Sheets['Magia'];
  gemas();

  tipo = Magia;
  ws = workbook.Sheets['Magia'];
  artes(5, 20);
  hechizos(23, 52)

  tipo = Manipulación;
  ws = workbook.Sheets['Armas'];
  hMarciales(2, 11);

  armas(17, 28)


  ws = workbook.Sheets['Inventario'];
  equipo(2, 20)

  pe.act();

  //mirar si ya hay uno con ese nombre y las diferencias
  // if (last) console.log(diferencia(pe, last));

  if (ls(pe.nombre)){
    last= Clase.convertir(ls(pe.nombre));
  }

  if (last) console.log(diferencia(last,pe));
  // eval(`last=new ${pe.clase}()`)
  // last.setAll(pe)

  if (confirm(`¿Quiere guardar '${pe.nombre}' en localStorage? `) == true) {
   ls(pe.nombre,pe);
   listaPersonajes(pe.nombre)
   console.log(`guardado '${pe.nombre}' en localStorage`);
  } else {
    console.log('No se ha guardado nada');
  }





};

function tecnicas(inicio = 2, fin = 38, ceros = false, hab = 'A', pf = 'B', xp = 'C', valor = 'D', des = 'M', seguir = true) {
  let habilidad = new Tecnica();
  //tipo= 'Manipulación'

  for (let i = inicio; i < fin; i += 4) {
    let nombre = ws[hab + i]?.v;
    if (!nombre) {
      if (seguir) continue;
      else return;
    }
    var fatiga = ws[pf + i]?.v;
    var porcentaje = ws[valor + i]?.v;
    var exp = ws[xp + i]?.v
    //si no se admiten 0 en el porcentaje y no tien xp se pasa a otro
    if (!ceros && !porcentaje && !exp) {
      continue;
    }
    var descripcion = ws[des + i]?.v;

    let f = ws[pf + (i + 1)]?.v;
    let n = ws[pf + (i + 2)]?.v;
    let e = ws[pf + (i + 3)]?.v;
    let c = ws['N' + (i + 1)]?.v;
    let sc = ws['N' + (i + 2)]?.v;

    // console.log('descirpcion', descripcion);
    // console.log('fallo', f);
    // console.log('normal', n);
    // console.log('especial', e);
    // console.log('critico', c);
    // console.log('scritico', sc);


    habilidad = new Tecnica(nombre, tipo, porcentaje, fatiga);
    if (exp) habilidad.xp = exp;


    pe.habilidades[nombre] = habilidad;
    // console.log(ws[nombre + i]?.v, ws[xp + i]?.v, ws[valor + i]?.v);
    // console.log(nombre, fatiga, exp, porcentaje);
    // console.log(habilidad);
  }
}


function equipo(inicio, fin, n = 'A', p = 'B', c = 'C', seguir = true) {

  for (let i = inicio; i < fin; i++) {
    let nombre = ws[n + i]?.v;
    if (!nombre) {
      if (seguir) continue;
      else return;
    }
    let obj;
    let peso = ws[p + i]?.v;
    var ctd = parseInt(ws[c + i]?.v);
    //si no se admiten 0 en el porcentaje y no tien xp se pasa a otro
    if (nombre.toLowerCase().startsWith("poción")) {
      // console.log('POCION');
      //TODO
      if (!ctd) ctd = 1;
      obj = new Pociones(nombre, peso, 0, ctd)
      obj.parse(nombre);
    }
    else

      if (ctd && ctd > 1)
        obj = new Objetos(nombre, peso, 0, ctd)
      else
        obj = new Objeto(nombre, peso)

        // console.log(obj);

    pe.inventario.add(obj);

  }
}

function armas(inicio, fin, n = 'A', p = 'D', seguir = true) {

  for (let i = inicio; i < fin; i++) {
    let nombre = ws[n + i]?.v;
    if (!nombre) {
      if (seguir) continue;
      else return;
    }
    let obj;
    let peso = ws[p + i]?.v;

    let daños = []

    let daño = ws[`G` + i]?.v;
    let tdaño = ws[`H` + i]?.v;
    if (daño) {
      daños.push(new Daño(daño, tdaño))
    }

    daño = ws[`I` + i]?.v;
    tdaño = ws[`J` + i]?.v;
    if (daño) {
      daños.push(new Daño(daño, tdaño))
    }

    obj = new Arma(nombre, peso, 0, ...daños)
    console.log('DAÑOS');
    console.log(daños);
    pe.inventario.add(obj);

  }
}

function arcos(inicio = 34, fin = 41, seguir = true, n = 'A', no = 'B', fue = 'C',
  recto = 'D', max = 'E', daño = 'J', bonAp = 'M', crit = 'T', diana = 'U', loc = 'V') {

  for (let i = inicio; i <= fin; i++) {
    let nombre = ws[n + i]?.v;
    if (!nombre) {
      if (seguir) continue;
      else return;
    }
    let obj;
    let peso = ws[p + i]?.v;

    let daños = []

    let daño = ws[daño + i]?.v;

    let no = ws[`F` + i]?.v;
    let fue = ws[`F` + i]?.v;
    let tdaño = ws[`H` + i]?.v;
    // let tdaño = ws[`H` + i]?.v;
    if (daño) {
      daños.push(new Daño(daño, 'P'))
    }

    daño = ws[`I` + i]?.v;
    tdaño = ws[`J` + i]?.v;
    if (daño) {
      daños.push(new Daño(daño, tdaño))
    }

    // obj = new Arma(nombre, peso, 0, daños)
    // pe.inventario.add(obj);

  }
}

function gemas(params) {
  for (let i = 8; i < 15; i++) {
    let nombre = ws['O' + i]?.v;
    if (!nombre) return;
    let capacidad = ws['P' + i]?.v;
    let pm = ws['Q' + i]?.v;
    var gema = new Gema(nombre, 0.1, 1000 * capacidad, capacidad, pm);
    // console.log(gema);
    pe.inventario.add(gema)
  }

  
}

// var tipo = Agilidad;
function h(inicio, fin, ceros = true, hab = 'A', xp = 'B', valor = 'C', seguir = true, fechaSubida = 'L') {
  let habilidad = new Habilidad();

  for (let i = inicio; i < fin; i++) {
    let nombre = ws[hab + i]?.v;
    if (!nombre) {
      if (seguir) continue;
      else return;
    }

    if (nombre.toUpperCase().startsWith("HABILIDADES DE ")) {       //si empieza por "HABILIDADES DE " sin que importen las mayúsculas
      nombre = nombre.replace(/habilidades de /gi, "");// guardo solo el tipo de habilidad sin que importen las mayúsculas
      tipo = nombre.charAt(0).toUpperCase() + nombre.toLowerCase().slice(1);                  // 1 en mayusculas
      continue;
    }

    var porcentaje = ws[valor + i]?.v;
    var exp = ws[xp + i]?.v
    //si no se admiten 0 en el porcentaje y no tien xp se pasa a otro
    if (!ceros && !porcentaje && !exp) {
      continue;
    }

    habilidad = new Habilidad(nombre, tipo, porcentaje);
    if (exp) habilidad.xp = exp;
    let f = fecha(i, fechaSubida)
    if (f) habilidad.fecha = f;

    pe.habilidades[nombre] = habilidad;
    // console.log(ws[nombre + i]?.v, ws[xp + i]?.v, ws[valor + i]?.v);
    console.log(nombre, exp, porcentaje);
    // console.log(habilidad);
  }
}


function hMarciales(inicio, fin, ceros = true, hab = 'A', xp = 'B', valor = 'C', seguir = true, fechaSubida = 'L') {
  let habilidad = new Habilidad();

  for (let i = inicio; i < fin; i++) {
    let nombre = ws[hab + i]?.v;
    if (!nombre) {
      if (seguir) continue;
      else return;
    }

    if (nombre.toUpperCase().startsWith("HABILIDADES DE ")) {       //si empieza por "HABILIDADES DE " sin que importen las mayúsculas
      nombre = nombre.replace(/habilidades de /gi, "");// guardo solo el tipo de habilidad sin que importen las mayúsculas
      tipo = nombre.charAt(0).toUpperCase() + nombre.toLowerCase().slice(1);                  // 1 en mayusculas
      continue;
    }

    var porcentaje = ws[valor + i]?.v;
    var exp = ws[xp + i]?.v
    //si no se admiten 0 en el porcentaje y no tien xp se pasa a otro
    if (!ceros && !porcentaje && !exp) {
      continue;
    }

    habilidad = new HabilidadMarcial(nombre, tipo, porcentaje);
    if (exp) habilidad.xp = exp;
    let f = fecha(i, fechaSubida)
    if (f) habilidad.fecha = f;

    pe.habilidades[nombre] = habilidad;
    // console.log(ws[nombre + i]?.v, ws[xp + i]?.v, ws[valor + i]?.v);
    console.log(nombre, exp, porcentaje);
    // console.log(habilidad);
  }
}

function artes(inicio, fin, ceros = true, hab = 'A', xp = 'B', valor = 'C', seguir = true, fechaSubida = 'L') {
  let habilidad = new Habilidad();

  for (let i = inicio; i < fin; i++) {
    let nombre = ws[hab + i]?.v;
    if (!nombre) {
      if (seguir) continue;
      else return;
    }

    var porcentaje = ws[valor + i]?.v;
    var exp = ws[xp + i]?.v
    //si no se admiten 0 en el porcentaje y no tien xp se pasa a otro
    if (!ceros && !porcentaje && !exp) {
      continue;
    }

    habilidad = new Habilidad(nombre, tipo, porcentaje);
    if (exp) habilidad.xp = exp;
    let f = fecha(i, fechaSubida)
    if (f) habilidad.fecha = f;

    pe.habilidades[nombre] = new Arte(habilidad);
    // console.log(ws[nombre + i]?.v, ws[xp + i]?.v, ws[valor + i]?.v);
    console.log(nombre, exp, porcentaje);
    // console.log(habilidad);
  }
}

function hechizos(inicio, fin, ceros = true, hab = 'A', xp = 'B', valor = 'C', pm = 'K', seguir = true) {
  let habilidad = new Habilidad();

  for (let i = inicio; i < fin; i++) {
    let nombre = ws[hab + i]?.v;
    if (!nombre) {
      if (seguir) continue;
      else return;
    }

    var porcentaje = ws[valor + i]?.v;
    var exp = ws[xp + i]?.v
    var puntosm = ws[pm + i]?.v

    //si no se admiten 0 en el porcentaje y no tien xp se pasa a otro
    if (!ceros && !porcentaje && !exp) {
      continue;
    }

    habilidad = new Hechizo(nombre, puntosm, porcentaje);
    if (exp) habilidad.xp = exp;

    pe.habilidades[nombre] = habilidad;
    // console.log(ws[nombre + i]?.v, ws[xp + i]?.v, ws[valor + i]?.v);
    console.log(nombre, exp, porcentaje, puntosm);
    // console.log(habilidad);
  }
}

function info(params) {
  var nombre = ws['B1']?.v
  var clase = ws['B2']?.v
  var altura = ws['B3']?.v
  var peso = ws['I3']?.v

  console.log(nombre);
  console.log(clase);
  console.log(altura);
  console.log(peso);
  if (clase) {
    eval(`pe=new ${clase}({})`) //un poco más rápida pero menos segura
    // pe = (Function('return new ' + clase))() //se supone que es más segura
    //TODO: hacer pruebas de rendimiento;
    console.log(pe);
  }
  else pe = new Humano();

  pe.nombre = nombre;
  pe.clase = clase;
  pe.altura = altura;
  pe.peso = peso;

  let f = (ws['K6']?.w + '-' + ws['L6']?.v).split('-'); //fecha nacimiento
  let fecha_nac = new Date(parseInt(f[2]), parseInt(f[1]) - 1, parseInt(f[0]))
  console.log("fecha Nacimiento:");
  console.log(fecha_nac.toLocaleDateString());

  pe.nacimiento=fecha_nac;
  f = (ws['K7']?.w + '-' + ws['L7']?.v).split('-'); //fecha actual
  let fecha = new Date(parseInt(f[2]), parseInt(f[1]) - 1, parseInt(f[0]))
  console.log(fecha.toLocaleDateString());
  pe.fecha=fecha;
  fechaMundo = fecha;

  car();
  // console.log(fecha.toLocaleString());
  // console.log(ws['K6']);


  //DINERO



  let i = buscar('Dinero:', 100, 200) + 1;
  var mm = ws['B' + i]?.v
  var mo = ws['B' + (i + 1)]?.v
  var mp = ws['F' + i]?.v
  var mb = ws['F' + (i + 1)]?.v
  console.log(mm, mo, mp, mb);
  if (mm) pe.inventario.add(new Objetos('mm', 0.0007, 1000, mm))
  if (mo) pe.inventario.add(new Objetos('mo', 0.002, 10, mo))
  if (mp) pe.inventario.add(new Objetos('mp', 0.002, 1, mp))
  if (mb) pe.inventario.add(new Objetos('mb', 0.002, 0.1, mb))

  i = buscar('banco', 110, 120) + 1;
  bancos(i, 5);

  // console.log(lastBanco.dinero(fecha));
  console.log(lastBanco.dinero());




}

function buscar(b, inicio, fin, col = 'A') {
  for (let i = inicio; i < fin; i++) {
    let valor = ws[col + i]?.v
    if (valor == b)
      return i;
  }
}


function IUHechizos(p, div = "salida") {
  var salida = document.getElementById(div);

  var nombres = [
    "Multiconjuro",
    "Sobrepotencia",
    "Refuerzo",
    "Alcance",
    "Duración",
    "Intensidad",
    "Puntería",
    "Velocidad"
  ]
  var habilidades = []

  p.actTodosBonHab();
  nombres.forEach(n => {
    h = p.getHabilidad(n);
    if (h && h.valor > 0) {
      habilidades.push(h)
      var div = document.createElement("div");
      // div.style.display="inline-block" //en linea si cabe entero

      var ia = new InputArte(h);
      div.appendChild(ia)

      salida.appendChild(div);

    }
  });

  var ih = new InputHechizo();
  var div = document.createElement("div");
  ih.setPersonaje(p);
  div.appendChild(ih)
  salida.appendChild(div);

  // habilidades.forEach(n => {
  //   h = p.getHabilidad(n);
  //   console.log(h);
  //   // document.getElementById(`ia-${h.nombre}`).setPersonaje(p);
  //   document.getElementById(`ia-${h.nombre}`).setHabilidad(h);
  // });

}



function car(n = 10, col = 'E') {
  let suma = 0
  for (let i = 0; i < 7; i++) {
    let car = ws[col + (n + i)]?.v;
    console.log(CP[i], car);
    pe.set(CP[i], car, false);
    suma += car;
  }
  console.log('TOTAL:', suma);
  pe.act();
}

var lastBanco;
var lastCredito;

function bancos(inicio, n = 10) {
  console.log('en bancos');

  for (let i = inicio; i < (inicio + n); i++) {
    console.log('A' + i);
    let nombre = ws['A' + i]?.v;
    console.log(nombre);
    if (!nombre) return;

    //fecha
    let f = (ws['B' + i]?.w + '-' + ws['C' + i]?.v).split('-'); //fecha ingreso
    console.log(parseInt(f[2]), parseInt(f[1]) - 1, parseInt(f[0]));
    let fecha = new Date(parseInt(f[2]), parseInt(f[1]) - 1, parseInt(f[0]))

    let interes = ws['D' + i]?.v;
    let dinero = ws['E' + i]?.v;
    console.log(nombre, fecha, interes, dinero);
    if (dinero) {
      var deposito = new Deposito(nombre, dinero, fecha, interes);
      // var credito= new Credito(nombre,dinero,fecha,interes);
      lastBanco = deposito;
      // lastCredito=credito;
      console.log(deposito);
    }

  }

}

function fecha(i, fecha) {
  let f = (ws[fecha + i]?.w + '-' + fechaMundo.getFullYear()).split('-'); //fecha ingreso
  // console.log(parseInt(f[2]), parseInt(f[1]) - 1, parseInt(f[0]));
  let fe = new Date(parseInt(f[2]), parseInt(f[1]) - 1, parseInt(f[0]))
  if (fe > fechaMundo) {
    // console.log(fe,fechaMundo);
    console.log(fe.mod('año', -1), fechaMundo);
  }
  else
    if (fe < fechaMundo) {
      console.log(fe, fechaMundo);
    }

  return fe;
}

function guardar() {
  ls(pe.nombre, pe);
  var salida = document.getElementById('inputs');
  var ic = new InputCustom(pe);
  salida.appendChild(ic);

}

function tablas(personaje) {
  var salida = document.getElementById('inputs');
  var ic = new InputCustom(personaje);
  salida.appendChild(ic);
  
}

function limpiarTablas() {
  var salida = document.getElementById('inputs');
  salida.innerHTML=""
  
}

function pifias(inicio, fin) {
  let h = new Habilidad('h', '2s', 1)
  for (let i = inicio; i < fin; i++) {
    h.valor = i;
    console.log(i, h.p, 100 - Math.round((100 - i) * 0.05), Math.ceil((100 - i) * 0.05), Math.floor((100 - i) / 20));

  }
}

function plot(dias = 300) {

  let fmt = uPlot.fmtDate("{YYYY}-{MM}-{DD}");
  let tzDate = ts => uPlot.tzDate(new Date(ts * 1e3), 'Europe/London');

  let opts = {
    title: `Subida en ${dias} días`,
    id: "chart1",
    class: "my-chart",
    width: 800,
    height: 600,

    series: [
      {
        label: "Fecha",
        value: (self, rawValue) => new Date(rawValue * 1000).fecha()
      },
      {
        // initial toggled state (optional)
        show: true,

        spanGaps: false,

        // in-legend display
        label: "Intensidad",
        value: (self, rawValue) => rawValue + "%",

        // series style
        stroke: "red",
        width: 1,

      }
    ],
    axes: [
      {
        //	size: 30,
        label: "X Axis Label",
        labelSize: 20,
        values: [
          // tick incr  default       year                        month   day                  hour   min               sec  mode 
          [3600 * 24 * 365, "{YYYY}", null, null, null, null, null, null, 1],
          [3600 * 24 * 28, "{MMM}", "\n{YYYY}", null, null, null, null, null, 1],
          [3600 * 24, "{D}/{M}", "\n{YYYY}", null, null, null, null, null, 1],
          [3600, "{HH}", "\n{D}/{M}/{YY}", null, "\n{D}/{M}", null, null, null, 1],
          [60, "{HH}:{mm}", "\n{D}/{M}/{YY}", null, "\n{D}/{M}", null, null, null, 1],
          [1, ":{ss}", "\n{D}/{M}/{YY} {HH}:{mm}", null, "\n{D}/{M} {HH}:{mm}", null, "\n{HH}:{mm}", null, 1],
          [0.001, ":{ss}.{fff}", "\n{D}/{M}/{YY} {HH}:{mm}", null, "\n{D}/{M} {HH}:{mm}", null, "\n{HH}:{mm}", null, 1],
        ]
      },
      ,
      {
        space: 50,
        //	size: 40,
        side: 1,
        label: "Y Axis Label",
        //	labelSize: 20,
        stroke: "red",
        class: "foo",
      }
    ],
  };

  let data = pe.simularTiradasDia('Intensidad', 10, dias)

  let uplot = new uPlot(opts, data, document.body);
}

// var w = cargaLocalObjeto("Wolfstein Einhorn");

//CAMBIAFORMAS
// var r = cargaLocalObjeto("Rosssel");

// var d = new Dragon({nombre:'Dragón', FUE:77})
// console.log(d);

// r.cuerpo.dañarLocalizacion(3,7);
// r.cambiaformas(d)



// class C1 {
//     constructor(a,b,c,d) {
// 			this.a = a
//       this.b = b
//       this.c = c
//       this.d = d

//   }
// }

// var c1 = new C1(1,'2',3,'Rober');
// var ic= new InputCustom(c1,['a','b','d']);
// var ic2= new InputCustom(d);
// salida.appendChild(ic);
// salida.appendChild(ic2);

// let resultados = [];
// for (let i = 0; i <= 100; i++)
// 	resultados[i] = 0;

// for (let i = 0; i <= 100000; i++) {
// 	// Alex intenta entender qué hago aquí
// 	resultados[Math.floor(Math.random() * 100 + 1)]++;
// }

// let resultados2 = [];
// for (let i = 0; i <= 100; i++)
// 	resultados2[i] = 0;

// for (let i = 0; i <= 100000; i++) {
// 	// Alex intenta entender qué hago aquí
// 	resultados2[Math.round(Math.random() * 100)]++;
// }

