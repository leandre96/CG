var scene = new THREE.Scene();//Se crea una escena de Three.js
var backgroundScene = "#40E0D0"//Se define un color de fondo para la escena
scene.background = new THREE.Color(backgroundScene);//Se setea dicho color para la escena
var camera = new THREE.PerspectiveCamera(75,window.innerWidth/window.innerHeight,0.1,500);//Se define una cámara
var renderer = new THREE.WebGLRenderer();//Se define un renderizador
var selected_object = null;//Variable para elementos seleccionados
renderer.setSize(window.innerWidth,window.innerHeight);//Se setea el tamaño al renderizador
document.body.appendChild(renderer.domElement);//Se procede a añadir al renderizador al DOM
var mouseOrbit = new THREE.OrbitControls(camera, renderer.domElement);//Se añade un controlador de órbita
var getMaterial = function(colorDesired){//
    let material = new THREE.MeshPhongMaterial({ color:colorDesired, side: THREE.DoubleSide, flatShading: true });
    return material;}
var tablero = new THREE.Group();//Se define un grupo para el tablero de ajedrez
var tile_width=2;
var tile_color="#ffffff";
var addTablero = function(){//Función que se encargara de agregar elementos a la tablero de ajedrez
    var tile_geometry = new THREE.BoxGeometry(tile_width,tile_width/10,tile_width);
    var black_material = getMaterial("#000000");   //Color negro fijo
    var color_material = getMaterial("#FFB6C1");  //to change with gui
    var black_color = -1;
	var length = 10; //Cantidad de cuadros de lado a lado
    for(var i = 0; i < length; i++){
        if (i % 2 == 0) { black_color = -1 }
        else { black_color = 1 };
        for(var j = 0; j < length; j++){
            var material;
            if(black_color == 1){ material = black_material; }   // iterate black and white
            else{ material = color_material; }
            var tile = new THREE.Mesh( tile_geometry, material );
            tile.position.x = (-4 + j) * tile_width;
            tile.position.z = (-4 + i) * tile_width;
            tablero.add(tile);
            black_color *= -1; } }
    scene.add(tablero); }
var ambient_light, white_light;               // white
var red_light, green_light, blue_light;       // RGB
var cyan_light, magenta_light, yellow_light;  // CMY
var speed=0.025;
var getSpotLight = function(colorDesired,intensity){
    spotLight = new THREE.SpotLight( colorDesired, intensity );
    return spotLight; }
var addLights = function( distanceFromCenter ){
    white_up_light = getSpotLight("#ffffff",1);
    white_up_light.position.set(0 - tile_width, 20, 0 - tile_width);
    scene.add(white_up_light);
    white_down_light = getSpotLight("#ffffff",1);
    white_down_light.position.set(0 - tile_width, -20, 0 - tile_width);
    scene.add(white_down_light);
    red_light = getSpotLight("#FF1493",6);
    red_light.position.set(distanceFromCenter - tile_width, 20, distanceFromCenter - tile_width);
    scene.add(red_light);
    green_light = getSpotLight("#00ff00",6);
    green_light.position.set( -distanceFromCenter - tile_width, 20, distanceFromCenter - tile_width);
    scene.add(green_light);
    blue_light = getSpotLight("#0000ff",6);
    blue_light.position.set( 0 - tile_width, 20, -distanceFromCenter - tile_width);
    scene.add(blue_light); }
var prism, esfera, piramide, toroide;
var figurasCreadas = false;
var addFiguras = function(){
    //piramide, la diferencia entre cylinder y cylinder 
    //buffer, es que el cylinder buffer permite que la cara 
    //superior tenga 0 de radio.
    let geometry = new THREE.CylinderBufferGeometry(0,2,3,4);
    let material = getMaterial("#800080");
    piramide = new THREE.Mesh(geometry,material);
    piramide.position.set(-4,2,3);	
    scene.add(piramide);
	
	geometry = new THREE.SphereBufferGeometry(1.5,32,32);
    material = getMaterial("#777777");
    esfera = new THREE.Mesh(geometry,material);
    esfera.position.set(2,3,3);	
    scene.add(esfera);	

    geometry = new THREE.TorusKnotGeometry(1.5,0.5,32,100);
    material = getMaterial("#ADFF2F");   //fixed color
    toroide = new THREE.Mesh(geometry,material);
    toroide.position.set(2.5,5.5,-3);	
    toroide.rotation.x = Math.PI / 2;
    scene.add(toroide);
    
    geometry = new THREE.CylinderGeometry(1,1,3,8);
    material = getMaterial("#A52A2A");
    prism = new THREE.Mesh(geometry,material);
    prism.position.set(-3.5,7,-3);
	
    scene.add(prism);	
    figurasCreadas = true; }
var removeFiguras = function(){
    control.detach( prism );
    control.detach( esfera );
    control.detach( piramide );
    control.detach( toroide );
    scene.remove(prism);
    scene.remove(esfera);
    scene.remove(piramide);
    scene.remove(toroide); 
    figurasCreadas = false; }
var rotateFigura = function(figura,vel_X,vel_Y,vel_Z){
    if(vel_X != 0){ figura.rotation.x += vel_X; }
    if(vel_Y != 0){ figura.rotation.y += vel_Y; }
    if(vel_Z != 0){ figura.rotation.z += vel_Z; } }
    var rotationOn = function(){
        rotateFigura(piramide,0,params.speed,0); 
        rotateFigura(prism,0,params.speed,0);
        rotateFigura(toroide,0,params.speed,0);
        rotateFigura(esfera,0,0,params.speed); }
var loader = new THREE.OBJLoader();
loader.load('obj/Chinese_dragon.obj',function ( object ) {
    iron_man = object;
    object.scale.set(0.1,0.1,0.1);
    object.position.set(-1,1.5,-3);
    object.rotation.x += 4.8;
    scene.add( object );},
    function ( xhr ) {console.log( ( xhr.loaded / xhr.total * 100 ) + '% loaded' );},
    function ( error ) {console.log( 'Ocurrio una falla' );}
);
// GUI
var params = { up_light: true, down_light: false, background: backgroundScene, 
    red_light: false, green_light: false , blue_light: false, 
    non_black_tiles: tile_color, geometries: true, rotation: false,speed : this.speed};

var nlines = params.length;
var gui = new dat.GUI({ height: nlines * 32 - 1, });

var scenectl = gui.addFolder("Scene control");
scenectl.add(params, 'up_light');
scenectl.add(params, 'down_light');
scenectl.addColor(params, 'background').onChange(update);
scenectl.add(params, 'red_light');
scenectl.add(params, 'green_light');
scenectl.add(params, 'blue_light');
scenectl.addColor(params, 'non_black_tiles').onChange(update);
scenectl.add(params, 'geometries');
scenectl.add(params, 'rotation');
scenectl.add(params, 'speed',-1,1);

// --- CHANGE COLOR GUI CONTROL ---------------------------------

var shapectl = gui.addFolder("Shape control");

var shape_params = {
    color: "#00ffff",
};
// adding folder to gui control
shapectl.addColor(shape_params, 'color').onChange(ChangeColor).listen();
// instantiate raycaster 
var raycaster = new THREE.Raycaster();
var mouse = new THREE.Vector2();
// get mouse coordinates all the time
function onMouseMove( event ) {
	mouse.x = ( event.clientX / window.innerWidth ) * 2 - 1;
	mouse.y = - ( event.clientY / window.innerHeight ) * 2 + 1;
}
// adding events to window
window.addEventListener( 'mousemove', onMouseMove, false );
document.addEventListener( 'mousedown', onDocumentMouseDown );
// callback for event to change color
function ChangeColor(){
    selected_object.material.color.setHex(shape_params.color);
};
// callback event for mouse down
function onDocumentMouseDown( event ) {
            if (figurasCreadas) {
                event.preventDefault();
                raycaster.setFromCamera( mouse, camera );            
                // calculate objects intersecting the picking ray
                var intersects = raycaster.intersectObjects( scene.children );
                // intersects[0].object.material.color.set( 0xff0000 );           
                //validate if has objects intersected
                if (intersects.length>0){
                    // pick first intersected object
                    selected_object = intersects[0].object;
                    // change gui color
                    shape_params.color = selected_object.material.color.getHex();                
                    control.setMode('translate');
                    control.attach( selected_object );
                }
            }
             
}
// ---------------------------------------------------


// ----- TRANSLATE CONTROL ---------------------------
control = new THREE.TransformControls( camera, renderer.domElement );
control.addEventListener( 'change', render );
control.addEventListener( 'dragging-changed', function ( event ) {
			mouseOrbit.enabled = ! event.value;
    } );
scene.add( control );
// load objects
addTablero();
addFiguras();
distanceFromCenter = 1.75*tile_width;
addLights( distanceFromCenter );
camera.position.set(-1, 4, 16);
// update and render loop
var isHex = function (posible_hex) {
    let re = /[0-9A-Fa-f]{6}/g;
    if (re.test(posible_hex)) { return true; } 
    else { return false; } }
var update = function(){ 
    // change in GUI for lights
    if (params.up_light) { white_up_light.intensity = 1; }
    else { white_up_light.intensity = 0; };

    if (params.down_light) { white_down_light.intensity = 1; }
    else { white_down_light.intensity = 0; };	            
    
    if (params.red_light) { red_light.intensity = 6; }
    else { red_light.intensity = 0; };
    
    if (params.green_light) { green_light.intensity = 6; }
    else { green_light.intensity = 0; };
    
    if (params.blue_light) { blue_light.intensity = 6; }
    else { blue_light.intensity = 0; };

    // change in GUI for color_tiles or background
    let background_hex = new THREE.Color(params.background).getHexString();
    if ( isHex(background_hex) && scene.background != "#" + background_hex ){
            scene.background = new THREE.Color("#"+background_hex); }
    let color_hex = new THREE.Color(params.non_black_tiles).getHexString();
    
    if ( isHex(color_hex) && tile_color != "#" + color_hex ){
            tile_color = "#" + color_hex;
            let table = scene.getObjectByName(tablero);
            scene.remove(table);
            addTablero(); }
    
            if( !figurasCreadas && params.geometries == true ){ addFiguras(); } 
    
    if( figurasCreadas && params.geometries == false ){ removeFiguras(); }
    
    if( figurasCreadas && params.rotation ){ rotationOn(); } }
    
function render(){ renderer.render(scene,camera); }
function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize( window.innerWidth, window.innerHeight );
    render();
}
window.addEventListener( 'resize', onWindowResize, false );
var showAnimationLoop = function(){
    requestAnimationFrame(showAnimationLoop);
    update();
    render(); }
showAnimationLoop();