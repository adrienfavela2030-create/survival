// js/zombie.js
let zombies = [];
const game = window.game;
const scene = window.scene;
const lights = window.lights;

function updateDayNight(isDay) {
  game.isDay = isDay;
  const fog = scene.fog;
  if (isDay) {
    fog.color.set(0x7ec8ff);
    fog.near = 50;
    fog.far = 220;
    lights.sun.intensity = 1.2;
    lights.ambient.intensity = 0.4;
  } else {
    fog.color.set(0x111111);
    fog.near = 5;
    fog.far = 40;
    lights.sun.intensity = 0.1;
    lights.ambient.intensity = 0.1;
  }
}

function createZombies() {
  const zMat = new THREE.MeshLambertMaterial({ color: 0x55aa55 });
  const n = 10 + (game.night - 1) * 2; // 10 on night 1, +2 per night
  const around = 200;

  for (let i = 0; i < n; i++) {
    const x = (Math.random() - 0.5) * around;
    const z = (Math.random() - 0.5) * around;

    const z = new THREE.Mesh(
      new THREE.BoxGeometry(1, 2, 1),
      zMat
    );
    z.position.set(x, 1, z);
    z.health = 20;
    scene.add(z);
    zombies.push(z);
  }
}

function updateZombies() {
  if (!game.isDay) {
    // AI
    for (let z of zombies) {
      const dir = new THREE.Vector3().subVectors(player.position, z.position).
