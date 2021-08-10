if ("webkitSpeechRecognition" in window) {
    let speechRecognition = new webkitSpeechRecognition();
    let final_transcript = "";
  
    speechRecognition.continuous = true;
    speechRecognition.interimResults = true;
    speechRecognition.lang = 'es-ES';
  
    speechRecognition.onstart = () => {
      document.querySelector("#status").style.display = "block";
    };
    speechRecognition.onerror = () => {
      document.querySelector("#status").style.display = "none";
      console.log("Speech Recognition Error");
    };
    speechRecognition.onend = () => {
      document.querySelector("#status").style.display = "none";
      console.log("Speech Recognition Ended");
    };
  
    speechRecognition.onresult = (event) => {
      let interim_transcript = "";
  
      for (let i = event.resultIndex; i < event.results.length; ++i) {
        if (event.results[i].isFinal) {
          final_transcript += event.results[i][0].transcript;
          speak(event.results[i][0].transcript);
        } else {
          interim_transcript += event.results[i][0].transcript;
        }
      }
      document.querySelector("#final").innerHTML = final_transcript;
      document.querySelector("#interim").innerHTML = interim_transcript;
    };
  
    document.querySelector("#start").onclick = () => {
      speechRecognition.start();
    };
    document.querySelector("#stop").onclick = () => {
      speechRecognition.stop();
    };
  } else {
    console.log("Speech Recognition Not Available");
  }



//#region Speech

var synth = window.speechSynthesis;

function speak(texto) {
    // console.log(synth.getVoices());
    console.log('EMPIEZA A HABLAR');
    if (synth.speaking) {
        console.error('speechSynthesis.speaking');
        return;
    }

    var utterThis = new SpeechSynthesisUtterance(texto);
    utterThis.onend = function (event) {
        console.log('SpeechSynthesisUtterance.onend');
        console.log('TERMINA DE HABLAR');
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