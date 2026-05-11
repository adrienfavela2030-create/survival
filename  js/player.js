// player.js

let player, projectiles = [];

function initPlayer() {
  // Player model
  player = new THREE.Mesh(
    new THREE.BoxGeometry(1, 2, 1),
    new THREE.MeshLambertMaterial({ color: 0xff4444 })
  );
  player.position.y = 1;
  scene.add(player);

  // Joystick
  const base = document.createElement("div");
  base.id = "stickBase";
  base.style.cssText = `
    position: fixed;
    bottom: 40px;
    left: 20px;
    width:100px;
    height:100px;
    border-radius:50%;
    background:rgba(255,255,255,.2);
    border:4px solid rgba(0,0,0,.35);
    touch-action:none;
  `;
  const kn = document.createElement("div");
  kn.id = "stickKnob";
  kn.style.cssText = `
    position:absolute;
    left:40px;
    top:40px;
    width:40px;
    height:40px;
    border-radius:50%;
    background:linear-gradient(#59d6ff,#0d6cff);
    border:3px solid #000;
  `;
  base.appendChild(kn);
  document.body.appendChild(base);

  let tracking = false;
  const radius = 30;

  base.addEventListener("touchstart", (e) => {
    e.preventDefault();
    tracking = true;
  });

  document.addEventListener("touchmove", (e) => {
    if (!tracking) return;
    e.preventDefault();
    const rect = base.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    const tx = e.touches[0].clientX;
    const ty = e.touches[0].clientY;
    let dx = tx - cx;
    let dy = ty - cy;
    const len = Math.hypot(dx, dy);
    if (len > radius) {
      const ang = Math.atan2(dy, dx);
      dx = Math.cos(ang) * radius;
      dy = Math.sin(ang) * radius;
    }
    kn.style.transform = `translate(${dx}px, ${dy}px)`;
    game.move.x = dx / radius;
    game.move.y = dy / radius;
  }, { passive: false });

  document.addEventListener("touchend", () => {
    tracking = false;
    game.move.x = 0;
    game.move.y = 0;
    kn.style.transform = "translate(0px, 0px)";
  });

  // Buttons
  document.getElementById("hitBtn").addEventListener("touchstart", () => game.hitPressed = true);
  document.getElementById("hitBtn").addEventListener("touchend", () => game.hitPressed = false);
  document.getElementById("jumpBtn").addEventListener("touchstart", () => if (!game.isJumping) game.isJumping = true);

  // Start game loop
  updatePlayer();
}

function updatePlayer() {
  const speed = 0.25;
  player.position.x += game.move.x * speed;
  player.position.z += game.move.y * speed;

  // Simple jump effect (up and back to ground)
  if (game.isJumping) {
    player.position.y += 0.15; // go up
    if (player.position.y >= 1.6) game.isJumping = false;
  } else {
    if (player.position.y > 1) player.position.y -= 0.1;
  }

  // Keep camera on player
  camera.position.copy(player.position);
  camera.position.y = 5;
  camera.position.z = 10;
  camera.lookAt(player.position);

  // HIT LOGIC
  if (game.hitPressed) {
    const range = 2; // hit range
    for (let z of game.zombies) {
      const d = player.position.distanceTo(z.position);
      if (d < range) {
        z.visible = false;
        setTimeout(() => {
          scene.remove(z);
          game.zombies = game.zombies.filter(zo => zo !== z);
          game.kills++;
          updateHUD();
        }, 100);
        break;
      }
    }
  }

  requestAnimationFrame(updatePlayer);
}
