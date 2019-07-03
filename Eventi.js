/*
TODO:
- Alcuni oggetti sono quasi identici. Fai una funzione di clonazione
*/

function Oscilla(obj, dir, ref_pos, A, omega, time){
    var displacement = dir.clone();
    displacement.multiplyScalar(A*Math.sin(omega*time));
    var newposition = ref_pos.clone();
    newposition.add(displacement);
    obj.position.copy(newposition);
}

// function Trasla(obj, dir, ref_pos, speed, time){
//     var displacement = dir.clone();
//     displacement.multiplyScalar(speed*time);
//     var newposition = ref_pos.clone();
//     newposition.add(displacement);
//     obj.position.copy(newposition);
// }

function Lin_Tween(target, inizio, fine, s){ // lerp
    target.copy(inizio).multiplyScalar(1-s).add(fine.clone().multiplyScalar(s));
}

function Cos_Tween(target, inizio, fine, t){ // funzione di tween con parametro (1-cos(πt))/2
    var s = .5-Math.cos(Math.PI*t)/2.;
    Lin_Tween(target, inizio, fine, s)
}

function Pow_Tween(potenza, target, inizio, fine, t){ // funzione di tween con parametro t^potenza
    var s = Math.pow(t,potenza);
    Lin_Tween(target, inizio, fine, s)
}

var v3_ausiliario = new THREE.Vector3();
var m4_ausiliario = new THREE.Matrix4();
var e1 = new THREE.Vector3(1,0,0);
var e2 = new THREE.Vector3(0,1,0);
var e3 = new THREE.Vector3(0,0,1);

////////////////////////////

var eventi = []; //questa è la lista degli eventi della sequenza animata

titoli_i = {
    durata: 4000,
    avvenuto: false,
    riposizionamento: true,
    eseguibile(){
        if(this.avvenuto) return false;
        return true;
    },
    esegui(){
        if(this.riposizionamento){
            this.riposizionamento = false;
            renderer.setClearColor("hsl(204, 100%, 0%)"); 
            renderer.render(blank_scene, camera);
            document.body.appendChild(titolo);
        }
        if(time >= this.durata) {
            this.avvenuto = true;
            renderer.setClearColor("hsl(204, 100%, 60%)");
            renderer.render(scene, camera);

            camera.position.set(14,5,0);
            var camera_target = new THREE.Vector3(0,0,-10);
            camera.lookAt(camera_target);
            chiocciola.position.set(8,.5,-10);
            chiocciola2.position.set(100,.5,-10);


            avanzata_iniziale.avviato = true;
            avanzata_iniziale.inizio = time;
            avanzata_iniziale.posizione_i.copy(chiocciola.position);
            avanzata_iniziale.posizione_f.copy(chiocciola.position);
            avanzata_iniziale.posizione_f.z = 13.3;
            avanzata_iniziale.rel_camera.copy(camera.position);
            avanzata_iniziale.rel_camera.sub(chiocciola.position);
            document.body.removeChild(titolo);
            s_camminata.play();
        }
    }
}
eventi.push(titoli_i);

avanzata_iniziale = {
    avviato: false,
    avvenuto: false,
    inizio: -1,
    durata: 8500,
    posizione_i: new THREE.Vector3(),
    posizione_f: new THREE.Vector3(),
    rel_camera: new THREE.Vector3(), //posizione della camera relativamente alla chiocciola
    esegui() {
        var t = time- this.inizio;
        var s = t/this.durata;
        Cos_Tween(chiocciola.position, this.posizione_i, this.posizione_f, s);
        Oscilla(occhi, asse_chiocciola, pos_occhi, .1, .003, time);
        Oscilla(guscio, asse_chiocciola, pos_guscio, .3, .003, time);
        camera.position.copy(chiocciola.position)
        camera.position.add(this.rel_camera);
        renderer.render(scene, camera);
        if(s>=1){
            this.avvenuto = true;
            alza_sguardo.avviato = true;
            alza_sguardo.inizio = time;
            alza_sguardo.quaternion_i.copy(occhi.quaternion);
            s_camminata.stop();
        }
    },
    eseguibile(){
        if(this.avvenuto) return false;
        if(this.avviato) return true;
        return false;
    }
}
eventi.push(avanzata_iniziale);

alza_sguardo = {
    inizio: -1,
    durata: 2500,
    ritardo:1000,
    avviato: false,
    avvenuto: false,
    quaternion_i: new THREE.Quaternion(),
    quaternion_f: new THREE.Quaternion().setFromAxisAngle( new THREE.Vector3(1,0,0), -Math.PI/3 ),
    // s_wow_flag: true,
    esegui() {
        var s = (time-this.inizio-this.ritardo)/this.durata;
        var p = .5-Math.cos(Math.PI*s)/2.;//parametro di cos_tween
        THREE.Quaternion.slerp( this.quaternion_i, this.quaternion_f, occhi.quaternion, p );
        occhi.position.y += .002;
        renderer.render(scene, camera);
        // if(s>.2 && this.s_wow_flag){
        //     this.s_wow_flag = false;
        //     s_wow.play();
        // }
        if(s>=1) {
            this.avvenuto = true;
            camera_guarda_su.avviato = true;
            camera_guarda_su.inizio = time;
            camera_guarda_su.rotazione_i.copy(camera.rotation);
            camera_guarda_su.posizione_i.copy(camera.position);
            camera_guarda_su.posizione_f.copy(camera.position);
            camera_guarda_su.posizione_f.x -= 6;
            s_wow.play();
        }
    },
    eseguibile(){
        if(this.avvenuto) return false;
        if(this.avviato && this.inizio+this.ritardo < time) return true; //avvio ritardato
        return false;
    }
}
eventi.push(alza_sguardo);

camera_guarda_su = {
    inizio: -1,
    durata: 2500,
    ritardo: 1000,
    avviato: false,
    avvenuto: false,
    // quaternion_i: new THREE.Quaternion(),
    // quaternion_f: new THREE.Quaternion()
    //     .setFromAxisAngle( new THREE.Vector3(0,1,0), Math.PI )
    //     .premultiply(new THREE.Quaternion().setFromAxisAngle( new THREE.Vector3(1,0,0), -Math.PI/3 )),
    rotazione_i: new THREE.Vector3(),
    rotazione_f: new THREE.Vector3(-1.5,3.1,0),
    posizione_i: new THREE.Vector3(),
    posizione_f: new THREE.Vector3(),
    eseguibile(){
        if(this.avvenuto) return false;
        if(this.avviato && this.inizio+this.ritardo<time) { //avvio ritardato
            return true;
        }
        return false;
    },
    esegui(){
        var s = ( time - this.inizio - 1000) / this.durata;
        var p = .5-Math.cos(Math.PI*s)/2.; //parametro di cos_tween
        camera.rotation.y = (1-p)*this.rotazione_i.y + p*this.rotazione_f.y;
        camera.rotation.x = (1-p)*this.rotazione_i.x + p*this.rotazione_f.x;
        camera.position.x = (1-p)*this.posizione_i.x + p*this.posizione_f.x;
        renderer.render(scene, camera);
        if(s>=1) {
            this.avvenuto = true;
            riposizionamento_1.avviato = true;
            riposizionamento_1.inizio = time;
        }
    }
}
eventi.push(camera_guarda_su);

// /////////////////////////
// comincia_ora = {
//     avvenuto: false,
//     eseguibile(){
//         if(this.avvenuto) return false;
//         return true;
//     },
//     esegui(){
//         riposizionamento_1.avviato = true;
//         riposizionamento_1.inizio = time;
//         this.avvenuto = true;
//     }
    
// }
// eventi.push(comincia_ora);
// /////////////////////////

riposizionamento_1 = {
    inizio: -1,
    ritardo: 500,
    avviato: false,
    avvenuto: false,
    eseguibile(){
        if(this.avvenuto) return false;
        if(this.avviato && this.inizio+this.ritardo<time) { //avvio ritardato
            return true;
        }
        return false;
    },
    esegui(){
        occhi.rotation.x = 0;
        occhi.position.copy(pos_occhi);
        chiocciola.rotation.x = -Math.PI/2;  
        chiocciola.position.set(7,16,29.5);
        camera.position.set(7,23,21);
        camera.lookAt(chiocciola.position.clone().add(new THREE.Vector3(1.8,3.5,0)));
        renderer.setClearColor("hsl(204, 100%, 0%)"); 
        renderer.render(blank_scene, camera);
        this.avvenuto = true;
        pausa_1.inizio = time;
    }
}
eventi.push(riposizionamento_1);

pausa_1 = {
    inizio: -1,
    durata: 700,
    avvenuto: false,
    eseguibile(){
        if(this.avvenuto) return false;
        if(this.inizio>0) return true;
        return false;
    },
    esegui(){
        if(time-this.inizio>= this.durata) {
            this.avvenuto = true;
            renderer.setClearColor("hsl(204, 100%, 60%)");
            renderer.render(scene, camera);
            scalata.avviato = true;
            scalata.inizio = time;
            //scalata.durata = 2000 + allontana_camera.durata - 1000 + sali_1.durata + scivola_1.durata + sali_2.durata + scivola_2.durata/2.;
            s_camminata2.play();
        }
    }
}
eventi.push(pausa_1);

scalata = {
    avviato: false,
    avvenuto: false,
    inizio: -1,
    eseguibile(){
        if(this.avvenuto) return false;
        if(this.avviato) return true;
        return false;
    },
    esegui() {
        Oscilla(occhi, asse_chiocciola, pos_occhi, .1, .003, time);
        Oscilla(guscio, asse_chiocciola, pos_guscio, .3, .003, time);
        renderer.render(scene, camera);
        if(time-this.inizio >= 2000 && allontana_camera.avviato == false) {
            allontana_camera.avviato = true;
            allontana_camera.inizio = time;
            var vett_allont = new THREE.Vector3();
            camera.getWorldDirection(vett_allont);
            vett_allont.add(e1.clone().multiplyScalar(2.)).normalize().multiplyScalar(8);
            allontana_camera.posizione_i.copy(camera.position);
            allontana_camera.posizione_f.copy(
                allontana_camera.posizione_i.clone().sub(vett_allont)
            );
        }
        if(time-this.inizio >= 3000 && sali_1.avviato == false) {
            sali_1.avviato = true;
            sali_1.inizio = time;
            sali_1.posizione_i.copy(chiocciola.position);
            sali_1.posizione_f.copy(chiocciola.position.clone().add(e2.clone().multiplyScalar(3)));
        }
    }
}
eventi.push(scalata);

allontana_camera = {
    avviato: false,
    avvenuto: false,
    inizio: -1,
    velocita: .002,
    durata: 5000,
    posizione_i: new THREE.Vector3(),
    posizione_f: new THREE.Vector3(),
    eseguibile(){
        if(this.avvenuto) return false;
        if(this.avviato) return true;
        return false;
    },
    esegui(){
        var t = time - this.inizio;
        Cos_Tween(camera.position, this.posizione_i, this.posizione_f, t/this.durata);
        renderer.render(scene, camera);
        if(t >= this.durata) {
            this.avvenuto = true;
            // sali_1.avviato = true;
            // sali_1.inizio = time;
            // sali_1.posizione_i.copy(chiocciola.position);
            // sali_1.posizione_f.copy(chiocciola.position.clone().add(e2.clone().multiplyScalar(3)));
            s_camminata2.stop();
            s_sforzo1.play();
        }
    }
}
eventi.push(allontana_camera);

sali_1 = {
    avviato: false,
    avvenuto: false,
    inizio: -1,
    durata: 5000,
    posizione_i: new THREE.Vector3(),
    posizione_f: new THREE.Vector3(),
    s_sforzo1_flag: true,
    eseguibile(){
        if(this.avvenuto) return false;
        if(this.avviato) return true;
        return false;
    },
    esegui(){
        var t = time - this.inizio;
        Cos_Tween(chiocciola.position, this.posizione_i, this.posizione_f, t/this.durata);
        renderer.render(scene, camera);
        // if(this.durata - t < 1000 && this.s_sforzo1_flag){
        //     s_sforzo1.play();
        //     this.s_sforzo1_flag = false;
        // }
        if(t >= this.durata) {
            this.avvenuto = true;
            scivola_2.avviato = true;
            scivola_2.inizio = time;
            scivola_2.posizione_i.copy(chiocciola.position);
            scivola_2.posizione_f.copy(chiocciola.position);
            scivola_2.posizione_f.y -= 20;
        }
    }
}
eventi.push(sali_1);

// scivola_1 = {
//     avviato: false,
//     avvenuto: false,
//     inizio: -1,
//     durata: 3000,
//     posizione_i: new THREE.Vector3(),
//     posizione_f: new THREE.Vector3(),
//     eseguibile(){
//         if(this.avvenuto) return false;
//         if(this.avviato) return true;
//         return false;
//     },
//     esegui(){
//         var t = time - this.inizio;
//         Cos_Tween(chiocciola.position, this.posizione_i, this.posizione_f, t/this.durata);
//         renderer.render(scene, camera);
//         if(t >= this.durata) {
//             this.avvenuto = true;
//             sali_2.avviato = true;
//             sali_2.inizio = time;
//             sali_2.posizione_i.copy(chiocciola.position);
//             sali_2.posizione_f.copy(
//                 chiocciola.position.clone().add(e2.clone().multiplyScalar(3))
//             );
//         }
//     }
// }
// eventi.push(scivola_1);

// sali_2 = {
//     avviato: false,
//     avvenuto: false,
//     inizio: -1,
//     durata: 3000,
//     posizione_i: new THREE.Vector3(),
//     posizione_f: new THREE.Vector3(),
//     eseguibile(){
//         if(this.avvenuto) return false;
//         if(this.avviato) return true;
//         return false;
//     },
//     esegui(){
//         var t = time - this.inizio;
//         Cos_Tween(chiocciola.position, this.posizione_i, this.posizione_f, t/this.durata);
//         renderer.render(scene, camera);
//         if(t >= this.durata) {
//             this.avvenuto = true;
//             scivola_2.avviato = true;
//             scivola_2.inizio = time;
//             scivola_2.posizione_i.copy(chiocciola.position);
//             scivola_2.posizione_f.copy(chiocciola.position.clone().sub(e2.clone().multiplyScalar(15)));
//         }
//     }
// }
// eventi.push(sali_2);

scivola_2 = {
    avviato: false,
    avvenuto: false,
    inizio: -1,
    durata: 4000,
    posizione_i: new THREE.Vector3(),
    posizione_f: new THREE.Vector3(),
    s_fallimento2_flag: true,
    eseguibile(){
        if(this.avvenuto) return false;
        if(this.avviato) return true;
        return false;
    },
    esegui(){
        var t = time - this.inizio;
        Pow_Tween(2, chiocciola.position, this.posizione_i, this.posizione_f, t/this.durata);
        renderer.render(scene, camera);
        if(t>1000 && this.s_fallimento2_flag){
            s_fallimento2.play();
            this.s_fallimento2_flag = false;
        } 
        if(t >= this.durata) {
            this.avvenuto = true;
            riposizionamento_2.avviato = true;
            scalata.avvenuto = true;
        }
    }
}
eventi.push(scivola_2);

riposizionamento_2 = {
    avviato: false,
    avvenuto: false,
    eseguibile(){
        if(this.avvenuto) return false;
        if(this.avviato) return true;
        return false;
    },
    esegui(){
        occhi.rotation.x = .1;
        chiocciola.rotation.x = -Math.PI/2;
        chiocciola.position.set(7,21,29.5);
        sforzo_1.posizione_f.copy(chiocciola.position);
        camera.position.set(16,26,27);
        camera.lookAt(chiocciola.position.clone().add(e2.clone().multiplyScalar(4.)));
        chiocciola.position.set(7,17,29.5);
        //camera.lookAt(chiocciola.position);
        renderer.setClearColor("hsl(204, 100%, 0%)"); 
        renderer.render(blank_scene, camera);
        this.avvenuto = true;
        pausa_2.inizio = time;
        sforzo_1.posizione_i.copy(chiocciola.position);
    }
}
eventi.push(riposizionamento_2);

pausa_2 = {
    inizio: -1,
    durata: 2000,
    avvenuto: false,
    eseguibile(){
        if(this.avvenuto) return false;
        if(this.inizio>0) return true;
        return false;
    },
    esegui(){
        if(time-this.inizio>= this.durata) {
            this.avvenuto = true;
            renderer.setClearColor("hsl(204, 100%, 60%)");
            renderer.render(scene, camera);
            sforzo_1.avviato = true;
            sforzo_1.inizio = time;
            s_marcia_musicale.play();
        }
    }
}
eventi.push(pausa_2);

var pos_occhi_sforzo = pos_occhi.clone().add(asse_chiocciola.clone().multiplyScalar(.8));
var pos_guscio_sforzo = pos_guscio.clone().add(asse_chiocciola.clone().multiplyScalar(.8));
var periodo_oscil_q = 524; //un quarto del periodo d'oscillazione
var numero_oscil_q = 13; //numero di quarti d'oscillazione
sforzo_1 = {
    inizio: -1,
    durata: periodo_oscil_q*numero_oscil_q,
    avviato: false,
    avvenuto: false,
    posizione_i: new THREE.Vector3(),
    posizione_f: new THREE.Vector3(),
    eseguibile(){
        if(this.avvenuto) return false;
        if(this.avviato) return true;
        return false;
    },
    esegui(){
        var t = time - this.inizio;
        var s = t / (periodo_oscil_q*numero_oscil_q-1);
        if(s<=1){ //nell'ultimo quarto di periodo (dell'oscillazione) il corpo non avanza più
            Cos_Tween(chiocciola.position, this.posizione_i, this.posizione_f, s);
        }
        Oscilla(occhi, asse_chiocciola, pos_occhi_sforzo, .25, Math.PI/(2.*periodo_oscil_q), t);
        Oscilla(guscio, asse_chiocciola, pos_guscio_sforzo, .7, Math.PI/(2.*periodo_oscil_q), t);
        renderer.render(scene, camera);
        if(t >= this.durata){
            this.avvenuto = true;
            stallo.avviato = true;
            stallo.inizio = time;
            stallo.occhi_posizione_i.copy(occhi.position);
            stallo.guscio_posizione_i.copy(guscio.position);
            stallo.occhi_posizione_f.copy(occhi.position);
            stallo.guscio_posizione_f.copy(guscio.position);
            stallo.occhi_posizione_f.z += .2; //ricorda come sono orientate gli oggetti all'interno dell'oggetto chiocciola
            stallo.guscio_posizione_f.z += .2;
            s_marcia_musicale.stop();
            s_ohoh.play();
        }
    }
}
eventi.push(sforzo_1);

stallo = {
    inizio: -1,
    durata: 100,
    avviato: false,
    avvenuto: false,
    occhi_posizione_i: new THREE.Vector3(),
    guscio_posizione_i: new THREE.Vector3(),
    occhi_posizione_f: new THREE.Vector3(),
    guscio_posizione_f: new THREE.Vector3(),
    eseguibile(){
        if(this.avvenuto) return false;
        if(this.avviato) return true;
        return false;
    },
    esegui(){
        // var t = time - this.inizio;
        // Oscilla(occhi, asse_chiocciola, pos_occhi_sforzo, .2, .003, t);
        // Oscilla(guscio, asse_chiocciola, pos_guscio_sforzo, .6, .003, t);
        // var s = t/this.durata;
        // Cos_Tween(occhi.position, this.occhi_posizione_i, this.occhi_posizione_f, s);
        // Cos_Tween(guscio.position, this.guscio_posizione_i, this.guscio_posizione_f, s);
        renderer.render(scene, camera);
        if(time - this.inizio >= this.durata){
            this.avvenuto = true;
            scivola_3.avviato = true;
            scivola_3.inizio = time;
            scivola_3.posizione_i.copy(chiocciola.position);
            scivola_3.posizione_f.copy(chiocciola.position.clone().sub(e2.clone().multiplyScalar(12.)));
            scivola_3.occhi_posizione_i.copy(occhi.position);
            scivola_3.guscio_posizione_i.copy(guscio.position);
        }
    }
}
eventi.push(stallo);

scivola_3 = {
    inizio: -1,
    durata: 4000,
    avviato: false,
    avvenuto: false,
    posizione_i: new THREE.Vector3(),
    posizione_f: new THREE.Vector3(),
    occhi_posizione_i: new THREE.Vector3(),
    guscio_posizione_i: new THREE.Vector3(),
    occhi_posizione_f: new THREE.Vector3().copy( pos_occhi.clone().multiplyScalar(2.).sub(pos_occhi_sforzo) ),
    guscio_posizione_f: new THREE.Vector3().copy( pos_guscio.clone().multiplyScalar(2.).sub(pos_guscio_sforzo) ),
    s_fallimento_flag: true,
    eseguibile(){
        if(this.avvenuto) return false;
        if(this.avviato) return true;
        return false;
    },
    esegui(){
        var t = time - this.inizio;
        Pow_Tween(5, chiocciola.position, this.posizione_i, this.posizione_f, t/this.durata);
        Cos_Tween(occhi.position, this.occhi_posizione_i, this.occhi_posizione_f, t/this.durata);
        Cos_Tween(guscio.position, this.guscio_posizione_i, this.guscio_posizione_f, t/this.durata);
        //Oscilla(occhi, asse_chiocciola, pos_occhi_sforzo, .2, .003, time);
        //Oscilla(guscio, asse_chiocciola, pos_guscio_sforzo, .6, .003, time);
        renderer.render(scene, camera);
        if(!s_ohoh.isPlaying && this.s_fallimento_flag){
            s_fallimento.play();
            this.s_fallimento_flag = false;
        }
        if(chiocciola.position.y < 8){
            this.avvenuto = true;
            sforzo_2.avviato = true;
            sforzo_2.inizio = time;
            sforzo_2.posizione_i.copy(chiocciola.position);
            sforzo_2.posizione_i.y = 5;
            sforzo_2.posizione_f.copy(chiocciola.position);
            sforzo_2.posizione_f.y = 23;
        }
    }
}
eventi.push(scivola_3);

sforzo_2 = {
    inizio: -1,
    durata: 9000,
    ritardo: 3000,
    avviato: false,
    avvenuto: false,
    posizione_i: new THREE.Vector3(),
    posizione_f: new THREE.Vector3(),
    s_sforzo_flag: true,
    eseguibile(){
        if(this.avvenuto) return false;
        if(this.avviato && this.inizio + this.ritardo < time){
            if(this.s_sforzo_flag){
                s_sforzo.play();
                this.s_sforzo_flag = false;
            }
            return true;
        }
        return false;
    },
    esegui(){
        var t = time - this.inizio;
        Lin_Tween(chiocciola.position, this.posizione_i, this.posizione_f, t/this.durata);
        Oscilla(occhi, asse_chiocciola, pos_occhi_sforzo, .1, .009, time);
        Oscilla(guscio, asse_chiocciola, pos_guscio_sforzo, .3, .009, time);
        renderer.render(scene, camera);
        if(t >= this.durata){
            this.avvenuto = true;
            riposizionamento_3.avviato = true;
            s_sforzo.stop();
        }
    }
}
eventi.push(sforzo_2);

riposizionamento_3 = {
    avviato: false,
    avvenuto: false,
    eseguibile(){
        if(this.avvenuto) return false;
        if(this.avviato) return true;
        return false;
    },
    esegui(){
        occhi.rotation.x = 0;
        chiocciola.rotation.x = 0;
        chiocciola.position.set(7,30.5,32); // [ref1]
        camera.position.set(12,32,45);
        chiocciola2.position.set(9,30.5,57);
        chiocciola2.rotation.y = Math.PI;
        camera.lookAt(chiocciola.position); // [ref1]
        renderer.setClearColor("hsl(204, 100%, 0%)"); 
        renderer.render(blank_scene, camera);
        this.avvenuto = true;
        pausa_3.inizio = time;
    }
}
eventi.push(riposizionamento_3);

pausa_3 = {
    inizio: -1,
    durata: 2000,
    avvenuto: false,
    eseguibile(){
        if(this.avvenuto) return false;
        if(this.inizio>0) return true;
        return false;
    },
    esegui(){
        if(time-this.inizio>= this.durata) {
            this.avvenuto = true;
            renderer.setClearColor("hsl(204, 100%, 60%)");
            renderer.render(scene, camera);
            avanzata_finale.avviato = true;
            avanzata_finale.inizio = time;
            avanzata_finale.posizione_i.copy(chiocciola.position);
            avanzata_finale.posizione_f.copy(chiocciola.position);
            avanzata_finale.posizione_f.z += 10;
            avanzata_finale.posizione_camera_i.copy(camera.position);
            avanzata_finale.posizione_camera_f.copy(camera.position);
            avanzata_finale.posizione_camera_f.z += 10; // [ref1]
            s_striscia.play();
        }
    }
}
eventi.push(pausa_3);

avanzata_finale = {
    avviato: false,
    avvenuto: false,
    inizio: -1,
    durata: 13000,
    posizione_i: new THREE.Vector3(),
    posizione_f: new THREE.Vector3(),
    posizione_camera_i: new THREE.Vector3(),
    posizione_camera_f: new THREE.Vector3(),
    s_flag_whoah: true,
    s_flag_sospiro: true,
    esegui() {
        var t = time - this.inizio;
        var s = t/this.durata;
        Pow_Tween(.3,chiocciola.position, this.posizione_i, this.posizione_f, s);
        Pow_Tween(.3,camera.position, this.posizione_camera_i, this.posizione_camera_f, s);
        Oscilla(occhi, asse_chiocciola, pos_occhi, (1-s)*.12, .003, time);
        Oscilla(guscio, asse_chiocciola, pos_guscio, (1-s)*.5, .003, time);
        renderer.render(scene, camera);
        if(t>100 && this.s_flag_sospiro) {
            s_sospiro.play();
            this.s_flag_sospiro = false;
        }
        if(camera.position.z>52 && this.s_flag_whoah){
            s_whoah.play();
            this.s_flag_whoah = false;
        }
        if(t> 6000 && !camera_finale.avviato){
            camera_finale.avviato = true;
            camera_finale.inizio = time;
            camera_finale.posizione_i.copy(camera.position);
            camera.getWorldDirection(v3_ausiliario); // [ref1]
            camera_finale.target_i.copy(v3_ausiliario).add(camera.position);
        }
        if(t >= this.durata){
            this.avvenuto = true;
            s_striscia.stop();
        }
    },
    eseguibile(){
        if(this.avvenuto) return false;
        if(this.avviato) return true;
        return false;
    }
}
eventi.push(avanzata_finale);

camera_finale = {
    inizio: -1,
    durata: 10000,
    avviato: false,
    avvenuto: false,
    posizione_i: new THREE.Vector3(),
    target_i: new THREE.Vector3(7,30.5,42), // [ref1]
    target_f: new THREE.Vector3(8,30.5,49),
    rotazione_i: 0,
    rotazione_f: .8,
    eseguibile(){
        if(this.avvenuto) return false;
        if(this.avviato) return true;
        return false;
    },
    esegui(){
        var s = ( time - this.inizio) / this.durata;
        var p = .5-Math.cos(Math.PI*s)/2.; // parametro di Cos-tween
        var rot = (1-p)*this.rotazione_i + p*this.rotazione_f; // angolo di rotazione
        m4_ausiliario.makeRotationY(rot); //matrice di rotazione da applicare alla posizione della camera
        camera.position.copy(this.posizione_i.clone().sub(this.target_f).applyMatrix4(m4_ausiliario)).add(this.target_f);
        Cos_Tween(v3_ausiliario, this.target_i, this.target_f, s);
        camera.lookAt(v3_ausiliario);
        renderer.render(scene, camera);
        if(s>=1) {
            this.avvenuto = true;
            pausa_4.inizio = time;
            renderer.setClearColor("hsl(204, 100%, 0%)");
            s_camminata_f.play();
            document.body.appendChild(scritta_f);
        }
    }
}
eventi.push(camera_finale);

pausa_4 = {
    inizio: -1,
    durata: 5000,
    ritardo: 1000,
    avvenuto: false,
    eseguibile(){
        if(this.avvenuto) return false;
        if(this.inizio>0 && time+this.ritardo >= this.inizio) return true;
        return false;
    },
    esegui(){
        renderer.render(blank_scene, camera);
        if(time-this.inizio>= this.durata) {
            this.avvenuto = true;
            termina.avviato = true;
            document.body.removeChild(scritta_f);
        }
    }
}
eventi.push(pausa_4);


////////////
termina = {
    avviato: false,
    eseguibile(){
        return this.avviato;
    },
    esegui(){
        for(var j=0; j<suoni.length-1; j++) if(suoni[j].isPlaying) suoni[j].stop();
        renderer.setClearColor("hsl(204, 100%, 0%)"); 
        renderer.render(blank_scene, camera);
        ResettaEventi();
        document.getElementById("play").style.visibility = "visible";
        cancelAnimationFrame( ID_animazione );
    }
}
eventi.push(termina);

function ResettaEventi(){
    for(var i=0; i<eventi.length; i++){
        eventi[i].avviato = false;
        eventi[i].avvenuto = false;
        eventi[i].inizio = -1;
        eventi[i].riposizionamento = true;
    }
}