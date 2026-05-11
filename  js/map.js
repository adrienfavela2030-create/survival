// js/map.js
let scene, camera, renderer, player;
const trees = [], bushes = [], houses = [], parkObjects = [];

function initMap() {
  scene = new THREE.Scene();
  scene.background = new THREE.Color(0x7ec8ff);
  scene.fog = new THREE.Fog(0x7ec8ff, 50, 220);

  const fov = 75;
  const aspect = window.innerWidth / window.innerHeight;
  camera = new THREE.PerspectiveCamera(fov, aspect, 0.1, 1000);

  renderer = new THREE.WebGLRenderer({ canvas: document.getElementById("gameCanvas"), antialias: true });
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));

  window.addEventListener("resize", () => {
    renderer.setSize(window.innerWidth, window.innerHeight);
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
  });

  const sun = new THREE.DirectionalLight(0xffffff, 1.2);
  sun.position.set(10, 20, 8);
  const amb = new THREE.AmbientLight(0x8fb3ff, 0.4);
  scene.add(sun, amb);

  // Ground
  const ground = new THREE.Mesh(
    new THREE.PlaneGeometry(400, 400),
    new THREE.MeshLambertMaterial({ color: 0x008800 })
  );
  ground.rotation.x = -Math.PI / 2;
  scene.add(ground);

  // Trees, bushes, safe zone, park, houses, furniture
  // … (same code from previous `createMap`)
  // JUST REMOVE the player camera setup from here.

  // Create player (still in map.js or move to player.js later)
  player = new THREE.Mesh(
    new THREE.BoxGeometry(1, 2, 1),
    new THREE.MeshLambertMaterial({ color: 0xff4444 })
  );
  player.position.set(0, 1, 10);
  scene.add(player);

  camera.position.set(0, 5, 10);
  camera.lookAt(player.position);
}
