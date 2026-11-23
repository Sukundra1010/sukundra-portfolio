const engineIntro = document.querySelector("[data-engine-intro]");
const engineStartButton = engineIntro?.querySelector("[data-engine-start]");
const engineSoundButton = engineIntro?.querySelector("[data-engine-sound]");
const engineSoundLabel = engineIntro?.querySelector("[data-engine-sound-label]");
const engineSkipButton = engineIntro?.querySelector("[data-engine-skip]");
const engineAudio = engineIntro?.querySelector("[data-engine-audio]");
const engineCanvas = engineIntro?.querySelector("[data-engine-canvas]");
const engineStatus = engineIntro?.querySelector("[data-engine-status]");
const engineTitle = engineIntro?.querySelector("[data-engine-title]");
const reducedMotionPreference = window.matchMedia("(prefers-reduced-motion: reduce)");

const createHelicopterAudio = (audioElement) => {
  const AudioContext = window.AudioContext || window.webkitAudioContext;
  if (!AudioContext) throw new Error("Web Audio is not supported in this browser.");

  const context = new AudioContext();
  const master = context.createGain();
  const panner = context.createStereoPanner();
  const limiter = context.createDynamicsCompressor();
  const source = context.createMediaElementSource(audioElement);
  const masterVolume = 0.85;
  const state = { enabled: false, rotorSpeed: 0, acceleration: 0 };
  master.gain.value = 0;
  limiter.threshold.value = -8;
  limiter.knee.value = 4;
  limiter.ratio.value = 10;
  limiter.attack.value = 0.003;
  limiter.release.value = 0.15;
  source.connect(master);
  master.connect(panner);
  panner.connect(limiter);
  limiter.connect(context.destination);

  const setParameter = (parameter, value) =>
    parameter.setTargetAtTime(value, context.currentTime, 0.08);

  return {
    resume() {
      return context.resume();
    },
    setEnabled(enabled) {
      state.enabled = enabled;
      setParameter(
        master.gain,
        enabled ? masterVolume * (0.55 + state.rotorSpeed * 0.3 + state.acceleration * 0.15) : 0,
      );
    },
    setMotion({ rotorSpeed, acceleration, pan, doppler }) {
      state.rotorSpeed = rotorSpeed;
      state.acceleration = acceleration;
      setParameter(panner.pan, pan * 0.55);
      audioElement.playbackRate = Math.min(1.06, Math.max(0.94, 1 + doppler * 0.06));
      if (state.enabled) {
        setParameter(master.gain, masterVolume * (0.55 + rotorSpeed * 0.3 + acceleration * 0.15));
      }
    },
    dispose() {
      return context.close();
    },
  };
};

const prepareTitleLetters = (title) => {
  title.querySelectorAll("[data-engine-title-line]").forEach((line) => {
    const characters = Array.from(line.textContent ?? "");
    const isEmphasizedLine = line.tagName === "STRONG";
    const fragment = document.createDocumentFragment();

    characters.forEach((character, index) => {
      const letter = document.createElement("span");
      letter.className = "engine-intro-title-character";
      letter.setAttribute("aria-hidden", "true");
      letter.style.setProperty(
        "--character-delay",
        `${(isEmphasizedLine ? 360 : 0) + index * (isEmphasizedLine ? 44 : 34)}ms`,
      );
      letter.textContent = character === " " ? "\u00a0" : character;
      fragment.append(letter);
    });

    line.replaceChildren(fragment);
    line.setAttribute("aria-hidden", "true");
  });
};

if (
  engineIntro &&
  engineStartButton &&
  engineSoundButton &&
  engineSoundLabel &&
  engineSkipButton &&
  engineAudio &&
  engineStatus &&
  engineTitle &&
  !reducedMotionPreference.matches
) {
  const sessionKey = "portfolioEngineIntroSeen";
  const soundPreferenceKey = "portfolioEngineSound";
  const flightStartDelayMs = 1800;
  const flightDurationMs = 3000;
  const soundDurationMs = 7000;
  const revealDelayMs = flightStartDelayMs + flightDurationMs;
  const finishDelayMs = revealDelayMs + 2300;
  let soundEnabled = true;
  let started = false;
  let finished = false;
  let startedAt = 0;
  let sceneController;
  let flightTimeout = 0;
  let soundTimeout = 0;
  let exitTimeout = 0;
  let titleTimeout = 0;
  let hideTimeout = 0;
  let previousBackgroundInertState = [];
  let soundExpired = false;
  let helicopterAudio;

  try {
    if (window.sessionStorage.getItem(sessionKey)) {
      engineIntro.remove();
    } else {
      window.sessionStorage.setItem(sessionKey, "1");
    }
  } catch (error) {
    console.warn("The intro was skipped because session storage is unavailable.", error);
    engineIntro.remove();
  }

  if (engineIntro.isConnected) {
    try {
      const savedSoundPreference = window.localStorage.getItem(soundPreferenceKey);
      soundEnabled = savedSoundPreference !== "off";
    } catch (error) {
      console.warn("The saved intro sound preference could not be read.", error);
    }

    const updateSoundControl = () => {
      engineSoundButton.setAttribute("aria-pressed", String(soundEnabled));
      engineSoundButton.setAttribute(
        "aria-label",
        soundExpired
          ? "Intro sound limit reached."
          : soundEnabled
            ? "Sound on at high volume. Mute intro sound."
            : "Sound off. Enable intro sound.",
      );
      engineSoundLabel.textContent = soundEnabled ? "Sound MAX" : "Sound OFF";
      engineSoundButton.disabled = soundExpired;
    };

    const saveSoundPreference = () => {
      try {
        window.localStorage.setItem(soundPreferenceKey, soundEnabled ? "on" : "off");
      } catch (error) {
        console.warn("The intro sound preference could not be saved.", error);
      }
    };

    const stopAudio = () => {
      helicopterAudio?.setEnabled(false);
      engineAudio.pause();
      engineAudio.currentTime = 0;
    };

    const stopAudioAtLimit = () => {
      soundExpired = true;
      soundEnabled = false;
      stopAudio();
      updateSoundControl();
    };

    const playAudio = () => {
      if (!soundEnabled || finished || soundExpired) return;
      try {
        helicopterAudio ??= createHelicopterAudio(engineAudio);
        helicopterAudio.setEnabled(true);
        const playback = engineAudio.play();
        playback?.catch((error) => {
          console.warn("The helicopter recording could not be played.", error);
          engineStatus.textContent = "Sound is unavailable. The intro will continue silently.";
        });
        helicopterAudio.resume().catch((error) => {
          console.warn("The helicopter sound could not be started.", error);
          engineStatus.textContent = "Sound is unavailable. The intro will continue silently.";
        });
      } catch (error) {
        console.warn("The helicopter sound could not be created.", error);
        engineStatus.textContent = "Sound is unavailable. The intro will continue silently.";
      }
      if (!soundTimeout) {
        soundTimeout = window.setTimeout(stopAudioAtLimit, soundDurationMs);
      }
    };

    const restorePage = () => {
      previousBackgroundInertState.forEach(({ element, wasInert }) => {
        element.inert = wasInert;
      });
      previousBackgroundInertState = [];
      document.body.classList.remove("engine-intro-active");
    };

    const finishIntro = (skip = false) => {
      if (finished) return;
      finished = true;
      window.clearTimeout(titleTimeout);
      window.clearTimeout(flightTimeout);
      window.clearTimeout(soundTimeout);
      window.clearTimeout(exitTimeout);
      window.clearTimeout(hideTimeout);
      stopAudio();
      helicopterAudio?.dispose().catch((error) => {
        console.warn("The helicopter sound could not be released.", error);
      });
      sceneController?.dispose();
      restorePage();
      engineIntro.classList.add("is-exiting");
      engineIntro.setAttribute("aria-hidden", "true");
      document.querySelector(".site-header .brand")?.focus({ preventScroll: true });

      if (skip) {
        engineIntro.hidden = true;
        return;
      }

      const hideOverlay = (event) => {
        if (event && event.propertyName !== "opacity") return;
        engineIntro.hidden = true;
        engineIntro.removeEventListener("transitionend", hideOverlay);
        window.clearTimeout(hideTimeout);
      };
      engineIntro.addEventListener("transitionend", hideOverlay);
      hideTimeout = window.setTimeout(hideOverlay, 950);
    };

    const startExperience = () => {
      if (started || finished) return;
      started = true;
      startedAt = performance.now();
      engineIntro.dataset.phase = "igniting";
      engineStartButton.disabled = true;
      engineStatus.textContent = "Main rotor spooling up";
      sceneController?.startExperience(startedAt);
      playAudio();

      flightTimeout = window.setTimeout(() => {
        engineStatus.textContent = "Lifting off. Enjoy the flight.";
      }, flightStartDelayMs);
      titleTimeout = window.setTimeout(() => {
        engineIntro.dataset.phase = "reveal";
        engineStatus.textContent = "Welcome to my portfolio";
      }, revealDelayMs);
      exitTimeout = window.setTimeout(() => finishIntro(), finishDelayMs);
    };

    const setPageInert = () => {
      previousBackgroundInertState = [...document.body.children]
        .filter((element) => element !== engineIntro)
        .map((element) => {
          const wasInert = element.inert;
          element.inert = true;
          return { element, wasInert };
        });
      document.body.classList.add("engine-intro-active");
    };

    prepareTitleLetters(engineTitle);
    updateSoundControl();
    engineIntro.hidden = false;
    setPageInert();
    engineStartButton.focus({ preventScroll: true });

    if (engineCanvas && engineIntro.dataset.sceneModule) {
      import(new URL(engineIntro.dataset.sceneModule, document.baseURI).href)
        .then(({ createHelicopterIntroScene }) => {
          if (finished || !engineIntro.isConnected) return;
          sceneController = createHelicopterIntroScene({
            canvas: engineCanvas,
            overlay: engineIntro,
            onMotion: (motion) => helicopterAudio?.setMotion(motion),
          });
          if (started) sceneController.startExperience(startedAt);
        })
        .catch((error) => {
          console.warn("The helicopter scene could not be loaded.", error);
          engineStatus.textContent = "The 3D scene is unavailable. The intro will continue.";
        });
    }

    engineStartButton.addEventListener("click", startExperience);
    engineSkipButton.addEventListener("click", () => finishIntro(true));
    engineSoundButton.addEventListener("click", () => {
      soundEnabled = !soundEnabled;
      updateSoundControl();
      saveSoundPreference();

      if (!soundEnabled) {
        stopAudio();
      } else if (started) {
        playAudio();
      } else {
        startExperience();
      }
    });

    engineIntro.addEventListener("keydown", (event) => {
      if (event.key === "Escape") {
        event.preventDefault();
        finishIntro(true);
        return;
      }

      if (event.key !== "Tab") return;
      const focusableControls = [engineSoundButton, engineSkipButton, engineStartButton].filter(
        (control) => !control.disabled,
      );
      const firstControl = focusableControls[0];
      const lastControl = focusableControls[focusableControls.length - 1];

      if (event.shiftKey && document.activeElement === firstControl) {
        event.preventDefault();
        lastControl.focus();
      } else if (!event.shiftKey && document.activeElement === lastControl) {
        event.preventDefault();
        firstControl.focus();
      }
    });
  }
}
