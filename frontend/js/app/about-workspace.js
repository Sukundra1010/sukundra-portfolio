const aboutThreeModuleUrl = "https://cdn.jsdelivr.net/npm/three@0.180.0/build/three.module.js";

const aboutStage = document.querySelector("[data-about-stage]");
const aboutCanvas = document.querySelector("[data-about-canvas]");
const aboutReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const aboutTypingAudio = aboutStage ? createTypingAudio(aboutStage) : null;

prepareBiographyReveal(document.querySelector("[data-about-biography]"));

if (aboutStage && aboutCanvas) {
  let loadStarted = false;

  async function loadWorkspace() {
    if (loadStarted) return;
    loadStarted = true;

    try {
      const THREE = await import(aboutThreeModuleUrl);
      createWorkspace(THREE);
    } catch (error) {
      console.error("Could not load the 3D About workspace.", error);
    }
  }

  function createWorkspace(THREE) {
    const renderer = new THREE.WebGLRenderer({
      canvas: aboutCanvas,
      alpha: true,
      antialias: true,
      powerPreference: "low-power",
    });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.5));
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.12;
    renderer.shadowMap.enabled = false;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(36, 1, 0.1, 40);
    camera.position.set(-1.7, 3.45, 8.2);
    camera.lookAt(0, 1.3, 0);

    const workspace = new THREE.Group();
    scene.add(workspace);

    const laptop = new THREE.Group();
    const laptopBaseY = 0.8;
    laptop.position.set(-0.58, laptopBaseY, -0.28);
    laptop.scale.setScalar(0.7);
    workspace.add(laptop);

    const ambientLight = new THREE.HemisphereLight(0xb9dcff, 0x141b35, 1.75);
    scene.add(ambientLight);

    const keyLight = new THREE.DirectionalLight(0xe4f3ff, 3.2);
    keyLight.position.set(-3.8, 7, 5);
    keyLight.castShadow = true;
    keyLight.shadow.mapSize.set(1024, 1024);
    keyLight.shadow.camera.left = -6;
    keyLight.shadow.camera.right = 6;
    keyLight.shadow.camera.top = 7;
    keyLight.shadow.camera.bottom = -5;
    keyLight.shadow.bias = -0.0002;
    scene.add(keyLight);

    const frontFill = new THREE.DirectionalLight(0xaccfff, 2.1);
    frontFill.position.set(4.5, 3.6, 7.5);
    scene.add(frontFill);

    const cyanLight = new THREE.PointLight(0x00cfff, 23, 8, 2);
    cyanLight.position.set(-3.3, 2.4, 2.2);
    scene.add(cyanLight);

    const purpleLight = new THREE.PointLight(0x8b5cf6, 21, 8, 2);
    purpleLight.position.set(3.2, 2.2, -1.1);
    scene.add(purpleLight);

    const warmRimLight = new THREE.PointLight(0xc8dfff, 12, 6, 2);
    warmRimLight.position.set(0.5, 4.3, -3.2);
    scene.add(warmRimLight);

    const environment = createEnvironmentTexture(THREE);
    scene.environment = environment;
    scene.environmentIntensity = 0.9;

    const chassisMaterial = new THREE.MeshPhysicalMaterial({
      color: 0x9aa9b9,
      metalness: 0.78,
      roughness: 0.24,
      clearcoat: 0.8,
      clearcoatRoughness: 0.24,
      envMapIntensity: 1.2,
    });
    const deckMaterial = new THREE.MeshPhysicalMaterial({
      color: 0x25364b,
      metalness: 0.72,
      roughness: 0.34,
      clearcoat: 0.42,
      envMapIntensity: 1,
    });
    const bezelMaterial = new THREE.MeshPhysicalMaterial({
      color: 0x111a28,
      metalness: 0.58,
      roughness: 0.24,
      clearcoat: 0.72,
      envMapIntensity: 1.05,
    });

    createWorkstationFurniture(THREE, workspace, chassisMaterial, deckMaterial);

    const base = new THREE.Mesh(
      createRoundedPrism(THREE, 4.55, 2.2, 0.15, 0.15, 0.035, true),
      chassisMaterial,
    );
    base.position.set(0, 0.08, 0);
    base.castShadow = true;
    base.receiveShadow = true;
    laptop.add(base);

    const deck = new THREE.Mesh(
      createRoundedPrism(THREE, 4.37, 2.08, 0.018, 0.12, 0.006, true),
      deckMaterial,
    );
    deck.position.set(0, 0.164, 0);
    deck.receiveShadow = true;
    laptop.add(deck);

    const keyboardPlate = new THREE.Mesh(
      new THREE.BoxGeometry(3.98, 0.016, 1.42),
      new THREE.MeshPhysicalMaterial({
        color: 0x142235,
        metalness: 0.48,
        roughness: 0.35,
      }),
    );
    keyboardPlate.position.set(0, 0.179, -0.18);
    laptop.add(keyboardPlate);

    const keyboard = addKeyboard(THREE, laptop);

    const screenCanvas = document.createElement("canvas");
    screenCanvas.width = 1280;
    screenCanvas.height = 720;
    const screenContext = screenCanvas.getContext("2d");
    if (!screenContext) throw new Error("The About workspace code texture could not be created.");

    const code = [
      "// React · JavaScript",
      "const developer = {",
      '  name: "Sukundra Pujara",',
      '  role: "Software Developer",',
      '  skills: ["Python", "JavaScript", "React"],',
      '  interests: ["AI", "Data Science",',
      '    "Robotics"]',
      "};",
      "<!-- HTML -->",
      '<main class="workspace">Hi</main>',
      "/* CSS */ .workspace { color: #00d4ff; }",
      "# Python",
      "def create(value):",
      "    return meaningful_insights(value)",
    ].join("\n");
    const openingCharacters = code.split("\n").slice(0, 8).join("\n").length;
    const screenTexture = new THREE.CanvasTexture(screenCanvas);
    screenTexture.colorSpace = THREE.SRGBColorSpace;
    screenTexture.minFilter = THREE.LinearFilter;
    screenTexture.magFilter = THREE.LinearFilter;
    screenTexture.generateMipmaps = false;

    const display = new THREE.Group();
    display.position.set(0, 0.04, -1.34);
    display.scale.setScalar(1.18);
    display.rotation.x = aboutReducedMotion ? -0.03 : -0.14;
    laptop.add(display);

    const monitorStand = new THREE.Mesh(new THREE.BoxGeometry(0.24, 1.08, 0.11), chassisMaterial);
    monitorStand.position.set(0, 0.67, -0.12);
    monitorStand.castShadow = true;
    display.add(monitorStand);

    const monitorFoot = new THREE.Mesh(
      createRoundedPrism(THREE, 0.78, 0.48, 0.07, 0.16, 0.018, true),
      chassisMaterial,
    );
    monitorFoot.position.set(0, 0.05, 0.02);
    monitorFoot.castShadow = true;
    display.add(monitorFoot);

    const screenFrame = new THREE.Mesh(
      createRoundedPrism(THREE, 4.46, 2.68, 0.14, 0.16, 0.028, false),
      chassisMaterial,
    );
    screenFrame.position.set(0, 1.32, 0);
    screenFrame.castShadow = true;
    screenFrame.receiveShadow = true;
    display.add(screenFrame);

    const screenBezel = new THREE.Mesh(
      createRoundedPrism(THREE, 4.29, 2.5, 0.018, 0.11, 0.006, false),
      bezelMaterial,
    );
    screenBezel.position.set(0, 1.32, 0.077);
    display.add(screenBezel);

    const screen = new THREE.Mesh(
      new THREE.PlaneGeometry(4.07, 2.28),
      new THREE.MeshBasicMaterial({
        map: screenTexture,
        toneMapped: false,
        side: THREE.DoubleSide,
      }),
    );
    screen.position.set(0, 1.32, 0.12);
    display.add(screen);

    const webcam = new THREE.Mesh(
      new THREE.SphereGeometry(0.027, 12, 8),
      new THREE.MeshBasicMaterial({ color: 0x68dfff }),
    );
    webcam.position.set(0, 2.58, 0.12);
    display.add(webcam);

    const screenGlow = new THREE.PointLight(0x41bfff, 3.3, 2.7, 2);
    screenGlow.position.set(0, 1.3, 0.34);
    display.add(screenGlow);

    const developerAnimator = createDeveloper(THREE, workspace, laptop, keyboard);

    const floorShadow = new THREE.Mesh(
      new THREE.PlaneGeometry(13, 10),
      new THREE.ShadowMaterial({ opacity: 0.26 }),
    );
    floorShadow.rotation.x = -Math.PI / 2;
    floorShadow.position.y = -0.08;
    floorShadow.receiveShadow = true;
    scene.add(floorShadow);

    const glowPlane = new THREE.Mesh(
      new THREE.CircleGeometry(3.7, 64),
      new THREE.MeshBasicMaterial({
        color: 0x117dcb,
        transparent: true,
        opacity: 0.075,
        depthWrite: false,
        side: THREE.DoubleSide,
      }),
    );
    glowPlane.rotation.x = -Math.PI / 2;
    glowPlane.position.set(0, -0.07, 0.05);
    glowPlane.scale.set(1.4, 0.74, 1);
    scene.add(glowPlane);

    const iconCards = createTechnologyCards(THREE, workspace);
    createHolographicPanels(THREE, workspace);
    createLightTrails(THREE, workspace);
    const particles = createParticles(THREE, scene);

    const pointer = { x: 0, y: 0, targetX: 0, targetY: 0 };
    const clock = new THREE.Clock();
    let animationId = 0;
    let isInView = false;
    let typedCharacters = openingCharacters;
    let nextTypingAt = performance.now() + 900;
    let pauseUntil = 0;
    let openProgress = aboutReducedMotion ? 1 : 0;
    let lastScreenState = "";

    function resize() {
      const bounds = aboutStage.getBoundingClientRect();
      const width = Math.max(1, Math.round(bounds.width));
      const height = Math.max(1, Math.round(bounds.height));
      renderer.setSize(width, height, false);
      camera.aspect = width / height;
      camera.fov = camera.aspect < 1.05 ? 42 : 36;
      camera.updateProjectionMatrix();
      if (aboutReducedMotion) renderer.render(scene, camera);
    }

    function updateCodeScreen(now) {
      let cursorVisible = true;

      if (!aboutReducedMotion) {
        if (typedCharacters < code.length && now >= nextTypingAt) {
          const character = code[typedCharacters];
          const keyIndex = keyboard.keyIndexForCharacter(character);
          keyboard.press(keyIndex);
          const fingerIndex =
            character === " "
              ? typedCharacters % 2 === 0
                ? 4
                : 9
              : fingerIndexForCharacter(character);
          developerAnimator.pressFinger(fingerIndex, keyIndex);
          aboutTypingAudio?.play(character === "\n" ? "enter" : "key");
          typedCharacters += 1;

          if (typedCharacters % 53 === 0 && typedCharacters < code.length) {
            const backspaceIndex = keyboard.keyIndexForCharacter("\b");
            keyboard.press(backspaceIndex);
            developerAnimator.pressFinger(8, backspaceIndex);
            aboutTypingAudio?.play("backspace");
          }

          const delay =
            character === "\n"
              ? 350
              : /[.,;:{}()[\]]/.test(character)
                ? 245
                : 68 + ((typedCharacters * 29) % 70);
          nextTypingAt = now + delay;
        } else if (typedCharacters === code.length) {
          if (!pauseUntil) {
            pauseUntil = now + 1900;
          } else if (now >= pauseUntil) {
            typedCharacters = openingCharacters;
            pauseUntil = 0;
            nextTypingAt = now + 500;
          }
        }

        cursorVisible = Math.floor(now / 480) % 2 === 0;
      } else {
        typedCharacters = code.length;
      }

      const state = `${typedCharacters}:${cursorVisible}`;
      if (state === lastScreenState) return;
      lastScreenState = state;
      drawCodeEditor(screenContext, screenCanvas, code, typedCharacters, cursorVisible);
      screenTexture.needsUpdate = true;
    }

    function renderFrame(now) {
      animationId = 0;
      if (!isInView || document.hidden) return;

      const delta = Math.min(clock.getDelta(), 0.05);
      const elapsed = clock.elapsedTime;
      updateCodeScreen(now);
      keyboard.update(delta);
      developerAnimator.update(elapsed, delta);

      if (!aboutReducedMotion) {
        openProgress = Math.min(1, openProgress + delta * 1.35);
        const openingEase = 1 - (1 - openProgress) ** 3;
        display.rotation.x = -0.14 + 0.11 * openingEase;
        pointer.x += (pointer.targetX - pointer.x) * 0.045;
        pointer.y += (pointer.targetY - pointer.y) * 0.045;
        camera.position.x = -1.7 + pointer.x * 0.12;
        camera.position.y = 3.45 - pointer.y * 0.08;
        camera.lookAt(0, 1.3, 0);
        workspace.rotation.y = pointer.x * 0.13 + Math.sin(elapsed * 0.18) * 0.035;
        workspace.rotation.x = pointer.y * -0.055;
        laptop.rotation.y = Math.sin(elapsed * 0.28) * 0.022;
        laptop.position.y = laptopBaseY + Math.sin(elapsed * 0.65) * 0.025;

        iconCards.forEach((card, index) => {
          card.position.y = card.userData.baseY + Math.sin(elapsed * 0.72 + index * 1.13) * 0.11;
          card.rotation.y = card.userData.baseRotationY + Math.sin(elapsed * 0.32 + index) * 0.16;
          card.rotation.x = Math.cos(elapsed * 0.37 + index * 0.7) * 0.08;
        });

        particles.rotation.y = elapsed * 0.018;
        particles.position.y = Math.sin(elapsed * 0.22) * 0.055;
      }

      renderer.render(scene, camera);
      if (!aboutReducedMotion) animationId = window.requestAnimationFrame(renderFrame);
    }

    function updateAnimationState() {
      const shouldRun = isInView && !document.hidden;
      if (shouldRun && !aboutReducedMotion && !animationId) {
        animationId = window.requestAnimationFrame(renderFrame);
      } else if (!shouldRun && animationId) {
        window.cancelAnimationFrame(animationId);
        animationId = 0;
      }
      if (shouldRun && aboutReducedMotion) renderFrame(performance.now());
    }

    function onPointerMove(event) {
      const bounds = aboutStage.getBoundingClientRect();
      pointer.targetX = ((event.clientX - bounds.left) / bounds.width - 0.5) * 2;
      pointer.targetY = ((event.clientY - bounds.top) / bounds.height - 0.5) * 2;
    }

    function onPointerLeave() {
      pointer.targetX = 0;
      pointer.targetY = 0;
    }

    aboutStage.addEventListener("pointermove", onPointerMove, { passive: true });
    aboutStage.addEventListener("pointerleave", onPointerLeave);
    window.addEventListener("resize", resize, { passive: true });
    document.addEventListener("visibilitychange", updateAnimationState);

    if ("IntersectionObserver" in window) {
      const visibilityObserver = new IntersectionObserver(
        ([entry]) => {
          isInView = entry.isIntersecting;
          updateAnimationState();
        },
        { rootMargin: "160px 0px" },
      );
      visibilityObserver.observe(aboutStage);
    } else {
      isInView = true;
    }

    resize();
    updateCodeScreen(performance.now());
    renderer.render(scene, camera);
    aboutStage.classList.add("is-rendered");
    updateAnimationState();
  }

  if ("IntersectionObserver" in window) {
    const loadObserver = new IntersectionObserver(
      ([entry], observer) => {
        if (!entry.isIntersecting) return;
        observer.disconnect();
        loadWorkspace();
      },
      { rootMargin: "280px 0px" },
    );
    loadObserver.observe(aboutStage);
  } else {
    loadWorkspace();
  }
}

function prepareBiographyReveal(biography) {
  if (!biography || biography.dataset.wordsPrepared) return;
  const heading = document.querySelector("[data-about-heading]");
  const keywords =
    /Artificial Intelligence|Computer Science|Web Development|Data Science|React\.js|JavaScript|Python|Django|Robotics/gi;
  const paragraphs = Array.from(biography.children).filter(
    (child) => child instanceof HTMLParagraphElement,
  );

  paragraphs.forEach((paragraph, paragraphIndex) => {
    paragraph.classList.add("about-paragraph-reveal");
    paragraph.style.setProperty("--about-paragraph-delay", `${paragraphIndex * 340}ms`);
    if (paragraphIndex === 1) paragraph.classList.add("about-paragraph-line-reveal");

    const textNodes = [];
    const walker = document.createTreeWalker(paragraph, NodeFilter.SHOW_TEXT);
    while (walker.nextNode()) textNodes.push(walker.currentNode);

    let wordIndex = 0;
    textNodes.forEach((textNode) => {
      const text = textNode.nodeValue || "";
      if (!text.trim()) return;

      const fragment = document.createDocumentFragment();
      let cursor = 0;

      function appendWords(value, isKeyword = false) {
        const parts = value.match(/\s+|[^\s]+/g) || [];
        parts.forEach((part) => {
          if (/^\s+$/.test(part)) {
            fragment.append(document.createTextNode(part));
            return;
          }

          const word = document.createElement("span");
          word.className = isKeyword ? "about-word about-keyword" : "about-word";
          word.style.setProperty(
            "--about-word-delay",
            paragraphIndex === 1 ? "0ms" : `${Math.min(wordIndex * 9, 450)}ms`,
          );
          word.textContent = part;
          wordIndex += 1;
          fragment.append(word);
        });
      }

      for (const match of text.matchAll(keywords)) {
        appendWords(text.slice(cursor, match.index));
        appendWords(match[0], true);
        cursor = match.index + match[0].length;
      }
      appendWords(text.slice(cursor));
      textNode.replaceWith(fragment);
    });
  });

  biography.dataset.wordsPrepared = "true";
  biography.classList.add("about-words-ready");
  heading?.classList.add("about-heading-ready");

  const lineRevealParagraph = paragraphs[1];
  if (lineRevealParagraph) {
    const setLineDelays = () => {
      const lines = new Map();
      lineRevealParagraph.querySelectorAll(".about-word").forEach((word) => {
        const lineTop = Math.round(word.getBoundingClientRect().top);
        if (!lines.has(lineTop)) lines.set(lineTop, []);
        lines.get(lineTop).push(word);
      });

      Array.from(lines.values()).forEach((line, lineIndex) => {
        line.forEach((word) => {
          word.style.setProperty("--about-word-delay", `${lineIndex * 95}ms`);
        });
      });
    };

    window.requestAnimationFrame(setLineDelays);
    if ("ResizeObserver" in window) {
      const lineResizeObserver = new ResizeObserver(() => {
        window.requestAnimationFrame(setLineDelays);
      });
      lineResizeObserver.observe(lineRevealParagraph);
    }
  }

  if (aboutReducedMotion || !("IntersectionObserver" in window)) {
    heading?.classList.add("is-reading");
    paragraphs.forEach((paragraph) => paragraph.classList.add("is-reading"));
    return;
  }

  const revealObserver = new IntersectionObserver(
    (entries, observer) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("is-reading");
        observer.unobserve(entry.target);
      });
    },
    { threshold: 0.08, rootMargin: "0px 0px -6% 0px" },
  );
  if (heading) revealObserver.observe(heading);
  paragraphs.forEach((paragraph) => revealObserver.observe(paragraph));
}

function createTypingAudio(stage) {
  const toggle = stage.querySelector("[data-about-sound-toggle]");
  const volumeControl = stage.querySelector("[data-about-volume]");
  const status = stage.querySelector("[data-about-sound-status]");
  if (!toggle || !volumeControl || !status) return null;

  const AudioContextConstructor = window.AudioContext || window.webkitAudioContext;
  let audioContext = null;
  let enabled = false;
  let volume = Number(volumeControl.value) / 100;

  function updateControls() {
    toggle.setAttribute("aria-pressed", String(enabled));
    toggle.setAttribute("aria-label", enabled ? "Turn typing sound off" : "Turn typing sound on");
    status.textContent = enabled ? "Mechanical typing sounds are on." : "Typing sound is off.";
  }

  toggle.addEventListener("click", async () => {
    if (!AudioContextConstructor) {
      status.textContent = "Typing sound is not supported in this browser.";
      toggle.disabled = true;
      console.error("Web Audio is not available for the About workspace typing sounds.");
      return;
    }

    try {
      if (!audioContext) audioContext = new AudioContextConstructor();
      if (!enabled) {
        await audioContext.resume();
        enabled = true;
      } else {
        enabled = false;
        await audioContext.suspend();
      }
      updateControls();
    } catch (error) {
      enabled = false;
      updateControls();
      status.textContent = "Typing sound could not be started. Check browser audio permissions.";
      console.error("Could not change the About workspace sound state.", error);
    }
  });

  volumeControl.addEventListener("input", () => {
    volume = Number(volumeControl.value) / 100;
    status.textContent = `Typing sound volume ${volumeControl.value} percent.`;
  });

  function play(kind) {
    if (!enabled || !audioContext || audioContext.state !== "running" || volume === 0) return;

    const now = audioContext.currentTime;
    const isEnter = kind === "enter";
    const isBackspace = kind === "backspace";
    const duration = isEnter ? 0.072 : isBackspace ? 0.042 : 0.027;
    const noiseBuffer = audioContext.createBuffer(
      1,
      Math.max(1, Math.floor(audioContext.sampleRate * duration)),
      audioContext.sampleRate,
    );
    const samples = noiseBuffer.getChannelData(0);
    for (let index = 0; index < samples.length; index += 1) {
      samples[index] = (Math.random() * 2 - 1) * (1 - index / samples.length);
    }

    const noise = audioContext.createBufferSource();
    noise.buffer = noiseBuffer;
    const filter = audioContext.createBiquadFilter();
    filter.type = isEnter ? "lowpass" : "bandpass";
    filter.frequency.value = isEnter ? 1250 : isBackspace ? 1850 : 2450;
    filter.Q.value = 0.72;

    const noiseGain = audioContext.createGain();
    const peak = volume * (isEnter ? 0.17 : isBackspace ? 0.12 : 0.095);
    noiseGain.gain.setValueAtTime(0.0001, now);
    noiseGain.gain.exponentialRampToValueAtTime(Math.max(0.0002, peak), now + 0.003);
    noiseGain.gain.exponentialRampToValueAtTime(0.0001, now + duration);
    noise.connect(filter).connect(noiseGain).connect(audioContext.destination);
    noise.start(now);
    noise.stop(now + duration);

    const body = audioContext.createOscillator();
    body.type = isEnter ? "triangle" : "sine";
    body.frequency.setValueAtTime(isEnter ? 150 : isBackspace ? 225 : 185, now);
    body.frequency.exponentialRampToValueAtTime(isEnter ? 95 : 120, now + duration);
    const bodyGain = audioContext.createGain();
    bodyGain.gain.setValueAtTime(0.0001, now);
    bodyGain.gain.exponentialRampToValueAtTime(volume * (isEnter ? 0.095 : 0.045), now + 0.003);
    bodyGain.gain.exponentialRampToValueAtTime(0.0001, now + duration);
    body.connect(bodyGain).connect(audioContext.destination);
    body.start(now);
    body.stop(now + duration);
  }

  updateControls();
  return { play };
}

function createRoundedPrism(THREE, width, height, depth, radius, bevel, horizontal) {
  const shape = createRoundedShape(THREE, width, height, radius);
  const geometry = new THREE.ExtrudeGeometry(shape, {
    depth: Math.max(0.001, depth - bevel * 2),
    bevelEnabled: bevel > 0,
    bevelSegments: 3,
    bevelSize: bevel,
    bevelThickness: bevel,
    curveSegments: 8,
    steps: 1,
  });
  geometry.translate(0, 0, -(depth - bevel * 2) / 2);
  if (horizontal) geometry.rotateX(-Math.PI / 2);
  geometry.computeVertexNormals();
  return geometry;
}

function createRoundedShape(THREE, width, height, radius) {
  const x = width / 2;
  const y = height / 2;
  const r = Math.min(radius, x * 0.5, y * 0.5);
  const shape = new THREE.Shape();
  shape.moveTo(-x + r, -y);
  shape.lineTo(x - r, -y);
  shape.quadraticCurveTo(x, -y, x, -y + r);
  shape.lineTo(x, y - r);
  shape.quadraticCurveTo(x, y, x - r, y);
  shape.lineTo(-x + r, y);
  shape.quadraticCurveTo(-x, y, -x, y - r);
  shape.lineTo(-x, -y + r);
  shape.quadraticCurveTo(-x, -y, -x + r, -y);
  return shape;
}

function addKeyboard(THREE, laptop) {
  const keyGeometry = new THREE.BoxGeometry(0.215, 0.047, 0.168);
  const keyMaterial = new THREE.MeshPhysicalMaterial({
    color: 0x20344c,
    metalness: 0.3,
    roughness: 0.28,
    clearcoat: 0.6,
    clearcoatRoughness: 0.24,
  });
  const rowCount = 5;
  const columnCount = 14;
  const keys = new THREE.InstancedMesh(keyGeometry, keyMaterial, rowCount * columnCount);
  const transform = new THREE.Object3D();
  const accent = new THREE.Color(0x294a69);
  const baseColor = new THREE.Color(0x20344c);
  const pressedColor = new THREE.Color(0x49d8ff);
  const keyPositions = [];
  const pressure = new Float32Array(rowCount * columnCount);
  let keyIndex = 0;

  for (let row = 0; row < rowCount; row += 1) {
    for (let column = 0; column < columnCount; column += 1) {
      const position = {
        x: -1.75 + column * 0.27,
        y: 0.217,
        z: -0.63 + row * 0.255,
      };
      keyPositions.push(position);
      transform.position.set(position.x, position.y, position.z);
      transform.updateMatrix();
      keys.setMatrixAt(keyIndex, transform.matrix);
      keys.setColorAt(keyIndex, (row + column) % 11 === 0 ? accent : baseColor);
      keyIndex += 1;
    }
  }

  keys.castShadow = true;
  keys.receiveShadow = true;
  laptop.add(keys);

  return {
    keyPositions,
    keyIndexForCharacter(character) {
      return keyIndexForCharacter(character, columnCount);
    },
    press(index) {
      if (index >= 0 && index < pressure.length) pressure[index] = 1;
    },
    update(delta) {
      let matricesChanged = false;
      for (let index = 0; index < pressure.length; index += 1) {
        const amount = pressure[index];
        if (amount <= 0) continue;

        const nextAmount = Math.max(0, amount - delta * 11);
        pressure[index] = nextAmount;
        const position = keyPositions[index];
        transform.position.set(position.x, position.y - nextAmount * 0.031, position.z);
        transform.scale.set(1, 1 - nextAmount * 0.2, 1);
        transform.updateMatrix();
        keys.setMatrixAt(index, transform.matrix);
        keys.setColorAt(index, baseColor.clone().lerp(pressedColor, nextAmount * 0.82));
        matricesChanged = true;
      }

      if (matricesChanged) {
        keys.instanceMatrix.needsUpdate = true;
        if (keys.instanceColor) keys.instanceColor.needsUpdate = true;
      }
    },
  };
}

function keyIndexForCharacter(character, columnCount) {
  const keyRows = ["1234567890-=", "qwertyuiop[]", "asdfghjkl;'", "zxcvbnm,./"];
  const key = character.toLowerCase();
  if (key === " ") return 4 * columnCount + 6;
  if (key === "\n") return 2 * columnCount + 12;
  if (key === "\b") return 1 * columnCount + 12;

  const row = keyRows.findIndex((keys) => keys.includes(key));
  if (row === -1) return 2 * columnCount + 12;
  const column = keyRows[row].indexOf(key);
  const offset = row === 0 ? 1 : row === 2 ? 1 : row === 3 ? 2 : 1;
  return row * columnCount + column + offset;
}

function fingerIndexForCharacter(character) {
  const key = character.toLowerCase();
  if (key === " ") return 4;
  if ("qaz1`".includes(key)) return 0;
  if ("wsx2".includes(key)) return 1;
  if ("edc34".includes(key)) return 2;
  if ("rfvtg5".includes(key)) return 3;
  if ("yhnujm6".includes(key)) return 5;
  if ("ik,7".includes(key)) return 6;
  if ("ol.8".includes(key)) return 7;
  if ("p;/'-=[]09".includes(key)) return 8;
  return key === "\n" || key === "\b" ? 8 : 9;
}

function createWorkstationFurniture(THREE, workspace, chassisMaterial, deckMaterial) {
  const desk = new THREE.Group();
  workspace.add(desk);

  const deskTop = new THREE.Mesh(
    createRoundedPrism(THREE, 5.35, 2.85, 0.15, 0.12, 0.025, true),
    new THREE.MeshPhysicalMaterial({
      color: 0x18263a,
      metalness: 0.55,
      roughness: 0.3,
      clearcoat: 0.8,
      clearcoatRoughness: 0.25,
    }),
  );
  deskTop.position.y = 0.82;
  deskTop.castShadow = true;
  deskTop.receiveShadow = true;
  desk.add(deskTop);

  const trim = new THREE.Mesh(
    new THREE.BoxGeometry(4.95, 0.018, 0.018),
    new THREE.MeshBasicMaterial({
      color: 0x1acdfa,
      transparent: true,
      opacity: 0.7,
    }),
  );
  trim.position.set(0, 0.78, 1.426);
  desk.add(trim);

  const legMaterial = new THREE.MeshStandardMaterial({
    color: 0x35485e,
    metalness: 0.72,
    roughness: 0.33,
  });
  [-2.28, 2.28].forEach((x) => {
    [-1.12, 1.12].forEach((z) => {
      const leg = new THREE.Mesh(new THREE.CylinderGeometry(0.055, 0.075, 0.83, 16), legMaterial);
      leg.position.set(x, 0.36, z);
      leg.castShadow = true;
      desk.add(leg);

      const foot = new THREE.Mesh(
        new THREE.CylinderGeometry(0.08, 0.08, 0.035, 16),
        chassisMaterial,
      );
      foot.position.set(x, -0.055, z);
      desk.add(foot);
    });
  });

  const apron = new THREE.Mesh(new THREE.BoxGeometry(4.55, 0.1, 0.16), deckMaterial);
  apron.position.set(0, 0.68, -1.08);
  desk.add(apron);

  const mouse = new THREE.Group();
  mouse.position.set(1.02, 0.905, 0.48);
  const mouseBody = new THREE.Mesh(
    createRoundedPrism(THREE, 0.26, 0.37, 0.105, 0.12, 0.02, true),
    new THREE.MeshPhysicalMaterial({
      color: 0x1d2c41,
      metalness: 0.44,
      roughness: 0.25,
      clearcoat: 0.84,
    }),
  );
  mouse.add(mouseBody);

  const mouseLine = new THREE.Mesh(
    new THREE.BoxGeometry(0.009, 0.008, 0.21),
    new THREE.MeshBasicMaterial({ color: 0x50dafa }),
  );
  mouseLine.position.set(0, 0.057, 0.015);
  mouse.add(mouseLine);

  const mouseWheel = new THREE.Mesh(
    new THREE.BoxGeometry(0.038, 0.012, 0.055),
    new THREE.MeshBasicMaterial({ color: 0x87e8ff }),
  );
  mouseWheel.position.set(0, 0.06, 0.067);
  mouse.add(mouseWheel);
  desk.add(mouse);

  const bookColors = [0x273e5c, 0x3e315f, 0x1e5266];
  bookColors.forEach((color, index) => {
    const book = new THREE.Mesh(
      createRoundedPrism(THREE, 0.7, 0.86, 0.12, 0.08, 0.012, true),
      new THREE.MeshStandardMaterial({ color, metalness: 0.18, roughness: 0.64 }),
    );
    book.position.set(-1.92 + index * 0.025, 0.94 + index * 0.125, -0.66 - index * 0.035);
    book.rotation.y = -0.12 + index * 0.08;
    book.castShadow = true;
    book.receiveShadow = true;
    desk.add(book);
  });

  const pot = new THREE.Mesh(
    new THREE.CylinderGeometry(0.2, 0.24, 0.34, 24),
    new THREE.MeshPhysicalMaterial({
      color: 0x28364c,
      metalness: 0.48,
      roughness: 0.32,
      clearcoat: 0.68,
    }),
  );
  pot.position.set(2.1, 1.02, -0.72);
  pot.castShadow = true;
  desk.add(pot);

  const leaves = new THREE.MeshStandardMaterial({
    color: 0x237a72,
    roughness: 0.52,
    metalness: 0.08,
  });
  for (let index = 0; index < 7; index += 1) {
    const angle = (index / 7) * Math.PI * 2;
    const leaf = new THREE.Mesh(new THREE.SphereGeometry(0.105, 12, 10), leaves);
    leaf.scale.set(0.55, 1.9, 0.42);
    leaf.position.set(
      2.1 + Math.cos(angle) * 0.17,
      1.35 + (index % 3) * 0.1,
      -0.72 + Math.sin(angle) * 0.15,
    );
    leaf.rotation.z = Math.cos(angle) * 0.58;
    leaf.rotation.x = Math.sin(angle) * 0.3;
    leaf.castShadow = true;
    desk.add(leaf);
  }

  createOfficeChair(THREE, workspace, chassisMaterial);
}

function createOfficeChair(THREE, workspace, chassisMaterial) {
  const chair = new THREE.Group();
  chair.position.set(0.95, 0, 0.55);
  chair.rotation.y = Math.PI;
  workspace.add(chair);

  const upholstery = new THREE.MeshStandardMaterial({
    color: 0x17263b,
    metalness: 0.12,
    roughness: 0.72,
  });
  const seamMaterial = new THREE.MeshStandardMaterial({
    color: 0x405b79,
    metalness: 0.32,
    roughness: 0.48,
  });

  const back = new THREE.Mesh(
    createRoundedPrism(THREE, 0.98, 0.94, 0.17, 0.18, 0.035, false),
    upholstery,
  );
  back.position.set(0, 1.35, 0.84);
  back.rotation.x = -0.08;
  back.castShadow = true;
  chair.add(back);

  const backInset = new THREE.Mesh(
    createRoundedPrism(THREE, 0.78, 0.72, 0.022, 0.14, 0.005, false),
    seamMaterial,
  );
  backInset.position.set(0, 1.35, 0.735);
  backInset.rotation.x = -0.08;
  chair.add(backInset);

  const headrest = new THREE.Mesh(
    createRoundedPrism(THREE, 0.46, 0.23, 0.13, 0.1, 0.02, false),
    upholstery,
  );
  headrest.position.set(0, 2.12, 0.84);
  headrest.castShadow = true;
  chair.add(headrest);

  const seat = new THREE.Mesh(
    createRoundedPrism(THREE, 1.02, 0.96, 0.18, 0.17, 0.035, true),
    upholstery,
  );
  seat.position.set(0, 0.76, -0.16);
  seat.castShadow = true;
  seat.receiveShadow = true;
  chair.add(seat);

  [-0.62, 0.62].forEach((x) => {
    const armSupport = new THREE.Mesh(
      new THREE.CylinderGeometry(0.035, 0.045, 0.46, 12),
      chassisMaterial,
    );
    armSupport.position.set(x, 1.04, -0.04);
    chair.add(armSupport);

    const armRest = new THREE.Mesh(
      createRoundedPrism(THREE, 0.18, 0.5, 0.11, 0.075, 0.018, true),
      upholstery,
    );
    armRest.position.set(x, 1.28, 0.02);
    chair.add(armRest);
  });

  const column = new THREE.Mesh(
    new THREE.CylinderGeometry(0.075, 0.105, 0.46, 16),
    chassisMaterial,
  );
  column.position.set(0, 0.46, -0.16);
  chair.add(column);

  const hub = new THREE.Mesh(new THREE.SphereGeometry(0.12, 16, 10), chassisMaterial);
  hub.position.set(0, 0.2, -0.16);
  chair.add(hub);

  for (let index = 0; index < 5; index += 1) {
    const angle = (index / 5) * Math.PI * 2;
    const end = new THREE.Vector3(Math.cos(angle) * 0.65, 0.11, -0.16 + Math.sin(angle) * 0.55);
    const start = new THREE.Vector3(0, 0.2, -0.16);
    const spoke = new THREE.Mesh(
      new THREE.CylinderGeometry(0.035, 0.05, start.distanceTo(end), 10),
      chassisMaterial,
    );
    positionBetween(THREE, spoke, start, end);
    chair.add(spoke);

    const caster = new THREE.Mesh(
      new THREE.SphereGeometry(0.09, 12, 8),
      new THREE.MeshStandardMaterial({ color: 0x141d2a, metalness: 0.45, roughness: 0.38 }),
    );
    caster.position.set(end.x, 0.06, end.z);
    chair.add(caster);
  }
}

function createDeveloper(THREE, workspace, laptop, keyboard) {
  const developer = new THREE.Group();
  developer.position.set(0.95, 0, 1.03);
  developer.rotation.y = Math.PI;
  workspace.add(developer);

  const sweaterTexture = createSweaterTexture(THREE);
  const sweaterMaterial = new THREE.MeshPhysicalMaterial({
    color: 0x29364a,
    map: sweaterTexture,
    bumpMap: sweaterTexture,
    bumpScale: 0.012,
    metalness: 0.04,
    roughness: 0.86,
    clearcoat: 0.12,
  });
  const sweaterShadowMaterial = new THREE.MeshStandardMaterial({
    color: 0x1d283b,
    roughness: 0.76,
  });
  const skinMaterial = new THREE.MeshStandardMaterial({
    color: 0xb98569,
    roughness: 0.66,
  });
  const denimMaterial = new THREE.MeshStandardMaterial({
    color: 0x26374e,
    roughness: 0.78,
  });
  const hairMaterial = new THREE.MeshStandardMaterial({
    color: 0x18202d,
    roughness: 0.82,
  });
  const torso = new THREE.Group();
  developer.add(torso);

  const pelvis = new THREE.Mesh(new THREE.CapsuleGeometry(0.31, 0.26, 8, 14), denimMaterial);
  pelvis.position.set(0, 0.88, -0.08);
  pelvis.castShadow = true;
  developer.add(pelvis);

  const chest = new THREE.Mesh(new THREE.CapsuleGeometry(0.37, 0.62, 10, 18), sweaterMaterial);
  chest.position.set(0, 1.48, 0.02);
  chest.castShadow = true;
  torso.add(chest);

  const sweaterHem = new THREE.Mesh(
    new THREE.CylinderGeometry(0.31, 0.33, 0.1, 24),
    sweaterShadowMaterial,
  );
  sweaterHem.position.set(0, 1.05, 0.02);
  torso.add(sweaterHem);

  const neck = new THREE.Mesh(new THREE.CylinderGeometry(0.105, 0.13, 0.23, 16), skinMaterial);
  neck.position.set(0, 2.04, 0.05);
  torso.add(neck);

  const head = new THREE.Group();
  head.position.set(0, 2.36, 0.075);
  head.rotation.y = 0.32;
  torso.add(head);

  const face = new THREE.Mesh(new THREE.SphereGeometry(0.235, 24, 18), skinMaterial);
  face.scale.set(0.9, 1.14, 0.92);
  face.castShadow = true;
  head.add(face);

  const hair = new THREE.Mesh(
    new THREE.SphereGeometry(0.238, 24, 14, 0, Math.PI * 2, 0, Math.PI * 0.58),
    hairMaterial,
  );
  hair.position.y = 0.055;
  hair.castShadow = true;
  head.add(hair);

  [-1, 1].forEach((side) => {
    const ear = new THREE.Mesh(new THREE.SphereGeometry(0.055, 12, 10), skinMaterial);
    ear.position.set(side * 0.216, -0.005, 0);
    ear.scale.set(0.62, 1, 0.72);
    head.add(ear);
  });

  const shoulderLeft = new THREE.Vector3(-0.31, 1.74, 0.04);
  const shoulderRight = new THREE.Vector3(0.31, 1.74, 0.04);
  const armMaterial = sweaterMaterial;
  const upperArms = [
    createBone(THREE, developer, 0.15, 0.39, armMaterial),
    createBone(THREE, developer, 0.15, 0.39, armMaterial),
  ];
  const forearms = [
    createBone(THREE, developer, 0.12, 0.34, sweaterMaterial),
    createBone(THREE, developer, 0.12, 0.34, sweaterMaterial),
  ];
  const cuffs = [
    new THREE.Mesh(new THREE.TorusGeometry(0.105, 0.025, 8, 18), sweaterShadowMaterial),
    new THREE.Mesh(new THREE.TorusGeometry(0.105, 0.025, 8, 18), sweaterShadowMaterial),
  ];
  cuffs.forEach((cuff) => developer.add(cuff));

  const leftHomeKeys = [
    ...[2, 3, 4, 5].map((column) => keyTarget(THREE, laptop, keyboard, 2, column)),
    keyTarget(THREE, laptop, keyboard, 4, 6),
  ];
  const rightHomeKeys = [
    ...[7, 8, 9, 10].map((column) => keyTarget(THREE, laptop, keyboard, 2, column)),
    keyTarget(THREE, laptop, keyboard, 4, 7),
  ];
  const hands = [
    createTypingHand(THREE, developer, skinMaterial, 0),
    createTypingHand(THREE, developer, skinMaterial, 1),
  ];
  const elbows = [new THREE.Vector3(0.43, 1.42, 0.48), new THREE.Vector3(0.48, 1.43, 0.46)];

  const legs = [
    {
      upper: createBone(THREE, developer, 0.19, 0.46, denimMaterial),
      lower: createBone(THREE, developer, 0.14, 0.35, denimMaterial),
      hip: new THREE.Vector3(-0.2, 0.91, -0.11),
      knee: new THREE.Vector3(-0.23, 0.54, 0.72),
      ankle: new THREE.Vector3(-0.23, 0.18, 0.91),
      shoe: createShoe(THREE, developer, -0.23, 0.14, 0.97),
    },
    {
      upper: createBone(THREE, developer, 0.19, 0.46, denimMaterial),
      lower: createBone(THREE, developer, 0.14, 0.35, denimMaterial),
      hip: new THREE.Vector3(0.2, 0.91, -0.11),
      knee: new THREE.Vector3(0.23, 0.54, 0.72),
      ankle: new THREE.Vector3(0.23, 0.18, 0.91),
      shoe: createShoe(THREE, developer, 0.23, 0.14, 0.97),
    },
  ];

  laptop.updateMatrixWorld(true);
  developer.updateMatrixWorld(true);
  setHandHomePosition(THREE, hands[0], leftHomeKeys);
  setHandHomePosition(THREE, hands[1], rightHomeKeys);

  function pressFinger(fingerIndex, keyIndex) {
    const hand = hands[fingerIndex < 5 ? 0 : 1];
    const finger = hand.fingers[fingerIndex % 5];
    const target = keyTargetFromIndex(THREE, laptop, keyboard, keyIndex);
    finger.press = 1;
    const localTarget = developer.worldToLocal(target.world.clone());
    finger.target.set(
      localTarget.x - hand.group.position.x,
      finger.home.y,
      localTarget.z - hand.group.position.z - finger.totalLength,
    );
    finger.root.userData.activeKey = keyIndex;
  }

  function update(elapsed, delta) {
    if (!aboutReducedMotion) {
      torso.rotation.x = Math.sin(elapsed * 0.62) * 0.012;
      head.rotation.y = 0.32 + Math.sin(elapsed * 0.78) * 0.035;
      head.rotation.x = Math.sin(elapsed * 0.54) * 0.018;
      developer.rotation.y = Math.PI + Math.sin(elapsed * 0.2) * 0.009;
    }

    hands.forEach((hand, handIndex) => {
      hand.update(delta, elapsed);
      const shoulder = handIndex === 0 ? shoulderLeft : shoulderRight;
      const elbow = elbows[handIndex];
      const wrist = hand.group.position.clone();
      const upper = upperArms[handIndex];
      const forearm = forearms[handIndex];
      const cuff = cuffs[handIndex];

      positionBone(THREE, upper, shoulder, elbow);
      positionBone(THREE, forearm, elbow, wrist);
      cuff.position.copy(wrist);
      cuff.quaternion.setFromUnitVectors(
        new THREE.Vector3(0, 1, 0),
        new THREE.Vector3().subVectors(wrist, elbow).normalize(),
      );
    });

    legs.forEach((leg) => {
      positionBone(THREE, leg.upper, leg.hip, leg.knee);
      positionBone(THREE, leg.lower, leg.knee, leg.ankle);
    });
  }

  update(0, 0);

  return {
    pressFinger,
    update,
  };
}

function keyTarget(THREE, laptop, keyboard, row, column) {
  const index = row * 14 + column;
  return keyTargetFromIndex(THREE, laptop, keyboard, index);
}

function keyTargetFromIndex(THREE, laptop, keyboard, index) {
  const position = keyboard.keyPositions[index];
  const world = new THREE.Vector3(position.x, position.y + 0.035, position.z);
  laptop.localToWorld(world);
  return { world, index };
}

function createTypingHand(THREE, developer, skinMaterial, handIndex) {
  const group = new THREE.Group();
  developer.add(group);

  const palm = new THREE.Mesh(new THREE.SphereGeometry(0.14, 16, 12), skinMaterial);
  palm.scale.set(1.15, 0.42, 1.5);
  group.add(palm);

  const fingers = Array.from({ length: 5 }, (_, index) => {
    const root = new THREE.Group();
    group.add(root);
    const proximal = new THREE.Group();
    root.add(proximal);

    const proximalLength = 0.11;
    addFingerBone(THREE, proximal, proximalLength, 0.034, skinMaterial);

    const middle = new THREE.Group();
    middle.position.y = proximalLength;
    proximal.add(middle);
    const middleLength = 0.075;
    addFingerBone(THREE, middle, middleLength, 0.029, skinMaterial);

    const distal = new THREE.Group();
    distal.position.y = middleLength;
    middle.add(distal);
    const distalLength = 0.055;
    addFingerBone(THREE, distal, distalLength, 0.024, skinMaterial);

    const knuckle = new THREE.Mesh(new THREE.SphereGeometry(0.036, 10, 8), skinMaterial);
    knuckle.position.y = proximalLength;
    proximal.add(knuckle);

    const finger = {
      root,
      proximal,
      middle,
      distal,
      press: 0,
      target: new THREE.Vector3(),
      home: new THREE.Vector3(),
      index,
      handIndex,
      totalLength: proximalLength + middleLength + distalLength,
    };
    if (index === 4) root.rotation.y = handIndex === 0 ? -0.38 : 0.38;
    root.userData.finger = finger;
    return finger;
  });

  return {
    group,
    palm,
    fingers,
    handIndex,
    basePosition: new THREE.Vector3(),
    update(delta, elapsed) {
      if (!aboutReducedMotion) {
        group.position.copy(this.basePosition);
        group.position.x += Math.sin(elapsed * 1.15 + handIndex) * 0.006;
        group.position.y += Math.sin(elapsed * 2.2 + handIndex) * 0.006;
      }

      fingers.forEach((finger) => {
        finger.press = Math.max(0, finger.press - delta * 8.5);
        const influence = finger.press;
        finger.root.position.lerp(finger.target, Math.min(1, delta * 10));
        finger.proximal.rotation.x = 1.68 + influence * 0.22;
        finger.middle.rotation.x = 0.08 + influence * 0.25;
        finger.distal.rotation.x = 0.04 + influence * 0.18;
        finger.root.position.y = -0.018 - influence * 0.012;
      });
    },
  };
}

function setHandHomePosition(THREE, hand, keyTargets) {
  const center = new THREE.Vector3();
  keyTargets.forEach((key) => center.add(key.world));
  center.divideScalar(keyTargets.length);
  const developer = hand.group.parent;
  const localCenter = developer.worldToLocal(center);
  hand.group.position.set(localCenter.x, localCenter.y + 0.12, localCenter.z - 0.29);
  hand.basePosition.copy(hand.group.position);

  hand.fingers.forEach((finger, index) => {
    const target = developer.worldToLocal(keyTargets[index].world.clone());
    finger.home.set(
      target.x - hand.group.position.x,
      -0.018,
      target.z - hand.group.position.z - finger.totalLength,
    );
    finger.target.copy(finger.home);
    finger.root.position.copy(finger.home);
    finger.proximal.rotation.x = 1.68;
    finger.middle.rotation.x = 0.08;
    finger.distal.rotation.x = 0.04;
  });

  return hand.group.position.clone();
}

function addFingerBone(THREE, pivot, length, radius, material) {
  const bone = new THREE.Mesh(
    new THREE.CylinderGeometry(radius * 0.84, radius, length, 8),
    material,
  );
  bone.position.y = length / 2;
  pivot.add(bone);

  const tip = new THREE.Mesh(new THREE.SphereGeometry(radius, 8, 6), material);
  tip.position.y = length;
  pivot.add(tip);
}

function createBone(THREE, parent, radius, cylinderLength, material) {
  const bone = new THREE.Mesh(new THREE.CapsuleGeometry(radius, cylinderLength, 5, 10), material);
  bone.castShadow = true;
  parent.add(bone);
  return bone;
}

function positionBone(THREE, bone, start, end) {
  const direction = new THREE.Vector3().subVectors(end, start);
  bone.position.copy(start).add(end).multiplyScalar(0.5);
  bone.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), direction.clone().normalize());
  const radius = bone.geometry.parameters.radius;
  const baseLength = bone.geometry.parameters.length + radius * 2;
  bone.scale.y = direction.length() / baseLength;
}

function createShoe(THREE, parent, x, y, z) {
  const shoe = new THREE.Mesh(
    new THREE.SphereGeometry(0.16, 16, 10),
    new THREE.MeshStandardMaterial({ color: 0x1b2533, roughness: 0.78 }),
  );
  shoe.position.set(x, y, z);
  shoe.scale.set(0.72, 0.58, 1.28);
  shoe.castShadow = true;
  parent.add(shoe);
  return shoe;
}

function positionBetween(THREE, mesh, start, end) {
  const direction = new THREE.Vector3().subVectors(end, start);
  mesh.position.copy(start).add(end).multiplyScalar(0.5);
  mesh.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), direction.clone().normalize());
}

function createSweaterTexture(THREE) {
  const canvas = document.createElement("canvas");
  canvas.width = 128;
  canvas.height = 128;
  const context = canvas.getContext("2d");
  if (!context) throw new Error("The developer's fabric texture could not be created.");

  context.fillStyle = "#d5dce5";
  context.fillRect(0, 0, canvas.width, canvas.height);
  for (let row = 0; row < 32; row += 1) {
    for (let column = 0; column < 32; column += 1) {
      const x = column * 4;
      const y = row * 4;
      const offset = row % 2 ? 2 : 0;
      context.fillStyle = (row + column) % 2 ? "rgba(255,255,255,.2)" : "rgba(45,65,88,.12)";
      context.fillRect(x + offset, y, 1, 3);
      context.fillRect(x + offset + 1, y + 2, 1, 1);
    }
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.repeat.set(3.2, 3.2);
  texture.anisotropy = 4;
  return texture;
}

function createEnvironmentTexture(THREE) {
  const canvas = document.createElement("canvas");
  canvas.width = 512;
  canvas.height = 256;
  const context = canvas.getContext("2d");
  if (!context) throw new Error("The About workspace reflection texture could not be created.");

  const gradient = context.createLinearGradient(0, 0, 0, canvas.height);
  gradient.addColorStop(0, "#25364c");
  gradient.addColorStop(0.42, "#0b172a");
  gradient.addColorStop(0.62, "#18233b");
  gradient.addColorStop(1, "#060a13");
  context.fillStyle = gradient;
  context.fillRect(0, 0, canvas.width, canvas.height);

  const reflections = [
    { x: 62, y: 94, radius: 105, color: "rgba(54, 199, 255, .75)" },
    { x: 420, y: 70, radius: 118, color: "rgba(153, 94, 255, .62)" },
    { x: 274, y: 152, radius: 86, color: "rgba(214, 231, 255, .62)" },
  ];
  reflections.forEach(({ x, y, radius, color }) => {
    const light = context.createRadialGradient(x, y, 0, x, y, radius);
    light.addColorStop(0, color);
    light.addColorStop(1, "rgba(0,0,0,0)");
    context.fillStyle = light;
    context.fillRect(x - radius, y - radius, radius * 2, radius * 2);
  });

  const texture = new THREE.CanvasTexture(canvas);
  texture.mapping = THREE.EquirectangularReflectionMapping;
  texture.colorSpace = THREE.SRGBColorSpace;
  return texture;
}

function createTechnologyCards(THREE, workspace) {
  const definitions = [
    {
      name: "HTML5",
      logoSymbol: "icon-html",
      color: "#e44d26",
      position: [-2.58, 2.58, 0.5],
    },
    {
      name: "CSS3",
      logoSymbol: "icon-css",
      color: "#1572b6",
      position: [2.62, 2.53, -0.35],
    },
    {
      name: "JavaScript",
      logoSymbol: "about-icon-javascript",
      color: "#f7df1e",
      position: [-2.75, 1.28, 0.8],
    },
    {
      name: "Python",
      logoSrc: PortfolioPaths.asset("images/python-logo.png"),
      color: "#80c9fa",
      position: [2.75, 1.13, 0.8],
    },
    {
      name: "GitHub",
      logoSrc: PortfolioPaths.asset("images/github-logo.png"),
      color: "#e5ecff",
      position: [-2.1, 0.15, 0.6],
    },
    {
      name: "React",
      logoSymbol: "icon-react",
      color: "#61dafb",
      position: [2.05, 3.38, -0.8],
    },
  ];

  return definitions.map((definition, index) => {
    const texture = createTechnologyTexture(THREE, definition);
    const material = new THREE.MeshBasicMaterial({
      map: texture,
      transparent: true,
      side: THREE.DoubleSide,
      depthWrite: false,
      toneMapped: false,
    });
    const card = new THREE.Mesh(new THREE.PlaneGeometry(0.84, 0.92), material);
    card.position.set(...definition.position);
    card.rotation.y = index % 2 ? -0.11 : 0.13;
    card.userData.baseY = definition.position[1];
    card.userData.baseRotationY = card.rotation.y;
    workspace.add(card);
    return card;
  });
}

function createTechnologyTexture(THREE, { name, logoSrc, logoSymbol, color }) {
  const canvas = document.createElement("canvas");
  canvas.width = 280;
  canvas.height = 300;
  const context = canvas.getContext("2d");
  if (!context) throw new Error(`The ${name} icon could not be created.`);

  drawRoundedRect(context, 13, 13, 254, 274, 32);
  context.fillStyle = "rgba(7, 16, 31, 0.88)";
  context.fill();
  context.lineWidth = 3;
  context.strokeStyle = `${color}bb`;
  context.stroke();

  const glow = context.createRadialGradient(140, 123, 8, 140, 123, 94);
  glow.addColorStop(0, `${color}66`);
  glow.addColorStop(1, `${color}00`);
  context.fillStyle = glow;
  context.fillRect(30, 25, 220, 205);

  context.fillStyle = "#e7f2ff";
  context.font = "700 26px Arial, sans-serif";
  context.textAlign = "center";
  context.textBaseline = "middle";
  context.fillText(name, 140, 226);
  context.fillStyle = color;
  context.fillRect(103, 258, 74, 3);

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.minFilter = THREE.LinearFilter;
  texture.generateMipmaps = false;

  const logo = new Image();
  logo.addEventListener(
    "load",
    () => {
      if (name === "GitHub") {
        context.beginPath();
        context.arc(140, 105, 66, 0, Math.PI * 2);
        context.fillStyle = "#f4f7ff";
        context.fill();
      }
      context.drawImage(logo, 77, 42, 126, 126);
      if (name === "JavaScript") {
        context.fillStyle = "#171717";
        context.font = "800 48px Arial, sans-serif";
        context.textAlign = "right";
        context.textBaseline = "bottom";
        context.fillText("JS", 198, 162);
      }
      texture.needsUpdate = true;
    },
    { once: true },
  );
  logo.addEventListener(
    "error",
    () => console.error(`Could not load the real ${name} logo for the About workspace.`),
    { once: true },
  );
  logo.src = logoSrc || createTechnologyLogoDataUrl(logoSymbol, color, name);

  return texture;
}

function createTechnologyLogoDataUrl(symbolId, color, name) {
  const symbol = document.getElementById(symbolId);
  if (!symbol) throw new Error(`The ${name} logo symbol is missing from the About workspace.`);

  const markup = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${symbol.getAttribute("viewBox") || "0 0 24 24"}" fill="${color}">${symbol.innerHTML}</svg>`;
  return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(markup)}`;
}

function createHolographicPanels(THREE, workspace) {
  const panels = [
    { label: "API / SERVICES", position: [-2.05, 2.05, -1.18], rotation: -0.15 },
    { label: "DATA / MODELS", position: [2.12, 0.18, -1.2], rotation: 0.13 },
  ];

  panels.forEach(({ label, position, rotation }, index) => {
    const canvas = document.createElement("canvas");
    canvas.width = 480;
    canvas.height = 190;
    const context = canvas.getContext("2d");
    if (!context) throw new Error("A holographic workspace panel could not be created.");

    context.fillStyle = "rgba(7, 20, 38, .56)";
    context.fillRect(2, 2, 476, 186);
    context.strokeStyle = index ? "rgba(168, 126, 255, .72)" : "rgba(66, 218, 255, .74)";
    context.lineWidth = 3;
    context.strokeRect(2, 2, 476, 186);
    context.fillStyle = "#d9edff";
    context.font = "600 26px monospace";
    context.fillText(label, 22, 41);
    for (let line = 0; line < 3; line += 1) {
      context.fillStyle = line === 1 ? "rgba(158, 133, 255, .75)" : "rgba(90, 211, 255, .68)";
      context.fillRect(24, 68 + line * 31, 130 + line * 32, 4);
      context.fillStyle = "rgba(177, 201, 230, .46)";
      context.fillRect(171 + line * 20, 68 + line * 31, 98 + line * 17, 4);
    }

    const texture = new THREE.CanvasTexture(canvas);
    texture.colorSpace = THREE.SRGBColorSpace;
    const panel = new THREE.Mesh(
      new THREE.PlaneGeometry(1.22, 0.48),
      new THREE.MeshBasicMaterial({
        map: texture,
        transparent: true,
        opacity: 0.62,
        depthWrite: false,
        side: THREE.DoubleSide,
        toneMapped: false,
      }),
    );
    panel.position.set(...position);
    panel.rotation.y = rotation;
    workspace.add(panel);
  });
}

function createLightTrails(THREE, workspace) {
  const trails = [
    {
      color: 0x27d8ff,
      points: [
        [-3.1, 0.28, -0.3],
        [-3.3, 0.74, -0.4],
        [-3.0, 1.55, -0.55],
        [-2.62, 2.9, -0.85],
        [-2.08, 3.34, -1.1],
      ],
    },
    {
      color: 0x9c69ff,
      points: [
        [3.05, 0.24, -0.5],
        [3.3, 0.82, -0.6],
        [3.02, 1.57, -0.8],
        [2.64, 2.8, -1.03],
        [2.02, 3.38, -1.2],
      ],
    },
  ];

  trails.forEach(({ color, points }) => {
    const curve = new THREE.CatmullRomCurve3(points.map(([x, y, z]) => new THREE.Vector3(x, y, z)));
    const tube = new THREE.Mesh(
      new THREE.TubeGeometry(curve, 64, 0.009, 7, false),
      new THREE.MeshBasicMaterial({
        color,
        transparent: true,
        opacity: 0.55,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
      }),
    );
    workspace.add(tube);
  });
}

function createParticles(THREE, scene) {
  const positions = [];
  for (let index = 0; index < 52; index += 1) {
    const angle = index * 2.399;
    const radius = 2.1 + ((index * 17) % 21) / 10;
    positions.push(
      Math.cos(angle) * radius,
      0.18 + ((index * 11) % 37) / 10,
      Math.sin(angle) * radius * 0.55 - 0.25,
    );
  }

  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute("position", new THREE.Float32BufferAttribute(positions, 3));
  const material = new THREE.PointsMaterial({
    color: 0x7edfff,
    size: 0.026,
    transparent: true,
    opacity: 0.68,
    sizeAttenuation: true,
    depthWrite: false,
  });
  const particles = new THREE.Points(geometry, material);
  scene.add(particles);
  return particles;
}

function drawCodeEditor(context, canvas, code, typedCharacters, cursorVisible) {
  const width = canvas.width;
  const height = canvas.height;
  context.clearRect(0, 0, width, height);
  context.fillStyle = "#07101e";
  context.fillRect(0, 0, width, height);

  const topBarHeight = 42;
  context.fillStyle = "#101b2c";
  context.fillRect(0, 0, width, topBarHeight);
  context.fillStyle = "#fb727a";
  context.beginPath();
  context.arc(22, 21, 5, 0, Math.PI * 2);
  context.fill();
  context.fillStyle = "#f4c368";
  context.beginPath();
  context.arc(41, 21, 5, 0, Math.PI * 2);
  context.fill();
  context.fillStyle = "#68d7a2";
  context.beginPath();
  context.arc(60, 21, 5, 0, Math.PI * 2);
  context.fill();

  const tabs = ["index.html", "styles.css", "app.js", "main.py", "Workspace.jsx"];
  context.font = "500 17px Consolas, monospace";
  tabs.forEach((tab, index) => {
    const x = 96 + index * 190;
    if (index === 2) {
      context.fillStyle = "#1c2a3d";
      context.fillRect(x - 9, topBarHeight - 1, 180, 34);
      context.fillStyle = "#63d9ff";
      context.fillRect(x - 9, topBarHeight + 32, 180, 2);
    }
    context.fillStyle = index === 2 ? "#dce9f8" : "#7f91a9";
    context.fillText(tab, x, 22);
  });

  context.fillStyle = "#0b1626";
  context.fillRect(0, topBarHeight, 48, height - topBarHeight);
  context.fillStyle = "#2b3a50";
  context.font = "600 18px Arial, sans-serif";
  context.fillText("⌂", 17, 83);
  context.fillText("⌕", 17, 123);
  context.fillText("◇", 17, 163);
  context.fillText("▤", 17, 203);

  const visibleCode = code.slice(0, typedCharacters);
  const lines = visibleCode.split("\n");
  const lineHeight = 44;
  const startY = 84;
  const lineNumberWidth = 68;
  context.textBaseline = "alphabetic";

  lines.forEach((line, lineIndex) => {
    const y = startY + lineIndex * lineHeight;
    context.fillStyle = "#8196b0";
    context.font = "500 22px Consolas, 'Courier New', monospace";
    context.fillText(String(lineIndex + 1).padStart(2, "0"), 58, y);
    context.font = "500 44px Consolas, 'Courier New', monospace";
    const tokenPattern =
      /(\/\/.*|#[0-9a-fA-F]{3,8}|#[^\s]*|\/\*.*?\*\/|<\/?[\w-]+|["'][^"']*["']|\b(?:export|const|function|return|class|def|from|import|self)\b|\b[A-Z][A-Za-z]+\b|[=()[\]{}:,.;<>]|\b[\w.]+\b|\s+)/g;
    const tokens = line.match(tokenPattern) || [];
    let x = lineNumberWidth + 26;

    tokens.forEach((token) => {
      if (/^(export|const|function|return|class|def|from|import|self)$/.test(token))
        context.fillStyle = "#c59bff";
      else if (/^#/.test(token)) context.fillStyle = "#64d9e8";
      else if (/^<\/?/.test(token)) context.fillStyle = "#64d9e8";
      else if (/^["']/.test(token)) context.fillStyle = "#a8e7ae";
      else if (/^[A-Z]/.test(token)) context.fillStyle = "#56d9e8";
      else if (/^[=()[\]{}:,.;<>]$/.test(token)) context.fillStyle = "#d2deed";
      else context.fillStyle = "#e3eefc";

      context.fillText(token, x, y);
      x += context.measureText(token).width;
    });

    if (lineIndex === lines.length - 1 && cursorVisible) {
      context.fillStyle = "#59ddff";
      context.fillRect(x + 2, y - 30, 4, 35);
    }
  });

  context.fillStyle = "#101c2c";
  context.fillRect(48, height - 31, width - 48, 31);
  context.fillStyle = "#88a6c5";
  context.font = "500 12px Consolas, monospace";
  context.fillText("Python 3.12     UTF-8     Ln 1, Col 1", 65, height - 11);

  const screenGlow = context.createRadialGradient(
    width * 0.55,
    height * 0.42,
    30,
    width * 0.55,
    height * 0.42,
    width * 0.7,
  );
  screenGlow.addColorStop(0, "rgba(26, 107, 177, .08)");
  screenGlow.addColorStop(1, "rgba(0, 0, 0, 0)");
  context.fillStyle = screenGlow;
  context.fillRect(0, 0, width, height);
}

function drawRoundedRect(context, x, y, width, height, radius) {
  const r = Math.min(radius, width / 2, height / 2);
  context.beginPath();
  context.moveTo(x + r, y);
  context.lineTo(x + width - r, y);
  context.quadraticCurveTo(x + width, y, x + width, y + r);
  context.lineTo(x + width, y + height - r);
  context.quadraticCurveTo(x + width, y + height, x + width - r, y + height);
  context.lineTo(x + r, y + height);
  context.quadraticCurveTo(x, y + height, x, y + height - r);
  context.lineTo(x, y + r);
  context.quadraticCurveTo(x, y, x + r, y);
  context.closePath();
}
