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

const createEdgeMask = () => {
  const canvas = document.createElement("canvas");
  canvas.width = 512;
  canvas.height = 512;
  const context = canvas.getContext("2d");
  if (!context) throw new Error("Could not create the motorcycle image edge mask.");

  const gradient = context.createRadialGradient(256, 256, 28, 256, 256, 362);
  gradient.addColorStop(0, "#fff");
  gradient.addColorStop(0.55, "#fff");
  gradient.addColorStop(1, "#000");
  context.fillStyle = gradient;
  context.fillRect(0, 0, canvas.width, canvas.height);

  return new THREE.CanvasTexture(canvas);
};

const createSmokeTexture = () => {
  const canvas = document.createElement("canvas");
  canvas.width = 256;
  canvas.height = 128;
  const context = canvas.getContext("2d");
  if (!context) throw new Error("Could not create the garage smoke texture.");

  [
    { x: 82, y: 72, radius: 66, alpha: 0.19 },
    { x: 142, y: 54, radius: 58, alpha: 0.15 },
    { x: 186, y: 78, radius: 50, alpha: 0.13 },
  ].forEach(({ x, y, radius, alpha }) => {
    const gradient = context.createRadialGradient(x, y, 4, x, y, radius);
    gradient.addColorStop(0, `rgba(202, 220, 255, ${alpha})`);
    gradient.addColorStop(0.55, `rgba(132, 164, 221, ${alpha * 0.55})`);
    gradient.addColorStop(1, "rgba(102, 130, 196, 0)");
    context.fillStyle = gradient;
    context.fillRect(0, 0, canvas.width, canvas.height);
  });

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  return texture;
};

export const createMotorcycleIntroScene = ({ canvas, overlay, imageUrl, jumpImageUrl }) => {
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

  const environmentLight = new THREE.HemisphereLight(0xa6c1ff, 0x080a16, 0.08);
  scene.add(environmentLight);

  const blueLight = new THREE.PointLight(0x51baff, 0.25, 18);
  blueLight.position.set(-4.3, 3.8, 2.4);
  scene.add(blueLight);

  const fillLight = new THREE.PointLight(0x68a9e8, 0.18, 16);
  fillLight.position.set(4.1, 3.3, -2.6);
  scene.add(fillLight);

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
    { x: 4.6, color: 0x5d95d4 },
  ].forEach(({ x, color }) => {
    const material = new THREE.MeshStandardMaterial({
      color,
      emissive: color,
      emissiveIntensity: 0.04,
      metalness: 0.08,
      roughness: 0.3,
    });
    const strip = new THREE.Mesh(new THREE.BoxGeometry(0.025, 4.6, 0.05), material);
    strip.position.set(x, 2.75, -2.95);
    scene.add(strip);
    neonMaterials.push(material);
  });

  const bikeImageGroup = new THREE.Group();
  bikeImageGroup.position.set(0, 2.65, -0.3);
  scene.add(bikeImageGroup);

  let imageLoaded = false;
  const photoMaterial = new THREE.MeshBasicMaterial({
    color: 0xffffff,
    alphaMap: createEdgeMask(),
    transparent: true,
    opacity: 0,
    side: THREE.DoubleSide,
    toneMapped: false,
  });
  const photo = new THREE.Mesh(new THREE.PlaneGeometry(6.25, 6.25), photoMaterial);
  bikeImageGroup.add(photo);

  const jumpImageWidth = 7.5;
  const jumpImageHeight = (jumpImageWidth * 768) / 1365;
  const jumpImageGroup = new THREE.Group();
  jumpImageGroup.position.set(0, 2.65, -0.42);
  scene.add(jumpImageGroup);

  let jumpImageLoaded = false;
  const jumpPhotoMaterial = new THREE.MeshBasicMaterial({
    color: 0x8999b2,
    alphaMap: createEdgeMask(),
    transparent: true,
    opacity: 0,
    side: THREE.DoubleSide,
    toneMapped: false,
  });
  const jumpPhoto = new THREE.Mesh(
    new THREE.PlaneGeometry(jumpImageWidth, jumpImageHeight),
    jumpPhotoMaterial,
  );
  jumpPhoto.position.z = 0.01;
  jumpImageGroup.add(jumpPhoto);

  const wheelOverlayGroups = [];
  const wheelOverlayMaterials = [];
  const addWheelOverlay = ({ imageX, imageY, imageRadius }) => {
    const radius = (imageRadius / 1365) * jumpImageWidth;
    const group = new THREE.Group();
    group.position.set(
      (imageX / 1365 - 0.5) * jumpImageWidth,
      (0.5 - imageY / 768) * jumpImageHeight,
      0.04,
    );

    const rimMaterial = new THREE.MeshBasicMaterial({
      color: 0x9dcfff,
      transparent: true,
      opacity: 0,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
      toneMapped: false,
    });
    const spokeMaterial = new THREE.LineBasicMaterial({
      color: 0xc3e3ff,
      transparent: true,
      opacity: 0,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
      toneMapped: false,
    });
    group.add(new THREE.Mesh(new THREE.TorusGeometry(radius, 0.012, 6, 40), rimMaterial));

    const spokePoints = [];
    for (let index = 0; index < 4; index += 1) {
      const angle = (index * Math.PI) / 4;
      const x = Math.cos(angle) * radius * 0.8;
      const y = Math.sin(angle) * radius * 0.8;
      spokePoints.push(new THREE.Vector3(-x, -y, 0), new THREE.Vector3(x, y, 0));
    }
    const spokeGeometry = new THREE.BufferGeometry().setFromPoints(spokePoints);
    group.add(new THREE.LineSegments(spokeGeometry, spokeMaterial));
    jumpImageGroup.add(group);
    wheelOverlayGroups.push(group);
    wheelOverlayMaterials.push(rimMaterial, spokeMaterial);
  };

  addWheelOverlay({ imageX: 1032, imageY: 224, imageRadius: 56 });
  addWheelOverlay({ imageX: 856, imageY: 360, imageRadius: 48 });

  const glowTexture = createGlowTexture();
  const floorReflections = [
    { x: -1.65, color: 0x55baff },
    { x: 1.65, color: 0x598ac2 },
  ].map(({ x, color }) => {
    const reflection = new THREE.Mesh(
      new THREE.PlaneGeometry(3.7, 2.2),
      new THREE.MeshBasicMaterial({
        map: glowTexture,
        color,
        transparent: true,
        opacity: 0,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
        toneMapped: false,
      }),
    );
    reflection.rotation.x = -Math.PI / 2;
    reflection.position.set(x, 0.006, 1.45);
    scene.add(reflection);
    return reflection;
  });

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

  const smokeTexture = createSmokeTexture();
  const smokeSprites = [
    { x: -3.1, y: 0.7, z: -1.15, color: 0x84b9ee, offset: 0.2 },
    { x: 3.2, y: 1.05, z: -1.25, color: 0x6889b2, offset: 1.8 },
    { x: -1.1, y: 0.28, z: -1.35, color: 0x9eb7dd, offset: 3.1 },
  ].map(({ x, y, z, color, offset }) => {
    const material = new THREE.SpriteMaterial({
      map: smokeTexture,
      color,
      transparent: true,
      opacity: 0.14,
      depthWrite: false,
    });
    const smoke = new THREE.Sprite(material);
    smoke.position.set(x, y, z);
    smoke.scale.set(3.6, 1.75, 1);
    smoke.userData.baseX = x;
    smoke.userData.baseY = y;
    smoke.userData.offset = offset;
    scene.add(smoke);
    return smoke;
  });

  const landingDustSprites = [-1, 1].map((direction) => {
    const material = new THREE.SpriteMaterial({
      map: smokeTexture,
      color: 0xd4edff,
      transparent: true,
      opacity: 0,
      depthWrite: false,
    });
    const sprite = new THREE.Sprite(material);
    sprite.userData.direction = direction;
    sprite.position.set(direction * 1.2, 2.15, 0.9);
    sprite.scale.set(1.5, 0.75, 1);
    scene.add(sprite);
    return sprite;
  });

  let disposed = false;
  let startedAt = 0;
  let landingTriggered = false;
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
      imageLoaded = true;
      if (!document.hidden) renderer.render(scene, camera);
    },
    undefined,
    (error) => {
      if (!disposed) {
        console.warn("The motorcycle reference image could not be loaded.", error);
      }
    },
  );
  photoLoader.load(
    jumpImageUrl,
    (texture) => {
      if (disposed) {
        texture.dispose();
        return;
      }
      texture.colorSpace = THREE.SRGBColorSpace;
      texture.anisotropy = renderer.capabilities.getMaxAnisotropy();
      jumpPhotoMaterial.map = texture;
      jumpPhotoMaterial.needsUpdate = true;
      jumpImageLoaded = true;
      if (!document.hidden) renderer.render(scene, camera);
    },
    undefined,
    (error) => {
      if (!disposed) {
        console.warn("The motorcycle jump image could not be loaded.", error);
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
  let cameraHomeZ = compact ? 9.8 : 9.2;
  const resize = () => {
    const bounds = overlay.getBoundingClientRect();
    if (!bounds.width || !bounds.height) return;
    camera.aspect = bounds.width / bounds.height;
    const fitDistance =
      6.25 / (2 * Math.tan(THREE.MathUtils.degToRad(camera.fov / 2)) * Math.min(camera.aspect, 1));
    cameraHomeZ = Math.max(compact ? 9.8 : 9.2, fitDistance * 1.08);
    camera.position.z = cameraHomeZ;
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

  let animationFrame = 0;

  const render = (time) => {
    animationFrame = 0;
    if (disposed || document.hidden) return;
    if (!startedAt) {
      renderer.render(scene, camera);
      return;
    }

    const elapsed = startedAt ? Math.max(0, (time - startedAt) / 1000) : 0;
    const lightsOn = smoothStep(0.45, 1.35, elapsed);
    const headlightOn = smoothStep(1.1, 1.8, elapsed);
    const ride = smoothStep(1.8, 2.6, elapsed);
    const rideSeconds = Math.max(0, elapsed - 1.8);
    const closeUpProgress = smoothStep(0, 1.8, elapsed);
    const jumpProgress = clamp01((elapsed - 2.4) / 1.8);
    const jumpArc = 4 * jumpProgress * (1 - jumpProgress);
    const jumpIn = smoothStep(1.9, 2.5, elapsed);
    const jumpOut = 1 - smoothStep(4.95, 5.5, elapsed);
    const jumpVisibility = jumpIn * jumpOut;
    const landingAge = Math.max(0, elapsed - 4.2);
    const landingImpact = elapsed >= 4.2 ? Math.exp(-landingAge * 5.5) : 0;
    const landingDust = smoothStep(4.2, 4.26, elapsed) * (1 - smoothStep(4.42, 4.92, elapsed));
    const sideExit = smoothStep(4.75, 5.45, elapsed);

    if (!landingTriggered && elapsed >= 4.2) {
      landingTriggered = true;
      overlay.dataset.landed = "true";
    }

    environmentLight.intensity = 0.08 + lightsOn * 1.27;
    blueLight.intensity = lightsOn * 5.4;
    fillLight.intensity = lightsOn * 3.4;
    neonMaterials.forEach((material) => {
      material.emissiveIntensity = 0.04 + lightsOn * 2.1;
    });
    const closeUpVisibility =
      smoothStep(0.04, 0.5, elapsed) * (1 - smoothStep(1.65, 2.35, elapsed));
    photoMaterial.opacity = imageLoaded ? closeUpVisibility * (0.72 + lightsOn * 0.28) : 0;
    jumpPhotoMaterial.opacity = jumpImageLoaded ? jumpVisibility * 0.94 : 0;
    wheelOverlayMaterials.forEach((material) => {
      material.opacity = jumpVisibility * 0.36;
    });
    wheelOverlayGroups.forEach((wheel, index) => {
      wheel.rotation.z = rideSeconds * (4.2 + ride * 1.4) + index * 0.4;
    });
    floorReflections.forEach((reflection) => {
      reflection.material.opacity = 0.025 + lightsOn * 0.2;
    });
    headlightHalos.forEach((halo) => {
      halo.material.opacity = headlightOn * 0.76;
    });
    smokeSprites.forEach((smoke) => {
      const drift = time * 0.00018 + smoke.userData.offset;
      smoke.position.x = smoke.userData.baseX + Math.sin(drift) * 0.38;
      smoke.position.y = smoke.userData.baseY + Math.cos(drift * 0.8) * 0.18;
      smoke.material.opacity = 0.1 + lightsOn * 0.06;
    });
    landingDustSprites.forEach((dust) => {
      dust.material.opacity = landingDust * 0.62;
      dust.position.x = dust.userData.direction * (1.2 + landingAge * 0.55);
      dust.position.y = 2.15 + landingAge * 0.55;
      dust.position.z = 0.9;
      dust.scale.set(1.8 + landingAge * 2.6, 0.9 + landingAge * 0.9, 1);
    });

    bikeImageGroup.position.x = Math.sin(rideSeconds * 0.28) * 0.16 * ride;
    bikeImageGroup.position.z = -0.3 + ride * (0.62 + Math.sin(rideSeconds * 0.8) * 0.12);
    bikeImageGroup.scale.setScalar(
      (1.62 - closeUpProgress * 0.62) * (1 + ride * (0.055 + Math.sin(rideSeconds * 1.1) * 0.016)),
    );
    bikeImageGroup.rotation.y = pointer.x * 0.035 + Math.sin(rideSeconds * 0.38) * 0.035 * ride;
    bikeImageGroup.rotation.x = -pointer.y * 0.018 + Math.sin(rideSeconds * 0.62) * 0.012 * ride;

    jumpImageGroup.position.x = Math.sin(rideSeconds * 1.1) * 0.12 - sideExit * 1.65;
    jumpImageGroup.position.y =
      2.65 +
      jumpArc * 0.62 -
      landingImpact * 0.48 +
      Math.sin(landingAge * 28) * landingImpact * 0.08;
    jumpImageGroup.position.z = -0.42 + ride * 0.78 + jumpArc * 0.18;
    jumpImageGroup.scale.setScalar(
      0.88 + ride * 0.12 + jumpArc * 0.06 - landingImpact * 0.04 - sideExit * 0.1,
    );
    jumpImageGroup.rotation.z = -jumpArc * 0.022 - landingImpact * 0.028 - sideExit * 0.035;

    const closeUpCamera = 1 - closeUpProgress;
    const cameraTargetZ = cameraHomeZ - closeUpCamera * 1.55 - ride * 0.35;
    camera.position.z += (cameraTargetZ - camera.position.z) * 0.07;
    camera.position.x +=
      (pointer.x +
        Math.sin(rideSeconds * 1.4) * 0.07 * ride +
        sideExit * 0.28 -
        camera.position.x) *
      0.025;
    camera.position.y +=
      (2.65 -
        pointer.y * 0.45 +
        Math.sin(rideSeconds * 1.9) * 0.04 * ride +
        jumpArc * 0.14 -
        landingImpact * 0.09 +
        Math.sin(landingAge * 32) * landingImpact * 0.04 -
        camera.position.y) *
      0.035;
    camera.lookAt(-ride * 0.2 + sideExit * 0.25, 2.65 + jumpArc * 0.16, ride * 0.25);
    particles.rotation.y += 0.0007 + ride * 0.0014;
    particles.material.opacity = 0.16 + lightsOn * 0.18 + smoothStep(4.2, 5.4, elapsed) * 0.28;

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
        const materialsToDispose = Array.isArray(object.material)
          ? object.material
          : [object.material];
        materialsToDispose.forEach((material) => {
          material.map?.dispose();
          material.alphaMap?.dispose();
          material.dispose();
        });
      });
      renderer.dispose();
    },
  };
};
