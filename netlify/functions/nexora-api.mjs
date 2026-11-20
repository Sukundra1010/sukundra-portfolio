const systemPrompt = [
  "You are Nexora AI, a helpful assistant for coding, learning, writing, research, and image understanding.",
  "Support English and Nepali. Prefer replying in the language used by the user.",
  "Be accurate and clear. State uncertainty rather than inventing facts, sources, or capabilities.",
  "For code, explain important assumptions and provide readable, secure examples.",
].join(" ");

const defaultOrigins = [
  "https://sukundra.com.np",
  "https://www.sukundra.com.np",
  "http://127.0.0.1:5500",
  "http://localhost:5500",
  "http://127.0.0.1:5501",
  "http://localhost:5501",
  "http://127.0.0.1:8888",
  "http://localhost:8888",
];
const allowedOrigins = new Set(
  (process.env.CORS_ORIGINS || defaultOrigins.join(","))
    .split(",")
    .map((origin) => origin.trim())
    .filter(Boolean),
);
const requestCounts = new Map();
const maxRequestBytes = 5.5 * 1024 * 1024;
const maxImageBytes = 4 * 1024 * 1024;
const maxImageDataUrlLength = 5.5 * 1024 * 1024;
const rateWindowMs = 60_000;
const maxRequestsPerWindow = 20;

function jsonResponse(status, payload, origin = "") {
  const headers = {
    "Cache-Control": "no-store",
    "Content-Type": "application/json; charset=utf-8",
    Vary: "Origin",
    "X-Content-Type-Options": "nosniff",
  };
  if (origin && allowedOrigins.has(origin)) {
    headers["Access-Control-Allow-Origin"] = origin;
  }
  return new Response(JSON.stringify(payload), { status, headers });
}

function checkRateLimit(ip) {
  const now = Date.now();
  const record = requestCounts.get(ip);
  if (!record || now - record.startedAt >= rateWindowMs) {
    requestCounts.set(ip, { startedAt: now, count: 1 });
    return true;
  }
  if (record.count >= maxRequestsPerWindow) return false;
  record.count += 1;
  return true;
}

function validateMessages(value) {
  if (!Array.isArray(value) || value.length === 0 || value.length > 20) {
    throw Object.assign(new Error("Send between 1 and 20 conversation messages."), { status: 400 });
  }

  const messages = value.map((message) => {
    if (
      !message ||
      !["user", "assistant"].includes(message.role) ||
      typeof message.content !== "string" ||
      !message.content.trim() ||
      message.content.length > 12_000
    ) {
      throw Object.assign(
        new Error("Each message needs a supported role and text of at most 12,000 characters."),
        { status: 400 },
      );
    }

    const result = { role: message.role, content: message.content };
    if (message.image !== undefined) {
      if (message.role !== "user" || typeof message.image !== "string") {
        throw Object.assign(new Error("The attached image is invalid."), { status: 400 });
      }
      if (message.image.length > maxImageDataUrlLength) {
        throw Object.assign(new Error("Images must be 4 MB or smaller."), { status: 413 });
      }
      const match = message.image.match(
        /^data:image\/(jpeg|png|webp|gif);base64,([A-Za-z0-9+/]+={0,2})$/,
      );
      if (!match) {
        throw Object.assign(
          new Error("Images must be valid JPEG, PNG, WebP, or GIF files up to 4 MB."),
          {
            status: 400,
          },
        );
      }
      if (Buffer.from(match[2], "base64").length > maxImageBytes) {
        throw Object.assign(new Error("Images must be 4 MB or smaller."), { status: 413 });
      }
      result.image = message.image;
    }
    return result;
  });

  if (messages.at(-1)?.role !== "user") {
    throw Object.assign(new Error("The most recent conversation message must be from the user."), {
      status: 400,
    });
  }
  return messages;
}

function providerMessages(messages) {
  return [
    { role: "system", content: systemPrompt },
    ...messages.map((message) => ({
      role: message.role,
      content: message.image
        ? [
            { type: "text", text: message.content },
            { type: "image_url", image_url: { url: message.image } },
          ]
        : message.content,
    })),
  ];
}

async function requestGemini(messages, apiKey) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 45_000);
  try {
    const response = await fetch(
      "https://generativelanguage.googleapis.com/v1beta/openai/chat/completions",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${apiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: process.env.GEMINI_MODEL || "gemini-4-hydrogen",
          messages: providerMessages(messages),
          max_tokens: 1200,
        }),
        signal: controller.signal,
      },
    );

    if (!response.ok) {
      console.error(`Gemini request failed with HTTP ${response.status}.`);
      throw Object.assign(new Error(`Gemini returned an error (HTTP ${response.status}).`), {
        status: response.status === 429 ? 429 : 502,
      });
    }

    const payload = await response.json();
    const reply = payload?.choices?.[0]?.message?.content;
    if (typeof reply !== "string" || !reply.trim()) {
      throw Object.assign(new Error("Gemini returned no text response."), { status: 502 });
    }
    return reply.trim();
  } catch (error) {
    if (error.name === "AbortError") {
      throw Object.assign(new Error("Gemini timed out. Please try again."), { status: 504 });
    }
    if (error instanceof TypeError) {
      throw Object.assign(new Error("Could not reach Gemini."), { status: 502 });
    }
    if (Number.isInteger(error.status)) throw error;
    throw Object.assign(new Error("Gemini returned an invalid response."), { status: 502 });
  } finally {
    clearTimeout(timeout);
  }
}

export default async function handler(request, context) {
  const origin = request.headers.get("origin") || "";
  const pathname = new URL(request.url).pathname;
  const headers = {
    "Access-Control-Allow-Headers": "Content-Type",
    "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
    "Access-Control-Max-Age": "600",
  };

  if (origin && !allowedOrigins.has(origin)) {
    return jsonResponse(403, { error: "This website origin is not allowed by the Nexora API." });
  }

  if (request.method === "OPTIONS") {
    if (origin) headers["Access-Control-Allow-Origin"] = origin;
    headers.Vary = "Origin";
    return new Response(null, { status: 204, headers });
  }

  if (pathname === "/api/health" && request.method === "GET") {
    return jsonResponse(
      200,
      {
        ok: true,
        configured: Boolean(process.env.GEMINI_API_KEY),
      },
      origin,
    );
  }

  if (pathname !== "/api/chat" || request.method !== "POST") {
    return jsonResponse(404, { error: "API route not found." }, origin);
  }

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return jsonResponse(
      503,
      {
        error: "Nexora AI is not configured. Add GEMINI_API_KEY to Netlify environment variables.",
      },
      origin,
    );
  }

  if (!checkRateLimit(context.ip || "unknown")) {
    return jsonResponse(429, { error: "Too many requests. Wait a minute and try again." }, origin);
  }

  try {
    const contentLength = Number(request.headers.get("content-length") || 0);
    if (contentLength > maxRequestBytes) {
      return jsonResponse(413, { error: "The request is too large." }, origin);
    }

    const rawBody = await request.text();
    if (Buffer.byteLength(rawBody, "utf8") > maxRequestBytes) {
      return jsonResponse(413, { error: "The request is too large." }, origin);
    }

    let body;
    try {
      body = JSON.parse(rawBody);
    } catch {
      return jsonResponse(400, { error: "Request body must be valid JSON." }, origin);
    }

    const messages = validateMessages(body?.messages);
    const reply = await requestGemini(messages, apiKey);
    return jsonResponse(200, { reply }, origin);
  } catch (error) {
    const status = Number.isInteger(error.status) ? error.status : 500;
    if (status === 500) console.error("Nexora AI request failed.", error);
    return jsonResponse(status, { error: error.message || "Nexora AI request failed." }, origin);
  }
}

export const config = {
  path: ["/api/health", "/api/chat"],
  method: ["GET", "POST", "OPTIONS"],
};
