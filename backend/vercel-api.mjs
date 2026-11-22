import nexoraHandler from "../netlify/functions/nexora-api.mjs";

export default {
  fetch(request) {
    const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
    return nexoraHandler(request, { ip });
  },
};
