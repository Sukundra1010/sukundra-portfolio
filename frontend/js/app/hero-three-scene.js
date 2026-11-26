const heroScene = document.querySelector("[data-hero-scene]");

if (heroScene) {
  const portrait = heroScene.querySelector("[data-hero-tilt]");
  const depthElements = [...heroScene.querySelectorAll(".portrait-skill-tag[data-depth]")];
  const motionPreference = window.matchMedia("(prefers-reduced-motion: reduce)");
  const finePointer = window.matchMedia("(hover: hover) and (pointer: fine)").matches;

  if ("IntersectionObserver" in window) {
    const visibilityObserver = new IntersectionObserver(
      (entries) => {
        heroScene.dataset.inView = String(entries.some((entry) => entry.isIntersecting));
      },
      { threshold: 0.05 },
    );

    visibilityObserver.observe(heroScene);
    window.addEventListener("pagehide", () => visibilityObserver.disconnect(), { once: true });
  } else {
    heroScene.dataset.inView = "true";
  }

  if (portrait && finePointer) {
    let targetX = 0;
    let targetY = 0;
    let currentX = 0;
    let currentY = 0;
    let animationFrame = 0;

    const resetTransforms = () => {
      if (animationFrame) window.cancelAnimationFrame(animationFrame);
      animationFrame = 0;
      targetX = 0;
      targetY = 0;
      currentX = 0;
      currentY = 0;
      portrait.style.removeProperty("--portrait-tilt-x");
      portrait.style.removeProperty("--portrait-tilt-y");
      depthElements.forEach((element) => {
        element.style.removeProperty("--parallax-x");
        element.style.removeProperty("--parallax-y");
      });
    };

    const updateTransforms = () => {
      currentX += (targetX - currentX) * 0.14;
      currentY += (targetY - currentY) * 0.14;

      const settled = Math.abs(targetX - currentX) < 0.002 && Math.abs(targetY - currentY) < 0.002;
      if (settled) {
        currentX = targetX;
        currentY = targetY;
      }

      portrait.style.setProperty("--portrait-tilt-x", `${(currentX * 14).toFixed(2)}deg`);
      portrait.style.setProperty("--portrait-tilt-y", `${(currentY * -11).toFixed(2)}deg`);

      depthElements.forEach((element) => {
        const depth = Number(element.dataset.depth);
        element.style.setProperty("--parallax-x", `${(currentX * depth * 6).toFixed(2)}px`);
        element.style.setProperty("--parallax-y", `${(currentY * depth * 5).toFixed(2)}px`);
      });

      if (settled) {
        animationFrame = 0;
        return;
      }

      animationFrame = window.requestAnimationFrame(updateTransforms);
    };

    const scheduleTransformUpdate = () => {
      if (!animationFrame) animationFrame = window.requestAnimationFrame(updateTransforms);
    };

    heroScene.addEventListener(
      "pointermove",
      (event) => {
        if (motionPreference.matches) return;
        const bounds = heroScene.getBoundingClientRect();
        targetX = Math.max(-0.5, Math.min(0.5, (event.clientX - bounds.left) / bounds.width - 0.5));
        targetY = Math.max(-0.5, Math.min(0.5, (event.clientY - bounds.top) / bounds.height - 0.5));
        scheduleTransformUpdate();
      },
      { passive: true },
    );

    heroScene.addEventListener(
      "pointerleave",
      () => {
        targetX = 0;
        targetY = 0;
        scheduleTransformUpdate();
      },
      { passive: true },
    );

    motionPreference.addEventListener("change", (event) => {
      if (event.matches) resetTransforms();
    });
  }
}
