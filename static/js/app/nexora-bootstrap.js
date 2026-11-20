const secureNetlifyHostname = "startling-sorbet-50f5ae.netlify.app";
const customDomains = ["sukundra.com.np", "www.sukundra.com.np"];
const isInsecureCustomDomain =
  window.location.protocol === "http:" &&
  customDomains.includes(window.location.hostname);

if (isInsecureCustomDomain) {
  const secureUrl = new URL(window.location.href);
  secureUrl.protocol = "https:";
  secureUrl.hostname = secureNetlifyHostname;
  secureUrl.port = "";
  window.location.replace(secureUrl.href);
} else {
  import("./nexora-ai.js");
}
