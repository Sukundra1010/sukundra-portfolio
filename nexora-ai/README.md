# Nexora AI backend

Nexora AI is the replacement for the portfolio's previous browser-only assistant
page. Its frontend is `../nexora-ai.html`, linked from the portfolio.
continue to work. The frontend is static; this small Node.js server securely
forwards chat requests to an OpenAI-compatible API. Provider credentials stay
on the server and are never included in browser JavaScript.

## Requirements

- Node.js 18 or newer
- An API key from the AI provider
- VS Code Live Server (or another local web server) to serve the portfolio page

## Run locally on Windows

Open two terminals from the portfolio repository root.

In the first PowerShell terminal, run the secure launcher:

```powershell
.\nexora-ai\start.ps1
```

On the first run, type the Gemini key directly into the hidden prompt. The
launcher saves it encrypted with Windows DPAPI under your local Windows profile,
outside the repository. Later runs use that encrypted key automatically. Leave
the terminal running while using Nexora AI. To choose another model, set
`GEMINI_MODEL` in that terminal before running the launcher.

To remove the saved key, run:

```powershell
Remove-Item "$env:LOCALAPPDATA\NexoraAI\gemini-key.dpapi"
```

The next launcher run will prompt for a key again.

The backend uses Google's OpenAI-compatible Gemini endpoint when
`GEMINI_API_KEY` is set. `GEMINI_MODEL` is optional; its default is
`gemini-4-hydrogen`. Use a model ID available to your Google AI Studio account.
For Google's compatibility details, see the
[Gemini API OpenAI compatibility guide](https://ai.google.dev/gemini-api/docs/openai).

To use OpenAI instead, set `OPENAI_API_KEY` and optionally `OPENAI_MODEL`
(default `gpt-4o-mini`). The backend reads the key from its process environment;
never add it to HTML, JavaScript, or a committed file. The selected model must
support image input to answer questions about attachments.

In the second terminal, start Live Server at the repository root and open
`nexora-ai.html`. The default CORS allowlist supports Live Server ports 5500
and 5501 on `localhost` and `127.0.0.1`. If Live Server uses another origin,
set `CORS_ORIGINS` in the first terminal before running the secure launcher,
for example:

```powershell
$env:CORS_ORIGINS = "http://127.0.0.1:5502,http://localhost:5502"
npm start
```

The page shows the backend connection state. If the server is stopped or no API
key is configured, Nexora displays the error and does not invent an answer.

## Configuration

| Variable          | Default                              | Description                                                   |
| ----------------- | ------------------------------------ | ------------------------------------------------------------- |
| `PORT`            | `3000`                               | Backend HTTP port                                             |
| `HOST`            | `127.0.0.1`                          | Listening interface; keep local during development            |
| `GEMINI_API_KEY`  | —                                    | Gemini key; selects Gemini when set                           |
| `GEMINI_MODEL`    | `gemini-4-hydrogen`                  | Gemini model ID available to your account                     |
| `GEMINI_BASE_URL` | Google Gemini compatibility endpoint | Optional Gemini-compatible API base URL                       |
| `OPENAI_API_KEY`  | —                                    | OpenAI key, used when no Gemini key is set                    |
| `OPENAI_MODEL`    | `gpt-4o-mini`                        | OpenAI model ID                                               |
| `OPENAI_BASE_URL` | `https://api.openai.com/v1`          | Optional OpenAI-compatible API base URL                       |
| `CORS_ORIGINS`    | Local Live Server origins            | Comma-separated exact browser origins allowed to call the API |

Conversations are stored in the visitor's browser. Image contents are not saved
to local chat history, but an image is sent to the configured provider when
submitted. Avoid attaching sensitive information.

## Deploy on Netlify

The repository includes a Netlify Function for `/api/health` and `/api/chat`.
After connecting this repository to Netlify, add these environment variables
under **Site configuration → Environment variables**:

| Variable         | Value                                     |
| ---------------- | ----------------------------------------- |
| `GEMINI_API_KEY` | Your Google AI Studio API key             |
| `GEMINI_MODEL`   | Optional; defaults to `gemini-4-hydrogen` |

Set the key's scope to Functions, then redeploy the site. The API key remains
server-side; do not put it in `nexora-ai.html`, JavaScript, or a committed file.
`CORS_ORIGINS` is optional and defaults to the portfolio's HTTPS domain plus
local development origins. If you use another domain or a Netlify Deploy
Preview, set it to a comma-separated list of exact origins.

The frontend uses the same site's `/api` routes on Netlify. Locally, it keeps
using the Node.js backend and the hidden, DPAPI-encrypted key prompt described
above.

GitHub Pages can host only the static frontend and cannot run this backend.
