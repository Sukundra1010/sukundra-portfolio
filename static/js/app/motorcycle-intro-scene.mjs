import * as THREE from "https://cdn.jsdelivr.net/npm/three@0.180.0/build/three.module.js";

const clamp01 = (value) => Math.min(1, Math.max(0, value));

const smoothStep = (start, end, value) => {
  const amount = clamp01((value - start) / (end - start));
  return amount * amount * (3 - 2 * amount);
};

const createGlowTexture = () => {
  const canvas = document.createElement("canvas");
  canvas.width = 128;
  canvas.height = 128;
  const context = canvas.getContext("2d");
  if (!context) throw new Error("Could not create the motorcycle headlight glow.");

  const gradient = context.createRadialGradient(64, 64, 2, 64, 64, 62);
  gradient.addColorStop(0, "rgba(206, 241, 255, 0.95)");
  gradient.addColorStop(0.16, "rgba(113, 196, 255, 0.52)");
  gradient.addColorStop(0.55, "rgba(79, 131, 255, 0.14)");
  gradient.addColorStop(1, "rgba(50, 80, 255, 0)");
  context.fillStyle = gradient;
  context.fillRect(0, 0, canvas.width, canvas.height);

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  return texture;
};

export const createMotorcycleIntroScene = ({ canvas, overlay, imageUrl }) => {
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
  scene.fog = new THREE.FogExp2(0x070b18, 0.033);

  const camera = new THREE.PerspectiveCamera(38, 1, 0.1, 60);
  camera.position.set(0, 2.65, compact ? 10.2 : 9.2);
  camera.lookAt(0, 2.65, 0);

  scene.add(new THREE.HemisphereLight(0xa6c1ff, 0x080a16, 1.35));

  const blueLight = new THREE.PointLight(0x51baff, 0.25, 18);
  blueLight.position.set(-4.3, 3.8, 2.4);
  scene.add(blueLight);

  const violetLight = new THREE.PointLight(0x9670ff, 0.18, 16);
  violetLight.position.set(4.1, 3.3, -2.6);
  scene.add(violetLight);

  const floor = new THREE.Mesh(
    new THREE.PlaneGeometry(34, 28),
    new THREE.MeshStandardMaterial({
      color: 0x0b1020,
      metalness: 0.42,
      roughness: 0.38,
    }),
  );
  floor.rotation.x = -Math.PI / 2;
  floor.position.y = -0.02;
  scene.add(floor);

  const wall = new THREE.Mesh(
    new THREE.PlaneGeometry(28, 12),
    new THREE.MeshStandardMaterial({
      color: 0x090d1a,
      metalness: 0.2,
      roughness: 0.76,
      side: THREE.DoubleSide,
    }),
  );
  wall.position.set(0, 4.1, -3.2);
  scene.add(wall);

  const neonMaterials = [];
  [
    { x: -4.6, color: 0x42baff },
    { x: 4.6, color: 0x9571ff },
  ].forEach(({ x, color }) => {
    const material = new THREE.MeshStandardMaterial({
      color,
      emissive: color,
      emissiveIntensity: 0.04,
      metalness: 0.08,
      roughness: 0.3,
    });
    const strip = new THREE.Mesh(new THREE.BoxGeometry(0.055, 4.6, 0.05), material);
    strip.position.set(x, 2.75, -2.95);
    scene.add(strip);
    neonMaterials.push(material);
  });

  const bikeImageGroup = new THREE.Group();
  bikeImageGroup.position.set(0, 2.65, -0.3);
  scene.add(bikeImageGroup);

  const photoMaterial = new THREE.MeshBasicMaterial({
    color: 0xffffff,
    transparent: true,
    opacity: 0.32,
    side: THREE.DoubleSide,
    toneMapped: false,
  });
  const photo = new THREE.Mesh(new THREE.PlaneGeometry(6.25, 6.25), photoMaterial);
  bikeImageGroup.add(photo);

  const glowTexture = createGlowTexture();
  const headlightHalos = [-0.38, 0.42].map((offset) => {
    const halo = new THREE.Mesh(
      new THREE.PlaneGeometry(2.15, 2.15),
      new THREE.MeshBasicMaterial({
        map: glowTexture,
        color: 0x9bdcff,
        transparent: true,
        opacity: 0,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
        toneMapped: false,
      }),
    );
    halo.position.set(1.94 + offset, -0.48, 0.035);
    bikeImageGroup.add(halo);
    return halo;
  });

  let disposed = false;
  const photoLoader = new THREE.TextureLoader();
  photoLoader.load(
    imageUrl,
    (texture) => {
      if (disposed) {
        texture.dispose();
        return;
      }
      texture.colorSpace = THREE.SRGBColorSpace;
      texture.anisotropy = renderer.capabilities.getMaxAnisotropy();
      photoMaterial.map = texture;
      photoMaterial.needsUpdate = true;
    },
    undefined,
    (error) => {
      if (!disposed) {
        console.warn("The motorcycle reference image could not be loaded.", error);
      }
    },
  );

  const particlePositions = new Float32Array(54 * 3);
  for (let index = 0; index < particlePositions.length; index += 3) {
    const seed = index / 3;
    particlePositions[index] = Math.sin(seed * 12.9898) * 5.3;
    particlePositions[index + 1] = 0.3 + ((seed * 0.618) % 4.5);
    particlePositions[index + 2] = Math.cos(seed * 8.233) * 2.8 - 1.5;
  }
  const particleGeometry = new THREE.BufferGeometry();
  particleGeometry.setAttribute("position", new THREE.BufferAttribute(particlePositions, 3));
  const particles = new THREE.Points(
    particleGeometry,
    new THREE.PointsMaterial({
      color: 0x98caff,
      size: 0.024,
      transparent: true,
      opacity: 0.42,
      sizeAttenuation: true,
    }),
  );
  scene.add(particles);

  const pointer = { x: 0, y: 0 };
  const onPointerMove = (event) => {
    if (event.pointerType === "touch") return;
    const bounds = overlay.getBoundingClientRect();
    pointer.x = ((event.clientX - bounds.left) / bounds.width - 0.5) * 1.5;
    pointer.y = ((event.clientY - bounds.top) / bounds.height - 0.5) * 0.7;
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
    const fitDistance =
      6.25 / (2 * Math.tan(THREE.MathUtils.degToRad(camera.fov / 2)) * Math.min(camera.aspect, 1));
    camera.position.z = Math.max(compact ? 9.8 : 9.2, fitDistance * 1.08);
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

  let startedAt = 0;
  let animationFrame = 0;

  const render = (time) => {
    animationFrame = 0;
    if (disposed || document.hidden) return;

    const elapsed = startedAt ? Math.max(0, (time - startedAt) / 1000) : 0;
    const lightsOn = smoothStep(0.05, 0.95, elapsed);
    const headlightOn = smoothStep(3.1, 3.8, elapsed);
    const ride = smoothStep(3.8, 4.8, elapsed);
    const rideSeconds = Math.max(0, elapsed - 3.8);

    blueLight.intensity = 0.25 + lightsOn * 5.4;
    violetLight.intensity = 0.18 + lightsOn * 4.1;
    neonMaterials.forEach((material) => {
      material.emissiveIntensity = 0.04 + lightsOn * 2.1;
    });
    photoMaterial.opacity = 0.32 + lightsOn * 0.68;
    headlightHalos.forEach((halo) => {
      halo.material.opacity = headlightOn * 0.76;
    });

    bikeImageGroup.position.x = Math.sin(rideSeconds * 0.28) * 0.16 * ride;
    bikeImageGroup.position.z = -0.3 + ride * (0.62 + Math.sin(rideSeconds * 0.8) * 0.12);
    bikeImageGroup.scale.setScalar(1 + ride * (0.055 + Math.sin(rideSeconds * 1.1) * 0.016));
    bikeImageGroup.rotation.y = pointer.x * 0.035 + Math.sin(rideSeconds * 0.38) * 0.035 * ride;
    bikeImageGroup.rotation.x = -pointer.y * 0.018 + Math.sin(rideSeconds * 0.62) * 0.012 * ride;
    camera.position.x +=
      (pointer.x + Math.sin(rideSeconds * 1.4) * 0.07 * ride - camera.position.x) * 0.025;
    camera.position.y +=
      (2.65 - pointer.y * 0.45 + Math.sin(rideSeconds * 1.9) * 0.04 * ride - camera.position.y) *
      0.025;
    camera.lookAt(-ride * 0.2, 2.65, ride * 0.25);
    particles.rotation.y += 0.0007 + ride * 0.0014;

    const particleAttribute = particleGeometry.getAttribute("position");
    for (let index = 2; index < particleAttribute.array.length; index += 3) {
      particleAttribute.array[index] += ride * 0.07;
      if (particleAttribute.array[index] > 4.8) particleAttribute.array[index] -= 9.2;
    }
    particleAttribute.needsUpdate = ride > 0;

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
        const materialsToDispose = Array.isArray(object.material)
          ? object.material
          : [object.material];
        materialsToDispose.forEach((material) => {
          material.map?.dispose();
          material.dispose();
        });
      });
      renderer.dispose();
    },
  };
};
