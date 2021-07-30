
//#region Reconocimiento de voz

var SpeechRecognition = SpeechRecognition || webkitSpeechRecognition
var SpeechGrammarList = SpeechGrammarList || webkitSpeechGrammarList
var SpeechRecognitionEvent = SpeechRecognitionEvent || webkitSpeechRecognitionEvent

// var colors = [ 'aqua' , 'azure' , 'beige', 'bisque', 'black', 'blue', 'brown', 'chocolate', 'coral', 'crimson', 'cyan', 'fuchsia', 'ghostwhite', 'gold', 'goldenrod', 'gray', 'green', 'indigo', 'ivory', 'khaki', 'lavender', 'lime', 'linen', 'magenta', 'maroon', 'moccasin', 'navy', 'olive', 'orange', 'orchid', 'peru', 'pink', 'plum', 'purple', 'red', 'salmon', 'sienna', 'silver', 'snow', 'tan', 'teal', 'thistle', 'tomato', 'turquoise', 'violet', 'white', 'yellow'];


var regSTOP = /parar|detener|acabar|terminar|stop|finalizar|fin dictado/gi

// var colors = ['Skasendor', 'Rosssel', 'esca', 'sendor', 'agua', 'azul', 'beis', 'negro', 'blanco', 'blue', 'marron', 'chocolate', 'coral', 'escarlata', 'rojo', 'verde']
// var grammar = '#JSGF V1.0; grammar colors; public <color> = ' + colors.join(' | ') + ' ;'

var resultado = "";
var recognition = new SpeechRecognition();
// var speechRecognitionList = new SpeechGrammarList();
// speechRecognitionList.addFromString(grammar, 1);
// recognition.grammars = speechRecognitionList;


//true para que escuche todo el tiempo
recognition.continuous = true;
recognition.lang = 'es-ES';
recognition.interimResults = false;
recognition.maxAlternatives = 3;

/**separar los articulos por y
 */
var y = false;
var boton;
var hablado;

// document.body.onclick = function() {
//   recognition.start();
//   console.log('Ready to receive a color command.');
// }

/**Funcion que inicializa el dictado
 * 
 */
function hablar() {

    boton = document.getElementById("dictar");
    //   hablado = document.getElementById("hablado");
    if (boton.style.color == "green") //ya esta escuchando y se para
    {
        recognition.stop();
        console.log('Dictado parado');
        return;
    }
    console.log('Botón de hablar pulsado');

    recognition.start();
    console.log('Preparado para escuchar');
    console.log(`Diga '${regSTOP}' para detener la escucha`);


    boton.style.color = "green";

}


// Controlo cuando genera los resultados para evitar el eco en Android https://issuetracker.google.com/issues/152628934
// eliminarlo cuando el bug sea resuelto
var lastTime = 0;


recognition.onresult = function (event) {
    // The SpeechRecognitionEvent results property returns a SpeechRecognitionResultList object
    // The SpeechRecognitionResultList object contains SpeechRecognitionResult objects.
    // It has a getter so it can be accessed like an array
    // The first [0] returns the SpeechRecognitionResult at the last position.
    // Each SpeechRecognitionResult object contains SpeechRecognitionAlternative objects that contain individual results.
    // These also have getters so they can be accessed like arrays.
    // The second [0] returns the SpeechRecognitionAlternative at position 0.
    // We then return the transcript property of the SpeechRecognitionAlternative object
    let last = event.results[event.results.length - 1][0];
    let lastArray = event.results[event.results.length - 1];
    // console.log(`Tamaño: ${size}`);

    // console.log('Confidence: ' + last.confidence);
    var time = Date.now();

    console.log(`${last.transcript}  (${last.confidence}) [${time}]`);
    voz(last.transcript);
    //   console.log(time);

    if (last.confidence < 0.5) console.log(event.results[event.results.length - 1]);
    lastTime = time;

    var td = regSTOP.test(last.transcript);
    // if (last.transcript.includes(STOP)) {
    if (td) {
        console.log('DETENER');
        recognition.stop();
    }

}

recognition.onspeechend = function () {
    recognition.stop();
    boton.style.color = "";
}

recognition.onnomatch = function (event) {
    console.log("No reconoce lo dicho");
    boton.style.color = "red";
}

recognition.onerror = function (event) {
    console.log('Error occurred in recognition: ' + event.error);
    boton.style.color = "red";

}

//#endregion 


//#region Speech

var synth = window.speechSynthesis;

function speak(texto) {
    // console.log(synth.getVoices());
    if (synth.speaking) {
        console.error('speechSynthesis.speaking');
        return;
    }

    var utterThis = new SpeechSynthesisUtterance(texto);
    utterThis.onend = function (event) {
        console.log('SpeechSynthesisUtterance.onend');
    }

    utterThis.onerror = function (event) {
        console.error('SpeechSynthesisUtterance.onerror');
    }

    // utterThis.voice = synth.getVoices()[7];
    // utterThis.pitch = 1.3
    // utterThis.rate = 1.3
    synth.speak(utterThis);

}
//#endregion

//#region Comandos de voz de rol

function voz(dictado) {
    // if(dictado.)
    var expresion = /localización (\d*)/i;
    var hallado = dictado.match(expresion);

    // console.log(hallado);
    if (hallado)
        localizacion(hallado[1])
    // if (dictado.includes('localización')){
    //     dictado.
    // }

    // var erPuntos = /puntos de (golpe|vida|magia|fatiga|resistencia)/i;
    var erPuntos = /puntos de (.*)/i;
    var p=dictado.match(erPuntos);
    if(p){
        console.log(p);
        puntos(p[1])
    }

    // var h=dictado.match(/habilidad (w+)/i);
    var h=dictado.match(/habilidad/i);
    if(h){
        console.log(h);
        // console.log(h[1]);
    }

    var b=dictado.match(/buscar (.*)/i);
    if(b){
        console.log(b);
        buscar(b[1])
    }

}

function buscar(busqueda) {
    // se muestra el buscador
    iuBuscar();
    // $("#buscar").val(busqueda)
    document.getElementById('buscar').value=busqueda; 

    iniciarBusqueda(busqueda)

}

function localizacion(valor) {
    let l = pj.cuerpo.darLocalizacion(valor).nombre

    //Reemplazo las abreviaciones
    var e = / Inf /;
    l = l.replace(e, " Inferior ");

    e = / Sup /;
    l = l.replace(e, " Superior ");

    e = /I$/;
    l = l.replace(e, "Izquierda");

    e = /D$/;
    l = l.replace(e, "Derecha");

    speak(l)
}

function puntos(tipo) {
    var p;
    switch (tipo) {
        case 'golpe':
        case 'vida':
        case 'salud':
            p = 'PG'
            break;
        case 'magia':
            p = 'PM'
            break;
        case 'fatiga':
            p = 'PF'
            break;

        default:
            p=tipo.substring(0,3).toUpperCase()
            break;
    }
    console.log(p,pj.getCar(p));
    speak(pj.getCar(p) + ' puntos de' + tipo)

}

function habilidad(nombre) {
    
}
//#endregion