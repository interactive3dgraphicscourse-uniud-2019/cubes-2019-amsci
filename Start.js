
var scene, camera, renderer, capturer;
var aspectRatio = 16/9;

function Start() {
    scene = new THREE.Scene();
    blank_scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera( 70, aspectRatio, 0.1, 500 );
    camera.add( listener );

    renderer = new THREE.WebGLRenderer( {antialias: true} );
    if((width = window.innerHeight*aspectRatio)<=window.innerWidth){
        renderer.setSize( width, window.innerHeight);
    } else renderer.setSize(window.innerWidth,window.innerWidth/aspectRatio);
    renderer.setClearColor("hsl(204, 100%, 60%)");
    renderer.setPixelRatio( window.devicePixelRatio );
    renderer.shadowMap.enabled = true;
    document.body.appendChild( renderer.domElement );
    
    camera.position.set(14,5,0);
    var camera_target = new THREE.Vector3(0,0,-10);
    camera.lookAt(camera_target); // non funziona
    
    scene.add(nuvola, chiocciola, siepe, muro, chiocciola2);

    hemiLight = new THREE.HemisphereLight( 0xffffff, 0xffffff, .7 );
    //hemiLight.color.setHSL( 0.6, 1, 0.6 );
    hemiLight.groundColor.setHSL( 0.095, 1, .75);
    hemiLight.position.set( 0, 500, 0 );
    scene.add( hemiLight );

    dirLight = new THREE.DirectionalLight( 0xffffff,.5 );
    dirLight.color.setHSL( 0.1, 1, 0.95 );
    dirLight.position.set(-10,70,40);
    dirLight.target.position.set(10,10,20);
    scene.add( dirLight , dirLight.target);
    dirLight.castShadow = true;
    dirLight.shadow.mapSize.width = 1024
    dirLight.shadow.mapSize.height = 1024;
    dirLight.shadow.camera.left = -30;
    dirLight.shadow.camera.bottom = -30;
    dirLight.shadow.camera.right = 30;
    dirLight.shadow.camera.top = 30;


    // GROUND
    var groundGeo = new THREE.PlaneBufferGeometry( 10000, 10000 );
    var groundMat = new THREE.MeshPhongMaterial( { color: 0xffffff, specular: 0x050505 } );
    groundMat.color.set(green_ter);
    var ground = new THREE.Mesh(groundGeo, groundMat);
    ground.position.y = 0;
    ground.rotation.x = -Math.PI/2;
    scene.add( ground );
    ground.receiveShadow = true;

    capturer = new CCapture( {
        format: 'png',
        framerate: 24
    } ); // per catturare i fotogrammi
}

document.addEventListener('keydown', ReadInput);
function ReadInput(input){
    if(input.key == " "){
        capturer.start();
    }
    if(input.key == "Enter"){
        capturer.stop();
        capturer.save();
    }
    if(input.key == "s"){
        cancelAnimationFrame( ID_animazione );
    }
}

var time, inizio=Date.now();
var ID_animazione = null;

function Update() {
    ID_animazione = requestAnimationFrame( Update );
    time = Date.now() - inizio;
    for(var i=0; i<eventi.length; i++){
        if(eventi[i].eseguibile()) eventi[i].esegui();
    }
}

Start();
Update();
