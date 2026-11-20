// Browser-only portfolio content and small navigation helpers.
const taleTraderProposalUrl =
  "https://softwaricacollege-my.sharepoint.com/:w:/g/personal/260093_softwarica_edu_np/IQDH5uRLGPQfS62RkKa4MgSwAS6OWyioGbARSXl02Gxk3dQ?e=NBzToN";
const taleTraderRepositoryUrl =
  "https://github.com/satvikabhandary64-sketch/40B_-Group-3-_-TaleTrader-";
const portfolioRepositoryUrl = "https://github.com/Sukundra1010/sukundra-portfolio";
const smartFinXRepositoryUrl = "https://github.com/Sukundra1010/SmartFinx-Finance-Tracker";

const defaultProjects = [
  {
    title: "Nexora AI",
    description:
      "A real AI assistant for coding, writing, summaries, and English or Nepali conversations, powered through a secure backend.",
    skills: "JavaScript, Node.js, HTML, CSS, AI API",
    link: "nexora-ai.html#sukundra-ai",
    linkLabel: "Open Nexora AI ↗",
    repository: portfolioRepositoryUrl,
    image: "static/images/nexora-ai-logo.svg",
    thumbnail: "static/images/nexora-ai-logo.svg",
    previewLabel: "Nexora AI logo",
    categories: ["ai", "web"],
  },
  {
    title: "SmartFinX",
    description:
      "A personal finance dashboard for tracking expenses, managing budgets, monitoring savings, and understanding spending habits.",
    skills: "Python, Personal Finance, Web App",
    link: "https://sukundra1010.pythonanywhere.com/",
    linkLabel: "Open SmartFinX ↗",
    repository: smartFinXRepositoryUrl,
    thumbnail: "static/images/smartfinx-preview.png",
    previewLabel: "SmartFinX landing page",
    categories: ["python", "web"],
    highlights: [
      "Track expenses and manage budgets.",
      "Monitor savings and spending habits.",
      "View finance information from a single dashboard.",
    ],
  },
  {
    title: "Portfolio Website — Sukundra Pujara",
    description:
      "My responsive personal portfolio showcasing my background, skills, projects, and Python learning notes.",
    skills: "HTML, CSS, JavaScript",
    link: "index.html",
    linkLabel: "View website ↗",
    repository: portfolioRepositoryUrl,
    image: "static/images/web-development.png",
    thumbnail: "static/images/portfolio-homepage-screenshot.png",
    previewLabel: "Website screenshot",
    categories: ["web"],
  },
  {
    title: "Tail Trader",
    description:
      "An e-commerce and blog website with a simple, user-friendly interface. This project is currently in progress.",
    skills: "HTML, CSS, JavaScript",
    link: taleTraderProposalUrl,
    repository: taleTraderRepositoryUrl,
    linkLabel: "Read Proposal ↗",
    image: "static/images/tale-trader-logo.png",
    thumbnail: "static/images/project-preview-tail-trader.svg",
    categories: ["web"],
    status: "In Progress",
  },
  {
    title: "Calculator App",
    description: "A browser-based calculator available online.",
    link: "https://calcora-81da.onrender.com/",
    linkLabel: "Open Calculator ↗",
    previewLabel: "Online calculator app",
    categories: ["web"],
  },
];

const excludedProjectTitles = new Set([
  "Python Programming Projects",
  "Web Development Projects",
  "Flask Web Applications",
  "Cybersecurity Learning Projects",
  "Machine Learning Fundamentals",
  "Student Management System",
  "SURMORA Restaurant Management System",
  "Pujara Business Management System",
]);

const nexoraAiProject = {
  description:
    "A real AI assistant for coding, writing, summaries, and English or Nepali conversations, powered through a secure backend.",
  link: "nexora-ai.html#sukundra-ai",
  repository: portfolioRepositoryUrl,
  image: "static/images/nexora-ai-logo.svg",
  thumbnail: "static/images/nexora-ai-logo.svg",
  previewLabel: "Nexora AI logo",
  highlights: [
    "Gets model-generated responses through a separate backend; no browser Q&A fallback is presented as AI.",
    "Supports English and Nepali conversations, coding help, writing, and summaries.",
    "Accepts image attachments when the configured provider model supports image input.",
  ],
  caseStudy: [
    {
      title: "An AI workspace",
      paragraphs: [
        "Nexora AI connects to a configured language model through a small Node.js API. The assistant can help with programming, writing, summaries, and questions in English or Nepali.",
        "Conversation history and message controls are available in the browser. Image questions are sent only when the configured provider model supports image input.",
      ],
    },
    {
      title: "Privacy and setup",
      paragraphs: [
        "Provider credentials are read from the backend environment and never included in frontend JavaScript. If the backend or provider is unavailable, the interface reports an error instead of returning a simulated answer.",
        "The portfolio itself can be served statically, but public Nexora AI responses require deploying the backend separately over HTTPS.",
      ],
    },
  ],
};

const readItems = (key, defaults = []) => {
  try {
    const saved = JSON.parse(localStorage.getItem(key));
    return Array.isArray(saved) ? saved : defaults;
  } catch (error) {
    console.error(`Could not read ${key} from browser storage.`, error);
    return defaults;
  }
};

const writeItems = (key, items) => {
  try {
    localStorage.setItem(key, JSON.stringify(items));
    return true;
  } catch (error) {
    console.error(`Could not save ${key} to browser storage.`, error);
    window.alert(
      "Could not save changes in this browser. Check storage settings and available space.",
    );
    return false;
  }
};

function updateProject(project) {
  if (project.title === "Sukundra AI Python Tutor") {
    return {
      ...project,
      title: "Nexora AI",
      ...nexoraAiProject,
      categories: ["ai", "web"],
    };
  }

  if (project.title === "Sukundra AI" || project.title === "Nexora AI") {
    return {
      ...project,
      title: "Nexora AI",
      ...nexoraAiProject,
      categories: ["ai", "web"],
    };
  }

  if (project.title === "SmartFinX") {
    return {
      ...project,
      link: "https://sukundra1010.pythonanywhere.com/",
      linkLabel: "Open SmartFinX ↗",
      repository: smartFinXRepositoryUrl,
      thumbnail: "static/images/smartfinx-preview.png",
      previewLabel: "SmartFinX landing page",
    };
  }

  if (
    project.title === "Portfolio Website — Sukundra Pujara" ||
    project.title === "Portfolio Website — Sukundra Pujara"
  ) {
    return {
      ...project,
      title: "Portfolio Website — Sukundra Pujara",
      link: project.link || "index.html",
      repository: project.repository || portfolioRepositoryUrl,
      thumbnail: "static/images/portfolio-homepage-screenshot.png",
      previewLabel: "Website screenshot",
      highlights: project.highlights || [
        "Responsive pages present my background, education, skills, and projects.",
        "Includes a project showcase, contact details, and Python learning notes.",
      ],
      categories: project.categories || ["web"],
    };
  }

  if (project.title === "Tale Trader" || project.title === "Tail Trader") {
    return {
      ...project,
      title: "Tail Trader",
      description:
        "An e-commerce and blog website with a simple, user-friendly interface. This project is currently in progress.",
      link: project.link || taleTraderProposalUrl,
      repository: project.repository || taleTraderRepositoryUrl,
      linkLabel: "Read Proposal ↗",
      image: "static/images/tale-trader-logo.png",
      thumbnail: "static/images/project-preview-tail-trader.svg",
      status: project.status || "In Progress",
      categories: project.categories || ["web"],
    };
  }

  return project;
}

function getProjects() {
  const savedProjects = readItems("portfolioProjects", defaultProjects)
    .map(updateProject)
    .filter((project) => !excludedProjectTitles.has(project.title));
  const savedTitles = new Set(savedProjects.map((project) => project.title));
  const missingDefaults = defaultProjects.filter((project) => !savedTitles.has(project.title));
  if (missingDefaults.length) {
    const mergedProjects = [...missingDefaults, ...savedProjects];
    if (writeItems("portfolioProjects", mergedProjects)) return mergedProjects;
  }
  return savedProjects;
}

function projectDetailUrl(project) {
  return `project.html?project=${encodeURIComponent(project.title)}`;
}

function renderProjects() {
  const projects = getProjects();
  const categoryLabels = {
    python: "Python",
    web: "Web Development",
    ai: "AI & Machine Learning",
    "data-science": "Data Science",
    mobile: "Mobile Development",
    automation: "Automation",
  };
  document.querySelectorAll("[data-project-list]").forEach((list) => {
    const items = list.dataset.projectList === "preview" ? projects.slice(0, 6) : projects;
    list.replaceChildren();
    if (!items.length) {
      list.innerHTML =
        '<p class="empty-state">No projects yet. Add one from the content manager.</p>';
      return;
    }
    items.forEach((project, index) => {
      const card = document.createElement("article");
      card.className = "project-card";
      card.dataset.projectIndex = String(projects.indexOf(project));
      card.dataset.categories = (project.categories || []).join(" ");
      card.dataset.searchText = [
        project.title,
        project.description,
        project.skills,
        ...(project.categories || []).map((category) => categoryLabels[category] || category),
        project.status || "",
      ]
        .join(" ")
        .toLocaleLowerCase();
      const art = document.createElement("div");
      art.className = "project-art";
      const cardBadges = document.createElement("div");
      cardBadges.className = "project-card-badges";
      const categories = (project.categories || []).filter((category) => categoryLabels[category]);
      categories.slice(0, 1).forEach((category) => {
        const badge = document.createElement("span");
        badge.className = "project-category-badge";
        badge.textContent = categoryLabels[category];
        cardBadges.append(badge);
      });
      if (project.status) {
        const statusBadge = document.createElement("span");
        statusBadge.className = "project-status-badge";
        statusBadge.textContent = project.status;
        cardBadges.append(statusBadge);
      }
      art.append(cardBadges);
      const cardImage = project.thumbnail || project.image;
      if (cardImage) {
        const image = document.createElement("img");
        image.src = safeProjectUrl(cardImage);
        image.alt = `${project.title} ${project.previewLabel || "illustrative interface preview"}`;
        image.loading = "lazy";
        image.decoding = "async";
        art.append(image);
      } else {
        const placeholder = document.createElement("span");
        placeholder.className = "project-art-placeholder";
        placeholder.textContent = `0${index + 1}`;
        art.append(placeholder);
      }
      const previewLabel = document.createElement("span");
      previewLabel.className = "project-preview-label";
      previewLabel.textContent = project.previewLabel || "Illustrative preview";
      art.append(previewLabel);
      const info = document.createElement("div");
      info.className = "project-info";
      const title = document.createElement("h3");
      title.textContent = project.title;
      const description = document.createElement("p");
      description.textContent = project.description;
      info.append(title, description);
      if (list.dataset.projectList !== "preview") {
        const projectUrl = safeProjectUrl(project.link);
        const repositoryUrl = safeProjectUrl(project.repository);
        const links = document.createElement("div");
        links.className = "project-links";
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
          links.append(link);
        }
        if (repositoryUrl) {
          const repository = document.createElement("a");
          repository.className = "button button-outline small";
          repository.href = repositoryUrl;
          repository.target = "_blank";
          repository.rel = "noopener noreferrer";
          repository.textContent = "GitHub ↗";
          links.append(repository);
        }
        const detailsButton = document.createElement("button");
        detailsButton.className = "project-details-link";
        detailsButton.type = "button";
        detailsButton.dataset.projectDetails = "";
        detailsButton.textContent = "View details";
        links.append(detailsButton);
        if (links.childElementCount) info.append(links);
      }
      card.append(art, info);
      list.append(card);
    });
  });
}

function setupProjectFilters() {
  document.querySelectorAll("[data-project-filter]").forEach((group) => {
    const list = document.querySelector(group.dataset.projectTarget || "[data-project-list]");
    if (!list) return;

    const target = `#${list.id}`;
    const search = [...document.querySelectorAll("[data-project-search]")].find(
      (input) => input.dataset.projectSearch === target,
    );
    const counter = [...document.querySelectorAll("[data-project-count]")].find(
      (element) => element.dataset.projectCount === target,
    );
    let activeFilter =
      group.querySelector('[data-filter][aria-pressed="true"]')?.dataset.filter || "all";

    const applyFilters = () => {
      const query = search?.value.trim().toLocaleLowerCase() || "";
      const cards = [...list.querySelectorAll(".project-card")];
      let visibleCount = 0;
      cards.forEach((card) => {
        const categories = card.dataset.categories.split(/\s+/).filter(Boolean);
        const matchesFilter = activeFilter === "all" || categories.includes(activeFilter);
        const matchesSearch = !query || (card.dataset.searchText || "").includes(query);
        card.hidden = !matchesFilter || !matchesSearch;
        if (!card.hidden) visibleCount += 1;
      });
      if (counter) {
        counter.textContent = visibleCount
          ? `Showing ${visibleCount} ${visibleCount === 1 ? "project" : "projects"}`
          : "No matching projects. Try another filter or search.";
      }
    };

    group.addEventListener("click", (event) => {
      const button =
        event.target instanceof Element ? event.target.closest("button[data-filter]") : null;
      if (!button || !group.contains(button)) return;

      activeFilter = button.dataset.filter;
      group.querySelectorAll("button[data-filter]").forEach((filterButton) => {
        const isSelected = filterButton === button;
        filterButton.setAttribute("aria-pressed", String(isSelected));
      });
      applyFilters();
    });
    search?.addEventListener("input", applyFilters);
    applyFilters();
  });
}

function setupProjectDetails() {
  if (!document.querySelector("[data-project-list]")) return;
  const dialog = document.createElement("dialog");
  dialog.className = "project-details-dialog";
  dialog.setAttribute("aria-labelledby", "project-details-title");
  dialog.innerHTML = `
    <div class="project-details-shell">
      <button class="project-details-close" type="button" aria-label="Close project details">×</button>
      <div class="project-details-art" data-details-art hidden></div>
      <div class="project-details-content">
        <div class="project-details-badges" data-details-badges></div>
        <h2 id="project-details-title" data-details-title></h2>
        <p data-details-description></p>
        <div class="project-links" data-details-links></div>
      </div>
    </div>
  `;
  document.body.append(dialog);
  const closeButton = dialog.querySelector(".project-details-close");
  closeButton.addEventListener("click", () => dialog.close());
  let returnFocusTarget = null;
  dialog.addEventListener("close", () => returnFocusTarget?.focus());
  dialog.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      event.preventDefault();
      dialog.close();
    }
  });
  dialog.addEventListener("click", (event) => {
    if (event.target === dialog) dialog.close();
  });

  document.addEventListener("click", (event) => {
    const trigger =
      event.target instanceof Element ? event.target.closest("[data-project-details]") : null;
    if (!trigger) return;
    const card = trigger.closest(".project-card");
    const projectIndex = Number(card?.dataset.projectIndex);
    const project = getProjects()[projectIndex];
    if (!project) {
      console.error("Could not find project details for the selected project.");
      return;
    }
    returnFocusTarget = trigger;

    const categoryLabels = {
      python: "Python",
      web: "Web Development",
      ai: "AI & Machine Learning",
      "data-science": "Data Science",
      mobile: "Mobile Development",
      automation: "Automation",
    };
    const art = dialog.querySelector("[data-details-art]");
    art.replaceChildren();
    art.hidden = !project.image;
    if (project.image) {
      const image = document.createElement("img");
      image.src = safeProjectUrl(project.image);
      image.alt = `${project.title} project visual`;
      art.append(image);
    }
    dialog.querySelector("[data-details-title]").textContent = project.title;
    dialog.querySelector("[data-details-description]").textContent = project.description;
    const badges = dialog.querySelector("[data-details-badges]");
    badges.replaceChildren();
    (project.categories || [])
      .filter((category) => categoryLabels[category])
      .forEach((category) => {
        const badge = document.createElement("span");
        badge.className = "project-category-badge";
        badge.textContent = categoryLabels[category];
        badges.append(badge);
      });
    if (project.status) {
      const status = document.createElement("span");
      status.className = "project-status-badge";
      status.textContent = project.status;
      badges.append(status);
    }

    const links = dialog.querySelector("[data-details-links]");
    links.replaceChildren();
    const projectUrl = safeProjectUrl(project.link);
    if (projectUrl) {
      const link = document.createElement("a");
      link.className = "button button-primary small";
      link.href = projectUrl;
      const isLocalProject = !/^[a-z][a-z0-9+.-]*:/i.test(project.link);
      if (!isLocalProject) {
        link.target = "_blank";
        link.rel = "noopener noreferrer";
      }
      link.textContent =
        project.linkLabel || (isLocalProject ? "Open project →" : "View project ↗");
      links.append(link);
    }
    const repositoryUrl = safeProjectUrl(project.repository);
    if (repositoryUrl) {
      const repository = document.createElement("a");
      repository.className = "button button-outline small";
      repository.href = repositoryUrl;
      repository.target = "_blank";
      repository.rel = "noopener noreferrer";
      repository.textContent = "GitHub repository ↗";
      links.append(repository);
    }
    const fullDetails = document.createElement("a");
    fullDetails.className = "button button-outline small project-full-details-link";
    fullDetails.href = projectDetailUrl(project);
    fullDetails.textContent = "Open full project page";
    links.append(fullDetails);
    if (!dialog.open) dialog.showModal();
  });
}

function renderProjectDetailPage() {
  const root = document.querySelector("[data-project-detail-page]");
  if (!root) return;

  const requestedTitle = new URLSearchParams(window.location.search).get("project");
  const project = getProjects().find((item) => item.title === requestedTitle);
  if (!project) {
    const section = document.createElement("section");
    section.className = "project-detail-not-found";
    const heading = document.createElement("h1");
    heading.textContent = "Project not found";
    const message = document.createElement("p");
    message.textContent =
      "This project link may be out of date or the project is no longer listed.";
    const link = document.createElement("a");
    link.className = "button button-primary";
    link.href = "projects.html";
    link.textContent = "Browse all projects";
    section.append(heading, message, link);
    root.replaceChildren(section);
    root.setAttribute("aria-busy", "false");
    return;
  }

  document.title = `${project.title} | Projects by Sukundra Pujara`;
  root.replaceChildren();

  const categoryLabels = {
    python: "Python",
    web: "Web Development",
    ai: "AI & Machine Learning",
    "data-science": "Data Science",
    mobile: "Mobile Development",
    automation: "Automation",
  };
  const breadcrumb = document.createElement("nav");
  breadcrumb.className = "project-detail-breadcrumb";
  breadcrumb.setAttribute("aria-label", "Breadcrumb");
  const projectListLink = document.createElement("a");
  projectListLink.href = "projects.html";
  projectListLink.textContent = "Projects";
  const separator = document.createElement("span");
  separator.setAttribute("aria-hidden", "true");
  separator.textContent = "/";
  const currentPage = document.createElement("span");
  currentPage.setAttribute("aria-current", "page");
  currentPage.textContent = project.title;
  breadcrumb.append(projectListLink, separator, currentPage);

  const hero = document.createElement("section");
  hero.className = "project-detail-hero";
  hero.setAttribute("aria-labelledby", "project-detail-title");
  const copy = document.createElement("div");
  copy.className = "project-detail-hero-copy";
  const eyebrow = document.createElement("p");
  eyebrow.className = "project-detail-eyebrow";
  eyebrow.textContent = "PROJECT OVERVIEW";
  const title = document.createElement("h1");
  title.id = "project-detail-title";
  title.textContent = project.title;
  const badges = document.createElement("div");
  badges.className = "project-details-badges";
  (project.categories || [])
    .filter((category) => categoryLabels[category])
    .forEach((category) => {
      const badge = document.createElement("span");
      badge.className = "project-category-badge";
      badge.textContent = categoryLabels[category];
      badges.append(badge);
    });
  if (project.status) {
    const status = document.createElement("span");
    status.className = "project-status-badge";
    status.textContent = project.status;
    badges.append(status);
  }
  copy.append(eyebrow, title, badges);
  hero.append(copy);

  const projectPreview = project.thumbnail || project.image;
  if (projectPreview) {
    const previewLabel = project.previewLabel || "Illustrative preview";
    const artwork = document.createElement("figure");
    artwork.className = "project-detail-artwork";
    const image = document.createElement("img");
    image.src = safeProjectUrl(projectPreview);
    image.alt = `${project.title} — ${previewLabel}`;
    image.loading = "eager";
    image.decoding = "async";
    const caption = document.createElement("figcaption");
    caption.textContent = previewLabel;
    artwork.append(image, caption);
    hero.append(artwork);
  }

  const content = document.createElement("div");
  content.className = "project-detail-content";
  const mainColumn = document.createElement("div");
  mainColumn.className = "project-detail-main";
  const overview = document.createElement("section");
  overview.className = "project-detail-panel";
  const overviewTitle = document.createElement("h2");
  overviewTitle.textContent = "Project overview";
  const overviewText = document.createElement("p");
  overviewText.textContent = project.description;
  overview.append(overviewTitle, overviewText);
  mainColumn.append(overview);

  if (Array.isArray(project.highlights) && project.highlights.length) {
    const highlights = document.createElement("section");
    highlights.className = "project-detail-panel";
    const highlightsTitle = document.createElement("h2");
    highlightsTitle.textContent = "Documented capabilities";
    const list = document.createElement("ul");
    project.highlights.forEach((item) => {
      const entry = document.createElement("li");
      entry.textContent = item;
      list.append(entry);
    });
    highlights.append(highlightsTitle, list);
    mainColumn.append(highlights);
  }

  if (Array.isArray(project.caseStudy)) {
    project.caseStudy.forEach((sectionData) => {
      const section = document.createElement("section");
      section.className = "project-detail-panel project-detail-case-study";
      const heading = document.createElement("h2");
      heading.textContent = sectionData.title;
      section.append(heading);

      (sectionData.paragraphs || []).forEach((text) => {
        const paragraph = document.createElement("p");
        paragraph.textContent = text;
        section.append(paragraph);
      });

      if (Array.isArray(sectionData.highlights) && sectionData.highlights.length) {
        const list = document.createElement("ul");
        sectionData.highlights.forEach((item) => {
          const entry = document.createElement("li");
          entry.textContent = item;
          list.append(entry);
        });
        section.append(list);
      }

      mainColumn.append(section);
    });
  }

  const sidebar = document.createElement("aside");
  sidebar.className = "project-detail-sidebar";

  const linksPanel = document.createElement("section");
  linksPanel.className = "project-detail-panel";
  const linksTitle = document.createElement("h2");
  linksTitle.textContent = "Project links";
  const links = document.createElement("div");
  links.className = "project-detail-links";
  const projectUrl = safeProjectUrl(project.link);
  if (projectUrl) {
    const link = document.createElement("a");
    link.className = "button button-primary";
    link.href = projectUrl;
    const isLocalProject = !/^[a-z][a-z0-9+.-]*:/i.test(project.link);
    if (!isLocalProject) {
      link.target = "_blank";
      link.rel = "noopener noreferrer";
    }
    link.textContent = project.linkLabel || (isLocalProject ? "Open project →" : "View project ↗");
    links.append(link);
  }
  const repositoryUrl = safeProjectUrl(project.repository);
  if (repositoryUrl) {
    const repository = document.createElement("a");
    repository.className = "button button-outline";
    repository.href = repositoryUrl;
    repository.target = "_blank";
    repository.rel = "noopener noreferrer";
    repository.textContent = "GitHub repository ↗";
    links.append(repository);
  }
  if (links.childElementCount) {
    linksPanel.append(linksTitle, links);
    sidebar.append(linksPanel);
  }

  content.append(mainColumn, sidebar);
  root.append(breadcrumb, hero, content);
  root.setAttribute("aria-busy", "false");
}

function renderGitHubActivity() {
  const list = document.querySelector("[data-github-repositories]");
  const status = document.querySelector("[data-github-status]");
  if (!list || !status) return;

  fetch("https://api.github.com/users/Sukundra1010/repos?sort=updated&per_page=6", {
    headers: { Accept: "application/vnd.github+json" },
  })
    .then((response) => {
      if (!response.ok) throw new Error(`GitHub API responded with ${response.status}.`);
      return response.json();
    })
    .then((repositories) => {
      if (!Array.isArray(repositories))
        throw new Error("GitHub returned an unexpected repository list.");

      const publicRepositories = repositories.filter((repository) => !repository.private);
      list.replaceChildren();
      publicRepositories.forEach((repository) => {
        const card = document.createElement("article");
        card.className = "github-repository";
        const name = document.createElement("h3");
        const link = document.createElement("a");
        link.href = repository.html_url;
        link.target = "_blank";
        link.rel = "noopener noreferrer";
        link.textContent = repository.name;
        name.append(link);

        const description = document.createElement("p");
        description.textContent = repository.description || "No description provided.";
        const metadata = document.createElement("p");
        metadata.className = "github-repository-meta";
        const language = repository.language || "Language not specified";
        metadata.textContent = `${language} · ★ ${repository.stargazers_count}`;
        card.append(name, description, metadata);
        list.append(card);
      });

      status.textContent = publicRepositories.length
        ? "Latest public repositories from GitHub."
        : "No public repositories were returned.";
    })
    .catch((error) => {
      console.warn("Could not load public GitHub repositories.", error);
      status.textContent =
        "GitHub activity could not be loaded right now. Visit the profile instead.";
      list.replaceChildren();
    });
}

function setupThemeToggle() {
  const toggle = document.querySelector(".theme-toggle");
  if (!toggle || toggle.dataset.themeInitialized === "true") return;
  toggle.dataset.themeInitialized = "true";

  let theme = "dark";
  try {
    const savedTheme =
      localStorage.getItem("portfolioTheme") || localStorage.getItem("pythonNotesTheme");
    theme = savedTheme === "light" ? "light" : "dark";
  } catch (error) {
    console.error("Could not read the saved theme preference.", error);
  }

  const applyTheme = () => {
    document.documentElement.dataset.theme = theme;
    toggle.textContent = theme === "dark" ? "☀ Light" : "☾ Dark";
    toggle.setAttribute("aria-label", `Switch to ${theme === "dark" ? "light" : "dark"} mode`);
    const themeColor = document.querySelector('meta[name="theme-color"]');
    if (themeColor) themeColor.content = theme === "dark" ? "#080b14" : "#f5f7fc";
  };
  applyTheme();
  toggle.addEventListener("click", () => {
    theme = theme === "dark" ? "light" : "dark";
    applyTheme();
    try {
      localStorage.setItem("portfolioTheme", theme);
    } catch (error) {
      console.error("Could not save the theme preference.", error);
    }
  });
}

function setupTypewriter() {
  const target = document.querySelector("[data-typewriter]");
  if (!target || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

  const titles = [
    "Full Stack Developer",
    "Sukundra Pujara",
    "Data Scientist",
    "Web Development",
    "Django",
    "AI & Machine Learning",
    "Robotics",
  ];
  let titleIndex = 0;
  let characterIndex = 0;
  let deleting = false;
  target.textContent = "";

  const typeNextCharacter = () => {
    const currentTitle = titles[titleIndex];
    if (deleting) {
      characterIndex -= 1;
      target.textContent = currentTitle.slice(0, characterIndex);
      if (characterIndex === 0) {
        deleting = false;
        titleIndex = (titleIndex + 1) % titles.length;
        window.setTimeout(typeNextCharacter, 450);
        return;
      }
    } else {
      characterIndex += 1;
      target.textContent = titles[titleIndex].slice(0, characterIndex);
      if (characterIndex === titles[titleIndex].length) {
        deleting = true;
        window.setTimeout(typeNextCharacter, 1800);
        return;
      }
    }
    window.setTimeout(typeNextCharacter, deleting ? 48 : 78);
  };
  window.setTimeout(typeNextCharacter, 300);
}

function setupScrollEffects() {
  const backToTop = document.querySelector("[data-back-to-top]");
  const finale = document.querySelector("[data-contact-finale]");
  const skills = document.querySelector("#skills");
  const skillGrid = skills?.querySelector(".skill-category-grid");
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  if (finale && !reduceMotion) {
    finale.classList.add("is-animated");
  }

  if (skillGrid) {
    if (reduceMotion || !("IntersectionObserver" in window)) {
      skillGrid.classList.add("is-visible");
    } else {
      skillGrid.classList.add("is-observed");
      const skillObserver = new IntersectionObserver(
        (entries, observer) => {
          if (entries.some((entry) => entry.isIntersecting)) {
            skillGrid.classList.add("is-visible");
            observer.unobserve(skillGrid);
          }
        },
        { threshold: 0.12 },
      );
      skillObserver.observe(skillGrid);
    }
  }

  if (backToTop || finale || skills) {
    const updateScrollEffects = () => {
      if (backToTop) {
        backToTop.classList.toggle("is-visible", window.scrollY > 560);
      }

      if (finale) {
        const bounds = finale.getBoundingClientRect();
        const isInView = bounds.top < window.innerHeight && bounds.bottom > 0;
        document.body.classList.toggle("contact-finale-in-view", isInView);

        if (
          !finale.classList.contains("is-visible") &&
          (reduceMotion || (bounds.top < window.innerHeight * 0.88 && bounds.bottom > 0))
        ) {
          finale.classList.add("is-visible");
          if (!reduceMotion) {
            prepareContactFinaleTypewriter(finale);
          }
        }
      }

      if (skills) {
        const bounds = skills.getBoundingClientRect();
        document.body.classList.toggle(
          "skills-section-in-view",
          bounds.top < window.innerHeight && bounds.bottom > 0,
        );
      }
    };

    window.addEventListener("scroll", updateScrollEffects, { passive: true });
    updateScrollEffects();
  }
}

function setupPremiumMotion() {
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const revealTargets = document.querySelectorAll(
    "main > section, .project-card, .skill-category-card, .education-card, .internship-card, .certificate-card, .about-card, .form-card, .contact-card",
  );

  if (!reduceMotion && "IntersectionObserver" in window) {
    document.body.classList.add("motion-ready");
    const revealObserver = new IntersectionObserver(
      (entries, observer) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        });
      },
      { rootMargin: "0px 0px -7% 0px", threshold: 0.08 },
    );

    revealTargets.forEach((target) => {
      target.classList.add("reveal-item");
      revealObserver.observe(target);
    });
  }

  const nav = document.querySelector(".portfolio-home .navigation");
  if (nav && "IntersectionObserver" in window) {
    const navLinks = [...nav.querySelectorAll('a[href^="#"]')];
    const navSections = navLinks
      .map((link) => document.querySelector(link.getAttribute("href")))
      .filter((section) => section instanceof HTMLElement);

    if (navSections.length) {
      const visibleSections = new Set();
      const updateActiveLink = () => {
        const activeSection = [...visibleSections].sort(
          (first, second) =>
            Math.abs(first.getBoundingClientRect().top - 130) -
            Math.abs(second.getBoundingClientRect().top - 130),
        )[0];
        navLinks.forEach((link) => {
          const isActive = link.hash === `#${activeSection?.id}`;
          link.classList.toggle("is-active", isActive);
          if (isActive) link.setAttribute("aria-current", "location");
          else link.removeAttribute("aria-current");
        });
      };
      const navObserver = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) visibleSections.add(entry.target);
            else visibleSections.delete(entry.target);
          });
          updateActiveLink();
        },
        { rootMargin: "-18% 0px -58% 0px", threshold: 0 },
      );
      navSections.forEach((section) => navObserver.observe(section));
    }
  }
}

function prepareContactFinaleTypewriter(finale) {
  const typewriter = finale.querySelector("[data-contact-finale-typewriter]");
  if (!typewriter || typewriter.dataset.prepared === "true") return;

  const text = typewriter.textContent.trim();
  const gradientStart = text.indexOf("My Portfolio Website");
  const fragment = document.createDocumentFragment();
  const gradient = document.createElement("span");
  gradient.className = "contact-finale-gradient-word";
  let index = 0;

  for (const character of text) {
    const target = gradientStart >= 0 && index >= gradientStart ? gradient : fragment;

    if (character === " ") {
      target.append(document.createTextNode(character));
    } else {
      const letter = document.createElement("span");
      letter.className = "contact-finale-character";
      letter.style.setProperty("--character-index", String(index));
      letter.textContent = character;
      target.append(letter);
    }

    index += 1;
  }

  if (gradient.childNodes.length) {
    fragment.append(gradient);
  }

  typewriter.replaceChildren(fragment);
  typewriter.dataset.prepared = "true";
}

function safeProjectUrl(value) {
  if (!value) return "";
  if (/^[A-Za-z0-9._-]+(?:\/[A-Za-z0-9._-]+)*(?:#[A-Za-z0-9_-]+)?$/.test(value)) {
    return value;
  }
  try {
    const url = new URL(value);
    return url.protocol === "https:" || url.protocol === "http:" ? url.href : "";
  } catch (error) {
    return "";
  }
}

function renderNotes() {
  const notes = readItems("portfolioNotes");
  document.querySelectorAll("[data-note-list]").forEach((list) => {
    const items = list.dataset.noteList === "preview" ? notes.slice(0, 3) : notes;
    list.replaceChildren();
    if (!items.length) {
      const message = document.createElement("p");
      message.className = "empty-state";
      message.textContent = "No notes yet. Add a learning note from the content manager.";
      list.append(message);
      return;
    }
    items.forEach((note) => {
      const card = document.createElement("article");
      card.className = "note-card";
      const title = document.createElement("h3");
      title.textContent = note.title;
      const body = document.createElement("p");
      body.textContent = note.body;
      const date = document.createElement("small");
      date.textContent = note.date || "";
      card.append(title, body, date);
      list.append(card);
    });
  });
}

function renderAdminLists() {
  const projectList = document.querySelector("[data-admin-projects]");
  const noteList = document.querySelector("[data-admin-notes]");
  if (!projectList || !noteList) return;
  projectList.replaceChildren();
  noteList.replaceChildren();
  getProjects().forEach((item, index) => {
    projectList.append(createAdminRow(item.title, item.description, "portfolioProjects", index));
  });
  readItems("portfolioNotes").forEach((item, index) => {
    noteList.append(createAdminRow(item.title, item.body, "portfolioNotes", index));
  });
}

function createAdminRow(titleText, bodyText, storageKey, index) {
  const row = document.createElement("div");
  row.className = "admin-row";
  const content = document.createElement("div");
  const title = document.createElement("strong");
  title.textContent = titleText;
  const body = document.createElement("p");
  body.textContent = bodyText;
  content.append(title, body);
  const button = document.createElement("button");
  button.className = "button button-danger small";
  button.type = "button";
  button.textContent = "Delete";
  button.addEventListener("click", () => {
    if (!window.confirm(`Delete "${titleText}" from this browser?`)) return;
    const defaults = storageKey === "portfolioProjects" ? defaultProjects : [];
    const items = readItems(storageKey, defaults);
    items.splice(index, 1);
    if (writeItems(storageKey, items)) {
      renderAdminLists();
      renderProjects();
      renderNotes();
    }
  });
  row.append(content, button);
  return row;
}

document.addEventListener("DOMContentLoaded", () => {
  const toggle = document.querySelector(".menu-toggle");
  const nav = document.querySelector(".navigation");
  if (toggle && nav) {
    if (!nav.id) nav.id = "main-navigation";
    toggle.setAttribute("aria-controls", nav.id);

    const setNavigationOpen = (isOpen) => {
      nav.classList.toggle("open", isOpen);
      toggle.setAttribute("aria-expanded", String(isOpen));
      toggle.setAttribute("aria-label", isOpen ? "Close navigation" : "Open navigation");
      toggle.textContent = isOpen ? "×" : "☰";
    };

    toggle.addEventListener("click", () => {
      setNavigationOpen(!nav.classList.contains("open"));
    });

    nav.addEventListener("click", (event) => {
      if (event.target instanceof Element && event.target.closest("a")) {
        setNavigationOpen(false);
      }
    });

    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape" && nav.classList.contains("open")) {
        setNavigationOpen(false);
        toggle.focus();
      }
    });

    document.addEventListener("click", (event) => {
      if (
        nav.classList.contains("open") &&
        event.target instanceof Node &&
        !nav.contains(event.target) &&
        !toggle.contains(event.target)
      ) {
        setNavigationOpen(false);
      }
    });
  }

  renderProjects();
  setupProjectFilters();
  setupProjectDetails();
  renderProjectDetailPage();
  renderNotes();
  renderAdminLists();
  renderGitHubActivity();
  setupThemeToggle();
  setupTypewriter();
  setupScrollEffects();
  setupPremiumMotion();

  const projectForm = document.querySelector("#project-form");
  if (projectForm) {
    projectForm.addEventListener("submit", (event) => {
      event.preventDefault();
      const form = new FormData(projectForm);
      const projects = readItems("portfolioProjects", defaultProjects);
      projects.push({
        title: String(form.get("title")).trim(),
        description: String(form.get("description")).trim(),
        skills: String(form.get("skills")).trim(),
        link: safeProjectUrl(String(form.get("link")).trim()),
      });
      if (writeItems("portfolioProjects", projects)) {
        projectForm.reset();
        renderAdminLists();
        renderProjects();
        window.alert("Project saved in this browser.");
      }
    });
  }

  const noteForm = document.querySelector("#note-form");
  if (noteForm) {
    noteForm.addEventListener("submit", (event) => {
      event.preventDefault();
      const form = new FormData(noteForm);
      const notes = readItems("portfolioNotes");
      notes.unshift({
        title: String(form.get("title")).trim(),
        body: String(form.get("body")).trim(),
        date: new Date().toLocaleDateString(),
      });
      if (writeItems("portfolioNotes", notes)) {
        noteForm.reset();
        renderAdminLists();
        renderNotes();
        window.alert("Note saved in this browser.");
      }
    });
  }

  const contactForm = document.querySelector("#contact-form");
  if (contactForm) {
    const contactFields = contactForm.querySelector("[data-contact-fields]");
    const contactSuccess = contactForm.querySelector("[data-contact-success]");
    const contactSubmit = contactForm.querySelector("[data-contact-submit]");
    const contactEmailLink = contactForm.querySelector("[data-contact-email-link]");
    const composeAgain = contactForm.querySelector("[data-contact-compose-again]");
    const contactSection = contactForm.closest(".contact-section");
    const hasFinePointer = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (contactSection && hasFinePointer && !prefersReducedMotion) {
      contactSection.querySelectorAll("[data-contact-tilt]").forEach((target) => {
        const resetTilt = () => {
          target.style.removeProperty("--contact-rotate-x");
          target.style.removeProperty("--contact-rotate-y");
          target.style.removeProperty("--contact-pointer-x");
          target.style.removeProperty("--contact-pointer-y");
        };

        target.addEventListener(
          "pointermove",
          (event) => {
            if (event.pointerType === "touch") return;
            const bounds = target.getBoundingClientRect();
            if (!bounds.width || !bounds.height) return;

            const x = Math.min(1, Math.max(0, (event.clientX - bounds.left) / bounds.width));
            const y = Math.min(1, Math.max(0, (event.clientY - bounds.top) / bounds.height));
            target.style.setProperty("--contact-rotate-x", `${((0.5 - y) * 10).toFixed(2)}deg`);
            target.style.setProperty("--contact-rotate-y", `${((x - 0.5) * 14).toFixed(2)}deg`);
            target.style.setProperty("--contact-pointer-x", `${(x * 100).toFixed(1)}%`);
            target.style.setProperty("--contact-pointer-y", `${(y * 100).toFixed(1)}%`);
          },
          { passive: true },
        );
        target.addEventListener("pointerleave", resetTilt, { passive: true });
        target.addEventListener("pointercancel", resetTilt, { passive: true });
      });
    }

    contactForm.addEventListener("submit", (event) => {
      event.preventDefault();
      if (!contactForm.reportValidity()) return;

      const form = new FormData(contactForm);
      const name = String(form.get("name")).trim();
      const email = String(form.get("email")).trim();
      const subjectText = String(form.get("subject")).trim();
      const message = String(form.get("message")).trim();
      const subject = encodeURIComponent(subjectText);
      const body = encodeURIComponent(`From: ${name} (${email})\n\n${message}`);
      const mailtoUrl = `mailto:sukundrapujara61@gmail.com?subject=${subject}&body=${body}`;

      contactSubmit.disabled = true;
      contactSubmit.classList.add("is-loading");
      contactForm.setAttribute("aria-busy", "true");
      contactEmailLink.href = mailtoUrl;
      window.location.href = mailtoUrl;

      window.setTimeout(() => {
        contactFields.hidden = true;
        contactSuccess.hidden = false;
        contactSuccess.focus();
        contactSubmit.disabled = false;
        contactSubmit.classList.remove("is-loading");
        contactForm.setAttribute("aria-busy", "false");
      }, 450);
    });

    composeAgain.addEventListener("click", () => {
      contactForm.reset();
      contactSuccess.hidden = true;
      contactFields.hidden = false;
      contactForm.setAttribute("aria-busy", "false");
      contactFields.querySelector("[name='name']").focus();
    });
  }
});
