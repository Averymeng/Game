import * as THREE from 'three';

export interface InputState {
  forward: boolean;
  backward: boolean;
  left: boolean;
  right: boolean;
}

// 蛋仔风玩家角色：白色蛋形身体 + 眼睛 + 腮红 + 头顶小叶子
export class Player {
  readonly group: THREE.Group;
  private readonly speed = 9;
  private readonly limit = 18; // 软边界半径，防止走丢

  constructor() {
    this.group = new THREE.Group();
    this.buildBody();
  }

  private buildBody(): void {
    // 身体（白色蛋形）
    const body = new THREE.Mesh(
      new THREE.SphereGeometry(0.85, 32, 32),
      new THREE.MeshToonMaterial({ color: 0xfffdf5 })
    );
    body.scale.y = 1.25;
    body.position.y = 1.05;
    body.castShadow = true;
    this.group.add(body);

    // 眼睛
    const eyeMat = new THREE.MeshToonMaterial({ color: 0x333333 });
    const eyeL = new THREE.Mesh(new THREE.SphereGeometry(0.14, 16, 16), eyeMat);
    eyeL.position.set(-0.28, 1.3, -0.7);
    this.group.add(eyeL);
    const eyeR = eyeL.clone();
    eyeR.position.x = 0.28;
    this.group.add(eyeR);

    // 腮红
    const cheekMat = new THREE.MeshToonMaterial({ color: 0xff9eb5 });
    const cheekL = new THREE.Mesh(new THREE.SphereGeometry(0.12, 16, 16), cheekMat);
    cheekL.position.set(-0.42, 0.9, -0.65);
    this.group.add(cheekL);
    const cheekR = cheekL.clone();
    cheekR.position.x = 0.42;
    this.group.add(cheekR);

    // 头顶小叶子
    const sprout = new THREE.Mesh(
      new THREE.SphereGeometry(0.18, 16, 16),
      new THREE.MeshToonMaterial({ color: 0x7ed957 })
    );
    sprout.position.y = 2.2;
    this.group.add(sprout);
  }

  update(dt: number, input: InputState): void {
    let dx = 0;
    let dz = 0;
    if (input.forward) dz -= 1;
    if (input.backward) dz += 1;
    if (input.left) dx -= 1;
    if (input.right) dx += 1;

    if (dx === 0 && dz === 0) return;

    const dir = new THREE.Vector3(dx, 0, dz).normalize();
    this.group.position.addScaledVector(dir, this.speed * dt);
    // 脸朝向移动方向（模型默认脸朝 -Z）
    this.group.rotation.y = Math.atan2(-dir.x, -dir.z);

    // 软边界
    const p = this.group.position;
    const dist = Math.sqrt(p.x * p.x + p.z * p.z);
    if (dist > this.limit) {
      p.x = (p.x / dist) * this.limit;
      p.z = (p.z / dist) * this.limit;
    }
  }
}
