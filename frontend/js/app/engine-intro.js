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
  const rideStartDelayMs = 1800;
  const rideDurationMs = 4000;
  const soundDurationMs = 7000;
  const revealDelayMs = rideStartDelayMs + rideDurationMs;
  const finishDelayMs = revealDelayMs + 1200;
  let soundEnabled = true;
  let started = false;
  let finished = false;
  let startedAt = 0;
  let sceneController;
  let rideTimeout = 0;
  let soundTimeout = 0;
  let exitTimeout = 0;
  let titleTimeout = 0;
  let hideTimeout = 0;
  let previousBackgroundInertState = [];
  let audioErrorReported = false;
  let soundExpired = false;

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
            ? "Sound on. Mute intro sound."
            : "Sound off. Enable intro sound.",
      );
      engineSoundLabel.textContent = soundEnabled ? "Sound ON" : "Sound OFF";
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
      engineAudio.pause();
    };

    const stopAudioAtLimit = () => {
      soundExpired = true;
      soundEnabled = false;
      engineAudio.pause();
      engineAudio.currentTime = 0;
      engineAudio.loop = false;
      updateSoundControl();
    };

    const playAudio = () => {
      if (!soundEnabled || finished || soundExpired) return;
      audioErrorReported = false;
      engineAudio.loop = true;
      const playback = engineAudio.play();
      playback?.catch((error) => {
        console.warn("The motorcycle startup sound could not be played.", error);
        engineStatus.textContent = "Sound is unavailable. The intro will continue silently.";
      });
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
      window.clearTimeout(rideTimeout);
      window.clearTimeout(soundTimeout);
      window.clearTimeout(exitTimeout);
      window.clearTimeout(hideTimeout);
      stopAudio();
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
      engineStatus.textContent = "Ignition sequence engaged";
      sceneController?.startExperience(startedAt);
      playAudio();

      rideTimeout = window.setTimeout(() => {
        engineIntro.classList.add("is-riding");
        engineStatus.textContent = "On the road. Enjoy the ride.";
      }, rideStartDelayMs);
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

    updateSoundControl();
    engineIntro.hidden = false;
    setPageInert();
    engineStartButton.focus({ preventScroll: true });

    if (engineCanvas && engineIntro.dataset.sceneModule) {
      import(new URL(engineIntro.dataset.sceneModule, document.baseURI).href)
        .then(({ createMotorcycleIntroScene }) => {
          if (finished || !engineIntro.isConnected) return;
          sceneController = createMotorcycleIntroScene({
            canvas: engineCanvas,
            overlay: engineIntro,
            imageUrl: new URL(engineIntro.dataset.sceneImage, document.baseURI).href,
          });
          if (started) sceneController.startExperience(startedAt);
        })
        .catch((error) => {
          console.warn("The motorcycle scene could not be loaded.", error);
          engineStatus.textContent = "The 3D scene is unavailable. The intro will continue.";
        });
    }

    engineAudio.addEventListener("error", () => {
      if (audioErrorReported) return;
      audioErrorReported = true;
      engineStatus.textContent = "Sound is unavailable. The intro will continue silently.";
      console.warn("The motorcycle startup audio file could not be loaded.");
    });

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
