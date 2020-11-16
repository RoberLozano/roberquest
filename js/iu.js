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
    //   crearEventos(object, cell, key);
      i++;
    }
  
    if (object instanceof Habilidad) {
      // en habilidad pongo el total (.v) y un tooltip con el E y C
      var cell = row.insertCell(i); cell.innerHTML =
        `<i data-toggle="tooltip" title="E: ${object.e}\nC: ${object.c} "> <b> ${object.v}</b> </i>`
    }
  
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
    // $("#i" + puntos).text(7);
    // document.getElementById("#i" + puntos).innerText='7'
    // pj.setCar(puntos,pj.getMaxPuntos(puntos))
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