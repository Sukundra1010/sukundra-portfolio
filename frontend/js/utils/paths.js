window.PortfolioPaths = {
  inPagesDirectory() {
    return window.location.pathname.includes("/pages/");
  },

  asset(relativePath) {
    const prefix = this.inPagesDirectory() ? "../" : "";
    return `${prefix}assets/${relativePath}`;
  },

  page(fileName) {
    if (fileName === "index.html") {
      return this.inPagesDirectory() ? "../index.html" : "index.html";
    }
    return this.inPagesDirectory() ? fileName : `pages/${fileName}`;
  },
};
