const launcher = document.createElement("a");
launcher.className = "nexora-launcher";
launcher.href = `${PortfolioPaths.page("nexora-ai.html")}#sukundra-ai`;
launcher.setAttribute("aria-label", "Open Nexora AI");
launcher.title = "Nexora AI";
launcher.innerHTML = `<img src="${PortfolioPaths.asset("images/nexora-ai-logo.svg")}" alt="" width="44" height="44" loading="lazy">`;

document.body.append(launcher);
