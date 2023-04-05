window.onload = init;
var domande = [];
var risultati = [];

console.log(this);


//window.location.href -> info sull'indirizzo attuale del sito e server
var indirizzo = window.location.href + "server/";

function init(){
    let ris = fetch(indirizzo+"domande.php", {method:'GET'});
    //Aspettiamo la risposta
    ris.then(async function(dati){
        //Leggiamo i dati della risposta e li convertiamo in json => chiamata asincrona
        domande = await dati.json();
        inserisciDomande();
    });

    document.getElementById("btnControlla").addEventListener("click", controlla.bind(document.getElementById("btnControlla")));
}

/**
 * Inserisce a schermo le domande che soddisfano il filtro
 * @param {*} filtro Stringa che deve comparire nel
 *                       testo della domanda per essere visualizzata (default null)
 */
function inserisciDomande(filtro = null){
    let div = document.getElementById("divDomande");
    div.innerHTML="";//Cancello le domande precedenti
    console.log(filtro);
    for(let j in domande){
        if(filtro == null || domande[j].testo.toLowerCase().includes(filtro.toLowerCase())){
            let domanda = document.createElement("div");
            domanda.innerHTML = domande[j].testo;
            for(let i in domande[j].risp){
                let radio = document.createElement("div");
                radio.innerHTML = `
                    <input type='radio' value='${domande[j].risp[i].cod}' name='${domande[j].n}' />
                    ${domande[j].risp[i].desc}<br>
                    `;
                domanda.appendChild(radio);
            }
            div.appendChild(domanda);
        }
    }
}

function controlla(){
    console.log(this);
    risultati = [];
    let risposte = document.querySelectorAll("input:checked");
    if(risposte.length == domande.length){
        let contErrate = 0;
        for(let risposta of risposte){
            let prova = domande[risposta.name].risp[risposta.value];
            if(!domande[risposta.name].risp[risposta.value].corretta){
                contErrate++;
            }
            risultati.push({
                nDomanda:risposta.name,
                nRisposta:risposta.value
            });
        }
        alert("Hai sbagliato "+ contErrate+" risposte");

    }else{
        alert("Attenzione, non hai risposto a tutte le domande!");
    }
    console.log(risultati);
    console.log(JSON.stringify(risultati));
    let a = document.createElement("a");
    a.setAttribute("download", "risultati.json");
    a.href = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(risultati));
    a.click();

    /*
    METODO 2
    //Incapsula un file/oggetto/stringa per poterla gestire in maniera più semplice
    let blob = new Blob([JSON.stringify(risultati)], { type: 'application/json' });
    let url = URL.createObjectURL(blob); 
    let a = document.createElement('a');
    a.href = url;
    a.download = "risultati.json";
    a.click();
    */


    //CONTATTO IL SERVER E MANDO LE RISPOSTE
    let promise = fetch(indirizzo + "risposte.php",
        { 
            method:'POST',
            body: JSON.stringify(risultati)            
    });

    promise.then(async function(risp){
        let json = await risp.json();
        alert(json.desc);
    });
}

function premuto(evento){//onkeydown
    //onkeyDown -> premo un tasto
    //richiamo la funzione che intercetta l'evento onkeydown

    //aggiorna input type text

    //onkeyUp
    //richiamo la funzione che intercetta l'evento onkeyup

    console.log(evento);
    console.log("onkeydown: " +evento.target.value);
}

function rilasciato(evento){//onkeyup -> txt già aggiornata
    console.log(evento);
    console.log("onkeyup: " +evento.target.value);

    //Leggiamo ciò che è stato scritto nella txt
    let filtro = evento.target.value;

    //Filtro le domande secondo quanto ho letto
    inserisciDomande(filtro);
    
}


