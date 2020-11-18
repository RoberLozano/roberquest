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
      var cell = row.insertCell(i); cell.innerHTML =
        `<i data-toggle="tooltip" title="E: ${object.e}\nC: ${object.c} "> <b> ${object.v}</b> </i>`
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
      cell.innerHTML = '<i data-toggle="tooltip" contenteditable="true"  id="' + CP[i] + '" title=' + pj[CP[i]] + '>' + pj.getCar(CP[i]) + '</i>';
      hTipo.innerHTML = '<i data-toggle="tooltip"  id="' + TipoHabilidades[i] + '" title=' + TipoHabilidades[i] + '>' + TipoHabilidades[i] + '</i>';
      hValor.innerHTML = '<i data-toggle="tooltip"  id="' + pj.getCar(TipoHabilidades[i]) + '" title=' + pj[TipoHabilidades[i]] + '>' + pj.getCar(TipoHabilidades[i]) + '</i>';
  
    }
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
        cell.innerHTML += ` <i class="fas fa-box-open"></i> <span class="badge badge-dark">${object.objetos.length}</span>`
  
        cell.addEventListener("click", function () {
          let nc = object.nombre;
          let index = pj.inventario.navegar(nav).objetos.indexOf(object);
          nav.push(index);
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
  
    
  
    // if (object instanceof Pociones) {
    //   objetoActual = object;
    //   console.log("me meto en pociones");
    //   cell.addEventListener("dbclick", function () {
    //     console.log("Voy a tomar");
    //     object.tomar();
    //   });
    // }
  
  
  
    if (object instanceof Habilidad) {
      console.log(key);
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
          // $("#editModal").modal('open');
          sel(object, cell); //selecciona o deselecciona si ya lo está
          console.log(objeto);
        });
      }
  
      if (key === "valor") {
        cell.addEventListener("click", function () {
          entrenar(object);
          //y lo muestro
        });
      }
      else{
        console.log(key);
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

  function tabActiva(params) {
    
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

}


//#region edición

var selected = [];
var copiado = [];

function descuento() {
  //TODO: DESCUENTO
  $('#descuento').modal('open');
  $('#rg-descuento').change(function () {
    console.log(this.value);
  });

  $('#quitarDescuento').one("click", function () {
    selected.forEach(element => {
      element.quitarDescuento();
      element.guardar();
    });
  });

  // $('#descuentoOk').one("click", function () {
  //   nombreLista = $("#nombreLista").val();
  //   let d = $("#sl-descuento").val();
  //   // console.log(d);
  //   selected.forEach(element => {
  //     let des;
  //     if (d === "ud") { des = new Descuento(+$('#rg-descuento').val(), 1); }
  //     else des = Descuento.oferta(d);
  //     element.descuento = des;
  //     // console.log(des);
  //     console.log(`${element.nombre} => ${element.total}`);
  //     element.guardar();
  //   });
  // });

}


function checkContexto() {
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


function isNumber(value) {
  if (value instanceof Number)
    return true
  else
    return !isNaN(value);
}

console.log("CARGA EL PUTO PERSONAJE:" + pj.nombre);
    // console.log(nav);
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
    // cargarContenedor();