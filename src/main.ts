import * as THREE from 'three';
import './style.css';
import { createWorld } from './world/scene';
import { buildWorld } from './world/islands';
import { Player } from './world/player';
import { createLoop } from './core/gameLoop';

const app = document.querySelector<HTMLDivElement>('#app')!;
const { scene, camera, renderer } = createWorld(app);

// 世界
buildWorld(scene);

// 玩家
const player = new Player();
scene.add(player.group);

// 键盘输入
const input = {
  forward: false,
  backward: false,
  left: false,
  right: false,
};

const keyMap: Record<string, keyof typeof input> = {
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

// 环绕相机状态
let theta = 0; // 方位角
let phi = 0.9; // 俯仰角（约 52°）
let distance = 16; // 与角色的距离

const target = new THREE.Vector3();

// 鼠标拖拽旋转视角
let dragging = false;
let lastX = 0;
let lastY = 0;

app.addEventListener('mousedown', (e) => {
  dragging = true;
  lastX = e.clientX;
  lastY = e.clientY;
});

window.addEventListener('mousemove', (e) => {
  if (!dragging) return;
  const dx = e.clientX - lastX;
  const dy = e.clientY - lastY;
  lastX = e.clientX;
  lastY = e.clientY;
  theta -= dx * 0.006;
  phi -= dy * 0.006;
  phi = Math.max(0.3, Math.min(1.35, phi));
});

window.addEventListener('mouseup', () => {
  dragging = false;
});

// 滚轮缩放
app.addEventListener(
  'wheel',
  (e) => {
    distance += e.deltaY * 0.01;
    distance = Math.max(8, Math.min(28, distance));
  },
  { passive: true }
);

function updateCamera(): void {
  target.copy(player.group.position);
  camera.position.x = target.x + distance * Math.cos(phi) * Math.sin(theta);
  camera.position.y = target.y + distance * Math.sin(phi);
  camera.position.z = target.z + distance * Math.cos(phi) * Math.cos(theta);
  camera.lookAt(target);
}

function update(dt: number): void {
  // 相对相机朝向计算移动方向
  const forward = new THREE.Vector3();
  forward.copy(target).sub(camera.position);
  forward.y = 0;
  forward.normalize();

  const right = new THREE.Vector3();
  right.crossVectors(forward, new THREE.Vector3(0, 1, 0)).normalize();

  const move = new THREE.Vector3();
  if (input.forward) move.add(forward);
  if (input.backward) move.sub(forward);
  if (input.right) move.add(right);
  if (input.left) move.sub(right);
  if (move.lengthSq() > 0) move.normalize();

  player.update(dt, move);
  updateCamera();
}

function render(): void {
  renderer.render(scene, camera);
}

updateCamera();
createLoop(update, render);

// 自适应窗口
window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});
