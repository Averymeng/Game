import * as THREE from 'three';

export interface Island {
  id: string;
  name: string;
  color: number;
  position: THREE.Vector3;
}

// 5 座岛（对应 PRD 学习板块），糖果色区分
export const ISLANDS: Island[] = [
  { id: 'know', name: '认识之岛', color: 0x7ed957, position: new THREE.Vector3() },
  { id: 'understand', name: '理解之岛', color: 0x5bc0eb, position: new THREE.Vector3() },
  { id: 'use', name: '使用之岛', color: 0xffa94d, position: new THREE.Vector3() },
  { id: 'advance', name: '进阶之岛', color: 0x9d7bff, position: new THREE.Vector3() },
  { id: 'duty', name: '责任之岛', color: 0xff7ea8, position: new THREE.Vector3() },
];

export function buildWorld(scene: THREE.Scene): void {
  buildPlaza(scene);
  buildIslands(scene);
  buildClouds(scene);
}

// 中心广场（出生点，卡卡迎接玩家的地方）
function buildPlaza(scene: THREE.Scene): void {
  const plaza = new THREE.Mesh(
    new THREE.CylinderGeometry(6.5, 7, 1.2, 48),
    new THREE.MeshToonMaterial({ color: 0xfff0b0 })
  );
  plaza.position.y = -0.6;
  plaza.castShadow = true;
  plaza.receiveShadow = true;
  scene.add(plaza);

  // 广场中心地标（奶油粉圆台）
  const center = new THREE.Mesh(
    new THREE.CylinderGeometry(1.6, 1.8, 0.4, 32),
    new THREE.MeshToonMaterial({ color: 0xffc4d6 })
  );
  center.position.y = 0.2;
  center.receiveShadow = true;
  scene.add(center);
}

function buildIslands(scene: THREE.Scene): void {
  const radius = 10;
  ISLANDS.forEach((island, i) => {
    const angle = (i / ISLANDS.length) * Math.PI * 2;
    island.position.set(Math.cos(angle) * radius, 0, Math.sin(angle) * radius);

    // 浮空岛平台（下宽上窄的圆台）
    const body = new THREE.Mesh(
      new THREE.CylinderGeometry(3.2, 3.8, 1.1, 32),
      new THREE.MeshToonMaterial({ color: island.color })
    );
    body.position.copy(island.position);
    body.castShadow = true;
    body.receiveShadow = true;
    scene.add(body);

    // 岛顶（浅色草地）
    const top = new THREE.Mesh(
      new THREE.CylinderGeometry(3.2, 3.2, 0.2, 32),
      new THREE.MeshToonMaterial({ color: 0xffffff })
    );
    top.position.copy(island.position);
    top.position.y = 0.65;
    top.receiveShadow = true;
    scene.add(top);

    // 岛上标志物（白色小尖塔，M2 换成关卡入口）
    const marker = new THREE.Mesh(
      new THREE.ConeGeometry(0.6, 1.4, 24),
      new THREE.MeshToonMaterial({ color: 0xffffff })
    );
    marker.position.copy(island.position);
    marker.position.y = 1.4;
    marker.castShadow = true;
    scene.add(marker);
  });
}

// 环绕的云朵，增强「浮空世界」的氛围
function buildClouds(scene: THREE.Scene): void {
  const cloudMat = new THREE.MeshToonMaterial({ color: 0xffffff });
  const positions: [number, number, number][] = [
    [0, 3, 0],
    [-10, 5, -8],
    [10, 6, 5],
    [0, 8, 12],
    [-12, 4, 10],
    [12, 4, -10],
  ];

  for (const [x, y, z] of positions) {
    const cloud = new THREE.Group();
    for (let j = 0; j < 3; j++) {
      const puff = new THREE.Mesh(
        new THREE.SphereGeometry(1.2 - j * 0.3, 16, 16),
        cloudMat
      );
      puff.position.x = j * 1.3 - 1.3;
      puff.position.y = Math.sin(j) * 0.3;
      cloud.add(puff);
    }
    cloud.position.set(x, y, z);
    cloud.scale.setScalar(1.2);
    scene.add(cloud);
  }
}
