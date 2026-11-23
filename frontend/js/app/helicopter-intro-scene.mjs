import * as THREE from "https://cdn.jsdelivr.net/npm/three@0.180.0/build/three.module.js";

const clamp01 = (value) => Math.min(1, Math.max(0, value));

const smoothStep = (start, end, value) => {
  const amount = clamp01((value - start) / (end - start));
  return amount * amount * (3 - 2 * amount);
};

const createMaterial = (color, metalness = 0, roughness = 0.5) =>
  new THREE.MeshStandardMaterial({ color, metalness, roughness });

const addMesh = (parent, geometry, material, position, scale = [1, 1, 1], rotation = [0, 0, 0]) => {
  const mesh = new THREE.Mesh(geometry, material);
  mesh.position.set(...position);
  mesh.scale.set(...scale);
  mesh.rotation.set(...rotation);
  parent.add(mesh);
  return mesh;
};

const createHelicopter = (scene) => {
  const helicopter = new THREE.Group();
  const airframe = new THREE.Group();
  helicopter.add(airframe);

  const bodyMaterial = createMaterial(0x435c68, 0.72, 0.32);
  const darkMaterial = createMaterial(0x17232b, 0.58, 0.38);
  const metalMaterial = createMaterial(0xa6bac2, 0.82, 0.24);
  const glassMaterial = new THREE.MeshPhysicalMaterial({
    color: 0x7dc6dc,
    metalness: 0.28,
    roughness: 0.12,
    transparent: true,
    opacity: 0.68,
    clearcoat: 1,
    clearcoatRoughness: 0.08,
  });
  const lightMaterial = new THREE.MeshBasicMaterial({ color: 0xffc87a });

  addMesh(
    airframe,
    new THREE.SphereGeometry(1, 32, 24),
    bodyMaterial,
    [0, 0, 0],
    [1.75, 0.63, 0.62],
  );
  addMesh(
    airframe,
    new THREE.SphereGeometry(1, 32, 24),
    bodyMaterial,
    [1.03, -0.02, 0],
    [0.83, 0.49, 0.57],
  );
  addMesh(
    airframe,
    new THREE.SphereGeometry(1, 24, 18),
    darkMaterial,
    [1.72, 0.18, 0],
    [0.61, 0.35, 0.51],
  );

  const cockpit = addMesh(
    airframe,
    new THREE.SphereGeometry(1, 32, 24, 0, Math.PI * 2, 0, Math.PI * 0.62),
    glassMaterial,
    [1.69, 0.34, 0],
    [0.73, 0.4, 0.54],
    [0, 0, -0.12],
  );
  cockpit.material.side = THREE.DoubleSide;

  [-0.38, 0.38].forEach((side) => {
    addMesh(
      airframe,
      new THREE.BoxGeometry(0.56, 0.48, 0.035),
      glassMaterial,
      [0.35, 0.28, side],
      [0, side < 0 ? 0.06 : -0.06, -0.06],
    );
    addMesh(
      airframe,
      new THREE.BoxGeometry(0.63, 0.04, 0.045),
      metalMaterial,
      [0.35, 0.53, side],
      [0, 0, -0.04],
    );
  });

  const tailBoom = addMesh(
    airframe,
    new THREE.CylinderGeometry(0.13, 0.26, 3.1, 16),
    bodyMaterial,
    [-2.27, 0.18, 0],
    [1, 1, 1],
    [0, 0, Math.PI / 2],
  );
  tailBoom.position.x = -2.35;
  addMesh(
    airframe,
    new THREE.BoxGeometry(0.88, 0.11, 0.12),
    bodyMaterial,
    [-3.32, 0.55, 0],
    [0, 0, -0.08],
  );
  addMesh(
    airframe,
    new THREE.BoxGeometry(0.13, 0.63, 0.12),
    bodyMaterial,
    [-3.48, 0.2, 0],
    [0, 0, 0.14],
  );

  [-1, 1].forEach((side) => {
    const skid = addMesh(
      airframe,
      new THREE.CylinderGeometry(0.045, 0.045, 2.85, 10),
      darkMaterial,
      [-0.12, -0.86, side * 0.48],
      [1, 1, 1],
      [0, 0, Math.PI / 2],
    );
    skid.position.x = -0.15;
    [-0.9, 0.8].forEach((x) => {
      addMesh(airframe, new THREE.CylinderGeometry(0.035, 0.035, 0.68, 8), metalMaterial, [
        x,
        -0.55,
        side * 0.48,
      ]);
    });
  });

  addMesh(
    airframe,
    new THREE.CylinderGeometry(0.16, 0.21, 0.42, 16),
    metalMaterial,
    [-0.1, 0.74, 0],
  );
  const mainRotor = new THREE.Group();
  mainRotor.position.set(-0.1, 0.98, 0);
  airframe.add(mainRotor);
  addMesh(mainRotor, new THREE.CylinderGeometry(0.25, 0.25, 0.08, 20), darkMaterial, [0, 0, 0]);
  [0, Math.PI / 2, Math.PI, (Math.PI * 3) / 2].forEach((angle) => {
    addMesh(
      mainRotor,
      new THREE.BoxGeometry(3.2, 0.055, 0.2),
      darkMaterial,
      [1.52, 0.035, 0],
      [1, 1, 1],
      [0, angle, -0.018],
    );
    addMesh(
      mainRotor,
      new THREE.BoxGeometry(0.42, 0.06, 0.24),
      metalMaterial,
      [Math.cos(angle) * 2.91, 0.035, -Math.sin(angle) * 2.91],
      [1, 1, 1],
      [0, angle, -0.018],
    );
  });

  const tailRotor = new THREE.Group();
  tailRotor.position.set(-3.45, 0.45, 0.68);
  airframe.add(tailRotor);
  addMesh(
    tailRotor,
    new THREE.CylinderGeometry(0.12, 0.12, 0.12, 16),
    metalMaterial,
    [0, 0, 0],
    [Math.PI / 2, 0, 0],
  );
  [0, Math.PI / 2, Math.PI, (Math.PI * 3) / 2].forEach((angle) => {
    addMesh(
      tailRotor,
      new THREE.BoxGeometry(0.09, 0.68, 0.075),
      darkMaterial,
      [Math.sin(angle) * 0.36, Math.cos(angle) * 0.36, 0],
      [1, 1, 1],
      [0, 0, angle],
    );
  });

  addMesh(airframe, new THREE.SphereGeometry(0.12, 16, 12), lightMaterial, [2.16, -0.05, 0]);
  addMesh(airframe, new THREE.SphereGeometry(0.08, 16, 12), lightMaterial, [-3.42, 0.6, 0]);
  const shadow = new THREE.Mesh(
    new THREE.CircleGeometry(1.7, 48),
    new THREE.MeshBasicMaterial({ color: 0x101a22, transparent: true, opacity: 0.36 }),
  );
  shadow.rotation.x = -Math.PI / 2;
  shadow.position.y = 0.01;
  shadow.scale.set(1.35, 0.56, 1);
  scene.add(shadow);
  scene.add(helicopter);

  return { helicopter, mainRotor, tailRotor, shadow };
};

export const createHelicopterIntroScene = ({ canvas, overlay, onMotion }) => {
  const compact = window.matchMedia("(max-width: 760px)").matches;
  const renderer = new THREE.WebGLRenderer({
    canvas,
    alpha: true,
    antialias: !compact,
    powerPreference: "low-power",
  });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, compact ? 1 : 1.5));
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;

  const scene = new THREE.Scene();
  scene.fog = new THREE.Fog(0x101b26, 15, 42);
  const camera = new THREE.PerspectiveCamera(36, 1, 0.1, 70);
  camera.position.set(0, 4.1, compact ? 14 : 12);
  camera.lookAt(0, 1.3, 0);

  scene.add(new THREE.HemisphereLight(0xc9e7ff, 0x25313c, 1.25));
  const keyLight = new THREE.DirectionalLight(0xffe1b4, 3.2);
  keyLight.position.set(-4, 8, 6);
  scene.add(keyLight);
  const fillLight = new THREE.PointLight(0x54b8ff, 22, 24);
  fillLight.position.set(4, 4, -2);
  scene.add(fillLight);

  const ground = new THREE.Mesh(
    new THREE.PlaneGeometry(80, 80),
    createMaterial(0x25313a, 0.18, 0.82),
  );
  ground.rotation.x = -Math.PI / 2;
  ground.position.y = -0.02;
  scene.add(ground);

  const helipad = new THREE.Mesh(
    new THREE.CircleGeometry(4.8, 64),
    new THREE.MeshStandardMaterial({
      color: 0x34434a,
      emissive: 0x142932,
      emissiveIntensity: 0.4,
      roughness: 0.74,
      metalness: 0.24,
    }),
  );
  helipad.rotation.x = -Math.PI / 2;
  helipad.position.y = 0.005;
  scene.add(helipad);

  const padRing = new THREE.Mesh(
    new THREE.RingGeometry(4.58, 4.66, 64),
    new THREE.MeshBasicMaterial({ color: 0x8bcbd9, transparent: true, opacity: 0.56 }),
  );
  padRing.rotation.x = -Math.PI / 2;
  padRing.position.y = 0.014;
  scene.add(padRing);

  const runwayLineMaterial = new THREE.MeshBasicMaterial({
    color: 0xd4e7e8,
    transparent: true,
    opacity: 0.52,
  });
  [-1.4, -0.7, 0, 0.7, 1.4].forEach((z) => {
    const marking = new THREE.Mesh(new THREE.BoxGeometry(0.1, 0.012, 0.34), runwayLineMaterial);
    marking.position.set(0, 0.018, z);
    scene.add(marking);
  });

  const { helicopter, mainRotor, tailRotor, shadow } = createHelicopter(scene);
  helicopter.position.set(0, 0.95, 0);
  helicopter.rotation.y = 0.42;
  const pointer = { x: 0, y: 0 };
  const onPointerMove = (event) => {
    if (event.pointerType === "touch") return;
    const bounds = overlay.getBoundingClientRect();
    pointer.x = ((event.clientX - bounds.left) / bounds.width - 0.5) * 0.35;
    pointer.y = ((event.clientY - bounds.top) / bounds.height - 0.5) * 0.16;
  };
  const onPointerLeave = () => {
    pointer.x = 0;
    pointer.y = 0;
  };
  overlay.addEventListener("pointermove", onPointerMove, { passive: true });
  overlay.addEventListener("pointerleave", onPointerLeave, { passive: true });

  let resizeObserver;
  const resize = () => {
    const bounds = overlay.getBoundingClientRect();
    if (!bounds.width || !bounds.height) return;
    camera.aspect = bounds.width / bounds.height;
    camera.position.z = Math.max(compact ? 14 : 12, 8.6 / Math.min(camera.aspect, 1));
    camera.updateProjectionMatrix();
    renderer.setSize(bounds.width, bounds.height, false);
  };
  if ("ResizeObserver" in window) {
    resizeObserver = new ResizeObserver(resize);
    resizeObserver.observe(overlay);
  } else {
    window.addEventListener("resize", resize);
  }
  resize();

  let disposed = false;
  let startedAt = 0;
  let previousTime = 0;
  let animationFrame = 0;
  const render = (time) => {
    animationFrame = 0;
    if (disposed || document.hidden) return;
    if (!startedAt) {
      renderer.render(scene, camera);
      return;
    }

    const elapsed = Math.max(0, (time - startedAt) / 1000);
    const delta = previousTime ? Math.min((time - previousTime) / 1000, 0.05) : 0;
    previousTime = time;
    const rotorSpin = smoothStep(0.15, 1.8, elapsed);
    const liftOff = smoothStep(2.15, 3.5, elapsed);
    const hoverTurn = smoothStep(3.3, 4.75, elapsed);
    const flyby = smoothStep(4.6, 6.35, elapsed);
    const acceleration = smoothStep(3.7, 5.9, elapsed);
    const flightBob = Math.sin(elapsed * 2.3) * 0.11 * liftOff;
    const travelX = Math.sin(Math.max(0, elapsed - 3.4) * 0.72) * 0.48 + flyby * 1.7;
    const rotorSpeed = 0.16 + rotorSpin * (0.84 + acceleration * 0.18);

    helicopter.position.x += (travelX - helicopter.position.x) * 0.065;
    helicopter.position.y = 0.95 + liftOff * 2.45 + flightBob;
    helicopter.rotation.y = 0.42 + hoverTurn * 1.02 + flyby * 0.23;
    helicopter.rotation.z = Math.sin(elapsed * 1.25) * 0.025 * liftOff + acceleration * 0.035;
    helicopter.rotation.x = pointer.y;
    helicopter.rotation.y += pointer.x;
    mainRotor.rotation.y += delta * (16 + rotorSpeed * 27);
    tailRotor.rotation.z += delta * (20 + rotorSpeed * 36);
    shadow.position.x = helicopter.position.x;
    shadow.material.opacity = 0.36 - liftOff * 0.2;
    shadow.scale.set(1.35 + liftOff * 0.55, 0.56 + liftOff * 0.18, 1);

    camera.position.x += (helicopter.position.x * 0.43 - camera.position.x) * 0.025;
    camera.position.y += (4.1 + liftOff * 0.35 + pointer.y - camera.position.y) * 0.025;
    camera.lookAt(helicopter.position.x * 0.2, 1.2 + liftOff * 0.52, 0);
    onMotion?.({
      rotorSpeed,
      acceleration,
      pan: flyby * 2 - 1,
      doppler: 1 - flyby * 2,
    });

    renderer.render(scene, camera);
    animationFrame = window.requestAnimationFrame(render);
  };

  const startRendering = () => {
    if (!disposed && !document.hidden && !animationFrame) {
      animationFrame = window.requestAnimationFrame(render);
    }
  };
  const onVisibilityChange = () => {
    if (document.hidden) {
      window.cancelAnimationFrame(animationFrame);
      animationFrame = 0;
    } else {
      startRendering();
    }
  };
  document.addEventListener("visibilitychange", onVisibilityChange);
  startRendering();

  return {
    startExperience(timestamp = performance.now()) {
      startedAt = timestamp;
      startRendering();
    },
    dispose() {
      if (disposed) return;
      disposed = true;
      window.cancelAnimationFrame(animationFrame);
      resizeObserver?.disconnect();
      if (!resizeObserver) window.removeEventListener("resize", resize);
      document.removeEventListener("visibilitychange", onVisibilityChange);
      overlay.removeEventListener("pointermove", onPointerMove);
      overlay.removeEventListener("pointerleave", onPointerLeave);
      scene.traverse((object) => {
        object.geometry?.dispose();
        if (!object.material) return;
        const materials = Array.isArray(object.material) ? object.material : [object.material];
        materials.forEach((material) => material.dispose());
      });
      renderer.dispose();
    },
  };
};
