# Sukundra Pujara — Portfolio

A responsive portfolio built with HTML, CSS, JavaScript, and an optional Django
backend for the real OpenAI-powered chat assistant. The website pages can be
viewed without the backend; AI chat requires the backend and a private OpenAI
API key. The supplied genuine profile photo is at `static/images/profile.jpg`.
Shared layouts and typography are in `static/css/design-refresh.css`.

## Run using VS Code on Windows

1. Open this folder in VS Code.
2. Open `index.html` in a browser. You can also install the **Live Server** extension,
   right-click `index.html`, and choose **Open with Live Server**.

The site can be viewed without a server; Live Server is recommended for a smoother
local development experience.

## Pages

- `index.html` — About, skills, projects, education, certificates, CV download,
  and notes preview.
- `projects.html` — Project list, including Sukundra AI, a browser-based Python
  learning assistant. Its project card opens the dedicated assistant page.
- `sukundra-ai.html` — Sukundra AI project page with a direct link to open the
  browser-based learning assistant.
- `calculator.html` — Working four-operation calculator with keyboard support.
- `notes.html` — Interactive Python Notes: Basic to Advanced curriculum with 85
  lesson cards, explanations, commented examples, expected outputs, common
  mistakes, challenges, search, filters, and saved lesson progress. It also
  includes 115 searchable theory questions and answers, topic-wise beginner
  practice, a dedicated OOP practice section, and a scored quiz.
- `contact.html` — Contact details and an email-app form.
- `admin.html` — Browser-local project and note editor.
- `static/files/sukundra-pujara-cv.pdf` — Two-page CV made from the supplied
  résumé images. The portfolio homepage provides a download button and a link
  to open the PDF in a new tab.

## Source code

The website's HTML, CSS, and application JavaScript are arranged in readable
blocks with two-space indentation. Main behaviors live in `static/js/main.js`,
`static/js/chatbot.js`, `static/js/calculator.js`, and `static/js/script.js`.
Python lessons and question banks are kept in separate data files so they are
easy to find without mixing them into the application logic.

VS Code is configured to format HTML, CSS, and JavaScript when you save a file.
You can also format a file at any time with **Shift+Alt+F**.

## Browser-only limitations

The contact form opens the visitor's default email program with the message filled
in. The visitor still needs to send the email. It does not store or send messages
automatically.

Projects and notes added in the content manager are saved in that browser's
`localStorage`; they are not published to other visitors or synced to another
device. Anyone who can open the page in that browser can use the editor. A static
HTML site cannot securely protect an admin dashboard or share edits with visitors.
Those features require a server or a content-management service.

Python lesson completion is also saved in the current browser using `localStorage`.
The lesson, theory, practice, and quiz content is bundled in the website and does
not need a backend. The floating Sukundra AI assistant also has a browser-based
question-and-answer mode. It uses the supplied Python Q&A bank and guides, plus
Python theory, practice, quiz, and lesson data together with verified portfolio
information whenever the Django/OpenAI service is unavailable. The chat header
shows “Browser Q&A · Ready” when it is answering locally.

The calculator project runs entirely in the browser and does not use a backend.

To replace your profile photo, replace `static/images/profile.jpg` with your own
image using the same filename.

The supplied Sukundra AI logo is saved at `static/images/sukundra-ai-logo.png`
and is used by the project card and chat interface.

## Sukundra AI chatbot

The floating Sukundra AI widget in `static/js/chatbot.js` sends visitor questions
to the Django API at `/api/ai/chat/` when it is available. The backend calls
OpenAI; its secret key is read only by Python from `backend/.env` and is never
placed in the website code. If the API is offline or has no API key, the widget
answers using the browser-loaded Python Q&A bank, OOP Q&A, theory, practice
exercises, quiz questions, lesson challenges, supplied Python guides, and
verified portfolio facts. Local answers do not need a backend or API key.
The browser stores chat history in the current tab and sends up to 10 recent
messages for conversation context. The API does not save conversations in its
SQLite database.

### Run the real AI locally on Windows

1. Follow `backend/README.md` to create the Python environment and install
   `backend/requirements.txt`.
2. Copy `backend/.env.example` to `backend/.env`. Add your own OpenAI API key
   and a private Django secret key. Keep `.env` private; API usage may cost money.
3. In a terminal, switch to `backend` and run:

   ```powershell
   python manage.py migrate
   python manage.py runserver
   ```

4. Open the portfolio using VS Code Live Server on port 5500 or 5501. Opening
   an HTML page directly as a `file://` URL may block API requests in the browser.
5. To host the portfolio and backend online, deploy the API using `render.yaml`,
   then update `SUKKU_AI_API_URL` in `static/js/chatbot-config.js` to the deployed
   HTTPS API origin. Set `CORS_ALLOWED_ORIGINS` in the backend to the exact
   HTTPS origin serving your portfolio, and redeploy both.

The site remains viewable if the API is offline; Sukundra AI switches to its
built-in browser Q&A. The API is protected by request validation and an
anonymous rate limit of 10 requests per hour.
