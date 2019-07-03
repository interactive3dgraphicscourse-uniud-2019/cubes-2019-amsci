var listener = new THREE.AudioListener();
var audioLoader = new THREE.AudioLoader();


s_camminata = new THREE.Audio( listener );
audioLoader.load( 'sounds/camminata.mp3', function( buffer ) {
    s_camminata.setBuffer( buffer );
    s_camminata.setLoop( true );
    s_camminata.setVolume( 0.5 );
});

s_camminata2 = new THREE.Audio( listener );
audioLoader.load( 'sounds/camminata2.mp3', function( buffer ) {
    s_camminata2.setBuffer( buffer );
    s_camminata2.setLoop( false );
    s_camminata2.setVolume( 0.5 );
});

s_camminata_f = new THREE.Audio( listener );
audioLoader.load( 'sounds/camminata.mp3', function( buffer ) {
    s_camminata_f.setBuffer( buffer );
    s_camminata_f.setLoop( false );
    s_camminata_f.setVolume( 0.5 );
});

s_sforzo1 = new THREE.Audio( listener );
audioLoader.load( 'sounds/sforzo.mp3', function( buffer ) {
    s_sforzo1.setBuffer( buffer );
    s_sforzo1.setLoop( false );
    s_sforzo1.setVolume( 0.5 );
});

s_striscia = new THREE.Audio( listener );
audioLoader.load( 'sounds/striscia.mp3', function( buffer ) {
    s_striscia.setBuffer( buffer );
    s_striscia.setLoop( true );
    s_striscia.setVolume( 0.1 );
    s_striscia.setPlaybackRate( 1.5 );
});

s_whoah = new THREE.Audio( listener );
audioLoader.load( 'sounds/whoah.mp3', function( buffer ) {
    s_whoah.setBuffer( buffer );
    s_whoah.setLoop( false );
    s_whoah.setVolume( 0.3 );
    s_whoah.setPlaybackRate( .9 );
});

s_wow = new THREE.Audio( listener );
audioLoader.load( 'sounds/wow.mp3', function( buffer ) {
    s_wow.setBuffer( buffer );
    s_wow.setLoop( false );
    s_wow.setVolume( 0.5 );
    s_wow.setPlaybackRate( .9 );
});

s_sospiro = new THREE.Audio( listener );
audioLoader.load( 'sounds/sospiro.mp3', function( buffer ) {
    s_sospiro.setBuffer( buffer );
    s_sospiro.setLoop( false );
    s_sospiro.setVolume( 0.4 );
    s_sospiro.setPlaybackRate( .8 );
});

s_marcia_musicale = new THREE.Audio( listener );
audioLoader.load( 'sounds/marcia_musicale.mp3', function( buffer ) {
    s_marcia_musicale.setBuffer( buffer );
    s_marcia_musicale.setLoop( true );
    s_marcia_musicale.setVolume( 0.3 );
    s_marcia_musicale.setPlaybackRate( .8 );
});

s_ohoh = new THREE.Audio( listener );
audioLoader.load( 'sounds/ohoh.mp3', function( buffer ) {
    s_ohoh.setBuffer( buffer );
    s_ohoh.setLoop( false );
    s_ohoh.setVolume( 0.5 );
});

s_fallimento = new THREE.Audio( listener );
audioLoader.load( 'sounds/fallimento.mp3', function( buffer ) {
    s_fallimento.setBuffer( buffer );
    s_fallimento.setLoop( false );
    s_fallimento.setVolume( 0.2 );
    s_fallimento.setPlaybackRate( 1.1 );
});

s_fallimento2 = new THREE.Audio( listener );
audioLoader.load( 'sounds/fallimento2.mp3', function( buffer ) {
    s_fallimento2.setBuffer( buffer );
    s_fallimento2.setLoop( false );
    s_fallimento2.setVolume( 0.2 );
});

s_sforzo = new THREE.Audio( listener );
audioLoader.load( 'sounds/sforzo.mp3', function( buffer ) {
    s_sforzo.setBuffer( buffer );
    s_sforzo.setLoop( true );
    s_sforzo.setVolume( 0.5 );
});

var suoni = [];
suoni.push(
    s_camminata,
    s_camminata2,
    s_sforzo1,
    s_striscia,
    s_whoah,
    s_wow,
    s_sospiro,
    s_marcia_musicale,
    s_ohoh,
    s_fallimento,
    s_fallimento2,
    s_sforzo,
    s_camminata_f
)
