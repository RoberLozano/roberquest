
    var fecha;
    var parte;
    var pieza;
    var servicio;
    var coda;
    var empresa;
    var tecnico;
    var pedido;

    var tecnicos=[
    "Amparo Martinez Alcarria" ,"Manuel Caulin Moreno", "Luis M. Rubio Marin" ,"Juan Bautista Rueda", "F. Javier Jimenez Garcia"]

    var texto="";

function act() {
    fecha=document.getElementById("fecha").value;
    parte=document.getElementById("parte").value;
    pieza=document.getElementById("pieza").value;
    servicio=document.getElementById("servicio").value;
    coda=document.getElementById("coda").value;
    empresa=document.getElementById("empresa").value;
    tecnico=document.getElementById("tecnico").value;
    pedido=document.getElementById("pedido").value;

    texto=`












Fecha:   ${fecha}
De:      Servicio de Mantenimiento
A:       ${servicio}
Asunto:  Baja de Equipamiento












Le comunicamos que el equipo/pieza/util '${pieza}' recibido en el Servicio de Mantenimiento para su reparacion con parte de averia ${parte} no se puede reparar por lo que el servicio de ${servicio} si quiere reponerlo/a debera hacer un pedido al Servicio de Suministros.

En el pedido que realice al Servicio de Suministros debe indicar de forma clara el parte del Servicio de Mantenimiento, en este caso es el: ${parte}



Codigo del Articulo: ${coda}

Empresa suminitradora del articulo: ${empresa}
`
    console.log(texto);
}

function download(filename, text) {
  var pom = document.createElement('a');
  pom.setAttribute('href', 'data:text/plain;charset=utf-8,' + 

encodeURIComponent(text));
  pom.setAttribute('download', filename);

  pom.style.display = 'none';
  document.body.appendChild(pom);

  pom.click();

  document.body.removeChild(pom);
}


