<?php
    //Prelevare i dati mandati dal client
    //IN FORMATO JSON
    $json = file_get_contents('php://input');

    //Prendere la data di oggi
    $data = date('Y-m-d');

    //Creavo un file con le rispsote dentro
    $fp = fopen("files/".$data."_risposte.json", "w");
    fwrite($fp, $json);
    fclose($fp);

    //Definisco la risposta
    $risp =  new stdClass();
    $risp->cod = 0;
    $risp->desc = "Salvataggio dei dati su file avvenuto con successo";

    //Ritorno una risposta al client
    echo json_encode($risp);