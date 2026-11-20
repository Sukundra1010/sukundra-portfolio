import { createServer } from "node:http";

const port = Number.parseInt(process.env.PORT || "3000", 10);
const host = process.env.HOST || "127.0.0.1";
const geminiApiKey = process.env.GEMINI_API_KEY || "";
const useGemini = Boolean(geminiApiKey);
const apiKey = geminiApiKey || process.env.OPENAI_API_KEY || "";
const model =
  (useGemini ? process.env.GEMINI_MODEL : process.env.OPENAI_MODEL) ||
  (useGemini ? "gemini-4-hydrogen" : "gpt-4o-mini");
const baseUrl = (
  useGemini
    ? process.env.GEMINI_BASE_URL || "https://generativelanguage.googleapis.com/v1beta/openai"
    : process.env.OPENAI_BASE_URL || "https://api.openai.com/v1"
).replace(/\/+$/, "");
const allowedOrigins = new Set(
  (
    process.env.CORS_ORIGINS ||
    "http://127.0.0.1:5500,http://localhost:5500,http://127.0.0.1:5501,http://localhost:5501"
  )
    .split(",")
    .map((origin) => origin.trim())
    .filter(Boolean),
);
const maxBodyBytes = 8 * 1024 * 1024;
const maxImageDataUrlLength = 7 * 1024 * 1024;
const maxImageBytes = 5 * 1024 * 1024;
const rateWindowMs = 60 * 1000;
const maxRequestsPerWindow = 20;
const requestCounts = new Map();
const systemPrompt = [
  "You are Nexora AI, a helpful assistant for coding, learning, writing, research, and image understanding.",
  "Support English and Nepali. Prefer replying in the language used by the user.",
  "Be accurate and clear. State uncertainty rather than inventing facts, sources, or capabilities.",
  "For code, explain important assumptions and provide readable, secure examples.",
].join(" ");

function sendJson(response, status, payload, origin = "") {
  const headers = {
    "Content-Type": "application/json; charset=utf-8",
    "Cache-Control": "no-store",
    "X-Content-Type-Options": "nosniff",
  };
  if (origin && allowedOrigins.has(origin)) {
    headers["Access-Control-Allow-Origin"] = origin;
    headers.Vary = "Origin";
  }
  response.writeHead(status, headers);
  response.end(JSON.stringify(payload));
}

function addCorsHeaders(response, origin) {
  if (!origin || !allowedOrigins.has(origin)) return false;
  response.setHeader("Access-Control-Allow-Origin", origin);
  response.setHeader("Vary", "Origin");
  response.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  response.setHeader("Access-Control-Allow-Headers", "Content-Type");
  response.setHeader("Access-Control-Max-Age", "600");
  return true;
}

function readJsonBody(request) {
  return new Promise((resolve, reject) => {
    let size = 0;
    let tooLarge = false;
    const chunks = [];
    request.on("data", (chunk) => {
      if (tooLarge) return;
      size += chunk.length;
      if (size > maxBodyBytes) {
        tooLarge = true;
        reject(Object.assign(new Error("Request body exceeds the 8 MB limit."), { status: 413 }));
        return;
      }
      chunks.push(chunk);
    });
    request.on("end", () => {
      if (tooLarge) return;
      try {
        resolve(JSON.parse(Buffer.concat(chunks).toString("utf8")));
      } catch {
        reject(Object.assign(new Error("Request body must be valid JSON."), { status: 400 }));
      }
    });
    request.on("error", reject);
  });
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
      message.content.length > 12000
    ) {
      throw Object.assign(
        new Error("Each message needs a supported role and text of at most 12,000 characters."),
        { status: 400 },
      );
    }

    const result = { role: message.role, content: message.content };
    if (message.image !== undefined) {
      if (
        message.role !== "user" ||
        typeof message.image !== "string" ||
        message.image.length > maxImageDataUrlLength
      ) {
        throw Object.assign(new Error("The attached image is invalid or too large."), {
          status: 400,
        });
      }
      const match = message.image.match(
        /^data:image\/(jpeg|png|webp|gif);base64,([A-Za-z0-9+/]+={0,2})$/,
      );
      if (!match) {
        throw Object.assign(new Error("Images must be valid JPEG, PNG, WebP, or GIF data."), {
          status: 400,
        });
      }
      const imageBytes = Buffer.from(match[2], "base64").length;
      if (imageBytes > maxImageBytes) {
        throw Object.assign(new Error("Images must be 5 MB or smaller."), { status: 400 });
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

function checkRateLimit(request) {
  const now = Date.now();
  const address = request.socket.remoteAddress || "unknown";
  const record = requestCounts.get(address);
  if (!record || now - record.startedAt >= rateWindowMs) {
    requestCounts.set(address, { startedAt: now, count: 1 });
    return true;
  }
  if (record.count >= maxRequestsPerWindow) return false;
  record.count += 1;
  return true;
}

function makeProviderMessages(messages) {
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

async function requestProvider(messages) {
  const base = new URL(baseUrl);
  const isLoopback = ["localhost", "127.0.0.1", "::1"].includes(base.hostname);
  if ((base.protocol !== "https:" && !isLoopback) || base.username || base.password) {
    throw Object.assign(new Error("The configured AI provider URL must use HTTPS."), {
      status: 500,
    });
  }

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 60_000);
  try {
    const response = await fetch(`${baseUrl}/chat/completions`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model,
        messages: makeProviderMessages(messages),
        ...(useGemini ? { max_tokens: 1200 } : { max_completion_tokens: 1200 }),
      }),
      signal: controller.signal,
    });

    if (!response.ok) {
      console.error(`AI provider request failed with HTTP ${response.status}.`);
      throw Object.assign(
        new Error(`The AI provider returned an error (HTTP ${response.status}).`),
        { status: response.status === 429 ? 429 : 502 },
      );
    }

    const payload = await response.json();
    const reply = payload?.choices?.[0]?.message?.content;
    if (typeof reply !== "string" || !reply.trim()) {
      throw Object.assign(new Error("The AI provider returned no text response."), { status: 502 });
    }
    return reply.trim();
  } catch (error) {
    if (error.name === "AbortError") {
      throw Object.assign(new Error("The AI provider timed out. Please try again."), {
        status: 504,
      });
    }
    if (error instanceof TypeError) {
      throw Object.assign(new Error("Could not reach the configured AI provider."), {
        status: 502,
      });
    }
    throw error;
  } finally {
    clearTimeout(timeout);
  }
}

const server = createServer(async (request, response) => {
  const origin = request.headers.origin || "";
  const url = new URL(request.url || "/", `http://${request.headers.host || "localhost"}`);

  if (origin && !addCorsHeaders(response, origin)) {
    sendJson(response, 403, { error: "This website origin is not allowed by the Nexora API." });
    return;
  }
  if (request.method === "OPTIONS") {
    response.writeHead(204);
    response.end();
    return;
  }

  if (request.method === "GET" && url.pathname === "/api/health") {
    sendJson(response, 200, { ok: true, configured: Boolean(apiKey) }, origin);
    return;
  }

  if (request.method !== "POST" || url.pathname !== "/api/chat") {
    sendJson(response, 404, { error: "API route not found." }, origin);
    return;
  }

  if (!apiKey) {
    sendJson(
      response,
      503,
      {
        error:
          "Nexora AI is not configured. Set GEMINI_API_KEY or OPENAI_API_KEY on the backend, then restart it.",
      },
      origin,
    );
    return;
  }

  if (!checkRateLimit(request)) {
    sendJson(response, 429, { error: "Too many requests. Wait a minute and try again." }, origin);
    return;
  }

  try {
    const body = await readJsonBody(request);
    const messages = validateMessages(body?.messages);
    const reply = await requestProvider(messages);
    sendJson(response, 200, { reply }, origin);
  } catch (error) {
    const status = Number.isInteger(error.status) ? error.status : 500;
    if (status === 500) console.error("Nexora API request failed.", error);
    sendJson(response, status, { error: error.message || "Nexora API request failed." }, origin);
  }
});

server.listen(port, host, () => {
  const address = server.address();
  const listeningPort = typeof address === "object" && address ? address.port : port;
  console.log(`Nexora AI backend listening at http://${host}:${listeningPort}`);
  if (!apiKey) console.warn("OPENAI_API_KEY is not set; chat requests will return a setup error.");
});
