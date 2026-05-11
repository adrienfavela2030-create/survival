// map.js

let scene, camera, renderer;

function initMap() {
  scene = new THREE.Scene();
  scene.background = new THREE.Color(0x7ec8ff);

  const fov = 75;
  const aspect = window.innerWidth / window.innerHeight;
  camera = new THREE.PerspectiveCamera(fov, aspect, 0.1, 1000);

  renderer = new THREE.WebGLRenderer({ canvas: document.getElementById("gameCanvas"), antialias: true });
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));

  window.addEventListener("resize", () => {
    const width = window.innerWidth;
    const height = window.innerHeight;
    renderer.setSize(width, height);
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
  });

  // Lighting
  const sun = new THREE.DirectionalLight(0xffffff, 1.2);
  sun.position.set(10, 20, 8);
  scene.add(sun);
  scene.add(new THREE.AmbientLight(0x8fb3ff, 0.4));

  // Default map (Map 1: Normal)
  buildMap1();
  animate();
}

function buildMap1() {
  // Ground
  const ground = new THREE.Mesh(
    new THREE.PlaneGeometry(100, 100),
    new THREE.MeshLambertMaterial({ color: 0x88cc66 })
  );
  ground.rotation.x = -Math.PI / 2;
  scene.add(ground);
  game.mapObjects.push(ground);

  camera.position.set(0, 5, 10);
  camera.lookAt(0, 1, 0);
}

// You can add more maps later:
// function buildMap2IceAge()
// function buildMap3Hospital()

function animate() {
  requestAnimationFrame(animate);

  // inOutside, camera is updated in player.js
  renderer.render(scene, camera);
}
