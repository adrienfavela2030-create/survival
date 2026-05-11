// js/map.js (updated)
let scene, camera, renderer, player;

function initMap() {
  scene = new THREE.Scene();
  scene.background = new THREE.Color(0x7ec8ff);
  scene.fog = new THREE.Fog(0x7ec8ff, 50, 220);

  camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);

  renderer = new THREE.WebGLRenderer({ 
    canvas: document.getElementById("gameCanvas"), 
    antialias: true 
  });
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));

  window.addEventListener("resize", () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  });

  // Lighting
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

  // Trees (example)
  const treeMat = new THREE.MeshLambertMaterial({ color: 0x228822 });
  for (let i = 0; i < 60; i++) {
    const x = (Math.random() - 0.5) * 360;
    const z = (Math.random() - 0.5) * 360;
    const h = 3 + Math.random() * 2;

    const trunk = new THREE.Mesh(
      new THREE.BoxGeometry(0.5, h, 0.5),
      new THREE.MeshLambertMaterial({ color: 0x8b5a2b })
    );
    trunk.position.y = h / 2;

    const crown = new THREE.Mesh(
      new THREE.SphereGeometry(1.2, 6, 5),
      treeMat
    );
    crown.position.y = h + 0.8;

    const tree = new THREE.Group();
    tree.add(trunk, crown);
    tree.position.set(x, 0, z);
    scene.add(tree);
  }

  // Safe zone
  const tent = new THREE.Mesh(
    new THREE.BoxGeometry(4, 3, 4),
    new THREE.MeshLambertMaterial({ color: 0xaa0000 })
  );
  tent.position.set(20, 1.5, 20);
  scene.add(tent);

  // Player (basic)
  player = new THREE.Mesh(
    new THREE.BoxGeometry(1, 2, 1),
    new THREE.MeshLambertMaterial({ color: 0xff4444 })
  );
  player.position.set(0, 1, 10);
  scene.add(player);

  // Initial camera
  camera.position.set(0, 5, 15);
  camera.lookAt(player.position);

  console.log("Map initialized successfully");
  return { scene, camera, renderer, player };
}

// Export for other modules (if using modules)
window.initMap = initMap;