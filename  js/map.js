// js/map.js
let scene, camera, renderer;
let player, trees = [], bushes = [], houses = [], parkObjects = [], safeZone;
const worldSize = 400;

function initMap() {
  scene = new THREE.Scene();
  scene.background = new THREE.Color(0x7ec8ff);
  scene.fog = new THREE.Fog(0x7ec8ff, 50, 220);

  const fov = 75;
  const aspect = window.innerWidth / window.innerHeight;
  camera = new THREE.PerspectiveCamera(fov, aspect, 0.1, 1000);
  camera.position.set(0, 5, 10);
  camera.lookAt(0, 1, 0);

  renderer = new THREE.WebGLRenderer({ canvas: document.getElementById("gameCanvas"), antialias: true });
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));

  window.addEventListener("resize", () => {
    const w = window.innerWidth;
    const h = window.innerHeight;
    renderer.setSize(w, h);
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
  });

  // Lighting (updated by day/night in zombie.js)
  const sun = new THREE.DirectionalLight(0xffffff, 1.2);
  sun.position.set(10, 20, 8);
  scene.add(sun);
  scene.add(new THREE.AmbientLight(0x8fb3ff, 0.4));
  window.lights = { sun, ambient: scene.children.find(c => c.type === "AmbientLight") };

  // Ground
  const ground = new THREE.Mesh(
    new THREE.PlaneGeometry(worldSize, worldSize),
    new THREE.MeshLambertMaterial({ color: 0x00aa00 })
  );
  ground.rotation.x = -Math.PI / 2;
  scene.add(ground);

  // Simple foggy forest
  const treeMat = new THREE.MeshLambertMaterial({ color: 0x228822 });
  const bushMat = new THREE.MeshLambertMaterial({ color: 0x116611 });

  for (let i = 0; i < 120; i++) {
    const x = (Math.random() - 0.5) * worldSize;
    const z = (Math.random() - 0.5) * worldSize;
    const h = 4 + Math.random() * 3;

    const trunk = new THREE.Mesh(
      new THREE.BoxGeometry(0.6, h, 0.6),
      new THREE.MeshLambertMaterial({ color: 0x8b5a2b })
    );
    trunk.position.y = h / 2;

    const leaves = new THREE.Mesh(
      new THREE.SphereGeometry(1.4, 8, 6),
      treeMat
    );
    leaves.position.y = h + 1;

    const tree = new THREE.Group();
    tree.add(trunk, leaves);
    tree.position.set(x, 0, z);
    scene.add(tree);
    trees.push(tree);
  }

  // Bushes
  for (let i = 0; i < 60; i++) {
    const x = (Math.random() - 0.5) * worldSize;
    const z = (Math.random() - 0.5) * worldSize;
    const b = new THREE.Mesh(
      new THREE.SphereGeometry(0.6, 6, 5),
      bushMat
    );
    b.position.set(x, 0, z);
    scene.add(b);
    bushes.push(b);
  }

  // Safe zone (tent + campfire)
  const tent = new THREE.Mesh(
    new THREE.BoxGeometry(4, 3, 4),
    new THREE.MeshLambertMaterial({ color: 0xaa0000 })
  );
  tent.position.set(10, 1.5, 10);
  scene.add(tent);

  const fire = new THREE.Mesh(
    new THREE.ConeGeometry(0.8, 1.2, 8),
    new THREE.MeshLambertMaterial({ color: 0xff6600 })
  );
  fire.rotation.x = Math.PI;
  fire.position.set(10, 0.6, 10);
  scene.add(fire);

  safeZone = { tent, fire };

  // Park (abandoned slide + chest)
  const slideBase = new THREE.Mesh(
    new THREE.BoxGeometry(10, 0.4, 0.8),
    new THREE.MeshLambertMaterial({ color: 0x333333 })
  );
  slideBase.position.y = 0.2;

  const slideSlide = new THREE.Mesh(
    new THREE.BoxGeometry(10, 0.2, 0.4),
    new THREE.MeshLambertMaterial({ color: 0x555555 })
  );
  slideSlide.position.y = 0.6;
  slideSlide.rotation.x = 0.25;

  const slide = new THREE.Group();
  slide.add(slideBase, slideSlide);
  slide.position.set(-20, 0, -30);
  scene.add(slide);
  parkObjects.push(slide);

  // Chest in park (safe, no zombies)
  const chest = new THREE.Mesh(
    new THREE.BoxGeometry(1.2, 0.8, 0.8),
    new THREE.MeshLambertMaterial({ color: 0xaa8844 })
  );
  chest.position.set(-20, 0.4, -28);
  scene.add(chest);
  parkObjects.push(chest);

  // Abandoned houses (random: 1–2, with 1–2 chests)
  const houseMat = new THREE.MeshLambertMaterial({ color: 0x666666 });
  const roofMat = new THREE.MeshLambertMaterial({ color: 0x333333 });

  for (let i = 0; i < 3; i++) {
    if (i >= 1 + Math.random() * 2) break; // 1–2 houses

    const x = (Math.random() - 0.5) * 160;
    const z = (Math.random() - 0.5) * 160;
    const house = new THREE.Group();

    const base = new THREE.Mesh(
      new THREE.BoxGeometry(10, 4.5, 10),
      houseMat
    );
    base.position.y = 2.25;

    const roof = new THREE.Mesh(
      new THREE.ConeGeometry(7.5, 3, 4),
      roofMat
    );
    roof.position.y = 5.5;

    house.add(base, roof);
    house.position.set(x, 0, z);
    scene.add(house);
    houses.push(house);

    // Chest inside house (1–2 per house)
    const chestCount = 1 + Math.floor(Math.random());
    for (let j = 0; j < chestCount; j++) {
      const cx = x + (Math.random() - 0.5) * 6;
      const cz = z + (Math.random() - 0.5) * 6;
      const h = 0.4;

      const c = new THREE.Mesh(
        new THREE.BoxGeometry(1.4, h, 1.4),
        new THREE.MeshLambertMaterial({ color: 0xaa8844 })
      );
      c.position.set(cx, h / 2, cz);
      scene.add(c);
      houses.push(c); // just for easy cleanup later if needed
    }

    // Fill house interior: carpet, TV, bed, couch, table
    const carpet = new THREE.Mesh(
      new THREE.BoxGeometry(6, 0.05, 6),
      new THREE.MeshLambertMaterial({ color: 0xaa00aa })
    );
    carpet.position.set(cx, 0, cz);
    scene.add(carpet);

    const tv = new THREE.Mesh(
      new THREE.BoxGeometry(1, 0.6, 0.1),
      new THREE.MeshLambertMaterial({ color: 0x222222 })
    );
    tv.position.set(cx - 2, 2, cz);
    scene.add(tv);

    const bed = new THREE.Mesh(
      new THREE.BoxGeometry(4, 0.2, 2),
      new THREE.MeshLambertMaterial({ color: 0x0000aa })
    );
    bed.position.set(cx + 2, 0.3, cz - 1);
    scene.add(bed);

    const couch = new THREE.Mesh(
      new THREE.BoxGeometry(3, 0.4, 1.5),
      new THREE.MeshLambertMaterial({ color: 0x880000 })
    );
    couch.position.set(cx + 2, 0.3, cz + 1.5);
    scene.add(couch);

    const table = new THREE.Mesh(
      new THREE.BoxGeometry(1.5, 0.6, 1.5),
      new THREE.MeshLambertMaterial({ color: 0xaa8844 })
    );
    table.position.set(cx, 0.6, cz);
    scene.add(table);
  }
}
