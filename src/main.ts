import * as THREE from 'three';
import './style.css';
import { createWorld } from './world/scene';
import { buildWorld } from './world/islands';
import { Player, type InputState } from './world/player';
import { createLoop } from './core/gameLoop';

const app = document.querySelector<HTMLDivElement>('#app')!;
const { scene, camera, renderer } = createWorld(app);

// 世界
buildWorld(scene);

// 玩家
const player = new Player();
scene.add(player.group);

// 输入
const input: InputState = {
  forward: false,
  backward: false,
  left: false,
  right: false,
};

const keyMap: Record<string, keyof InputState> = {
  KeyW: 'forward',
  ArrowUp: 'forward',
  KeyS: 'backward',
  ArrowDown: 'backward',
  KeyA: 'left',
  ArrowLeft: 'left',
  KeyD: 'right',
  ArrowRight: 'right',
};

window.addEventListener('keydown', (e) => {
  const k = keyMap[e.code];
  if (k) {
    input[k] = true;
    e.preventDefault();
  }
});

window.addEventListener('keyup', (e) => {
  const k = keyMap[e.code];
  if (k) input[k] = false;
});

// 相机跟随（斜俯视，跟随角色）
const cameraOffset = new THREE.Vector3(0, 16, 22);
const cameraTarget = new THREE.Vector3();

function update(dt: number): void {
  player.update(dt, input);

  cameraTarget.copy(player.group.position);
  const desired = cameraTarget.clone().add(cameraOffset);
  camera.position.lerp(desired, Math.min(1, dt * 5));
  camera.lookAt(cameraTarget);
}

function render(): void {
  renderer.render(scene, camera);
}

createLoop(update, render);

// 自适应窗口
window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});
