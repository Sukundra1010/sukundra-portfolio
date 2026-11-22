document.addEventListener("DOMContentLoaded", () => {
  const section = document.querySelector("#projects.projects-premium");
  const list = section?.querySelector("[data-project-list='preview']");
  if (!section || !list) return;

  const projects = getProjects();
  const cards = [...list.querySelectorAll(".project-card")];
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const finePointer = window.matchMedia("(pointer: fine)").matches;

  cards.forEach((card) => {
    const project = projects[Number(card.dataset.projectIndex)];
    const info = card.querySelector(".project-info");
    if (!project || !info) return;

    card.dataset.projectTitle = project.title;
    card.tabIndex = 0;
    card.setAttribute("aria-label", `View details for ${project.title}`);

    const actions = document.createElement("div");
    actions.className = "project-links project-actions";

    const projectUrl = safeProjectUrl(project.link);
    if (projectUrl) {
      const link = document.createElement("a");
      link.className = "button button-primary small project-primary-link";
      link.href = projectUrl;
      const isLocalProject = !/^[a-z][a-z0-9+.-]*:/i.test(project.link);
      if (!isLocalProject) {
        link.target = "_blank";
        link.rel = "noopener noreferrer";
      }
      link.textContent =
        project.linkLabel || (isLocalProject ? "Open project →" : "View project ↗");
      actions.append(link);
    }

    const repositoryUrl = safeProjectUrl(project.repository);
    if (repositoryUrl) {
      const repository = document.createElement("a");
      repository.className = "button button-outline small project-repository-link";
      repository.href = repositoryUrl;
      repository.target = "_blank";
      repository.rel = "noopener noreferrer";
      repository.textContent = "GitHub ↗";
      actions.append(repository);
    }

    const detailsButton = document.createElement("button");
    detailsButton.className = "project-details-link";
    detailsButton.type = "button";
    detailsButton.dataset.projectDetails = "";
    detailsButton.textContent = "Details";
    actions.append(detailsButton);
    info.append(actions);

    card.addEventListener("click", (event) => {
      if (event.target instanceof Element && event.target.closest("a, button")) return;
      detailsButton.click();
    });

    card.addEventListener("keydown", (event) => {
      if (event.target !== card || !["Enter", " "].includes(event.key)) return;
      event.preventDefault();
      detailsButton.click();
    });

    if (!finePointer || reduceMotion) return;

    card.addEventListener("pointermove", (event) => {
      const bounds = card.getBoundingClientRect();
      const x = (event.clientX - bounds.left) / bounds.width - 0.5;
      const y = (event.clientY - bounds.top) / bounds.height - 0.5;
      card.style.transform = `perspective(1200px) rotateX(${-y * 4.5}deg) rotateY(${x * 5}deg) translateY(-3px)`;
    });

    card.addEventListener("pointerleave", () => {
      card.style.transform = "";
    });
  });
});
