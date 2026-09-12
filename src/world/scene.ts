import * as THREE from 'three';

export interface World {
  scene: THREE.Scene;
  camera: THREE.PerspectiveCamera;
  renderer: THREE.WebGLRenderer;
}

export function createWorld(container: HTMLElement): World {
  const scene = new THREE.Scene();
  scene.background = new THREE.Color(0x8ec5fc);
  // 远处雾，营造浮空世界的纵深感
  scene.fog = new THREE.Fog(0x8ec5fc, 45, 130);

  const camera = new THREE.PerspectiveCamera(
    55,
    container.clientWidth / container.clientHeight,
    0.1,
    300
  );
  camera.position.set(0, 16, 22);

  const renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setSize(container.clientWidth, container.clientHeight);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  container.appendChild(renderer.domElement);

  // 半球光（天光 + 地面反光，柔和的糖果色基调）
  const hemi = new THREE.HemisphereLight(0xdfefff, 0xffe0c0, 1.1);
  scene.add(hemi);

  // 主方向光（太阳），投射阴影
  const sun = new THREE.DirectionalLight(0xffffff, 2.4);
  sun.position.set(18, 28, 12);
  sun.castShadow = true;
  sun.shadow.mapSize.set(2048, 2048);
  sun.shadow.camera.near = 1;
  sun.shadow.camera.far = 100;
  sun.shadow.camera.left = -50;
  sun.shadow.camera.right = 50;
  sun.shadow.camera.top = 50;
  sun.shadow.camera.bottom = -50;
  sun.shadow.bias = -0.0005;
  scene.add(sun);

  return { scene, camera, renderer };
}
