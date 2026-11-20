const academicCertificates = [
  {
    kind: "Academic certificate",
    title: "SEE Certificate",
    description: "Secondary Education Examination certificate.",
    image: "static/images/see-certificate.jpg",
    alt: "SEE certificate for Sukundra Pujara",
  },
  {
    kind: "Academic grade sheet",
    title: "Grade XI Grade Sheet",
    description: "Grade XI academic grade sheet.",
    image: "static/images/grade-xi-grade-sheet.jpg",
    alt: "Grade XI grade sheet for Sukundra Pujara",
  },
  {
    kind: "Academic transcript",
    title: "Grade XII Transcript",
    description: "Grade XII academic transcript.",
    image: "static/images/grade-xii-transcript.jpg",
    alt: "Grade XII transcript for Sukundra Pujara",
  },
  {
    kind: "Academic certificate",
    title: "Provisional Certificate",
    description: "Provisional academic certificate.",
    image: "static/images/provisional-certificate.jpg",
    alt: "Provisional certificate for Sukundra Pujara",
  },
  {
    kind: "Academic certificate",
    title: "Migration Certificate",
    description: "Academic migration certificate.",
    image: "static/images/migration-certificate.jpg",
    alt: "Migration certificate for Sukundra Pujara",
  },
  {
    kind: "Academic certificate",
    title: "Character / Transfer Certificate",
    description: "Character and transfer certificate.",
    image: "static/images/character-transfer-certificate.jpg",
    alt: "Character and transfer certificate for Sukundra Pujara",
  },
];

const certificateTrack = document.querySelector("[data-certificate-track]");
const certificateViewport = document.querySelector("[data-certificate-viewport]");
const certificatePosition = document.querySelector("[data-certificate-position]");
const certificateViewer = document.querySelector("[data-certificate-viewer]");

if (certificateTrack && certificateViewport && certificateViewer) {
  const originalCertificates = Array.from(
    certificateTrack.querySelectorAll(".certificate-card"),
  ).map((card) => {
    const imageLink = card.querySelector(".certificate-image-link");
    const image = imageLink?.querySelector("img");
    const info = card.querySelector(".certificate-info");

    return {
      kind: info?.querySelector(".certificate-kind")?.textContent?.trim() || "Certificate",
      title: info?.querySelector("h3")?.textContent?.trim() || "Certificate",
      description: info?.querySelector("p")?.textContent?.trim() || "",
      image: image?.getAttribute("src") || imageLink?.getAttribute("href") || "",
      alt: image?.getAttribute("alt") || "Certificate",
    };
  });

  const certificates = [...academicCertificates, ...originalCertificates];
  const certificateCards = certificates.map((certificate, index) =>
    createCertificateCard(certificate, index),
  );
  certificateTrack.replaceChildren(...certificateCards);

  const viewerImage = certificateViewer.querySelector("[data-viewer-image]");
  const viewerTitle = certificateViewer.querySelector("[data-viewer-title]");
  const viewerSource = certificateViewer.querySelector("[data-viewer-source]");
  const viewerCanvas = certificateViewer.querySelector("[data-viewer-canvas]");
  const viewerZoomLabel = certificateViewer.querySelector("[data-viewer-zoom-label]");
  const viewerCount = certificateViewer.querySelector("[data-viewer-count]");
  const viewerClose = certificateViewer.querySelector("[data-viewer-close]");
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  let activeIndex = 0;
  let zoom = 1;
  let returnFocus = null;
  let scrollFrame = 0;
  let pointerStart = null;
  let suppressClick = false;

  function createCertificateCard(certificate, index) {
    const article = document.createElement("article");
    article.className = "certificate-card";
    article.dataset.certificateIndex = String(index);
    article.setAttribute("aria-label", certificate.title);

    const inner = document.createElement("div");
    inner.className = "certificate-card-inner";

    const front = document.createElement("div");
    front.className = "certificate-card-face certificate-card-front";

    const imageLink = document.createElement("a");
    imageLink.className = "certificate-image-link";
    imageLink.href = certificate.image;
    imageLink.target = "_blank";
    imageLink.rel = "noopener noreferrer";
    imageLink.dataset.certificateOpen = "";
    imageLink.setAttribute("aria-label", `Preview ${certificate.title}`);

    const image = document.createElement("img");
    image.src = certificate.image;
    image.alt = certificate.alt;
    image.loading = "lazy";
    image.decoding = "async";
    image.draggable = false;

    const imageAction = document.createElement("span");
    imageAction.className = "certificate-image-action";
    imageAction.setAttribute("aria-hidden", "true");
    imageAction.textContent = "Open preview";
    imageLink.append(image, imageAction);

    const caption = document.createElement("div");
    caption.className = "certificate-front-caption";

    const captionKind = document.createElement("span");
    captionKind.className = "certificate-kind";
    captionKind.textContent = certificate.kind;

    const captionTitle = document.createElement("h3");
    captionTitle.textContent = certificate.title;

    const previewLink = document.createElement("a");
    previewLink.className = "certificate-front-open";
    previewLink.href = certificate.image;
    previewLink.target = "_blank";
    previewLink.rel = "noopener noreferrer";
    previewLink.dataset.certificateOpen = "";
    previewLink.textContent = "Open preview";
    previewLink.setAttribute("aria-label", `Open ${certificate.title} preview`);
    caption.append(captionKind, captionTitle, previewLink);
    front.append(imageLink, caption);

    const back = document.createElement("div");
    back.className = "certificate-card-face certificate-card-back";

    const info = document.createElement("div");
    info.className = "certificate-info";

    const kind = document.createElement("span");
    kind.className = "certificate-kind";
    kind.textContent = certificate.kind;

    const title = document.createElement("h3");
    title.textContent = certificate.title;

    const description = document.createElement("p");
    description.textContent = certificate.description;

    const openLink = document.createElement("a");
    openLink.className = "button button-outline small";
    openLink.href = certificate.image;
    openLink.target = "_blank";
    openLink.rel = "noopener noreferrer";
    openLink.dataset.certificateOpen = "";
    openLink.textContent = "View certificate";
    openLink.setAttribute("aria-label", `View ${certificate.title}`);

    info.append(kind, title, description, openLink);
    back.append(info);
    inner.append(front, back);
    article.append(inner);

    return article;
  }

  function updateCarouselPosition() {
    const viewportRect = certificateViewport.getBoundingClientRect();
    const viewportCenter = viewportRect.left + viewportRect.width / 2;
    let nearestIndex = 0;
    let nearestDistance = Number.POSITIVE_INFINITY;

    certificateCards.forEach((card, index) => {
      const cardRect = card.getBoundingClientRect();
      const distance = Math.abs(cardRect.left + cardRect.width / 2 - viewportCenter);
      if (distance < nearestDistance) {
        nearestDistance = distance;
        nearestIndex = index;
      }
    });

    activeIndex = nearestIndex;
    updatePositionText();
  }

  function updatePositionText() {
    if (certificatePosition) {
      certificatePosition.textContent = `${String(activeIndex + 1).padStart(2, "0")} / ${String(certificates.length).padStart(2, "0")}`;
    }
  }

  function scrollToCertificate(index) {
    activeIndex = (index + certificates.length) % certificates.length;
    certificateCards[activeIndex].scrollIntoView({
      behavior: reducedMotion ? "auto" : "smooth",
      block: "nearest",
      inline: "center",
    });
    updatePositionText();
  }

  function updateViewerImageSize() {
    if (!viewerImage?.naturalWidth || !viewerCanvas) return;

    const availableWidth = Math.max(1, viewerCanvas.clientWidth - 36);
    const availableHeight = Math.max(1, viewerCanvas.clientHeight - 36);
    const fitScale = Math.min(
      availableWidth / viewerImage.naturalWidth,
      availableHeight / viewerImage.naturalHeight,
      1,
    );
    viewerImage.style.width = `${Math.round(viewerImage.naturalWidth * fitScale * zoom)}px`;
    viewerImage.style.height = `${Math.round(viewerImage.naturalHeight * fitScale * zoom)}px`;
    viewerZoomLabel.textContent = `${Math.round(zoom * 100)}%`;
  }

  function showCertificate(index) {
    activeIndex = (index + certificates.length) % certificates.length;
    const certificate = certificates[activeIndex];
    zoom = 1;
    viewerImage.src = certificate.image;
    viewerImage.alt = certificate.alt;
    viewerTitle.textContent = certificate.title;
    viewerSource.href = certificate.image;
    viewerCount.textContent = `${String(activeIndex + 1).padStart(2, "0")} / ${String(certificates.length).padStart(2, "0")}`;

    if (!certificateViewer.open) {
      returnFocus = document.activeElement;
      certificateViewer.showModal();
    }

    if (viewerImage.complete) {
      updateViewerImageSize();
    } else {
      viewerImage.addEventListener("load", updateViewerImageSize, { once: true });
    }
  }

  function closeViewer() {
    if (certificateViewer.open) certificateViewer.close();
  }

  certificateTrack.addEventListener("click", (event) => {
    if (suppressClick) {
      event.preventDefault();
      event.stopImmediatePropagation();
      suppressClick = false;
      return;
    }

    const card = event.target.closest(".certificate-card");
    if (!card || !certificateViewer.showModal) return;
    const index = Number(card?.dataset.certificateIndex);
    if (!Number.isInteger(index)) return;

    if (event.target.closest("a")) event.preventDefault();
    showCertificate(index);
  });

  certificateTrack.addEventListener("focusin", (event) => {
    const card = event.target.closest(".certificate-card");
    if (!card) return;
    card.classList.toggle(
      "is-focused-back",
      Boolean(event.target.closest(".certificate-card-back")),
    );
  });

  certificateTrack.addEventListener("focusout", (event) => {
    const card = event.target.closest(".certificate-card");
    if (card && !card.contains(event.relatedTarget)) card.classList.remove("is-focused-back");
  });

  certificateViewport.addEventListener(
    "scroll",
    () => {
      window.cancelAnimationFrame(scrollFrame);
      scrollFrame = window.requestAnimationFrame(updateCarouselPosition);
    },
    { passive: true },
  );

  certificateViewport.addEventListener("keydown", (event) => {
    if (event.key !== "ArrowLeft" && event.key !== "ArrowRight") return;
    event.preventDefault();
    scrollToCertificate(activeIndex + (event.key === "ArrowRight" ? 1 : -1));
  });

  certificateViewport.addEventListener("pointerdown", (event) => {
    if (event.button !== 0 || event.target.closest("button")) return;
    pointerStart = {
      pointerId: event.pointerId,
      x: event.clientX,
      scrollLeft: certificateViewport.scrollLeft,
      moved: false,
    };
    certificateViewport.classList.add("is-dragging");
  });

  certificateViewport.addEventListener("pointermove", (event) => {
    if (!pointerStart || event.pointerId !== pointerStart.pointerId) return;
    const delta = event.clientX - pointerStart.x;
    if (Math.abs(delta) > 5 && !pointerStart.moved) {
      pointerStart.moved = true;
      certificateViewport.setPointerCapture(event.pointerId);
    }
    if (!pointerStart.moved) return;
    event.preventDefault();
    certificateViewport.scrollLeft = pointerStart.scrollLeft - delta;
  });

  const endPointerDrag = (event) => {
    if (!pointerStart || event.pointerId !== pointerStart.pointerId) return;
    suppressClick = pointerStart.moved;
    pointerStart = null;
    certificateViewport.classList.remove("is-dragging");
    if (suppressClick) {
      window.setTimeout(() => {
        suppressClick = false;
      }, 0);
    }
  };
  window.addEventListener("pointerup", endPointerDrag);
  window.addEventListener("pointercancel", endPointerDrag);

  document.querySelector("[data-certificate-previous]")?.addEventListener("click", () => {
    scrollToCertificate(activeIndex - 1);
  });
  document.querySelector("[data-certificate-next]")?.addEventListener("click", () => {
    scrollToCertificate(activeIndex + 1);
  });

  document.querySelector("[data-viewer-previous]")?.addEventListener("click", () => {
    showCertificate(activeIndex - 1);
  });
  document.querySelector("[data-viewer-next]")?.addEventListener("click", () => {
    showCertificate(activeIndex + 1);
  });
  viewerClose?.addEventListener("click", closeViewer);

  certificateViewer.querySelector("[data-viewer-zoom-in]")?.addEventListener("click", () => {
    zoom = Math.min(3, Math.round((zoom + 0.25) * 100) / 100);
    updateViewerImageSize();
  });

  certificateViewer.querySelector("[data-viewer-zoom-out]")?.addEventListener("click", () => {
    zoom = Math.max(1, Math.round((zoom - 0.25) * 100) / 100);
    updateViewerImageSize();
  });

  certificateViewer.querySelector("[data-viewer-zoom-reset]")?.addEventListener("click", () => {
    zoom = 1;
    updateViewerImageSize();
  });

  certificateViewer.addEventListener("click", (event) => {
    if (event.target === certificateViewer) closeViewer();
  });

  certificateViewer.addEventListener("keydown", (event) => {
    if (event.key === "ArrowLeft") {
      event.preventDefault();
      showCertificate(activeIndex - 1);
    } else if (event.key === "ArrowRight") {
      event.preventDefault();
      showCertificate(activeIndex + 1);
    }
  });

  certificateViewer.addEventListener("close", () => {
    zoom = 1;
    viewerImage.removeAttribute("style");
    if (returnFocus instanceof HTMLElement) returnFocus.focus({ preventScroll: true });
    returnFocus = null;
  });

  window.addEventListener("resize", () => {
    if (certificateViewer.open) updateViewerImageSize();
  });

  if (window.matchMedia("(hover: hover) and (pointer: fine)").matches && !reducedMotion) {
    certificateCards.forEach((card) => {
      card.addEventListener("pointermove", (event) => {
        if (pointerStart) return;
        const bounds = card.getBoundingClientRect();
        const x = (event.clientX - bounds.left) / bounds.width;
        const y = (event.clientY - bounds.top) / bounds.height;
        card.style.setProperty("--tilt-x", `${(0.5 - y) * 7}deg`);
        card.style.setProperty("--tilt-y", `${(x - 0.5) * 9}deg`);
      });

      card.addEventListener("pointerleave", () => {
        card.style.setProperty("--tilt-x", "0deg");
        card.style.setProperty("--tilt-y", "0deg");
      });
    });
  }

  updateCarouselPosition();
}
