const heroScene = document.querySelector("[data-hero-scene]");
const heroCanvas = document.querySelector("[data-hero-canvas]");
const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

if (heroScene && heroCanvas) {
  let renderer;
  let animationFrame = 0;
  let isVisible = false;
  let disposed = false;
  let renderScene;
  let resizeObserver;

  const startScene = async () => {
    if (heroScene.dataset.sceneStarted === "true") return;
    heroScene.dataset.sceneStarted = "true";

    try {
      const THREE =
        await import("https://cdn.jsdelivr.net/npm/three@0.180.0/build/three.module.js");
      if (disposed || !heroCanvas.isConnected) return;

      const scene = new THREE.Scene();
      const camera = new THREE.PerspectiveCamera(36, 1, 0.1, 60);
      camera.position.set(0, 0, 9.2);

      renderer = new THREE.WebGLRenderer({
        canvas: heroCanvas,
        alpha: true,
        antialias: !window.matchMedia("(max-width: 760px)").matches,
        powerPreference: "low-power",
      });
      renderer.setPixelRatio(
        Math.min(
          window.devicePixelRatio || 1,
          window.matchMedia("(max-width: 760px)").matches ? 1 : 1.5,
        ),
      );
      renderer.outputColorSpace = THREE.SRGBColorSpace;
      renderer.toneMapping = THREE.ACESFilmicToneMapping;

      scene.add(new THREE.AmbientLight(0xb9c9ff, 1.8));

      const violetLight = new THREE.PointLight(0x8568ff, 22, 14);
      violetLight.position.set(-3.2, 3.2, 3.5);
      scene.add(violetLight);

      const blueLight = new THREE.PointLight(0x3aaeff, 18, 12);
      blueLight.position.set(3.2, -1.6, 2.8);
      scene.add(blueLight);

      const workspace = new THREE.Group();
      scene.add(workspace);

      const core = new THREE.Group();
      const coreMesh = new THREE.Mesh(
        new THREE.IcosahedronGeometry(1.72, 2),
        new THREE.MeshPhysicalMaterial({
          color: 0x5266d9,
          emissive: 0x192466,
          emissiveIntensity: 0.45,
          metalness: 0.58,
          roughness: 0.32,
          transparent: true,
          opacity: 0.22,
          transmission: 0.28,
          thickness: 0.6,
        }),
      );
      core.add(coreMesh);

      const wireframe = new THREE.Mesh(
        new THREE.IcosahedronGeometry(1.78, 1),
        new THREE.MeshBasicMaterial({
          color: 0x9b9dff,
          wireframe: true,
          transparent: true,
          opacity: 0.19,
        }),
      );
      core.add(wireframe);
      workspace.add(core);

      const rings = [
        {
          radius: 2.12,
          tube: 0.018,
          color: 0x69d8ff,
          rotation: [0.82, 0.1, -0.32],
          speed: 0.00009,
        },
        {
          radius: 2.48,
          tube: 0.012,
          color: 0x9b7dff,
          rotation: [1.24, -0.1, 0.56],
          speed: -0.00007,
        },
        {
          radius: 2.83,
          tube: 0.008,
          color: 0x759cff,
          rotation: [0.38, 0.3, -0.16],
          speed: 0.00005,
        },
      ].map(({ radius, tube, color, rotation, speed }) => {
        const ring = new THREE.Mesh(
          new THREE.TorusGeometry(radius, tube, 8, 160),
          new THREE.MeshBasicMaterial({
            color,
            transparent: true,
            opacity: 0.55,
          }),
        );
        ring.rotation.set(...rotation);
        ring.userData.speed = speed;
        workspace.add(ring);
        return ring;
      });

      const badgeTexture = (label, accent) => {
        const canvas = document.createElement("canvas");
        canvas.width = 480;
        canvas.height = 176;
        const context = canvas.getContext("2d");
        if (!context) throw new Error("Could not create a canvas for the 3D skill badges.");

        context.shadowColor = accent;
        context.shadowBlur = 22;
        context.fillStyle = "rgba(12, 20, 40, 0.92)";
        context.beginPath();
        context.roundRect(10, 10, 460, 156, 42);
        context.fill();
        context.shadowBlur = 0;
        context.strokeStyle = `${accent}99`;
        context.lineWidth = 3;
        context.stroke();
        context.beginPath();
        context.arc(56, 88, 10, 0, Math.PI * 2);
        context.fillStyle = accent;
        context.fill();
        context.fillStyle = "#eef3ff";
        context.font = "600 48px Segoe UI, Arial, sans-serif";
        context.textBaseline = "middle";
        context.fillText(label, 88, 91);

        const texture = new THREE.CanvasTexture(canvas);
        texture.colorSpace = THREE.SRGBColorSpace;
        return texture;
      };

      const badges = [
        { label: "Python", accent: "#79d3ff", position: [-2.1, 1.72, 0.34] },
        { label: "React.js", accent: "#7ce6ff", position: [2.1, 1.72, 0.18] },
        { label: "JavaScript", accent: "#ffdc75", position: [2.1, -1.72, 0.3] },
        { label: "AI / ML", accent: "#bca2ff", position: [-2.1, -1.72, 0.15] },
      ];

      const badgeSprites = badges.map(({ label, accent, position }, index) => {
        const material = new THREE.SpriteMaterial({
          map: badgeTexture(label, accent),
          transparent: true,
          depthWrite: false,
        });
        const sprite = new THREE.Sprite(material);
        sprite.position.set(...position);
        sprite.scale.set(label === "JavaScript" ? 1.34 : 1.2, 0.44, 1);
        sprite.userData.baseY = position[1];
        sprite.userData.floatOffset = index * 1.5;
        workspace.add(sprite);
        return sprite;
      });

      const shapeMaterials = [
        new THREE.MeshStandardMaterial({
          color: 0xa999ff,
          emissive: 0x5246bc,
          emissiveIntensity: 0.65,
          metalness: 0.38,
          roughness: 0.3,
        }),
        new THREE.MeshStandardMaterial({
          color: 0x73dfff,
          emissive: 0x1d72a8,
          emissiveIntensity: 0.55,
          metalness: 0.42,
          roughness: 0.28,
        }),
        new THREE.MeshStandardMaterial({
          color: 0xffd77d,
          emissive: 0x8c5a19,
          emissiveIntensity: 0.42,
          metalness: 0.35,
          roughness: 0.3,
        }),
      ];
      const geometry = [
        new THREE.OctahedronGeometry(0.25, 0),
        new THREE.TorusGeometry(0.19, 0.065, 8, 24),
        new THREE.DodecahedronGeometry(0.22, 0),
      ];
      const orbitingShapes = geometry.map((shape, index) => {
        const mesh = new THREE.Mesh(shape, shapeMaterials[index]);
        const angle = (index / geometry.length) * Math.PI * 2 + 0.4;
        mesh.position.set(Math.cos(angle) * 2.3, Math.sin(angle) * 2.1, 0.58);
        mesh.userData.floatOffset = index * 2.1;
        workspace.add(mesh);
        return mesh;
      });

      const particlePositions = new Float32Array(126 * 3);
      for (let index = 0; index < particlePositions.length; index += 3) {
        const angle = Math.random() * Math.PI * 2;
        const radius = 2.95 + Math.random() * 0.8;
        particlePositions[index] = Math.cos(angle) * radius;
        particlePositions[index + 1] = Math.sin(angle) * radius * 0.76;
        particlePositions[index + 2] = (Math.random() - 0.5) * 1.8;
      }

      const particleGeometry = new THREE.BufferGeometry();
      particleGeometry.setAttribute("position", new THREE.BufferAttribute(particlePositions, 3));
      const particles = new THREE.Points(
        particleGeometry,
        new THREE.PointsMaterial({
          color: 0xa8bcff,
          size: 0.022,
          transparent: true,
          opacity: 0.58,
          sizeAttenuation: true,
        }),
      );
      workspace.add(particles);

      const resize = () => {
        const bounds = heroScene.getBoundingClientRect();
        if (!bounds.width || !bounds.height) return;
        camera.aspect = bounds.width / bounds.height;
        camera.position.z = bounds.width < 330 ? 10.1 : 9.2;
        camera.updateProjectionMatrix();
        renderer.setSize(bounds.width, bounds.height, false);
        renderer.render(scene, camera);
      };

      resizeObserver = new ResizeObserver(resize);
      resizeObserver.observe(heroScene);
      resize();

      const pointer = { x: 0, y: 0 };
      if (!reducedMotion) {
        heroScene.addEventListener(
          "pointermove",
          (event) => {
            if (event.pointerType === "touch") return;
            const bounds = heroScene.getBoundingClientRect();
            pointer.x = ((event.clientX - bounds.left) / bounds.width - 0.5) * 0.5;
            pointer.y = ((event.clientY - bounds.top) / bounds.height - 0.5) * 0.38;
          },
          { passive: true },
        );
        heroScene.addEventListener(
          "pointerleave",
          () => {
            pointer.x = 0;
            pointer.y = 0;
          },
          { passive: true },
        );
      }

      renderScene = (time = 0) => {
        animationFrame = 0;
        if (!isVisible || document.hidden) return;

        if (!reducedMotion) {
          const seconds = time * 0.001;
          const bounds = heroScene.getBoundingClientRect();
          const scrollTilt = THREE.MathUtils.clamp(
            (window.innerHeight * 0.5 - (bounds.top + bounds.height * 0.5)) /
              Math.max(window.innerHeight, 1),
            -1,
            1,
          );
          workspace.rotation.y +=
            (pointer.x * 0.18 + scrollTilt * 0.08 - workspace.rotation.y) * 0.035;
          workspace.rotation.x +=
            (-pointer.y * 0.14 - scrollTilt * 0.025 - workspace.rotation.x) * 0.035;
          core.rotation.y += 0.001;
          core.position.y = Math.sin(seconds * 0.75) * 0.07;

          rings.forEach((ring) => {
            ring.rotation.z += ring.userData.speed;
          });
          badgeSprites.forEach((sprite) => {
            sprite.position.y =
              sprite.userData.baseY + Math.sin(seconds * 0.8 + sprite.userData.floatOffset) * 0.045;
          });
          orbitingShapes.forEach((shape) => {
            shape.rotation.x += 0.003;
            shape.rotation.y += 0.004;
            shape.position.z = 0.58 + Math.sin(seconds + shape.userData.floatOffset) * 0.09;
          });
          particles.rotation.z += 0.00035;
        }

        renderer.render(scene, camera);
        if (!reducedMotion) animationFrame = window.requestAnimationFrame(renderScene);
      };

      const dispose = () => {
        disposed = true;
        window.cancelAnimationFrame(animationFrame);
        resizeObserver?.disconnect();
        scene.traverse((object) => {
          object.geometry?.dispose();
          if (object.material) {
            const materials = Array.isArray(object.material) ? object.material : [object.material];
            materials.forEach((material) => {
              material.map?.dispose();
              material.dispose();
            });
          }
        });
        renderer?.dispose();
      };

      const observer = new IntersectionObserver(
        (entries) => {
          isVisible = entries.some((entry) => entry.isIntersecting);
          if (isVisible && !document.hidden) {
            if (reducedMotion) renderScene();
            else if (!animationFrame) animationFrame = window.requestAnimationFrame(renderScene);
          } else {
            window.cancelAnimationFrame(animationFrame);
            animationFrame = 0;
          }
        },
        { threshold: 0.05 },
      );
      observer.observe(heroScene);

      document.addEventListener("visibilitychange", () => {
        if (document.hidden) {
          window.cancelAnimationFrame(animationFrame);
          animationFrame = 0;
        } else if (isVisible && !reducedMotion && !animationFrame) {
          animationFrame = window.requestAnimationFrame(renderScene);
        }
      });
      window.addEventListener("pagehide", dispose, { once: true });

      heroScene.dataset.sceneReady = "true";
    } catch (error) {
      console.warn(
        "The interactive hero scene could not load; the portrait remains available.",
        error,
      );
    }
  };

  if ("IntersectionObserver" in window) {
    const loader = new IntersectionObserver(
      (entries) => {
        if (!entries.some((entry) => entry.isIntersecting)) return;
        loader.disconnect();
        startScene();
      },
      { rootMargin: "160px" },
    );
    loader.observe(heroScene);
  } else {
    startScene();
  }
}
