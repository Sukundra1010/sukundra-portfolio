// Browser-only portfolio content and small navigation helpers.
const taleTraderProposalUrl = "https://softwaricacollege-my.sharepoint.com/:w:/g/personal/260093_softwarica_edu_np/IQDH5uRLGPQfS62RkKa4MgSwAS6OWyioGbARSXl02Gxk3dQ?e=NBzToN";

const defaultProjects = [
  {
    title: "Sukundra AI",
    description: "A browser-based AI learning assistant for beginner Python questions, step-by-step code examples, and information about my portfolio.",
    skills: "JavaScript, HTML, CSS, Python Learning",
    link: "sukundra-ai.html#sukundra-ai",
    image: "static/images/sukundra-ai-logo.png",
  },
  {
    title: "Pujara Business Management System",
    description: "A web-based business management system project. Open the live app to explore it.",
    skills: "Python, Business Management, Web App",
    link: "https://pujarabms-ysg37fer.manus.space/app",
    image: "static/images/python-logo.png",
  },
  {
    title: "Portfolio Website — Sukundra Pujara",
    description: "My responsive personal portfolio showcasing my background, skills, projects, and Python learning notes.",
    skills: "HTML, CSS, JavaScript",
    link: "",
    image: "static/images/web-development.png",
  },
  {
    title: "Sukundra Advanced Calculator",
    description: "A browser-based calculator with keyboard support, built using HTML, CSS, and JavaScript.",
    skills: "HTML, CSS, JavaScript",
    link: "calculator.html",
    image: "static/images/sukundra-advanced-calculator.png",
  },
  {
    title: "Tale Trader",
    description: "An e-commerce and blog website with a simple, user-friendly interface. This project is currently in progress.",
    skills: "HTML, CSS, JavaScript",
    link: taleTraderProposalUrl,
    linkLabel: "Read Proposal ↗",
    image: "static/images/tale-trader-logo.png",
  },
  {
    title: "Machine Learning Fundamentals",
    description: "I am currently making progress in learning Machine Learning through beginner-friendly practice projects.",
    skills: "Python, AI, Learning",
    link: "",
    image: "static/images/machine-learning.png",
  },
];

const excludedProjectTitles = new Set([
  "Python Programming Projects",
  "Web Development Projects",
  "Flask Web Applications",
  "Cybersecurity Learning Projects",
  "Calculator App",
]);

const sukundraAiProject = {
  description: "A browser-based AI learning assistant for beginner Python questions, step-by-step code examples, and information about my portfolio.",
  link: "sukundra-ai.html#sukundra-ai",
  image: "static/images/sukundra-ai-logo.png",
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
    window.alert("Could not save changes in this browser. Check storage settings and available space.");
    return false;
  }
};

function updateProject(project) {
  if (project.title === "Sukundra AI Python Tutor") {
    return {
      ...project,
      title: "Sukundra AI",
      ...sukundraAiProject,
    };
  }

  if (project.title === "Sukundra AI") {
    return {
      ...project,
      ...sukundraAiProject,
    };
  }

  if (project.title === "Portfolio Website — Sukundra Pujara") {
    return {
      ...project,
      link: project.link || "http://127.0.0.1:5500/notes.html",
    };
  }

  if (project.title === "Machine Learning Fundamentals") {
    return {
      ...project,
      description: "I am currently making progress in learning Machine Learning through beginner-friendly practice projects.",
      image: "static/images/machine-learning.png",
    };
  }

  if (project.title === "Tale Trader") {
    return {
      ...project,
      description: "An e-commerce and blog website with a simple, user-friendly interface. This project is currently in progress.",
      link: project.link || taleTraderProposalUrl,
      linkLabel: project.link && project.link !== taleTraderProposalUrl
        ? project.linkLabel
        : "Read Proposal ↗",
      image: "static/images/tale-trader-logo.png",
    };
  }

  return project;
}

function getProjects() {
  const savedProjects = readItems("portfolioProjects", defaultProjects)
    .filter((project) => !excludedProjectTitles.has(project.title))
    .map(updateProject);
  const savedTitles = new Set(savedProjects.map((project) => project.title));
  const missingDefaults = defaultProjects.filter((project) => !savedTitles.has(project.title));
  if (missingDefaults.length) {
    const mergedProjects = [...missingDefaults, ...savedProjects];
    if (writeItems("portfolioProjects", mergedProjects)) return mergedProjects;
  }
  return savedProjects;
}

function renderProjects() {
  const projects = getProjects();
  document.querySelectorAll("[data-project-list]").forEach((list) => {
    const items = list.dataset.projectList === "preview" ? projects.slice(0, 6) : projects;
    list.replaceChildren();
    if (!items.length) {
      list.innerHTML = '<p class="empty-state">No projects yet. Add one from the content manager.</p>';
      return;
    }
    items.forEach((project, index) => {
      const card = document.createElement("article");
      card.className = "project-card";
      const art = document.createElement("div");
      art.className = "project-art";
      if (project.image) {
        const image = document.createElement("img");
        image.src = project.image;
        image.alt = `${project.title} image`;
        art.append(image);
      } else {
        art.textContent = ["🐍", "🌐", "⚗", "🛒", "🧠", "🛡"][index % 6];
      }
      const info = document.createElement("div");
      info.className = "project-info";
      const title = document.createElement("h3");
      title.textContent = project.title;
      const description = document.createElement("p");
      description.textContent = project.description;
      const tags = document.createElement("div");
      tags.className = "tags";
      (project.skills || "").split(",").filter(Boolean).forEach((skill) => {
        const tag = document.createElement("span");
        tag.textContent = skill.trim();
        tags.append(tag);
      });
      info.append(title, description, tags);
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
        link.textContent = project.linkLabel || (isLocalProject ? "Open App →" : "View Project ↗");
        info.append(link);
      }
      card.append(art, info);
      list.append(card);
    });
  });
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
  renderNotes();
  renderAdminLists();

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
    contactForm.addEventListener("submit", (event) => {
      event.preventDefault();
      const form = new FormData(contactForm);
      const subject = encodeURIComponent(`Portfolio message from ${String(form.get("name")).trim()}`);
      const body = encodeURIComponent(
        `From: ${String(form.get("name")).trim()} (${String(form.get("email")).trim()})\n\n${String(form.get("message")).trim()}`,
      );
      window.location.href = `mailto:sukundrapujara61@gmail.com?subject=${subject}&body=${body}`;
    });
  }
});
