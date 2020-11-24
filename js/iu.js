function objetoTabla(object, tabla, visibles) {
    var table = document.getElementById(tabla);
    var row = table.insertRow();
  
    var i = 0
    for (key of visibles) {//Esto serían todas
      var cell = row.insertCell(i);
      let valor;
      //Hacer un get de property en vez de método
      // if (key.includes("()")) {//si es un método
      //   valor = eval("object." + key);
      // }
      // else {
      if (i == 0) id = object[key];
      // crearEventos(object, cell, key);
      // console.log(object[key]);
      valor = object[key];
      // }
  
      if (valor === undefined) valor = "";
  
      cell.innerHTML = '<i data-toggle="tooltip"  id="' + id + "|" + key + "|" + valor + '" title=' + key + '>' + valor + '</i>';
      crearEventos(object, cell, key);
      i++;
    }
  
    if (object instanceof Habilidad) {
      // en habilidad pongo el total (.v) y un tooltip con el E y C
      var cell = row.insertCell(i);
      cell.innerHTML =
        `<i data-toggle="tooltip" title="E: ${object.e}\nC: ${object.c} "> <b> ${object.v}</b> </i>`
        crearEventos(object, cell, "total");

    }
  
  }
function tablaHabilidades() {
    var visibles = $("#columnas").val();
    // visibles.push(v);
    clear("tbHab");
    //header
    createHeader(visibles);
    for (habilidad in pj.habilidades) {
      let hab = pj.getHabilidad(habilidad);
      objetoTabla(hab, "tbHab", visibles)
    };
  }
//Poblar con datos
function tablaStats(idTabla = "statsTable") {
    var table = document.getElementById(idTabla);
    clear();
  
    for (let i in CP) {
      var row = table.insertRow();
      var tipo = row.insertCell(0);
      var cell = row.insertCell(1);
      let hTipo = row.insertCell(2);
      let hValor = row.insertCell(3);
  
      tipo.innerHTML = '<i data-toggle="tooltip"  id="lb' + CP[i] + '" title=' + CP[i] + '>' + CP[i] + '</i>';
      // cell.innerHTML = '<i data-toggle="tooltip"  onfocusout="console.log(this.innerHTML)" contenteditable="true"  id="' + CP[i] + '" title=' + pj[CP[i]] + '>' + pj.getCar(CP[i]) + '</i>';
      cell.innerHTML = `<i data-toggle="tooltip"  onfocusout="pj['${CP[i]}']=parseInt(this.innerHTML); console.log(pj['${CP[i]}']);" contenteditable="true"  id="${CP[i]}" title='${pj[CP[i]]}'>${pj.getCar(CP[i])}</i>`;
      hTipo.innerHTML = '<i data-toggle="tooltip"  id="' + TipoHabilidades[i] + '" title=' + TipoHabilidades[i] + '>' + TipoHabilidades[i] + '</i>';
      hValor.innerHTML = '<i data-toggle="tooltip"  id="' + pj.getCar(TipoHabilidades[i]) + '" title=' + pj[TipoHabilidades[i]] + '>' + pj.getCar(TipoHabilidades[i]) + '</i>';
  
    }
    
  //   CP.forEach(pt => {
  //   //console.log(document.getElementById( pt));
  //   document.getElementById( pt).addEventListener('blur', (event) => {
  //     console.log("FOCUS LOST");
  //     // //pj[pt]
  //     // var n= parseInt(document.getElementById(pt).innerHTML);
  //     // console.log(n);
  //     // // pj.save();
  //     //   pj[pt]=n
  //   });
  // });
  }

  function actPuntos() {
    $("#btPG").text("/  " + pj.getMaxPuntos(PG));
    $("#btPF").text("/  " + pj.getMaxPuntos(PF));
    $("#btPM").text("/  " + pj.getMaxPuntos(PM));
  
    $("#iPG").val(pj.getCar(PG));
    $("#iPF").val(pj.getCar(PF));
    $("#iPM").val(pj.getCar(PM));
  
  }
  
  

  function addObjet2Table(object, tabla) {
    const keys = Object.keys(object);
    const values = Object.values(object);
    var table = document.getElementById(tabla);
    var row = table.insertRow();
    var id = -1
    for (i = 0; i < keys.length; i++) {
      if (i == 0) id = values[i];
      var cell = row.insertCell(i);
    //   crearEventos(object, cell);
      cell.innerHTML = '<i data-toggle="tooltip"  id="' + id + "|" + keys[i] + "|" + values[i] + '" title=' + keys[i] + '>' + values[i] + '</i>';
      // cell.tooltip({title: "<h1><strong>HTML</strong> $keys[i] <code>the</code> <em>tooltip</em></h1>", html: true, placement: "bottom"});
      // console.log(keys[i] + ":" + values[i]); //check your console to see it!
    }
  
  }


  function createHeader(visibles, header = "header") {
    var th = document.getElementById(header);
    th.style.textTransform = "uppercase";
    th.innerHTML = ""; //clear header
    var row = th.insertRow(0);
    for (var i in visibles) {
      var cell = row.insertCell(i);
      // cell.innerHTML = '<b>' + visibles[i].toUpperCase() + '</b>';
      cell.innerHTML = '<b>' + visibles[i] + '</b>';
    }
    if (header === "header") {//si es habilidades
      // El total si sale siempre cambiar cuando se aplique tb a inventario
      // a no ser que ponga el peso total
      cell = row.insertCell();
      cell.innerHTML = '<b>' + "TOTAL" + '</b>';
      th.appendChild(row);
    }
  
  }

  function crearEventos(object, cell, key) {
    //si e sun contenedor cargo lso elementos que contiene
    if (object instanceof Contenedor) {
  
      if (key === "nombre") {
        // cell.style.color = "red";
        // cell.innerHTML += `   <button type="button" class="btn btn-secondary btn-sm" onclick="editar();" >Abrir</button>`
        // cell.innerHTML += ` <i class="material-icons small">delete</i> <img class="ic" src="img/box-open-solid.svg"></img> <span class="badge">${object.objetos.length}</span>`
        var x = document.createElement("SPAN");
        //como la creo en el momento si es fondo enegro invierto colores
        x.innerHTML=  `<i class="material-icons small">delete</i> <img class="ic ${negro?'invert':''}" src="img/box-open-solid.svg"></img> <span class="badge">${object.objetos.length}</span>`
        cell.appendChild(x);
        x.addEventListener("click", function () {
          let nc = object.nombre;
          let index = pj.inventario.navegar(nav).objetos.indexOf(object);

          nav.push(index);
          console.log('Contenedor:'+object.nombre);
          let thisnav=nav;
          document.getElementById('breadcrumb').innerHTML+=`<a onclick="alert('[${thisnav}]');eval('nav=[${thisnav}]');ir()" class="breadcrumb">${object.nombre}</a>`
          console.log(nav);
          cargarContenedor(object);
          // editar(object);
  
        });
      }
    }
  
    if (object instanceof Gema && key === "nombre") {
      cell.innerHTML = `<i class="fas fa-gem"></i> ` + cell.innerHTML;
      cell.innerHTML += ` <span class="badge " style="color:blue;" >${object.pm}/${object.capacidad}</span>`;
      // cell.innerHTML += ` <span class="badge badge-dark" style="background: linear-gradient(315deg, #b8d0e0 0%, #a6afb9 54%,  #b8d0e0 80% );">${object.ctd}</span>`
  
    }
    // if (object instanceof Pociones && key === "nombre") {
  
    //   let index = object.efectos.search(/\(/g);
    //   let s = object.efectos.substring(index, object.efectos.length)
    //   cell.innerHTML = `<i class="fas fa-flask" ></i> ` + cell.innerHTML;
    //   cell.innerHTML += ` <span class="badge " style="color:blue;" >${s}</span>`;
    //   var ht = new Hammer(cell);
    //   ht.on("press tap", function (ev) {
    //     console.log(ev);
    //     if (ev.type == "tap")
    //       console.log("TAP");
    //     else
    //       object.tomar();
    //   });
    //   // cell.innerHTML += ` <span class="badge badge-dark" style="background: linear-gradient(315deg, #b8d0e0 0%, #a6afb9 54%,  #b8d0e0 80% );">${object.ctd}</span>`
  
    // }
  
    if (object instanceof Objetos && key === "nombre") {
      if (object[key] == "mo") cell.innerHTML += ` <span class="badge badge-dark gold" >${object.ctd}</span>`;
      else
        if (object[key] == "mm") cell.innerHTML += ` <span class="badge metal" >${object.ctd}</span>`;
        else
          cell.innerHTML += ` <span class="badge badge-dark"  >${object.ctd}</span>`;
      // cell.innerHTML += ` <span class="badge badge-dark" style="background: linear-gradient(315deg, #b8d0e0 0%, #a6afb9 54%,  #b8d0e0 80% );">${object.ctd}</span>`
  
    }
  
  //TODO: Objetos

    // if (object instanceof Objeto) {
    //   var hammertime = new Hammer(cell);
    //   hammertime.on('swipe', function (ev) {
    //     console.log(ev);
    //     if (ev.direction == 2) {
    //       // cell.parentElement.style.background = "white";
    //       cell.parentElement.classList.remove("selec");
    //       deseleccionar(object);
    //     } //a izq
    //     else {
    //       // cell.parentElement.style.background = "green";
    //       cell.parentElement.classList.add("selec");
    //       seleccionar(object);
    //     } //a derechas selecciona
    //   });
  
  
      // var mc = new Hammer.Manager(cell);
  
  
      // // Tap recognizer with minimal 2 taps
      // mc.add(new Hammer.Tap({ event: 'doubletap', taps: 2 }));
      // // Single tap recognizer
      // mc.add(new Hammer.Tap({ event: 'singletap' }));
  
  
      // // we want to recognize this simulatenous, so a quadrupletap will be detected even while a tap has been recognized.
      // mc.get('doubletap').recognizeWith('singletap');
      // // we only want to trigger a tap, when we don't have detected a doubletap
      // mc.get('singletap').requireFailure('doubletap');
  
  
      // mc.on("singletap doubletap swipe", function (ev) {
      //   console.log( "Toque " +ev.type + " ");
      // });
  
      cell.addEventListener("dblclick", function () {
        // alert("mover objeto") + object.nombre;
        //modifico el editor modal
        editar(object);
        //y lo muestro
        // $("#editModal").modal();
        // document.getElementById('editModal').open();
        $("#editModal").modal('open');
      });
  
    
  
    if (object instanceof Pociones) {
      objetoActual = object;
      console.log("me meto en pociones");
      cell.addEventListener("dbclick", function () {
        console.log("Voy a tomar");
        object.tomar();
      });
    }
  
    if (object instanceof Habilidad) {
      if (key === "xp") { //si doy un click en xp +1
        cell.addEventListener("click", function () {
          console.log('lo incremento y guardo' );
          //lo incremento y guardo en firebase 
          // object.xp++;
          object.addXP(1);
          // object.save();
          tablaHabilidades()
        });
      }
  
      if (key === "nombre") {
        cell.addEventListener("click", function () {
          //modifico el editor modal
          editar(object);
          //y lo muestro
          // $("#editModal").modal();
          $("#editModal").modal('open');
          // sel(object, cell); //selecciona o deselecciona si ya lo está
          // console.log(objeto);
        });
      }
  
      if (key === "valor") {
        cell.addEventListener("click", function () {
          entrenar(object);
          //y lo muestro
        });
      }
      if (key === "total") {
        cell.addEventListener("click", function () {
          sel(object, cell);
          console.log(object);
        });
      }
      
  
    }
  
    if (object instanceof Hechizo) {
      if (key === "nombre") {
        cell.innerHTML += ` <i class="fas fa-magic"></i><span class="badge " style="color:blue;" >${object.pm}</span>`;
  
        var ht = new Hammer(cell);
        ht.on("press tap", function (ev) {
          console.log(ev);
          if (ev.type == "tap")
            console.log("TAP");
          else
            hechizos(object); //en toque largo hechizo
        });
      }
    }

  }
  
  function editar(objeto) {
    // console.log("Editar:"+objeto );
    objetoActual = objeto;
    var editor = document.getElementById("editor");
    editor.innerHTML = ""; //clear editor

      for (key in objeto){

              //experimental
              //editor por línea
              // editor.innerHTML = editor.innerHTML + `<div class="input-field col s12">
              //inline
              editor.innerHTML = editor.innerHTML + `<div class="input-field inline">
              <input id="edit${key}" type="${isNumber(objeto[key]) ? "number" : "text"}" class="validate" value="${objeto[key]}">
              <label class="active" for="edit${key}">${key}</label>
            </div>`
  
      // editor.innerHTML = editor.innerHTML + ' <b>' + k.toUpperCase() + ':</b>' +
      //   `<input data-toggle="tooltip"  id="edit${k}" value='${v}'' title="${k}" ><br>`
        // editor.innerHTML = editor.innerHTML +
        // `<div class="input-field inline"><input id="edit${k}"  value='${v}' type="text"><label for="edit${k}">${k}</label></div>`
      // '<input data-toggle="tooltip"  id="edit' + keys[i] + '" value=' + values[i] + ' title=' + keys[i] + ' ><br>';
      //Probar con forms
    }
    editor.innerHTML = editor.innerHTML + `<button type="button" class="btn btn-success" onclick="guardarObjeto()">Guardar</button>`
  
  }

  function clear(id = "statsTable") {
    var tb = document.getElementById(id);
    tb.innerHTML = ""; //clear body
  }
  function cargarContenedor(object) {
    object = pj.inventario.navegar(nav);
    if (!(object instanceof Contenedor)) return; //si no es contenedor
    //hago éste el contenedor actual
    // contenedorActual = object;
    // console.log("Contenedor Act:");
    console.log("Objeto Act:");
    // console.log(pj.inventario.navegar(nav));
    console.log(object);
    clear("tbInv"); //limpio la tabla
    let visibles = $("#colInventario").val();
    createHeader(visibles, "hdInv");
    object.objetos.forEach(function (element) {
      // addObjet2Table(element, "tbInv")
      objetoTabla(element, "tbInv", visibles);
    });
    addObjet2Table(["peso Total", roundTo(3, object.pesa)], "tbInv")
  }

  function pantalla() {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen();
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      }
    }
  }

  var tab;
  function tabActiva(params) {
    tab=$(".active").attr('href');
      console.log("Active Tab:"+$(".active").attr('id'));
      console.log("Active Tab Div:"+$(".active").attr('href'));
     
  }

  function pMax(puntos) {
    let valor = pj.getMaxPuntos(puntos);
    $("#i" + puntos).val(valor);
  }

  PUNTOS.forEach(pt => {
    document.getElementById('i' + pt).addEventListener('change', (event) => {
      pj[pt] = parseInt(event.target.value);
      // pj.save();
    });
  });
  

  var colAntes, colDespues;


$('select').change(function (e) {
  // console.log("aparece "+$('select').val());
  colAntes = $(this).val()

  console.log(e.target.value);
  console.log(colAntes);
});

//para tabla habilidades
$('#columnas').change( function (e) {
  tablaHabilidades();
});

//para tabla habilidades
$('#colInventario').change( function (e) {
  cargarContenedor();
});


function info(params) {
  $('#brand').text(pj.nombre);
  document.title = pj.nombre;
    document.getElementById("cabeceraInfo").innerHTML='<i class="material-icons">info</i>Información de '+pj.nombre
    $('#iNombre').val(pj.nombre);
$('#iRaza').val(pj.clase);
$('#iPeso').val(pj.peso);

}

function toogle(id="buscador") {
  let x = document.getElementById(id);

  if (x.style.display === "none") {
    x.style.display = "block";
  } else {
    x.style.display = "none";
  }
}

//BUSCAR
$("#buscar").on("keyup", function () {
  var value = $(this).val().toLowerCase();
  $("#tbHab tr").filter(function () {
    $(this).toggle($(this).text().toLowerCase().indexOf(value) > -1)
  });
});

//DARKMODE

var negro=false;
function dark() {
  var element = document.body;
  element.classList.toggle("dark");
  //  document.getElementById('tabla').classList.toggle("table-dark");
  document.getElementById('tbHab').classList.toggle("dark");
  $("input").toggleClass("dark");
  $("#cabeceraInfo").toggleClass("dark");
  // $("#cabeceraInfo").css("color", "red");
  // $(":input").css("color", "white");
  // $('#tabla').DataTable();
  $("#tabs-swipe-demo").toggleClass("dark");

//los iconos invertidos pero a la segunda no funciona
 $('.ic').toggleClass("invert");
negro=!negro;
}


//#region edición

var selected = [];
var copiado = [];
var nav = [];


function checkContexto() {
  if (selected.length == 1) { //si hay 1 seleccionado
    // $("#fb-editar").show();

  }
  if (selected.length < 1) { //si no hay seleccionados
    // $("#fb-copiar").hide();
    // $("#fb-cortar").hide();
    // $("#fb-eliminar").hide();
    // $("#fb-editar").hide();
    // // $("#fb-descuento").hide();
    // $("#deseleccionarTodo").hide();
    // $("#fb-nuevo").show();


  }
  else {
    // $("#fb-copiar").show();
    // $("#fb-cortar").show();
    // $("#fb-eliminar").show();
    // $("#fb-editar").show();
    // $("#deseleccionarTodo").show();
    // $("#fb-nuevo").hide();

  }

  if (copiado.length < 1) {
    // $("#fb-pegar").hide();
  }
  else {
    // $("#fb-pegar").show();
  }


}

function invertirSeleccion() {
  $("#myTable").children('tr').each(function (i) {

    var pos = selected.indexOf(articulos[i]);
    if (pos > -1) { //deselecciono si ya está
      console.log("Deselecciono" + i + "  " + articulos[i].nombre);

      selected.splice(pos, 1);
      this.classList.remove("selec"); //quito la clase de seleccionado
    }
    else { //si no está lo selecciono
      console.log("Selecciono" + i + "  " + articulos[i].nombre);
      selected.push(articulos[i]);
      this.classList.add("selec");//pongo formato seleccionado
    }


  });
  checkContexto();

}


function deseleccionarTodo() {
  console.log(articulos);
  selected = [];
  $("#myTable").children('tr').each(function (i) {
    this.classList.remove("selec");
  });
  checkContexto();
}

function seleccionarTodo() {
  console.log(articulos);
  // PETA copiar de uno en uno
  // selected = articulos;
  selected = [...articulos];

  $("#myTable").children('tr').each(function (i) {
    this.classList.add("selec");
  });
  checkContexto();

  M.toast({ html: `${selected.length} seleccionado${selected.length > 1 ? 's' : ''}` })

}

function toast(s) {
  M.toast({ html: s })
}

/**
 * 
 * @param {Object} objeto el objeto seleccionado
 * @param {Cell} celda la celda sobre la que se actúa
 */
function sel(objeto, celda) {

  console.log(selected);
  var pos = selected.indexOf(objeto);
  console.log("pos:" + pos);
  if (pos > -1) { //deselecciono si ya está
    selected.splice(pos, 1);
    celda.parentElement.classList.remove("selec"); //quito la clase de seleccionado
  }
  else { //si no está lo selecciono
    selected.push(objeto);
    celda.parentElement.classList.add("selec");//pongo formato seleccionado
  }

  checkContexto();
  console.log(selected);

}

// function seleccionar(objeto) {
//   console.log(selected);
//   var pos = selected.indexOf(objeto);
//   console.log("pos:" + pos);
//   if (pos > -1) return; //ya está seleccionado
//   selected.push(objeto);
//   console.log(selected);
// }

// function deseleccionar(objeto) {
//   var pos = selected.indexOf(objeto);
//   console.log("Encontrado en pos:" + pos);
//   if (pos > -1) selected.splice(pos, 1);
//   console.log(selected);

// }

function copiar() {
  copiado = selected;
  checkContexto();
}

function cortar() {
  // copiado.push(objetoActual);
  copiar();
  eliminar();
  // pj.inventario.navegar(nav).sacar(objetoActual);
  // pj.save();
  // cargarPersonaje(true);
}

function eliminar() {

  let l=selected.length;

  //se quita la escucha
  off=true

  selected.forEach((element,i) => {
    if(i==(l-1)) off=false; //si es el último se vuelve a activar la escucha
    element.borrar();
  });

  // $("#fb-pegar").hide();

  // M.toast({html: selected.length +" eliminados"})
  M.toast({ html: `${selected.length} eliminado${selected.length > 1 ? 's' : ''}` })
  selected = [];
  checkContexto();

}

function pegar() {
  copiado.forEach(element => {
    nuevoArticulo(element);
  });
  // copiado = [];
  selected = [];
  checkContexto();


}

//#endregion

//#region navegacion


function atras() {
  nav.pop();
  let bc= document.getElementById('breadcrumb');
  bc.removeChild(bc.lastChild);
  ir();
}

function ir() {

  console.log("CARGA CONTENEDOR");
  console.log(pj.inventario.navegar(nav).nombre);
  cargarContenedor(pj.inventario.navegar(nav));

}

//#endregion navegacion


//#region ATACAR

var pnj = {}
/**
 * 
 * @param {String} nombre El nombre del PNJ a cargar
 * @param {var} pnj La variable donde se guarda el PNJ
 */
function cargarPNJ(nombre, id = nombre) {
  // let ruta = `personajes/${nombre}/`;
  // // console.log("CARGAR RUTA:" + ruta);
  // fbActual = database.ref(ruta);

  // // si lo hago así es menos eficiente,
  // // porque siempre que haya un cambio
  // // donde sea me, va a cargar el personaje entero

  // fbActual.on('value', function (item) {
  //   console.log("onvalue PNJ" + item.val().nombre);

  //   pnj[id] = new Humanoide({});
  //   // pnj = new Animal({});
  //   pnj[id].setAll(item.val());

  //   console.log(`CARGA EL PNJ: ${pnj[id].nombre} en pnj["${id}"]`);

  // });

  pnj[id] = new Humano({});
  pnj[id].nombre='Enemigo';
  guerrero(pnj[id], 10, 'maza', 'arco', 'daga')
}

var enemigo="Enemigo";
function atacarModal(habilidad) {
  console.log("estoy en atacar modal");
  //inicializa
  // atPJ();
  // let enemigo = new Humano();
  // enemigo.nombre="Enemigo"
  atP(pj.nombre, "PJ")

  console.log("ENEMIGO es-->" + enemigo);
  cargarPNJ(enemigo, enemigo);
  atP(enemigo, "PNJ")


  $("#modalAtacar").modal();

}



var zoomCuerpo = 1;

function atP(personaje = "Enemigo", rol = "PNJ") {
  if (rol === "PNJ") console.log("atP-->PNJ");
  else console.log("atP-->PJ");
  var datalist = `<datalist id='listaLocalizaciones${personaje}'>`
  var listaLoc = [];
  if (rol === "PNJ")
    pnj[personaje].cuerpo.todosNombres(listaLoc);
  else
    pj.cuerpo.todosNombres(listaLoc);

  listaLoc.forEach(l => {
    datalist += ` <option value="${l}"></option>`
  });
  datalist += "</datalist>"

  document.getElementById(`at${rol}`).innerHTML =

  // Daño: <input id="iDaño${personaje}" type="number"  class="form-control number-input col-2" ondblclick="this.value=Math.round(Math.random() * 15);">
  // <button id="bDañar" type="button" class="btn btn-danger" onclick="
  // dañar('${rol}',document.getElementById('iDaño${personaje}').value,document.getElementById('localizaciones${personaje}').value);
  // console.log(document.getElementById('localizaciones${personaje}').value );
  // atDaños();
  // ">Dañar</button>

    `
    <div>
        Habilidad ofensiva:<br>
        <div class="input-field inline"> <input-dado id="id${personaje}"></input-dado></div>
        <div class="input-field inline"> <input-arma id="arma${personaje}"></input-arma></div>
        <br>
        <form>
            <label>
                <input type="radio" id="r-todo${personaje}" name="lugar" value="todo" checked>
                <span>Todo</span>
            </label>
            <label>
                <input type="radio" id="r-arriba${personaje}" name="lugar" value="arriba">
                <span>Arriba</span>
            </label>
            <label>
                <input type="radio" id="r-abajo${personaje}" name="lugar" value="abajo">
                <span>Abajo</span>
            </label>
        </form>
        <div>
            <div class="input-field inline"><input id="iDadosLoc${personaje}" class='dado' type="number"
                    ondblclick="this.value=Math.round(Math.random() * 100);">
                <label for="iDadosLoc${personaje}">Dados</label></div>
            <div class="input-field inline"> <input type="text" list="listaLocalizaciones${personaje}"
                    id="localizaciones${personaje}"> ${datalist} </input>
                <label for="localizaciones${personaje}">Localización</label></div>
        </div>
    
        <div id="daños${(rol === " PNJ") ? 'PNJ' : 'PJ' }"></div>
    
        <input id="zoom" type="range" min="0" max="1" step="any" onchange="zoomCuerpo=this.value;atDaños()"
            style="width: 100%;">
        <canvas id="canvas${rol}" width="500" height="900" style="background-color: black;border:1px solid #d3d3d3;">
            Your browser does not support the HTML5 canvas tag.</canvas>
        <div style="display:none;"><img id="cuerpo" src="Body.png" alt="Cuerpo"></div>
    
    </div>
`;

  /* <button id="+" onclick="zoomCuerpo+=0.1;atDaños()">+</button>
  <button id="-" onclick="zoomCuerpo-=0.1;atDaños()">-</button> */

  // ${(rol === "PJ") ? 'pnj.' + personaje : "pj"}.cuerpo.dañarLocalizacion(this.value,document.getElementById('localizaciones${personaje}').value);

  // console.log(${(rol === "PNJ")?'pnj.'+personaje:"pj"}.cuerpo.darLocalizacion(document.getElementById('localizaciones${personaje}').value).dañar(this.value) );

  $(`#iDadosLoc${personaje}`).change(function () {
    valor = event.target.value;
    let medio = 60
    if (document.getElementById(`r-arriba${personaje}`).checked) {
      if (valor > medio) valor = Math.trunc(escalar(valor, medio, 100, 1, medio))
    }
    else
      if (document.getElementById(`r-abajo${personaje}`).checked) {
        if (valor < medio) valor = Math.trunc(escalar(valor, 1, medio, medio, 100))
      }

    if (rol === "PNJ") { $(`#localizaciones${personaje}`).val(pj.cuerpo.darLocalizacion(valor).nombre) }

    else {
      $(`#localizaciones${personaje}`).val(pnj[$('#nombreEnemigo').val()].cuerpo.darLocalizacion(valor).nombre) 
      // $(`#localizaciones${personaje}`).val(pnj[enemigo].cuerpo.darLocalizacion(valor).nombre) 
      
    }


  });

  if (rol === "PNJ") { document.getElementById(`id${personaje}`).setPersonaje(pnj[personaje]) }
  else { document.getElementById(`id${personaje}`).setPersonaje(pj); }

}


function dañar(p, daño, loc) {
  console.log("Daño", p, daño);
  if (p === "PJ") {
    pnj[$('#nombreEnemigo').val()].cuerpo.dañarLocalizacion(daño, loc)
  }
  else {
    pj.cuerpo.dañarLocalizacion(daño, loc)
  }


}

function atDaños(params) {
  let todos = [];
  let string = ""
  //dibujar

  console.log("atDaños");

  // var canvas = document.getElementById("myCanvas");
  // var ctx = canvas.getContext("2d");
  // var img = document.getElementById("cuerpo");
  // ctx.drawImage(img, 0, 0);

  let canvas = document.getElementById('canvasPNJ');
  canvas.width = 500 * zoomCuerpo;
  canvas.height = 900 * zoomCuerpo;
  pnj[$('#nombreEnemigo').val()].cuerpoDaño("canvasPNJ", zoomCuerpo);

  pnj[$('#nombreEnemigo').val()].cuerpo.todosDaños(todos);
  todos.forEach(l => {
    // console.log(l.nombre,l.daño);
    string += `${l.nombre} :<b>${l.daño}</b>/${l.pg}<br>`
    // string+=l.nombre+":"+l.daño+"<br>";
    // if(l.x && l.y){
    //   console.log("dibujo ",l.nombre,l.x, l.y, l.daño*5);
    //   ctx.globalAlpha = 0.5
    //   ctx.beginPath();
    //   ctx.arc(l.x, l.y, l.daño*5, 0, 2 * Math.PI, false);
    //   ctx.fillStyle = 'red';
    //   ctx.fill();
    // }

  });
  // string+=`${pnj[$('#nombreEnemigo').val()].getCar("PG")} / ${pnj[$('#nombreEnemigo').val()].getMaxPuntos(PG)}`
  
  // Quité los daños
  // document.getElementById('dañosPNJ').innerHTML = string;


  todos = [];
  string = ""
  pj.cuerpo.todosDaños(todos);
  canvas = document.getElementById('canvasPJ');
  canvas.width = 500 * zoomCuerpo;
  canvas.height = 900 * zoomCuerpo;
  pj.cuerpoDaño("canvasPJ", zoomCuerpo);


  todos.forEach(l => {
    // console.log(l.nombre,l.daño);
    string += `${l.nombre} :<b>${l.daño}</b>/${l.pg}<br>`
    // string+=l.nombre+":"+l.daño+"<br>";
  });
  document.getElementById('dañosPJ').innerHTML = string;


  // document.getElementById('dañosPJ').innerHTML= JSON.stringify(todos);
  // document.getElementById('dañosPJ').innerHTML= JSON.stringify(pnj[$('#nombreEnemigo').val()].cuerpo.dañadas())
  // document.getElementById('dañosPNJ').innerHTML= JSON.stringify(pj.cuerpo.dañadas());
}


//#endregion



function cargar(params) {
  console.log("CARGA EL PUTO PERSONAJE:" + pj.nombre);
    console.log(nav);
    // console.log(pj);
    info();

    // makeTable("", pj);
    tablaHabilidades();
    tablaStats();
    actPuntos();

    //Inventario nuevo TODO: quitar
    // pj.inventario = creaInventario();
    // console.log(pj.inventario.darContenedores());
    // console.log("ARMAS");
    // console.log(pj.inventario.darClase(Arma));
    // console.log("Objetos");
    // console.log(pj.inventario.darClase(Objetos));


    //TODO: hacer que funcione
    // if (contenedorActual) {
    //   console.log("Contenedor Act:");
    //   console.log(contenedorActual);
    //   cargarContenedor(contenedorActual);
    // }
    // else
    cargarContenedor();
  
}


cargar();