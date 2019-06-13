# Info
Primo progetto di Interactive 3D Graphics

Antonio M. Scielzo

## Generale

Il file GrandeContenitore.html è il file principale, in cui è definito il canvas e in cui sono chiamate le librerie e i files js usati (descritti nel seguito). All'apertura viene avviata una sequenza animata di alcuni secondi.

Il file video.mkv contiene una registrazione di tale sequenza. Siccome tale registrazione non è di buona qualità, è preferibile usare il file html.

## Cartelle
- `lib` contiene le librerie esterne
- `sounds` contiene i files audio

## Files js

- `Start.js` contiene le funzioni Start(), che inizializza la scena, e Update(), che aggiorna l'immagine sul canvas con un ciclo `for` sull'elenco degli eventi costruito in Eventi.js
- `Eventi.js` contiene l'elenco degli eventi, costruiti come oggetti con alcune proprietà e almeno due funzioni, che vengono chiamate da Update():
	- `eseguibile() : Boolean`, che restituisce vero se e solo se l’evento deve avvenire
	- `esegui()`, che contiene l’evento vero e proprio
- `Suoni.js` carica gli oggetti audio riprodotti durante la sequenza animata
- `Assemblaggio.js` contiene la funzione di assemblaggio, gli oggetti della scena costruiti con tale funzione e gli elementi di testo. La funzione di assemblaggio prende come argomenti una mappa 3D di interi, un array di cubi e un Objecct3D. La funzione piazza il cubo array[n] in posizione (i,j,k) se il valore della mappa in (i,j,k) è n+1, non piazza nulla se tale valore è nullo. I cubi piazzati sono aggiunti nell’Object3D passato come argomento
- `Mappe.js` contiene le mappe 3D usate dalla funzione di assemblaggio

