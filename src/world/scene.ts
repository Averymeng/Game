import * as THREE from 'three';

export interface World {
  scene: THREE.Scene;
  camera: THREE.PerspectiveCamera;
  renderer: THREE.WebGLRenderer;
}

export function createWorld(container: HTMLElement): World {
  const scene = new THREE.Scene();
  scene.background = new THREE.Color(0xa8dcff);
  scene.fog = new THREE.Fog(0xa8dcff, 40, 110);

  const camera = new THREE.PerspectiveCamera(
    55,
    container.clientWidth / container.clientHeight,
    0.1,
    300
  );
  camera.position.set(0, 12.5, 10);

  const renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setSize(container.clientWidth, container.clientHeight);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  // 不启用色调映射，保持糖果色明亮饱和
  container.appendChild(renderer.domElement);

  // 环境光弱一点，让方向光主导明暗（立体感）
  const hemi = new THREE.HemisphereLight(0xdfefff, 0xffe0c0, 0.6);
  scene.add(hemi);

  // 主方向光（太阳）强一点，突出明暗面
  const sun = new THREE.DirectionalLight(0xffffff, 3.2);
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
