document.addEventListener("DOMContentLoaded", () => {
  const player = document.querySelector("[data-thank-you-audio]");
  if (!player) return;

  const speech = window.speechSynthesis;
  const SpeechUtterance = window.SpeechSynthesisUtterance;
  const message =
    "Hello! Thank you for visiting my website. I truly appreciate your time and interest in my work. Welcome to my portfolio. I hope you enjoy exploring my projects and creativity. Have a wonderful day!";
  const playButton = player.querySelector("[data-audio-play]");
  const pauseButton = player.querySelector("[data-audio-pause]");
  const resumeButton = player.querySelector("[data-audio-resume]");
  const replayButton = player.querySelector("[data-audio-replay]");
  const muteButton = player.querySelector("[data-audio-mute]");
  const muteLabel = player.querySelector("[data-audio-mute-label]");
  const status = player.querySelector("[data-audio-status]");
  const subtitles = player.querySelector("[data-audio-subtitles]");
  const words = [];
  let state = "idle";
  let muted = false;
  let utterance;
  let playbackId = 0;
  let audioContext;
  let ambientGain;
  let ambientOscillators = [];
  let boundaryTimer;
  let fallbackTimer;
  let boundarySeen = false;
  let fallbackElapsed = 0;
  let fallbackResumedAt = 0;

  const appendCaptionWords = () => {
    subtitles.replaceChildren();
    let characterIndex = 0;
    for (const token of message.match(/\s+|[^\s]+/g) || []) {
      if (/^\s+$/.test(token)) {
        subtitles.append(document.createTextNode(token));
      } else {
        const word = document.createElement("span");
        word.dataset.wordIndex = String(words.length);
        word.dataset.startIndex = String(characterIndex);
        word.textContent = token;
        subtitles.append(word);
        words.push(word);
      }
      characterIndex += token.length;
    }
    subtitles.setAttribute("aria-label", message);
  };

  const setStatus = (text) => {
    status.textContent = text;
  };

  const updateControls = () => {
    playButton.disabled = state === "speaking" || state === "paused";
    pauseButton.disabled = state !== "speaking";
    resumeButton.disabled = state !== "paused";
    replayButton.disabled = !speechSupported;
  };

  const markSpokenWord = (wordIndex) => {
    words.forEach((word, index) => {
      word.classList.toggle("is-spoken", index < wordIndex);
      word.classList.toggle("is-current", index === wordIndex);
    });
  };

  const clearCaptions = () => {
    words.forEach((word) => word.classList.remove("is-current", "is-spoken"));
  };

  const stopAmbient = () => {
    if (!audioContext || !ambientGain) return;
    const now = audioContext.currentTime;
    ambientGain.gain.cancelScheduledValues(now);
    ambientGain.gain.setTargetAtTime(0, now, 0.08);
    const oscillators = ambientOscillators;
    ambientOscillators = [];
    window.setTimeout(() => {
      oscillators.forEach((oscillator) => {
        try {
          oscillator.stop();
        } catch (error) {
          if (error.name !== "InvalidStateError") throw error;
        }
      });
    }, 350);
  };

  const startAmbient = async () => {
    const AudioContextConstructor = window.AudioContext || window.webkitAudioContext;
    if (!AudioContextConstructor) return;

    if (!audioContext || audioContext.state === "closed") {
      audioContext = new AudioContextConstructor();
      ambientGain = audioContext.createGain();
      ambientGain.gain.value = 0;
      ambientGain.connect(audioContext.destination);

      for (const frequency of [110, 164.81, 220]) {
        const oscillator = audioContext.createOscillator();
        const voiceGain = audioContext.createGain();
        oscillator.type = "sine";
        oscillator.frequency.value = frequency;
        voiceGain.gain.value = 0.16;
        oscillator.connect(voiceGain);
        voiceGain.connect(ambientGain);
        oscillator.start();
        ambientOscillators.push(oscillator);
      }
    }

    if (audioContext.state === "suspended") await audioContext.resume();
    const now = audioContext.currentTime;
    ambientGain.gain.cancelScheduledValues(now);
    ambientGain.gain.setTargetAtTime(muted ? 0 : 0.018, now, 0.7);
  };

  const playChime = () => {
    if (!audioContext || muted) return;
    const oscillator = audioContext.createOscillator();
    const gain = audioContext.createGain();
    const now = audioContext.currentTime;
    oscillator.type = "sine";
    oscillator.frequency.setValueAtTime(523.25, now);
    oscillator.frequency.exponentialRampToValueAtTime(783.99, now + 0.24);
    gain.gain.setValueAtTime(0.0001, now);
    gain.gain.exponentialRampToValueAtTime(0.055, now + 0.035);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.55);
    oscillator.connect(gain);
    gain.connect(audioContext.destination);
    oscillator.start(now);
    oscillator.stop(now + 0.56);
  };

  const chooseVoice = () => {
    const englishVoices = speech.getVoices().filter((voice) => /^en(-|_)/i.test(voice.lang));
    const preferredNames = ["aria", "jenny", "samantha", "google us english"];
    return (
      preferredNames
        .map((name) => englishVoices.find((voice) => voice.name.toLowerCase().includes(name)))
        .find(Boolean) ||
      englishVoices.find((voice) => /^en-us$/i.test(voice.lang)) ||
      englishVoices[0]
    );
  };

  const clearFallback = () => {
    window.clearTimeout(boundaryTimer);
    window.clearInterval(fallbackTimer);
    boundaryTimer = undefined;
    fallbackTimer = undefined;
  };

  const armFallbackCaptions = (id) => {
    window.clearTimeout(boundaryTimer);
    window.clearInterval(fallbackTimer);
    boundaryTimer = window.setTimeout(() => {
      if (id !== playbackId || state !== "speaking") return;
      fallbackTimer = window.setInterval(() => {
        const elapsed = fallbackElapsed + performance.now() - fallbackResumedAt;
        const wordIndex = Math.min(Math.floor(elapsed / 360), words.length - 1);
        markSpokenWord(wordIndex);
      }, 280);
    }, 1100);
  };

  const startFallbackCaptions = (id) => {
    fallbackElapsed = 0;
    fallbackResumedAt = performance.now();
    armFallbackCaptions(id);
  };

  const speak = async () => {
    if (!speechSupported) {
      setStatus("Speech playback is not available in this browser.");
      return;
    }

    playbackId += 1;
    const id = playbackId;
    clearFallback();
    boundarySeen = false;
    speech.cancel();
    clearCaptions();
    player.classList.remove("is-speaking");
    state = "idle";
    updateControls();

    startAmbient()
      .then(() => {
        if (id === playbackId) playChime();
      })
      .catch((error) => {
        console.warn("The greeting's ambient audio could not start.", error);
      });

    utterance = new SpeechUtterance(message);
    utterance.lang = "en-US";
    utterance.rate = 0.96;
    utterance.pitch = 1.02;
    utterance.volume = muted ? 0 : 1;
    const voice = chooseVoice();
    if (voice) {
      utterance.voice = voice;
      utterance.lang = voice.lang;
    }

    utterance.onstart = () => {
      if (id !== playbackId) return;
      state = "speaking";
      player.classList.add("is-speaking");
      setStatus(
        voice ? `Speaking with ${voice.name}.` : "Speaking with your browser’s default voice.",
      );
      updateControls();
      startFallbackCaptions(id);
    };

    utterance.onboundary = (event) => {
      if (id !== playbackId || event.name !== "word" || !Number.isFinite(event.charIndex)) return;
      boundarySeen = true;
      clearFallback();
      const currentIndex = words.findIndex((word) => {
        const start = Number(word.dataset.startIndex);
        return start <= event.charIndex && start + word.textContent.length > event.charIndex;
      });
      if (currentIndex >= 0) markSpokenWord(currentIndex);
    };

    utterance.onpause = () => {
      if (id !== playbackId) return;
      state = "paused";
      player.classList.remove("is-speaking");
      clearFallback();
      if (fallbackResumedAt) fallbackElapsed += performance.now() - fallbackResumedAt;
      setStatus("Greeting paused.");
      updateControls();
      if (audioContext?.state === "running") {
        audioContext.suspend().catch((error) => {
          console.warn("The greeting's ambient audio could not pause.", error);
        });
      }
    };

    utterance.onresume = () => {
      if (id !== playbackId) return;
      state = "speaking";
      player.classList.add("is-speaking");
      fallbackResumedAt = performance.now();
      setStatus(
        voice ? `Speaking with ${voice.name}.` : "Speaking with your browser’s default voice.",
      );
      updateControls();
      if (!boundarySeen) armFallbackCaptions(id);
      if (audioContext?.state === "suspended") {
        audioContext.resume().catch((error) => {
          console.warn("The greeting's ambient audio could not resume.", error);
        });
      }
    };

    utterance.onend = () => {
      if (id !== playbackId) return;
      clearFallback();
      state = "ended";
      player.classList.remove("is-speaking");
      markSpokenWord(words.length);
      setStatus("Thank you for listening.");
      updateControls();
      stopAmbient();
    };

    utterance.onerror = (event) => {
      if (id !== playbackId || event.error === "canceled" || event.error === "interrupted") return;
      clearFallback();
      state = "error";
      player.classList.remove("is-speaking");
      setStatus("Voice playback failed. Please try again or check your browser’s speech settings.");
      updateControls();
      stopAmbient();
      console.error("The portfolio greeting could not be spoken.", event.error);
    };

    state = "speaking";
    updateControls();
    setStatus("Preparing your greeting…");
    speech.speak(utterance);
  };

  const speechSupported = Boolean(speech && SpeechUtterance);
  appendCaptionWords();
  if (!speechSupported) {
    [playButton, pauseButton, resumeButton, replayButton].forEach((button) => {
      button.disabled = true;
    });
    setStatus("Speech playback is not supported in this browser.");
  }
  updateControls();

  playButton.addEventListener("click", speak);
  replayButton.addEventListener("click", speak);

  pauseButton.addEventListener("click", () => {
    if (state === "speaking") speech.pause();
  });

  resumeButton.addEventListener("click", () => {
    if (state !== "paused") return;
    speech.resume();
    state = "speaking";
    player.classList.add("is-speaking");
    setStatus("Resuming your greeting.");
    updateControls();
    if (fallbackResumedAt) {
      fallbackResumedAt = performance.now();
      if (!boundarySeen) armFallbackCaptions(playbackId);
    }
  });

  muteButton.addEventListener("click", () => {
    muted = !muted;
    muteButton.setAttribute("aria-pressed", String(muted));
    muteLabel.textContent = muted ? "Unmute" : "Mute";
    if (utterance) utterance.volume = muted ? 0 : 1;
    if (ambientGain && audioContext) {
      const now = audioContext.currentTime;
      ambientGain.gain.cancelScheduledValues(now);
      ambientGain.gain.setTargetAtTime(muted || state !== "speaking" ? 0 : 0.018, now, 0.12);
    }
    setStatus(
      muted ? "Audio muted." : state === "speaking" ? "Audio unmuted." : "Audio unmuted and ready.",
    );
  });

  const stopOnNavigation = () => {
    playbackId += 1;
    clearFallback();
    if (speechSupported) speech.cancel();
    player.classList.remove("is-speaking");
    if (audioContext && audioContext.state !== "closed") {
      stopAmbient();
      audioContext.close();
    }
  };

  window.addEventListener("pagehide", stopOnNavigation, { once: true });
  window.addEventListener("beforeunload", stopOnNavigation, { once: true });
});
