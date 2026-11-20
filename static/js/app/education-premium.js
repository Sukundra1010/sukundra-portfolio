document.addEventListener("DOMContentLoaded", () => {
  const section = document.querySelector("#education.education-premium");
  if (!section) return;

  const cards = [...section.querySelectorAll("[data-academic-card]")];
  const counters = [...section.querySelectorAll("[data-count]")];
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  const animateCount = (element) => {
    if (element.dataset.animated === "true") return;
    element.dataset.animated = "true";

    const target = Number(element.dataset.count);
    const decimals = Number(element.dataset.decimals || 0);
    if (!Number.isFinite(target)) return;
    if (reducedMotion) {
      element.textContent = target.toFixed(decimals);
      return;
    }

    const duration = 900;
    const startedAt = performance.now();
    const update = (now) => {
      const progress = Math.min((now - startedAt) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      element.textContent = (target * eased).toFixed(decimals);
      if (progress < 1) requestAnimationFrame(update);
    };
    requestAnimationFrame(update);
  };

  if ("IntersectionObserver" in window) {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          entry.target.classList.add("is-visible");
          entry.target.querySelectorAll("[data-count]").forEach(animateCount);
          observer.unobserve(entry.target);
        });
      },
      { threshold: 0.18 },
    );
    cards.forEach((card, index) => {
      card.style.transitionDelay = reducedMotion ? "0ms" : `${index * 90}ms`;
      observer.observe(card);
    });
  } else {
    cards.forEach((card) => card.classList.add("is-visible"));
    counters.forEach(animateCount);
  }

  if (reducedMotion || !window.matchMedia("(pointer: fine)").matches) return;

  cards.forEach((card) => {
    card.addEventListener("pointermove", (event) => {
      const bounds = card.getBoundingClientRect();
      const x = (event.clientX - bounds.left) / bounds.width - 0.5;
      const y = (event.clientY - bounds.top) / bounds.height - 0.5;
      card.style.transform = `perspective(1100px) rotateX(${-y * 2.4}deg) rotateY(${x * 3.2}deg) translateY(-3px)`;
    });

    card.addEventListener("pointerleave", () => {
      card.style.transform = "";
    });
  });
});
