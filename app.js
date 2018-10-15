var WIDTH = window.innerWidth,
  HEIGHT = window.innerHeight,
  intensity = 1,
  group;

var renderer = new THREE.WebGLRenderer({
  antialias: true,
  aplpha: false
});
renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(WIDTH, HEIGHT);
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
renderer.setClearColor(0xcce0ff, 0.5);
renderer.gammaInput = true;
renderer.gammaOutput = true;

var scene = new THREE.Scene();
scene.background = new THREE.Color(0xcce0ff);

init();

function init() {
  makeGround();
  makeBulbGroup(-3,2,0, 0x0b2a9e);
  makeBulbGroup( 0,2,0, 0xff0000);
  makeBulbGroup( 3,2,0, 0xffee88);

  // Tablero de Ajedrez
  var geometry = new THREE.BoxGeometry( 10, 10, 1 );

  var texture = new THREE.TextureLoader().load('textura.jpg');
  var material = new THREE.MeshStandardMaterial({map: texture});

  var cube = new THREE.Mesh( geometry, material );

  cube.receiveShadow = true;

  cube.position.set(0, 0.8,0);
  cube.rotation.x = 89.8;

  scene.add(cube);

}

function makeGround() {
  var groundGeo = new THREE.PlaneGeometry(100, 100);
  var groundMat = new THREE.MeshStandardMaterial({
    color: 0xffffff,
    metalness: 0.65
  });
  groundMat.color.setHex(0xe81b05);

  var ground = new THREE.Mesh(groundGeo, groundMat);
  ground.rotation.x = -Math.PI / 2;
  ground.position.y = 0;

  scene.add(ground);
  ground.receiveShadow = true;
}

function makeBulbGroup(x,y,z, LightColor) {
  group = new THREE.Group();
  //main bulb
  var bulbGeometry = new THREE.SphereGeometry(1, 32, 32);
  var bulbLight = new THREE.PointLight(LightColor, 1, 100, 2);
  var bulbMat = new THREE.MeshStandardMaterial({
    emissive: LightColor,
    emissiveIntensity: intensity,
    color: LightColor,
    roughness: 1
  });

  bulbLight.add(new THREE.Mesh(bulbGeometry, bulbMat));
  bulbLight.position.set(0, 2, 0);
  bulbLight.castShadow = true;

  var d = 200;

  bulbLight.shadow.camera.left = -d;
  bulbLight.shadow.camera.right = d;
  bulbLight.shadow.camera.top = d;
  bulbLight.shadow.camera.bottom = -d;

  bulbLight.shadow.camera.far = 100;

  //stem
  var bulbStem = new THREE.CylinderGeometry(0.5, 0.65, 0.55, 32);
  var stemMat = new THREE.MeshStandardMaterial({
    color: LightColor,
    emissive: LightColor,
    emissiveIntensity: intensity,
    metalness: 0.8,
    roughness: 0
  });

  var bStem = new THREE.Mesh(bulbStem, stemMat);
  bStem.position.set(0, 2.9, 0);
  bStem.castShadow = true;
  bStem.receiveShadow = true;

  //plug main
  var bulbPlug = new THREE.CylinderGeometry(0.52, 0.52, 1.2, 32);

  var plugMat = new THREE.MeshStandardMaterial({
    color: 0x807d7a
  });

  var plug = new THREE.Mesh(bulbPlug, plugMat);
  plug.position.set(0, 3.2, 0);
  plug.receiveShadow = true;
  plug.castShadow = true;

  //plug top
  var topGeo = new THREE.CylinderGeometry(0.25, 0.3, 0.2, 32);

  var topMat = new THREE.MeshStandardMaterial({
    color: 0xe8d905
  });
  var plugTop = new THREE.Mesh(topGeo, topMat);
  plugTop.position.set(0, 3.75, 0);
  plugTop.receiveShadow = true;
  plugTop.castShadow = true;

  //plug rings
  var ringGeo = new THREE.TorusGeometry(0.52, 0.04, 4, 100);

  var ringMat = new THREE.MeshStandardMaterial({
    color: 0x807d7a
  });

  var ringY = 3.33;
  for (i = 0; i < 3; i++) {
    var ring = new THREE.Mesh(ringGeo, ringMat);
    ring.rotation.x = -Math.PI / 2;
    ring.position.set(0, ringY, 0);
    group.add(ring);

    ringY += 0.15;
  }

  //top ring
  var topRingGeo = new THREE.TorusGeometry(0.49, 0.05, 16, 100);

  var topRing = new THREE.Mesh(topRingGeo, ringMat);
  topRing.position.set(0, 3.75, 0);
  topRing.rotation.x = -Math.PI / 2;

  //bottom ring
  var botRingGeo = new THREE.TorusGeometry(0.5, 0.05, 16, 100);

  var botRing = new THREE.Mesh(botRingGeo, ringMat);
  botRing.position.set(0, 3.15, 0);
  botRing.rotation.x = -Math.PI / 2;

  //add to group
  group.add(bStem);
  group.add(bulbLight);
  group.add(plug);
  group.add(plugTop);
  group.add(botRing);
  group.add(topRing);

  scene.add(group);
  group.position.y = y;
  group.position.z = z;
  group.position.x = x;
}

//camera
camera = new THREE.PerspectiveCamera(
  30,
  window.innerWidth / window.innerHeight,
  1,
  10000
);

camera.position.set(0, 4.25, 15);
scene.add(camera);



document.body.appendChild(renderer.domElement);

camera.lookAt(new THREE.Vector3(0, 2, 0));

(function render() {
  renderer.render(scene, camera);

  requestAnimationFrame(render);
})();
