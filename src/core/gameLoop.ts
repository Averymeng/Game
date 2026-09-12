import * as THREE from 'three';

export function createLoop(
  update: (dt: number) => void,
  render: () => void
): void {
  const clock = new THREE.Clock();

  function tick(): void {
    const dt = Math.min(clock.getDelta(), 0.1);
    update(dt);
    render();
    requestAnimationFrame(tick);
  }

  tick();
}
