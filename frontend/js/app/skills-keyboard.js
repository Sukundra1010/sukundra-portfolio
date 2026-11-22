const threeModuleUrl = "https://cdn.jsdelivr.net/npm/three@0.180.0/build/three.module.js";

const skills = [
  {
    id: "html",
    name: "HTML",
    mark: "HTML",
    color: "#f26c45",
    level: "Intermediate",
    description: "Semantic markup for accessible, well-structured web pages.",
    logo: PortfolioPaths.asset("images/skills/html5.png"),
  },
  {
    id: "css",
    name: "CSS",
    mark: "CSS",
    color: "#4399f6",
    level: "Intermediate",
    description: "Visual styling, layout, and adaptive interfaces.",
    logo: PortfolioPaths.asset("images/skills/css3.png"),
  },
  {
    id: "javascript",
    name: "JavaScript",
    mark: "JS",
    color: "#ead054",
    level: "Intermediate",
    description: "Client-side behavior and interactive web experiences.",
    logo: PortfolioPaths.asset("images/skills/javascript.png"),
  },
  {
    id: "python",
    name: "Python",
    mark: "Py",
    color: "#4388f2",
    level: "Advanced",
    description: "Application logic, automation, and my growing work in data and AI.",
    logo: PortfolioPaths.asset("images/skills/python.png"),
  },
  {
    id: "django",
    name: "Django",
    mark: "Dj",
    color: "#4ebd8a",
    level: "Intermediate",
    description: "Python web framework fundamentals for backend applications.",
    logo: PortfolioPaths.asset("images/skills/django.png"),
  },
  {
    id: "react",
    name: "React",
    mark: "Re",
    color: "#62d8ef",
    level: "Intermediate",
    description: "Component-based user interface development.",
    logo: PortfolioPaths.asset("images/skills/react.png"),
  },
  {
    id: "c",
    name: "C",
    mark: "C",
    color: "#62a9f6",
    level: "Beginner",
    description: "Programming fundamentals and low-level concepts.",
    logo: PortfolioPaths.asset("images/skills/c.png"),
  },
  {
    id: "flutter",
    name: "Flutter",
    mark: "Fl",
    color: "#53aee9",
    level: "Intermediate",
    description: "Cross-platform interface development with Flutter.",
    logo: PortfolioPaths.asset("images/skills/flutter.png"),
  },
  {
    id: "mysql",
    name: "MySQL",
    mark: "SQL",
    color: "#8c82ee",
    level: "Intermediate",
    description: "Relational data and SQL query fundamentals.",
    logo: PortfolioPaths.asset("images/skills/mysql.png"),
  },
  {
    id: "git",
    name: "Git",
    mark: "Git",
    color: "#ee7958",
    level: "Intermediate",
    description: "Version control and collaborative code management.",
    logo: PortfolioPaths.asset("images/skills/git.png"),
  },
  {
    id: "github",
    name: "GitHub",
    mark: "GH",
    color: "#c5d0e0",
    level: "Intermediate",
    description: "Collaborative repositories, code sharing, and review workflows.",
    logo: PortfolioPaths.asset("images/skills/github.png"),
  },
  {
    id: "ai",
    name: "AI Fundamentals",
    mark: "AI",
    color: "#9b82f4",
    level: "Intermediate",
    description: "Foundational concepts in artificial intelligence and intelligent systems.",
    logo: PortfolioPaths.asset("images/skills/ai.png"),
  },
  {
    id: "datascience",
    name: "Data Science",
    mark: "DS",
    color: "#4fa0ee",
    level: "Intermediate",
    description: "Data preparation, analysis, and visualization for useful insights.",
  },
  {
    id: "robotics",
    name: "Robotics",
    mark: "RO",
    color: "#58cbb5",
    level: "Intermediate",
    description: "Interest in intelligent systems, sensing, and real-world decision-making.",
  },
  {
    id: "uiux",
    name: "UI/UX Design",
    mark: "UX",
    color: "#ac85fa",
    level: "Beginner",
    description: "User flows, visual hierarchy, and usability-focused interfaces.",
    logo: PortfolioPaths.asset("images/skills/ui-ux.png"),
  },
];

const section = document.querySelector("#skills");
const stage = section?.querySelector(".skills-keyboard-stage");
const visualHost = section?.querySelector("[data-skills-keyboard-visual]");
const statusMessage = section?.querySelector("[data-skills-status]");
const selectedName = section?.querySelector("[data-selected-skill]");
const selectedDescription = section?.querySelector("[data-selected-description]");
const selectedLevel = section?.querySelector("[data-selected-level]");
const soundToggle = section?.querySelector("[data-sound-toggle]");
const soundLabel = section?.querySelector("[data-sound-label]");
const soundStatus = section?.querySelector("[data-sound-status]");
const fallbackList = section?.querySelector("[data-skills-fallback]");
const accessibleList = section?.querySelector("[data-skills-accessible-controls]");

if (
  !section ||
  !stage ||
  !visualHost ||
  !statusMessage ||
  !selectedName ||
  !selectedDescription ||
  !selectedLevel ||
  !soundToggle ||
  !soundLabel ||
  !soundStatus ||
  !fallbackList ||
  !accessibleList
) {
  throw new Error("The interactive skills keyboard is missing required page elements.");
}

const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const skillById = new Map(skills.map((skill) => [skill.id, skill]));
const skillButtons = new Map(skills.map((skill) => [skill.id, []]));
let selectedSkill = skillById.get("javascript");
let hoveredSkill = null;
let soundEnabled = false;
let audioContext = null;
let keyboard;
let loadStarted = false;

function updateSkillPanel(skill) {
  const activeSkill = skill || selectedSkill;
  selectedName.textContent = activeSkill.name;
  selectedDescription.textContent = activeSkill.description;
  selectedLevel.textContent = activeSkill.level || "";
  section.style.setProperty("--selected-accent", activeSkill.color);
}

function updatePressedButtons() {
  skillButtons.forEach((buttons, id) => {
    buttons.forEach((button) => {
      button.setAttribute("aria-pressed", String(id === selectedSkill.id));
    });
  });
}

function selectSkill(skill) {
  selectedSkill = skill;
  updateSkillPanel(hoveredSkill || selectedSkill);
  updatePressedButtons();
}

function previewSkill(skill) {
  hoveredSkill = skill;
  updateSkillPanel(skill);
  keyboard?.setHoveredSkill(skill);
}

function clearPreview() {
  hoveredSkill = null;
  updateSkillPanel(selectedSkill);
  keyboard?.setHoveredSkill(null);
}

function makeSkillButton(skill, isFallback) {
  const item = document.createElement("li");
  const button = document.createElement("button");
  button.type = "button";
  button.dataset.skillId = skill.id;
  button.textContent = skill.name;
  button.setAttribute("aria-pressed", String(skill.id === selectedSkill.id));
  if (isFallback) button.style.setProperty("--skill-accent", skill.color);
  button.addEventListener("focus", () => previewSkill(skill));
  button.addEventListener("blur", clearPreview);
  button.addEventListener("click", () => {
    selectSkill(skill);
    keyboard?.pressSkill(skill, false);
    keyboard?.playSound("press");
  });
  item.append(button);
  skillButtons.get(skill.id).push(button);
  return item;
}

skills.forEach((skill) => {
  accessibleList.append(makeSkillButton(skill, false));
  fallbackList.append(makeSkillButton(skill, true));
});
updateSkillPanel(selectedSkill);
updatePressedButtons();

function updateSoundControl() {
  soundToggle.setAttribute("aria-pressed", String(soundEnabled));
  soundLabel.textContent = soundEnabled ? "On" : "Off";
}

function makeNoiseBuffer(context, duration) {
  const frameCount = Math.max(1, Math.floor(context.sampleRate * duration));
  const buffer = context.createBuffer(1, frameCount, context.sampleRate);
  const channel = buffer.getChannelData(0);
  for (let frame = 0; frame < frameCount; frame += 1) {
    channel[frame] = Math.random() * 2 - 1;
  }
  return buffer;
}

function playKeyboardSound(kind) {
  if (!soundEnabled || !audioContext || audioContext.state !== "running") return;

  const context = audioContext;
  const now = context.currentTime;
  const isHover = kind === "hover";
  const duration = isHover ? 0.018 : 0.045;
  const source = context.createBufferSource();
  const filter = context.createBiquadFilter();
  const noiseGain = context.createGain();

  source.buffer = makeNoiseBuffer(context, duration);
  filter.type = "highpass";
  filter.frequency.setValueAtTime(isHover ? 2600 : 1250, now);
  noiseGain.gain.setValueAtTime(isHover ? 0.018 : 0.16, now);
  noiseGain.gain.exponentialRampToValueAtTime(0.0001, now + duration);
  source.connect(filter);
  filter.connect(noiseGain);
  noiseGain.connect(context.destination);
  source.start(now);
  source.stop(now + duration);

  if (!isHover) {
    const thock = context.createOscillator();
    const thockGain = context.createGain();
    thock.type = "triangle";
    thock.frequency.setValueAtTime(148, now);
    thock.frequency.exponentialRampToValueAtTime(72, now + 0.065);
    thockGain.gain.setValueAtTime(0.11, now);
    thockGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.065);
    thock.connect(thockGain);
    thockGain.connect(context.destination);
    thock.start(now);
    thock.stop(now + 0.07);
  }
}

soundToggle.addEventListener("click", async () => {
  if (soundEnabled) {
    soundEnabled = false;
    updateSoundControl();
    soundStatus.textContent = "Sound is off.";
    return;
  }

  const AudioContextConstructor = window.AudioContext || window.webkitAudioContext;
  if (!AudioContextConstructor) {
    soundStatus.textContent = "Web Audio is not available in this browser.";
    return;
  }

  try {
    audioContext ||= new AudioContextConstructor();
    await audioContext.resume();
    soundEnabled = true;
    soundStatus.textContent = "Sound is on. Click or hover over a key.";
  } catch (error) {
    soundEnabled = false;
    soundStatus.textContent = "Sound could not be started. Check browser audio permissions.";
    console.error("Could not enable keyboard sounds.", error);
  }
  updateSoundControl();
});

function setStageError(error) {
  stage.dataset.status = "error";
  statusMessage.textContent = "3D keyboard unavailable. Choose a skill from the list.";
  fallbackList.hidden = false;
  console.error("Could not load the 3D skills keyboard.", error);
}

function createRoundedKeyGeometry(THREE, width, depth, height) {
  const radius = Math.min(0.12, width * 0.1, depth * 0.1);
  const shape = new THREE.Shape();
  const left = -width / 2;
  const right = width / 2;
  const back = -depth / 2;
  const front = depth / 2;

  shape.moveTo(left + radius, back);
  shape.lineTo(right - radius, back);
  shape.quadraticCurveTo(right, back, right, back + radius);
  shape.lineTo(right, front - radius);
  shape.quadraticCurveTo(right, front, right - radius, front);
  shape.lineTo(left + radius, front);
  shape.quadraticCurveTo(left, front, left, front - radius);
  shape.lineTo(left, back + radius);
  shape.quadraticCurveTo(left, back, left + radius, back);

  const geometry = new THREE.ExtrudeGeometry(shape, {
    depth: height,
    bevelEnabled: true,
    bevelSegments: 3,
    bevelSize: 0.035,
    bevelThickness: 0.035,
    curveSegments: 5,
    steps: 1,
  });
  geometry.rotateX(-Math.PI / 2);
  geometry.computeVertexNormals();
  return geometry;
}

function drawRoboticsIcon(context, color) {
  context.save();
  context.strokeStyle = color;
  context.fillStyle = color;
  context.lineWidth = 6;
  context.lineCap = "round";
  context.lineJoin = "round";

  context.beginPath();
  context.roundRect(60, 77, 44, 40, 11);
  context.stroke();

  context.beginPath();
  context.moveTo(82, 77);
  context.lineTo(82, 67);
  context.stroke();
  context.beginPath();
  context.arc(82, 62, 4, 0, Math.PI * 2);
  context.fill();

  context.beginPath();
  context.arc(72, 93, 3, 0, Math.PI * 2);
  context.arc(92, 93, 3, 0, Math.PI * 2);
  context.fill();
  context.beginPath();
  context.moveTo(73, 105);
  context.lineTo(91, 105);
  context.moveTo(60, 91);
  context.lineTo(53, 91);
  context.moveTo(104, 91);
  context.lineTo(111, 91);
  context.moveTo(70, 122);
  context.lineTo(94, 122);
  context.stroke();
  context.restore();
}

function createKeyLabel(THREE, skill, renderer) {
  const canvas = document.createElement("canvas");
  canvas.width = 512;
  canvas.height = 192;
  const context = canvas.getContext("2d");
  if (!context) throw new Error("Could not create a canvas for the 3D key labels.");

  const drawLabel = (logoImage = null) => {
    context.clearRect(0, 0, canvas.width, canvas.height);
    context.fillStyle = "rgba(3, 8, 17, 0.42)";
    context.beginPath();
    context.roundRect(7, 7, 498, 178, 26);
    context.fill();
    context.strokeStyle = `${skill.color}75`;
    context.lineWidth = 3;
    context.stroke();

    context.beginPath();
    context.roundRect(23, 40, 118, 112, 23);
    context.fillStyle = logoImage ? "#f5f7fb" : `${skill.color}30`;
    context.fill();
    context.strokeStyle = `${skill.color}bb`;
    context.lineWidth = 3;
    context.stroke();

    if (logoImage) {
      const imageScale = Math.min(96 / logoImage.naturalWidth, 90 / logoImage.naturalHeight);
      const imageWidth = logoImage.naturalWidth * imageScale;
      const imageHeight = logoImage.naturalHeight * imageScale;
      context.drawImage(
        logoImage,
        82 - imageWidth / 2,
        96 - imageHeight / 2,
        imageWidth,
        imageHeight,
      );
    } else if (skill.id === "robotics") {
      drawRoboticsIcon(context, skill.color);
    } else {
      context.fillStyle = skill.color;
      context.textAlign = "center";
      context.textBaseline = "middle";
      context.font = `700 ${skill.mark.length > 3 ? 35 : 47}px Inter, Arial, sans-serif`;
      context.fillText(skill.mark, 82, 98, 102);
    }

    context.fillStyle = "#f4f7ff";
    context.textAlign = "left";
    context.font = "650 43px Inter, Arial, sans-serif";
    let fontSize = 43;
    while (context.measureText(skill.name).width > 333 && fontSize > 24) {
      fontSize -= 1;
      context.font = `650 ${fontSize}px Inter, Arial, sans-serif`;
    }
    context.fillText(skill.name, 162, 97, 330);
  };

  drawLabel();

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.anisotropy = renderer.capabilities.getMaxAnisotropy();
  texture.needsUpdate = true;

  if (skill.logo) {
    const logoImage = new Image();
    logoImage.decoding = "async";
    logoImage.onload = () => {
      drawLabel(logoImage);
      texture.needsUpdate = true;
    };
    logoImage.onerror = () => {
      console.error(`Could not load the ${skill.name} key logo: ${skill.logo}`);
    };
    logoImage.src = skill.logo;
  }

  return texture;
}

function createKeyboard(THREE) {
  const stageRect = stage.getBoundingClientRect();
  if (!stageRect.width || !stageRect.height) {
    throw new Error("The 3D keyboard stage has no visible dimensions.");
  }

  const renderer = new THREE.WebGLRenderer({
    alpha: true,
    antialias: true,
    powerPreference: "low-power",
  });
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.08;
  renderer.shadowMap.enabled = false;
  renderer.domElement.className = "skills-keyboard-canvas";
  renderer.domElement.setAttribute("aria-hidden", "true");
  renderer.domElement.tabIndex = -1;
  visualHost.append(renderer.domElement);

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(37, stageRect.width / stageRect.height, 0.1, 80);
  const cameraTarget = new THREE.Vector3(0, 0.74, 0);
  const keyboardRoot = new THREE.Group();
  const keyObjects = new Map();
  const hitTargets = [];
  const raycaster = new THREE.Raycaster();
  const pointer = new THREE.Vector2();
  const boardWidth = 7.12;
  const boardDepth = 5.22;
  const columnsPerRow = 4;
  const rows = Array.from({ length: Math.ceil(skills.length / columnsPerRow) }, (_, index) =>
    skills.slice(index * columnsPerRow, (index + 1) * columnsPerRow),
  );
  let hoveredId = "";
  let pointerY = 0;
  let targetRotationX = 0.035;
  let inView = false;
  let animationId = 0;
  let lastFrameTime = 0;

  scene.add(new THREE.HemisphereLight(0xa8c6f4, 0x14131e, 1.35));
  scene.add(new THREE.AmbientLight(0x9ca9c8, 0.52));

  const keyLight = new THREE.DirectionalLight(0xf0f4ff, 2.7);
  keyLight.position.set(-4.5, 9, 6);
  keyLight.castShadow = true;
  keyLight.shadow.mapSize.set(1024, 1024);
  keyLight.shadow.camera.left = -8;
  keyLight.shadow.camera.right = 8;
  keyLight.shadow.camera.top = 8;
  keyLight.shadow.camera.bottom = -8;
  keyLight.shadow.bias = -0.0003;
  scene.add(keyLight);

  const cyanLight = new THREE.PointLight(0x16d4cf, 42, 12, 2);
  cyanLight.position.set(-4.1, 2.5, 2.8);
  scene.add(cyanLight);
  const violetLight = new THREE.PointLight(0x865bff, 45, 13, 2);
  violetLight.position.set(4, 3.2, -2.7);
  scene.add(violetLight);

  const ground = new THREE.Mesh(
    new THREE.PlaneGeometry(60, 60),
    new THREE.ShadowMaterial({ opacity: 0.3 }),
  );
  ground.rotation.x = -Math.PI / 2;
  ground.position.y = 0.08;
  ground.receiveShadow = true;
  scene.add(ground);

  const caseMaterial = new THREE.MeshPhysicalMaterial({
    color: 0x202c40,
    metalness: 0.64,
    roughness: 0.3,
    clearcoat: 0.55,
    clearcoatRoughness: 0.24,
  });
  const plateMaterial = new THREE.MeshStandardMaterial({
    color: 0x2a3950,
    metalness: 0.7,
    roughness: 0.34,
  });
  const keyboardCase = new THREE.Mesh(
    new THREE.BoxGeometry(boardWidth, 0.56, boardDepth),
    caseMaterial,
  );
  keyboardCase.position.y = 0.53;
  keyboardCase.castShadow = true;
  keyboardCase.receiveShadow = true;
  keyboardRoot.add(keyboardCase);

  const topPlate = new THREE.Mesh(
    new THREE.BoxGeometry(boardWidth - 0.12, 0.12, boardDepth - 0.12),
    plateMaterial,
  );
  topPlate.position.y = 0.87;
  topPlate.castShadow = true;
  topPlate.receiveShadow = true;
  keyboardRoot.add(topPlate);

  const ledColors = [0x14dfbf, 0x5395ff, 0x9365ff, 0xff9f64];
  const ledWidth = (boardWidth - 0.6) / ledColors.length;
  ledColors.forEach((color, index) => {
    const led = new THREE.Mesh(
      new THREE.BoxGeometry(ledWidth - 0.08, 0.035, 0.045),
      new THREE.MeshStandardMaterial({
        color,
        emissive: color,
        emissiveIntensity: 1.4,
        roughness: 0.24,
      }),
    );
    led.position.set(-boardWidth / 2 + 0.3 + ledWidth * (index + 0.5), 0.3, boardDepth / 2 + 0.004);
    keyboardRoot.add(led);
  });

  const switchMaterial = new THREE.MeshStandardMaterial({
    color: 0x0b101a,
    metalness: 0.28,
    roughness: 0.56,
  });
  const labelGeometry = new THREE.PlaneGeometry(1.34, 0.69);
  const columnStep = 1.55;
  const rowStep = 1.17;
  const topPlateY = 0.93;

  rows.forEach((row, rowIndex) => {
    row.forEach((skill, columnIndex) => {
      const keyWidth = 1.44;
      const keyDepth = 0.92;
      const x = (columnIndex - (row.length - 1) / 2) * columnStep;
      const z = (rowIndex - (rows.length - 1) / 2) * rowStep;
      const switchBase = new THREE.Mesh(new THREE.BoxGeometry(0.34, 0.16, 0.3), switchMaterial);
      switchBase.position.set(x, topPlateY + 0.055, z);
      keyboardRoot.add(switchBase);

      const keyGroup = new THREE.Group();
      keyGroup.position.set(x, topPlateY + 0.1, z);
      keyboardRoot.add(keyGroup);

      const accent = new THREE.Color(skill.color);
      const capMaterial = new THREE.MeshPhysicalMaterial({
        color: accent.clone().multiplyScalar(0.45),
        metalness: 0.18,
        roughness: 0.26,
        clearcoat: 0.78,
        clearcoatRoughness: 0.2,
        emissive: accent,
        emissiveIntensity: 0.13,
      });
      const cap = new THREE.Mesh(
        createRoundedKeyGeometry(THREE, keyWidth, keyDepth, 0.37),
        capMaterial,
      );
      cap.castShadow = true;
      cap.receiveShadow = true;
      keyGroup.add(cap);

      const labelTexture = createKeyLabel(THREE, skill, renderer);
      const labelMaterial = new THREE.MeshBasicMaterial({
        map: labelTexture,
        transparent: true,
        depthWrite: false,
        toneMapped: false,
      });
      const label = new THREE.Mesh(labelGeometry, labelMaterial);
      label.rotation.x = -Math.PI / 2;
      label.position.y = 0.425;
      label.position.z = 0.006;
      label.scale.x = 0.94;
      keyGroup.add(label);

      const keyState = {
        skill,
        group: keyGroup,
        material: capMaterial,
        offset: 0,
        velocity: 0,
        target: 0,
      };
      keyObjects.set(skill.id, keyState);
      hitTargets.push(cap);
      cap.userData.skillId = skill.id;
    });
  });

  scene.add(keyboardRoot);

  const configureCamera = () => {
    const rect = stage.getBoundingClientRect();
    if (!rect.width || !rect.height) return;
    camera.aspect = rect.width / rect.height;
    const halfFieldTangent = Math.tan((camera.fov * Math.PI) / 360);
    const projectedWidth = boardWidth + 0.2;
    const projectedHeight = boardDepth * 0.52 + 1.25;
    const widthDistance = projectedWidth / (2 * halfFieldTangent * camera.aspect);
    const heightDistance = projectedHeight / (2 * halfFieldTangent);
    const distance = Math.max(7.8, widthDistance * 1.12, heightDistance * 1.12);
    camera.position
      .copy(cameraTarget)
      .add(new THREE.Vector3(0, 0.52, 0.81).normalize().multiplyScalar(distance));
    camera.lookAt(cameraTarget);
    camera.updateProjectionMatrix();
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.5));
    renderer.setSize(rect.width, rect.height, false);
    renderer.render(scene, camera);
  };

  const resizeObserver = new ResizeObserver(configureCamera);
  resizeObserver.observe(stage);
  window.addEventListener("resize", configureCamera, { passive: true });

  function setHoveredSkill(skill) {
    hoveredId = skill?.id || "";
    if (skill) {
      playKeyboardSound("hover");
    }
  }

  function pressSkill(skill, hold) {
    const key = keyObjects.get(skill.id);
    if (!key) return;
    key.target = -0.105;
    if (!hold) {
      window.setTimeout(() => {
        key.target = 0;
      }, 95);
    }
  }

  function playSound(kind) {
    playKeyboardSound(kind);
  }

  function getSkillAtPointer(event) {
    const rect = renderer.domElement.getBoundingClientRect();
    pointer.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
    pointer.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
    raycaster.setFromCamera(pointer, camera);
    const intersection = raycaster.intersectObjects(hitTargets, false)[0];
    return intersection ? skillById.get(intersection.object.userData.skillId) : null;
  }

  renderer.domElement.addEventListener("pointermove", (event) => {
    const skill = getSkillAtPointer(event);
    const nextId = skill?.id || "";
    if (nextId !== hoveredId) {
      hoveredId = nextId;
      hoveredSkill = skill;
      if (skill) playKeyboardSound("hover");
      updateSkillPanel(skill || selectedSkill);
    }
    renderer.domElement.style.cursor = skill ? "pointer" : "grab";
    if (!reducedMotion) {
      const bounds = renderer.domElement.getBoundingClientRect();
      pointerY = ((event.clientY - bounds.top) / bounds.height - 0.5) * 2;
      targetRotationX = 0.035 - pointerY * 0.035;
    }
  });

  renderer.domElement.addEventListener("pointerleave", () => {
    hoveredId = "";
    hoveredSkill = null;
    updateSkillPanel(selectedSkill);
    renderer.domElement.style.cursor = "grab";
    targetRotationX = 0.035;
  });

  renderer.domElement.addEventListener("pointerdown", (event) => {
    const skill = getSkillAtPointer(event);
    if (!skill) return;
    event.preventDefault();
    selectSkill(skill);
    pressSkill(skill, true);
    playKeyboardSound("press");
    renderer.domElement.style.cursor = "grabbing";
  });

  window.addEventListener("pointerup", () => {
    keyObjects.forEach((key) => {
      key.target = 0;
    });
    if (renderer.domElement.isConnected) renderer.domElement.style.cursor = "grab";
  });

  function animate(now) {
    animationId = 0;
    if (!inView || document.hidden) return;
    animationId = window.requestAnimationFrame(animate);
    const delta = lastFrameTime ? Math.min((now - lastFrameTime) / 1000, 0.04) : 0;
    lastFrameTime = now;

    keyObjects.forEach((key) => {
      const spring = (key.target - key.offset) * 112;
      key.velocity += (spring - key.velocity * 17) * delta;
      key.offset += key.velocity * delta;
      if (Math.abs(key.offset - key.target) < 0.0005 && Math.abs(key.velocity) < 0.008) {
        key.offset = key.target;
        key.velocity = 0;
      }
      key.group.position.y = topPlateY + 0.1 + key.offset;
      const highlighted = key.skill.id === hoveredId || key.skill.id === selectedSkill.id;
      key.material.emissiveIntensity = highlighted ? 0.32 : 0.13;
    });

    const easing = 1 - Math.exp(-delta * 5);
    keyboardRoot.rotation.x += (targetRotationX - keyboardRoot.rotation.x) * easing;
    if (!reducedMotion) {
      keyboardRoot.position.y = Math.sin(now * 0.00055) * 0.035;
    }
    renderer.render(scene, camera);
  }

  function updateAnimationState() {
    const shouldAnimate = inView && !document.hidden;
    if (shouldAnimate && !animationId) {
      lastFrameTime = 0;
      animationId = window.requestAnimationFrame(animate);
    } else if (!shouldAnimate && animationId) {
      window.cancelAnimationFrame(animationId);
      animationId = 0;
      lastFrameTime = 0;
    }
  }

  const visibilityObserver = new IntersectionObserver(
    ([entry]) => {
      inView = entry.isIntersecting;
      updateAnimationState();
    },
    { threshold: 0 },
  );
  visibilityObserver.observe(stage);
  document.addEventListener("visibilitychange", updateAnimationState);

  configureCamera();
  stage.dataset.status = "ready";
  statusMessage.textContent = "Interactive keyboard ready.";

  return { setHoveredSkill, pressSkill, playSound };
}

async function loadKeyboard() {
  if (loadStarted) return;
  loadStarted = true;
  try {
    const THREE = await import(threeModuleUrl);
    keyboard = createKeyboard(THREE);
  } catch (error) {
    setStageError(error);
  }
}

if ("IntersectionObserver" in window) {
  const loadObserver = new IntersectionObserver(
    ([entry], observer) => {
      if (entry.isIntersecting) {
        observer.disconnect();
        loadKeyboard();
      }
    },
    { rootMargin: "280px 0px" },
  );
  loadObserver.observe(stage);
} else {
  loadKeyboard();
}
