// zombie.js

function spawnWave(wave) {
  const num = 3 + wave * 2;
  const radius = 18 + wave * 5;
  for (let i = 0; i < num; i++) {
    const z = new THREE.Mesh(
      new THREE.BoxGeometry(1, 2, 1),
      new THREE.MeshLambertMaterial({ color: 0x55aa55 })
    );
    z.position.x = (Math.random() - 0.5) * 2 * radius;
    z.position.z = (Math.random() - 0.5) * 2 * radius;
    z.position.y = 1;
    scene.add(z);
    game.zombies.push(z);
  }
}

// You can later add:
// - zombie health
// - damage to player
// - special variants
