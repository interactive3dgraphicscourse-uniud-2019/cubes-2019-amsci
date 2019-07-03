//mesh di base
var cube_geo = new THREE.BoxGeometry(1,1,1);
var cube_mat = new THREE.MeshPhongMaterial();
var cube = new THREE.Mesh( cube_geo, cube_mat );
cube.castShadow = true;
cube.receiveShadow = true;

//var nos_cube_mat = new THREE.MeshBasicMaterial();
var nos_cube = new THREE.Mesh( cube_geo, cube_mat );

var basic_cube_mat = new THREE.MeshBasicMaterial();
var basic_cube = new THREE.Mesh( cube_geo, basic_cube_mat );


//colori
var white = new THREE.Color("hsl(0, 100%, 100%)");
var light_brown = new THREE.Color("hsl(40, 83%, 60%)");
var light_light_brown = new THREE.Color("hsl(39, 83%, 74%)");
var grey = new THREE.Color("hsl(60, 60%, 40%)");
var dark_brown = new THREE.Color("hsl(40, 93%, 40%)");
var dark_dark_brown = new THREE.Color("hsl(40, 93%, 25%)");
var black = new THREE.Color("hsl(0, 100%, 0%)");
var dark_red = new THREE.Color("hsl(0, 100%, 20%)");
var green = new THREE.Color("hsl(90, 100%, 20%)");
var green_bis = new THREE.Color("hsl(90, 100%, 25%)");
var green_ter = new THREE.Color("hsl(90, 100%, 30%)");
var orange = new THREE.Color("hsl(15, 50%, 42%)");

//funzione che clona il cubo di base con il suo materiale e lo colora
function CreaCuboColorato(cube, colour){
    var coloured_cube = cube.clone();
    coloured_cube.traverse((node) => { //per clonare anche il materiale
        if (node.isMesh) {
          node.material = node.material.clone();
        }
    });
    coloured_cube.material.color.set(colour);
    return coloured_cube;
}

//funzione di assemblaggio
function Assembla(map, obj, group){
	for(i=0; i<map.length; i++){
		for(j=0; j<map[i].length; j++){
			for(k=0; k<map[i][j].length; k++){
                if(map[i][j][k]!=0){
                    var obj2 = obj[map[i][j][k]-1].clone();
                    obj2.position.set(j,i,k);
                    group.add(obj2);
                }
            }
		}
	}
	return group;
}

//nuvola
var nuvola = new THREE.Object3D();
nuvola = Assembla(nuvola_map, [CreaCuboColorato(nos_cube, white)], nuvola);
nuvola.position.set(15,48,8);
nuvola.scale.multiplyScalar(4);

//chiocciola
var chiocciola = new THREE.Object3D();
var corpo = new THREE.Object3D();
var occhi = new THREE.Object3D();
var guscio = new THREE.Object3D();
var bocca = new THREE.Object3D();
var asse_chiocciola = new THREE.Vector3(0,0,1); // direzioni relative per muovere occhi e guscio

corpo = Assembla(corpo_map, [CreaCuboColorato(cube, light_brown)], corpo);
guscio = Assembla(guscio_map, [
    CreaCuboColorato(cube, dark_brown), 
    CreaCuboColorato(cube, dark_dark_brown)], guscio);
guscio.position.set(0,1,1);
var pos_guscio = new THREE.Vector3(0,1,1); // posizione di riferimento per guscio

var occhio1 = CreaCuboColorato(cube,white);
    occhio1.scale.multiplyScalar(1.2);
    occhio1.position.x=-1;
var pupilla1 = CreaCuboColorato(cube,black);
    pupilla1.castShadow = false;
    pupilla1.receiveShadow = false;
    pupilla1.scale.multiplyScalar(.5);
    pupilla1.position.set(-1,0,.4);
var occhio2 = occhio1.clone();
    occhio2.position.x=1;
var pupilla2 = pupilla1.clone();
    pupilla2.position.set(1,0,.4);
occhi.add(occhio1,occhio2,pupilla1,pupilla2);
occhi.position.set(1,1.5,6);
var pos_occhi = new THREE.Vector3(1,1.5,6); // posizione di riferimento per occhi

bocca = Assembla(bocca_map, [CreaCuboColorato(nos_cube,dark_red)], bocca);
bocca.scale.multiplyScalar(.1);
bocca.rotation.y = Math.PI/2;
bocca.position.set(.3,.2,6.5);

chiocciola.add(guscio, occhi, bocca, asse_chiocciola);

// chiocciola 2
var chiocciola2 = chiocciola.clone();
var corpo2 = new THREE.Object3D();
corpo2 = Assembla(corpo_map, [CreaCuboColorato(cube, light_light_brown)], corpo2);
chiocciola2.add(corpo2);
chiocciola.add(corpo);


// siepe
var siepe = new THREE.Object3D();
siepe = Assembla(siepe_map, [
    CreaCuboColorato(nos_cube,green),
    CreaCuboColorato(nos_cube,green_bis),
    CreaCuboColorato(nos_cube,green_ter)
], siepe);
siepe.position.set(-14,2,-40);
siepe.scale.multiplyScalar(4);
console.log(siepe);

//muro
var muro = new THREE.Object3D();
muro = Assembla([[[1],[1]]], [CreaCuboColorato(cube,orange)], muro);
muro.scale.multiplyScalar(30);
muro.scale.x *=2;
muro.position.set(6,15,45);


//titolo
var titolo = document.createElement('div');
titolo.style.position = 'absolute';
titolo.style.width = '100%';
titolo.style.height = '100%';
titolo.style.display = 'flex';
titolo.style.alignItems = 'center';
titolo.style.justifyContent = 'center';
titolo.style.backgroundColor = "black";
titolo.style.color = "white";
titolo.style.fontSize = 70 + 'px';
titolo.innerHTML = "La grande scalata";

//scritta_finale
var scritta_f = document.createElement('div');
scritta_f.style.position = 'absolute';
scritta_f.style.width = '100%';
scritta_f.style.height = '100%';
scritta_f.style.display = 'flex';
scritta_f.style.alignItems = 'center';
scritta_f.style.justifyContent = 'center';
scritta_f.style.backgroundColor = "black";
scritta_f.style.color = "white";
scritta_f.style.fontSize = 70 + 'px';
scritta_f.innerHTML = "Fine";


