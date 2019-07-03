var nuvola_map = [[
    [0,0,0,1,0],
    [0,1,1,1,1],
    [1,1,1,1,1],
    [0,0,1,1,1]
]];

var corpo_map = [[
    [1,1,1,1,1,1,1],
	[1,1,1,1,1,1,1],
    [1,1,1,1,1,1,1]
]];

var guscio_map = [  // 2 mesh
    [
        [1,1,1],
        [1,0,1],
        [1,1,1]
    ],[
        [1,2,1],
		[1,0,1],
		[1,2,1]
    ],[
        [1,1,1],
		[1,1,1],
		[1,1,1]
    ]
];

var bocca_map = [[[1,1,1,1,1,1,1,1,1,1,1,1,1,1,1]]];

// var siepe_length = 30;
// var siepe_width = 15;
// var siepe_map = [...Array(10)].map(e => [...Array(siepe_length)].map(e => Array(siepe_width).fill(0)));

// for(i=0; i<15; i++) {
//     for(h=0; h<5+THREE.Math.randInt(0,5); h++){
//         siepe_map[h][i][0] = THREE.Math.randInt(1,3);
//     }
//     for(h=0; h<THREE.Math.randInt(0,5); h++){
//         siepe_map[h][i][1] = THREE.Math.randInt(1,3);
//     } 
// }
// for(j=0; j<8; j++) {
//     for(h=0; h<5+THREE.Math.randInt(0,5); h++){
//         siepe_map[h][8+j][j] = THREE.Math.randInt(1,3);
//     }
//     for(h=0; h<THREE.Math.randInt(0,4); h++){
//         siepe_map[h][7+j][j] = THREE.Math.randInt(1,3);
//     } 
// }


//return array with height data from img, taken from: http://danni-three.blogspot.it/2013/09/threejs-heightmaps.html
function getHeightData(img,scale) {
    if (scale == undefined) scale=1;
    var canvas = document.createElement( 'canvas' );
    canvas.width = img.width;
    canvas.height = img.height;
    var context = canvas.getContext( '2d' );

    var size = img.width * img.height;
    console.log(size);
    var data = new Float32Array( size );

    context.drawImage(img,0,0);

    for ( var i = 0; i < size; i ++ ) {
        data[i] = 0
    }

    var imgd = context.getImageData(0, 0, img.width, img.height);
    var pix = imgd.data;

    var j=0;
    for (var i = 0; i<pix.length; i +=4) {
        var all = pix[i]+pix[i+1]+pix[i+2];  // all is in range 0 - 255*3
        data[j++] = scale*all/3;   
    }
    return data;
}

var siepe_length = 18;
var siepe_width = 10;
var siepe_map = [...Array(26)].map(e => [...Array(siepe_width)].map(e => Array(siepe_length).fill(0)));
var imgLoader = new THREE.ImageLoader();
imgLoader.load('textures/heightmap2.png', function(img) {
    var siepe_map_base = getHeightData(img,0.1);
    console.log(siepe_map_base);
    for(var i=0; i<siepe_width; i++){
        for(var j=0; j<siepe_length; j++){
            for(var k=0; k<siepe_map_base[siepe_length*i+j]; k++){
                siepe_map[k][i][j] = THREE.Math.randInt(1,3);
            }
        }
    }
    console.log(siepe_map);
});

