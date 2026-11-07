/*
 * Sukundra AI answers questions using the knowledge bundled with this site.
 */
(() => {
  // Keep the conversation short and inside this browser tab.
  const historyKey = "sukkuAiConversation:v1";
  const maxStoredMessages = 30;
  const maxMessageLength = 6000;
  // These buttons give visitors a few useful questions to start with.
  const quickQuestions = [
    "Who is Er. Sukundra Pujara?",
    "What are his technical skills?",
    "Tell me about his projects.",
    "What is his educational background?",
    "Is he available for internships?",
    "What programming languages does he know?",
    "How can I contact him?",
    "Show me the Python roadmap from Basic to Advanced.",
    "Explain Python variables and data types.",
    "Explain Python data types with examples.",
    "Teach me Python functions.",
    "Teach me Python classes and OOP.",
    "Show me a safe Python database example.",
    "Explain Python decorators with an example.",
    "Generate a Python calculator starter.",
    "Debug this Python code: if True print('hello')",
    "Give me a Python interview question.",
  ];

  // Words that appear in many questions but do not identify a topic.
  const ignoredTopicWords = new Set([
    "a",
    "about",
    "after",
    "all",
    "also",
    "an",
    "and",
    "are",
    "basic",
    "beginner",
    "be",
    "been",
    "being",
    "between",
    "both",
    "can",
    "code",
    "complete",
    "detail",
    "details",
    "did",
    "do",
    "does",
    "entire",
    "everything",
    "example",
    "explain",
    "find",
    "for",
    "from",
    "full",
    "give",
    "how",
    "in",
    "is",
    "it",
    "learn",
    "like",
    "me",
    "mean",
    "more",
    "of",
    "on",
    "or",
    "please",
    "program",
    "python",
    "question",
    "roadmap",
    "sabai",
    "sabbai",
    "show",
    "simple",
    "tell",
    "the",
    "theory",
    "this",
    "to",
    "use",
    "used",
    "using",
    "what",
    "when",
    "where",
    "which",
    "why",
    "with",
    "write",
    "you",
    "their",
    "them",
    "there",
    "they",
    "would",
    "should",
    "could",
    "than",
    "then",
  ]);

  // Make common plurals and typos match the words used in the guide.
  function normalizeTopicWord(word) {
    if (word.length > 5 && word.endsWith("sses")) return word.slice(0, -2);
    if (word.length > 4 && word.endsWith("ies")) return `${word.slice(0, -3)}y`;
    if (word.length > 4 && word.endsWith("s")) return word.slice(0, -1);
    return word;
  }

  // Keep only unique topic words from the question.
  function getTopicWords(question) {
    const normalizedQuestion = question
      .toLowerCase()
      .replace(/\bclass\s+methods?\b/g, "classmethod")
      .replace(/\bstatic\s+methods?\b/g, "staticmethod")
      .replace(/\bcontext\s+managers?\b/g, "contextmanager")
      .replace(/\b(veriable|variabel|varible|varibles|varibale)\b/g, "variable");
    const words = normalizedQuestion.match(/[a-z_]+/g) || [];

    return [
      ...new Set(
        words
          .map(normalizeTopicWord)
          .filter((word) => word.length > 1 && !ignoredTopicWords.has(word)),
      ),
    ];
  }

  // Split the supplied guide into sections so a question can find one topic.
  function loadPythonGuideSections() {
    const guideText = [window.SUKKU_PYTHON_GUIDE_TEXT, window.SUKKU_PYTHON_OOP_TEXT]
      .filter((text) => typeof text === "string" && text.trim())
      .join("\n\n");
    if (!guideText) return [];

    const headingPattern =
      /^(?:## (\d+\.\s.+)|# (PART \d+:.*|Suggested Learning Path)|\*\*(\d+\.\s.+)\*\*)$/gm;
    const headings = [...guideText.matchAll(headingPattern)];

    return headings
      .map((heading, index) => {
        const start = heading.index + heading[0].length;
        const end = headings[index + 1]?.index ?? guideText.length;
        return {
          title: (heading[1] || heading[2] || heading[3]).trim(),
          content: guideText.slice(start, end).trim(),
        };
      })
      .filter((section) => section.content);
  }

  const pythonGuideSections = loadPythonGuideSections();

  // Small inline icons keep the widget independent of external image files.
  const icons = {
    robot: `
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M12 2v3m-7 4h14a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-8a2 2 0 0 1 2-2Zm3 4v3m8-3v3M8 17h8M3 13H1m22 0h-2"/>
      </svg>`,
    minimize: `
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M5 12h14"/>
      </svg>`,
    maximize: `
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M8 3H5a2 2 0 0 0-2 2v3m13-5h3a2 2 0 0 1 2 2v3M3 16v3a2 2 0 0 0 2 2h3m8 0h3a2 2 0 0 0 2-2v-3"/>
      </svg>`,
    clear: `
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M4 7h16m-10 4v6m4-6v6M6 7l1 14h10l1-14M9 7V4h6v3"/>
      </svg>`,
    close: `
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="m6 6 12 12M18 6 6 18"/>
      </svg>`,
    send: `
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="m22 2-7 20-4-9-9-4 20-7ZM22 2 11 13"/>
      </svg>`,
    microphone: `
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <rect x="9" y="2" width="6" height="13" rx="3"/>
        <path d="M5 10v2a7 7 0 0 0 14 0v-2m-7 9v3m-4 0h8"/>
      </svg>`,
    copy: `
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <rect x="8" y="8" width="13" height="13" rx="2"/>
        <path d="M16 8V5a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h3"/>
      </svg>`,
  };

  // Create the floating button that opens the chat panel.
  const launcher = document.createElement("button");
  launcher.className = "sukku-chat-launcher";
  launcher.type = "button";
  launcher.id = "sukundra-ai";
  launcher.setAttribute("aria-label", "Open SUKUNDRA AI PRO chat");
  launcher.setAttribute("aria-expanded", "false");
  launcher.innerHTML = `
    <span class="sukku-chat-brand-mark" aria-hidden="true"><img src="static/images/sukundra-ai-logo.png" alt=""></span>
    <span class="sukku-chat-launcher-label">Ask SUKUNDRA AI PRO</span>
  `;

  // Build the chat window. CSS controls how it fits desktop and mobile screens.
  const panel = document.createElement("section");
  panel.className = "sukku-chat-panel";
  panel.setAttribute("role", "dialog");
  panel.setAttribute("aria-label", "SUKUNDRA AI PRO chat");
  panel.setAttribute("aria-modal", "false");
  panel.hidden = true;

  panel.innerHTML = `
    <header class="sukku-chat-header">
      <div class="sukku-chat-avatar"><img src="static/images/sukundra-ai-logo.png" alt=""></div>
      <div class="sukku-chat-heading">
        <strong>SUKUNDRA AI PRO</strong>
        <span>Python coding tutor · Portfolio assistant</span>
        <span
          class="sukku-chat-status"
          data-chat-status
          data-state="online"
          role="status"
        >
          <i></i><span>Browser Q&amp;A · Connecting</span>
        </span>
      </div>
      <div class="sukku-chat-tools">
        <button
          type="button"
          class="sukku-chat-icon-button"
          data-chat-minimize
          aria-label="Minimize chat"
          title="Minimize"
        >${icons.minimize}</button>
        <button
          type="button"
          class="sukku-chat-icon-button"
          data-chat-maximize
          aria-label="Maximize chat"
          title="Maximize"
        >${icons.maximize}</button>
        <button
          type="button"
          class="sukku-chat-icon-button"
          data-chat-clear
          aria-label="Clear conversation"
          title="Clear conversation"
        >${icons.clear}</button>
        <button
          type="button"
          class="sukku-chat-icon-button"
          data-chat-close
          aria-label="Close chat"
          title="Close"
        >${icons.close}</button>
      </div>
    </header>
    <div class="sukku-chat-workspace">
      <aside class="sukku-chat-sidebar" aria-label="Chat workspace">
        <div class="sukku-chat-workspace-brand">
          <span class="sukku-chat-workspace-glyph" aria-hidden="true">✦</span>
          <span>Workspace</span>
        </div>
        <span class="sukku-chat-sidebar-label">START A CONVERSATION</span>
        <button class="sukku-chat-prompt-link is-active" type="button" data-chat-prompt="Teach me Python from the basics." aria-pressed="true">
          <span aria-hidden="true">⌘</span> Python learning
        </button>
        <button class="sukku-chat-prompt-link" type="button" data-chat-prompt="Tell me about his projects." aria-pressed="false">
          <span aria-hidden="true">▧</span> Projects
        </button>
        <button class="sukku-chat-prompt-link" type="button" data-chat-prompt="Who is Er. Sukundra Pujara?" aria-pressed="false">
          <span aria-hidden="true">◉</span> About Sukundra
        </button>
        <span class="sukku-chat-sidebar-label sukku-chat-source-heading">AVAILABLE KNOWLEDGE</span>
        <ul class="sukku-chat-source-list">
          <li><span aria-hidden="true">▤</span> Python Q&amp;A bank</li>
          <li><span aria-hidden="true">▤</span> Python learning guides</li>
          <li><span aria-hidden="true">▤</span> Object-oriented Python guide</li>
          <li><span aria-hidden="true">▤</span> Verified portfolio details</li>
        </ul>
        <p class="sukku-chat-sidebar-note">Uses bundled learning content and guided coding helpers. Python code is reviewed as text and is never executed here.</p>
      </aside>
      <section class="sukku-chat-conversation" aria-label="Conversation">
        <section class="sukku-chat-voicebar" aria-label="Voice input">
          <div class="sukku-chat-voice-copy">
            <span class="sukku-chat-voice-title">Speak to SUKUNDRA AI PRO</span>
            <span class="sukku-chat-voice-status" data-voice-status aria-live="polite">Tap the mic; voice questions auto-send</span>
          </div>
          <label class="sukku-chat-voice-language">
            <span class="sukku-chat-sr-only">Voice input language</span>
            <select data-voice-language aria-label="Voice input language">
              <option value="en-US">English</option>
              <option value="ne-NP">नेपाली</option>
            </select>
          </label>
          <div class="sukku-chat-waveform" aria-hidden="true">
            ${Array.from({ length: 27 }, () => "<span></span>").join("")}
          </div>
          <button class="sukku-chat-voice-button" type="button" data-chat-voice aria-label="Start voice input" aria-pressed="false" title="Start voice input">
            ${icons.microphone}
          </button>
        </section>
        <div
          class="sukku-chat-messages"
          data-chat-messages
          aria-live="polite"
          aria-relevant="additions text"
        ></div>
        <div
          class="sukku-chat-typing"
          data-chat-typing
          hidden
          aria-label="Sukundra AI is typing"
        >
          <span></span>
          <span></span>
          <span></span>
          <span class="sukku-chat-typing-label">Sukundra AI is preparing a reply</span>
        </div>
        <form class="sukku-chat-form" data-chat-form>
          <label class="sukku-chat-sr-only" for="sukku-chat-input">Write your message</label>
          <textarea
            id="sukku-chat-input"
            name="message"
            rows="1"
            maxlength="${maxMessageLength}"
            placeholder="Ask about Python or Sukundra…"
            required
          ></textarea>
          <div class="sukku-chat-composer-actions">
            <p class="sukku-chat-hint">Enter to send · voice input is optional</p>
            <button
              class="sukku-chat-send"
              type="submit"
              aria-label="Send message"
              title="Send message"
            >${icons.send}</button>
          </div>
        </form>
      </section>
      <aside class="sukku-chat-activity" aria-label="Session activity">
        <div class="sukku-chat-activity-heading">
          <div><span class="sukku-chat-sidebar-label">SESSION</span><h2>Activity</h2></div>
          <span class="sukku-chat-live-label"><i></i> Live</span>
        </div>
        <ol class="sukku-chat-activity-list" data-chat-activity aria-live="polite">
          <li class="is-complete"><span class="sukku-chat-activity-dot"></span><span>Workspace ready</span></li>
          <li class="is-pending"><span class="sukku-chat-activity-dot"></span><span>Waiting for a question</span></li>
        </ol>
        <div class="sukku-chat-activity-note">
          <span class="sukku-chat-sidebar-label">ABOUT THIS ASSISTANT</span>
          <p>Answers use the learning guides and verified portfolio facts bundled with this website.</p>
        </div>
      </aside>
    </div>
  `;

  document.body.append(launcher, panel);

  // Save the HTML elements that the chatbot updates later.
  const statusElement = panel.querySelector("[data-chat-status]");
  const messagesElement = panel.querySelector("[data-chat-messages]");
  const typingElement = panel.querySelector("[data-chat-typing]");
  const form = panel.querySelector("[data-chat-form]");
  const input = panel.querySelector("#sukku-chat-input");
  const sendButton = panel.querySelector(".sukku-chat-send");
  const voiceButton = panel.querySelector("[data-chat-voice]");
  const voiceStatus = panel.querySelector("[data-voice-status]");
  const voiceLanguage = panel.querySelector("[data-voice-language]");
  const activityList = panel.querySelector("[data-chat-activity]");

  let voiceRecognition = null;
  let voiceMessageReady = false;
  let voiceTranscript = "";
  if (navigator.language?.toLowerCase().startsWith("ne")) {
    voiceLanguage.value = "ne-NP";
  }
  const voiceInputSupported = Boolean(window.SpeechRecognition || window.webkitSpeechRecognition);
  const voiceOutputSupported = Boolean(window.speechSynthesis && window.SpeechSynthesisUtterance);

  function speakReply(text, language = "en-US") {
    if (!voiceOutputSupported) {
      voiceStatus.textContent = "English speech output is not supported in this browser.";
      return;
    }

    const spokenText = text
      .replace(/```[\s\S]*?```/g, " Code example omitted. ")
      .replace(/`([^`]+)`/g, "$1")
      .replace(/https?:\/\/\S+/g, "link")
      .replace(/[*#_>|]/g, "")
      .replace(/\s+/g, " ")
      .trim()
      .slice(0, 1800);
    if (!spokenText) return;

    window.speechSynthesis.cancel();
    const utterance = new window.SpeechSynthesisUtterance(spokenText);
    utterance.lang = language;
    const preferredVoice = window.speechSynthesis
      .getVoices()
      .find((voice) => voice.lang.toLowerCase().startsWith(language.slice(0, 2).toLowerCase()));
    if (preferredVoice) utterance.voice = preferredVoice;
    utterance.addEventListener("start", () => {
      panel.classList.add("is-speaking");
      voiceStatus.textContent = "Sukundra AI is speaking…";
    });
    utterance.addEventListener("end", () => {
      panel.classList.remove("is-speaking");
      voiceStatus.textContent = "Reply spoken. Tap the microphone to continue.";
    });
    utterance.addEventListener("error", (event) => {
      panel.classList.remove("is-speaking");
      console.warn("Sukundra AI speech output failed.", event.error);
      voiceStatus.textContent =
        "English speech could not play. Check your browser's speech settings.";
    });
    window.speechSynthesis.speak(utterance);
  }

  function setupVoiceInput() {
    voiceLanguage.addEventListener("change", () => {
      if (voiceRecognition) voiceRecognition.lang = voiceLanguage.value;
      voiceStatus.textContent =
        voiceLanguage.value === "ne-NP"
          ? "Nepali input selected · answer spoken in English"
          : "English input selected · answer spoken in English";
    });

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      voiceButton.disabled = true;
      voiceButton.title = "Voice input is not supported in this browser";
      voiceStatus.textContent = "Voice input is not supported in this browser";
      return;
    }

    try {
      voiceRecognition = new SpeechRecognition();
      voiceRecognition.lang = voiceLanguage.value;
      voiceRecognition.interimResults = true;
      voiceRecognition.continuous = false;
    } catch (error) {
      console.error("Could not initialize voice recognition.", error);
      voiceButton.disabled = true;
      voiceStatus.textContent = "Voice input could not start. You can still type your message.";
      return;
    }

    voiceRecognition.addEventListener("start", () => {
      panel.classList.add("is-listening");
      voiceTranscript = "";
      voiceMessageReady = false;
      voiceLanguage.disabled = true;
      voiceButton.setAttribute("aria-pressed", "true");
      voiceButton.setAttribute("aria-label", "Stop voice input");
      voiceButton.title = "Stop voice input";
      voiceStatus.textContent = "Listening… speak now";
    });

    voiceRecognition.addEventListener("result", (event) => {
      let finalTranscript = "";
      let interimTranscript = "";
      for (let index = event.resultIndex; index < event.results.length; index += 1) {
        const transcript = event.results[index][0].transcript;
        if (event.results[index].isFinal) finalTranscript += transcript;
        else interimTranscript += transcript;
      }

      if (finalTranscript.trim()) {
        voiceTranscript = `${voiceTranscript} ${finalTranscript.trim()}`.trim();
        voiceMessageReady = true;
        voiceStatus.textContent = "Voice captured. Preparing an English spoken answer…";
      } else if (interimTranscript) {
        voiceStatus.textContent = "Listening…";
      }
    });

    voiceRecognition.addEventListener("error", (event) => {
      const errorMessages = {
        "not-allowed":
          "Microphone permission was denied. Allow microphone access to use voice input.",
        "service-not-allowed": "Voice recognition is unavailable in this browser.",
        network:
          "Speech recognition service is unavailable. Check your internet connection and try again.",
        "no-speech": "No speech was detected. Try again when ready.",
        "audio-capture": "No microphone was found. Check your device and try again.",
        "language-not-supported":
          voiceLanguage.value === "ne-NP"
            ? "Nepali speech recognition is not supported here. Choose English or check your browser's supported languages."
            : "English speech recognition is not supported by this browser.",
      };
      voiceStatus.textContent =
        errorMessages[event.error] ||
        "Voice input could not start. You can still type your message.";
    });

    voiceRecognition.addEventListener("end", () => {
      panel.classList.remove("is-listening");
      voiceLanguage.disabled = false;
      voiceButton.setAttribute("aria-pressed", "false");
      voiceButton.setAttribute("aria-label", "Start voice input");
      voiceButton.title = "Start voice input";
      if (voiceStatus.textContent === "Listening… speak now") {
        voiceStatus.textContent =
          voiceLanguage.value === "ne-NP"
            ? "Nepali input selected · answer spoken in English"
            : "English input selected · answer spoken in English";
      }
      if (voiceMessageReady) {
        voiceMessageReady = false;
        const message = voiceTranscript;
        voiceTranscript = "";
        sendMessage(message, true, true);
      }
    });

    voiceButton.addEventListener("click", () => {
      if (sending) {
        voiceStatus.textContent = "Please wait for the current answer before speaking again.";
        return;
      }
      if (panel.classList.contains("is-listening")) {
        voiceRecognition.stop();
        return;
      }
      if (window.speechSynthesis?.speaking) {
        window.speechSynthesis.cancel();
        panel.classList.remove("is-speaking");
      }
      try {
        voiceRecognition.start();
      } catch (error) {
        console.error("Could not start voice recognition.", error);
        voiceStatus.textContent =
          error.name === "NotAllowedError"
            ? "Microphone permission was denied. Allow microphone access to use voice input."
            : error.name === "InvalidStateError"
              ? "Voice input is already starting. Wait a moment and try again."
              : `Voice input could not start (${error.name || "unknown error"}). Check microphone permission and browser speech support.`;
      }
    });
  }

  // Add question buttons to the welcome screen.
  const suggestionsElement = document.createElement("div");
  suggestionsElement.className = "sukku-chat-suggestions";
  suggestionsElement.setAttribute("aria-label", "Suggested questions");
  quickQuestions.forEach((question) => {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "sukku-chat-suggestion";
    button.textContent = question;
    button.addEventListener("click", () => sendMessage(question));
    suggestionsElement.append(button);
  });

  // Track the current conversation and widget state.
  // Declare this before loading history because loading can report a storage error.
  let historyAvailable = true;
  let conversation = loadConversation();
  let sending = false;
  let closeTimer = null;

  // Update the small status label in the chat header.
  function setStatus(message, state) {
    statusElement.dataset.state = state;
    statusElement.querySelector("span").textContent = message;
  }

  // Use the current time if an old saved message has a bad timestamp.
  function safeTime(value) {
    const date = new Date(value);
    const safeDate = Number.isNaN(date.getTime()) ? new Date() : date;
    return safeDate.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
  }

  function scrollToLatest() {
    messagesElement.scrollTop = messagesElement.scrollHeight;
  }

  // Remove Markdown emphasis markers without changing Python code syntax.
  function cleanAnswerFormatting(text) {
    return text
      .replace(/(^|\n)[ \t]*\*[ \t]+/g, "$1• ")
      .replace(/(^|[^*])\*\*([^*\n]+)\*\*(?![\w*])/g, "$1$2")
      .replace(/(^|[^\w*])\*([^*\n]+)\*(?![\w*])/g, "$1$2");
  }

  function appendInlineFormatting(container, text) {
    const formattingPattern = /(`[^`\n]+`|\*\*[^*\n]+\*\*)/g;
    let lastIndex = 0;
    let match = formattingPattern.exec(text);

    while (match) {
      if (match.index > lastIndex) {
        container.append(
          document.createTextNode(cleanAnswerFormatting(text.slice(lastIndex, match.index))),
        );
      }

      const formatted = document.createElement(match[0].startsWith("`") ? "code" : "strong");
      formatted.textContent = match[0].startsWith("`")
        ? match[0].slice(1, -1)
        : match[0].slice(2, -2);
      container.append(formatted);
      lastIndex = formattingPattern.lastIndex;
      match = formattingPattern.exec(text);
    }

    if (lastIndex < text.length) {
      container.append(document.createTextNode(cleanAnswerFormatting(text.slice(lastIndex))));
    }
  }

  function appendFormattedParagraph(container, lines) {
    const paragraph = document.createElement("p");
    lines.forEach((line, index) => {
      if (index > 0) paragraph.append(document.createElement("br"));
      appendInlineFormatting(paragraph, line);
    });
    container.append(paragraph);
  }

  function appendFormattedList(container, listItems, ordered) {
    const list = document.createElement(ordered ? "ol" : "ul");
    const isLineByLine = listItems.every((item) => /^Line \d+(?::|\s)/i.test(item));
    if (isLineByLine) list.className = "sukku-chat-line-by-line";

    listItems.forEach((item) => {
      const listItem = document.createElement("li");
      const lineLabel = item.match(/^(Line \d+:?)\s*(.*)$/i);
      if (lineLabel) {
        const label = document.createElement("strong");
        label.textContent = lineLabel[1];
        listItem.append(label, document.createTextNode(" "));
        appendInlineFormatting(listItem, lineLabel[2]);
      } else {
        appendInlineFormatting(listItem, item);
      }
      list.append(listItem);
    });
    container.append(list);
  }

  // Render simple Markdown as safe, readable chat elements.
  function renderFormattedText(container, text) {
    let paragraphLines = [];
    let listItems = [];
    let listIsOrdered = false;

    const flushParagraph = () => {
      if (paragraphLines.length === 0) return;
      appendFormattedParagraph(container, paragraphLines);
      paragraphLines = [];
    };

    const flushList = () => {
      if (listItems.length === 0) return;
      appendFormattedList(container, listItems, listIsOrdered);
      listItems = [];
    };

    text.split(/\r?\n/).forEach((line) => {
      const trimmedLine = line.trim();
      const heading = trimmedLine.match(/^#{1,3}\s+(.+)$/);
      const unorderedItem = trimmedLine.match(/^[-*]\s+(.+)$/);
      const orderedItem = trimmedLine.match(/^\d+[.)]\s+(.+)$/);
      const lineExplanation = trimmedLine.match(/^Line \d+(?::|\s+)(.+)$/i);

      if (!trimmedLine) {
        flushParagraph();
        flushList();
        return;
      }

      if (heading) {
        flushParagraph();
        flushList();
        const headingElement = document.createElement("h4");
        appendInlineFormatting(headingElement, heading[1]);
        container.append(headingElement);
        return;
      }

      if (unorderedItem || orderedItem || lineExplanation) {
        flushParagraph();
        const isOrdered = Boolean(orderedItem);
        if (listItems.length > 0 && listIsOrdered !== isOrdered) flushList();
        listIsOrdered = isOrdered;
        listItems.push(lineExplanation ? trimmedLine : (unorderedItem || orderedItem)[1]);
        return;
      }

      flushList();
      paragraphLines.push(line);
    });

    flushParagraph();
    flushList();
  }

  function renderAnswerText(container, text) {
    // Code blocks are inserted as text so code is displayed, never executed.
    const codeBlockPattern = /```([a-zA-Z0-9+#.-]*)\r?\n([\s\S]*?)```/g;
    let lastIndex = 0;
    let match = codeBlockPattern.exec(text);

    while (match) {
      const explanation = text.slice(lastIndex, match.index);
      if (explanation) {
        renderFormattedText(container, explanation);
      }

      const codeBlock = document.createElement("pre");
      codeBlock.className = "sukku-chat-code";
      if (match[1]) codeBlock.dataset.language = match[1].toUpperCase();
      const code = document.createElement("code");
      match[2]
        .trimEnd()
        .split(/\r?\n/)
        .forEach((line) => {
          const codeLine = document.createElement("span");
          codeLine.className = "sukku-chat-code-line";
          codeLine.textContent = line || "\u00a0";
          code.append(codeLine);
        });
      codeBlock.append(code);
      container.append(codeBlock);
      lastIndex = codeBlockPattern.lastIndex;
      match = codeBlockPattern.exec(text);
    }

    const remainingText = text.slice(lastIndex);
    if (remainingText) {
      renderFormattedText(container, remainingText);
    }
  }

  // Create one message bubble and its timestamp/copy controls.
  function appendMessage(message, options = {}) {
    const bubble = document.createElement("article");
    const errorClass = options.error ? " is-error" : "";
    bubble.className = `sukku-chat-message is-${message.role}${errorClass}`;

    if (options.error || message.role === "assistant") {
      const label = document.createElement("span");
      label.className = "sukku-chat-message-label";
      if (options.error) {
        label.textContent = "Connection notice";
      } else if (message.source === "python") {
        label.textContent = "SUKUNDRA AI PRO · Python tutor";
      } else {
        label.textContent = "SUKUNDRA AI PRO";
      }
      bubble.append(label);
    }

    const content = document.createElement("div");
    content.className = "sukku-chat-message-content";
    renderAnswerText(content, message.content);

    const footer = document.createElement("div");
    footer.className = "sukku-chat-message-footer";
    const time = document.createElement("time");
    time.dateTime = message.timestamp || new Date().toISOString();
    time.textContent = safeTime(time.dateTime);
    footer.append(time);

    if (message.role === "assistant" && !options.error && !options.welcome) {
      const copyButton = document.createElement("button");
      copyButton.type = "button";
      copyButton.className = "sukku-chat-copy";
      copyButton.setAttribute("aria-label", "Copy AI response");
      copyButton.title = "Copy response";
      copyButton.innerHTML = icons.copy;
      copyButton.addEventListener("click", async () => {
        try {
          await navigator.clipboard.writeText(message.content);
          copyButton.setAttribute("aria-label", "Response copied");
          copyButton.title = "Copied";
          window.setTimeout(() => {
            copyButton.setAttribute("aria-label", "Copy AI response");
            copyButton.title = "Copy response";
          }, 1500);
        } catch (error) {
          console.error("Could not copy the Sukundra AI response.", error);
          setStatus("Copy failed. Select and copy the response text.", "error");
        }
      });
      footer.append(copyButton);
    }

    bubble.append(content, footer);
    messagesElement.append(bubble);
    scrollToLatest();
  }

  // Show the first screen and its suggested questions.
  function showWelcome() {
    messagesElement.replaceChildren();
    const welcome = document.createElement("section");
    welcome.className = "sukku-chat-welcome";
    welcome.setAttribute("aria-label", "Welcome to Sukundra AI");

    const greeting = document.createElement("span");
    greeting.className = "sukku-chat-welcome-label";
    greeting.textContent = "SUKUNDRA AI";

    const heading = document.createElement("h2");
    heading.textContent = "How can I help you today?";

    const description = document.createElement("p");
    description.textContent =
      "Ask about Sukundra or learn Python step by step with simple explanations and code examples.";

    welcome.append(greeting, heading, description, suggestionsElement);
    messagesElement.append(welcome);
  }

  // Read only valid messages from this browser tab.
  function loadConversation() {
    try {
      const saved = JSON.parse(sessionStorage.getItem(historyKey) || "[]");
      if (!Array.isArray(saved)) return [];

      return saved.filter(isValidMessage).slice(-maxStoredMessages);
    } catch (error) {
      historyAvailable = false;
      console.error("Could not read Sukundra AI chat history from this session.", error);
      return [];
    }
  }

  // Ignore malformed history entries before displaying saved messages.
  function isValidMessage(item) {
    return (
      item &&
      (item.role === "user" || item.role === "assistant") &&
      typeof item.content === "string" &&
      item.content.length > 0 &&
      item.content.length <= maxMessageLength
    );
  }

  function saveConversation() {
    try {
      const recentMessages = conversation.slice(-maxStoredMessages);
      sessionStorage.setItem(historyKey, JSON.stringify(recentMessages));
    } catch (error) {
      historyAvailable = false;
      console.error("Could not save Sukundra AI chat history in this session.", error);
      setStatus("Chat works, but this session cannot save its history.", "error");
    }
  }

  // Redraw the chat after loading history or clearing it.
  function renderConversation() {
    if (conversation.length === 0) {
      showWelcome();
      return;
    }

    messagesElement.replaceChildren();
    conversation.forEach((message) => appendMessage(message));
  }

  function showTyping(isTyping) {
    typingElement.hidden = !isTyping;
    sendButton.disabled = isTyping;
    panel.querySelector("[data-chat-clear]").disabled = isTyping;
    input.disabled = isTyping;
    voiceButton.disabled = isTyping || !voiceInputSupported;
    panel.querySelectorAll("[data-chat-prompt]").forEach((button) => {
      button.disabled = isTyping;
    });

    panel.querySelectorAll(".sukku-chat-suggestion").forEach((button) => {
      button.disabled = isTyping;
    });
    if (isTyping) scrollToLatest();
  }

  function logActivity(message, state = "pending") {
    const item = document.createElement("li");
    item.className = `is-${state}`;
    const dot = document.createElement("span");
    dot.className = "sukku-chat-activity-dot";
    dot.setAttribute("aria-hidden", "true");
    const text = document.createElement("span");
    text.textContent = message;
    item.append(dot, text);
    activityList.append(item);
    while (activityList.children.length > 6) activityList.firstElementChild.remove();
  }

  // Display a visible notice instead of silently ignoring an error.
  function showError(message) {
    const errorMessage = {
      role: "assistant",
      content: message,
      timestamp: new Date().toISOString(),
    };

    appendMessage(errorMessage, {
      error: true,
    });
  }

  function requestAiReply(message, readAloud = false, voiceOnly = false) {
    logActivity("Finding an answer in bundled knowledge", "active");
    try {
      const codingReply = window.SUKKU_PYTHON_ASSISTANT?.getReply(message);
      const reply = codingReply || getPythonGuideAnswer(message);
      const assistantMessage = {
        role: "assistant",
        content: reply,
        timestamp: new Date().toISOString(),
      };
      if (!voiceOnly) {
        conversation.push(assistantMessage);
        conversation = conversation.slice(-maxStoredMessages);
        saveConversation();
        appendMessage(assistantMessage);
      }
      setStatus("Browser Q&A · Ready", "online");
      logActivity("Browser answer prepared", "complete");
      if (readAloud) speakReply(reply, "en-US");
    } catch (error) {
      console.error("Sukundra AI browser Q&A could not answer the message.", error);
      logActivity("Could not prepare an answer", "error");
      if (voiceOnly) {
        voiceStatus.textContent = "Could not prepare an English spoken answer. Please try again.";
      } else {
        showError("I couldn't generate a local answer. Please try a Python or portfolio question.");
      }
      setStatus("Browser Q&A · Request failed", "error");
    } finally {
      sending = false;
      showTyping(false);
    }
  }

  function findPythonGuideSection(question) {
    const queryTerms = getTopicWords(question);
    if (!queryTerms?.length || !pythonGuideSections.length) return null;

    // A word in a section title matters more than a word in its explanation.
    const rankedSections = pythonGuideSections
      .map((section, index) => {
        const titleTerms = new Set(
          (section.title.toLowerCase().match(/[a-z_]+/g) || []).map(normalizeTopicWord),
        );
        const contentTerms = new Set(
          (section.content.toLowerCase().match(/[a-z_]+/g) || []).map(normalizeTopicWord),
        );
        const titleMatches = queryTerms.filter((term) => titleTerms.has(term)).length;
        const contentMatches = queryTerms.filter((term) => contentTerms.has(term)).length;

        return {
          ...section,
          index,
          titleMatches,
          contentMatches,
          score: titleMatches * 10 + contentMatches,
        };
      })
      .sort((first, second) => second.score - first.score || first.index - second.index);

    const bestMatch = rankedSections[0];

    // Return no match rather than displaying an unrelated lesson.
    if (!bestMatch || (bestMatch.titleMatches === 0 && bestMatch.contentMatches < 2)) {
      return null;
    }

    return bestMatch;
  }

  // Match a visitor's question with one of the supplied theory questions.
  function findPythonQuestionAnswer(question) {
    const availableQuestions = [];
    availableQuestions.push(
      ...(Array.isArray(window.SUKKU_PYTHON_OOP_QUESTIONS)
        ? window.SUKKU_PYTHON_OOP_QUESTIONS
        : []),
      ...(Array.isArray(window.SUKKU_PYTHON_QUESTIONS) ? window.SUKKU_PYTHON_QUESTIONS : []),
    );
    (window.PYTHON_THEORY || []).forEach((section) => {
      (section.questions || []).forEach(([theoryQuestion, answer]) => {
        availableQuestions.push({
          question: theoryQuestion,
          answer,
        });
      });
    });
    (window.PYTHON_PRACTICE || []).forEach((topic) => {
      (topic.questions || []).forEach((exercise) => {
        availableQuestions.push({
          question: exercise.question,
          answer: exercise.solution,
          explanation: exercise.explanation,
          output: exercise.output,
          category: "practice",
        });
      });
    });
    (window.PYTHON_QUIZ || []).forEach((quizQuestion) => {
      availableQuestions.push({
        question: quizQuestion.question,
        answer: quizQuestion.choices?.[quizQuestion.answer],
        category: "quiz",
      });
    });
    (window.PYTHON_LESSONS || []).forEach((lesson) => {
      if (lesson.challenge && lesson.answer) {
        availableQuestions.push({
          question: lesson.challenge,
          answer: lesson.answer,
          category: "lesson",
        });
      }
    });
    if (availableQuestions.length === 0) return null;
    const validQuestions = availableQuestions.filter(
      (item) => item && typeof item.question === "string" && typeof item.answer === "string",
    );

    const normalizedQuestion = question
      .toLowerCase()
      .replace(/[?!.,]/g, "")
      .replace(/\s+/g, " ")
      .trim();
    const exactAnswer = validQuestions.find((item) => {
      const bankQuestion = item.question
        .toLowerCase()
        .replace(/[?!.,]/g, "")
        .replace(/\s+/g, " ")
        .trim();
      return bankQuestion === normalizedQuestion;
    });
    if (exactAnswer) return exactAnswer;

    const queryTerms = getTopicWords(question);
    if (queryTerms.length === 0) return null;

    const rankedAnswers = validQuestions
      .map((item, index) => {
        const answerTerms = getTopicWords(item.question);
        const matchingTerms = queryTerms.filter((term) => answerTerms.includes(term));
        const questionCoverage = matchingTerms.length / queryTerms.length;
        const answerCoverage = matchingTerms.length / answerTerms.length;

        return {
          item,
          index,
          answerTermCount: answerTerms.length,
          matchingCount: matchingTerms.length,
          questionCoverage,
          score: matchingTerms.length * 10 + questionCoverage * 5 + answerCoverage * 3,
        };
      })
      .sort((first, second) => second.score - first.score || first.index - second.index);

    const bestAnswer =
      queryTerms.length === 1
        ? rankedAnswers.find((answer) => answer.matchingCount === 1 && answer.answerTermCount === 1)
        : rankedAnswers[0];
    if (!bestAnswer || bestAnswer.questionCoverage < 0.5) return null;
    if (queryTerms.length > 2 && bestAnswer.matchingCount < 2) return null;

    return bestAnswer.item;
  }

  const practiceProgramSteps = {
    "Write a program to check if a number is prime.": [
      "Defines a function that checks the number passed in as `n`.",
      "Numbers below 2 are not prime.",
      "Returns `False` for a number below 2.",
      "Tests possible divisors from 2 up to the square root of `n`.",
      "Checks whether the current divisor divides `n` evenly.",
      "Returns `False` as soon as a divisor is found.",
      "Returns `True` when no divisor was found.",
    ],
    "Write a program to check if a string is a palindrome.": [
      "Defines a function that accepts a string named `s`.",
      "Lowercases the text and removes spaces so the comparison ignores them.",
      "Returns whether the cleaned string is the same forwards and backwards.",
    ],
    "Write a program to print the Fibonacci series.": [
      "Defines a function that prints `n` Fibonacci numbers.",
      "Starts the sequence with 0 and 1.",
      "Repeats the next two steps `n` times.",
      "Prints the current Fibonacci number on the same line.",
      "Moves forward by making the old second number the first and adding the pair for the new second.",
    ],
    "Write a program to find the factorial of a number.": [
      "Defines a recursive factorial function.",
      "For 1 or less, returns 1; otherwise multiplies `n` by the factorial of the previous number.",
    ],
    "Write a program to count word frequency in a text.": [
      "Imports `Counter`, which counts repeated values.",
      "Stores a sample sentence in `text`.",
      "Splits the sentence into words, counts them, and prints the most frequent words.",
    ],
    "Write a program to check if two strings are anagrams.": [
      "Defines a function that takes two strings.",
      "Lowercases and sorts both strings, then checks whether the sorted characters match.",
    ],
    "Write a program to find the second largest number in a list.": [
      "Defines a function that accepts a list of numbers.",
      "Removes duplicates, sorts the numbers, and saves the result.",
      "Returns the second-largest unique number, or `None` if there are fewer than two.",
    ],
    "Write FizzBuzz in Python.": [
      "Loops through the numbers 1 to 15.",
      "If a number is divisible by 15, prints `FizzBuzz`.",
      "Otherwise, if it is divisible by 3, prints `Fizz`.",
      "Otherwise, if it is divisible by 5, prints `Buzz`.",
      "If none of those conditions match, prints the number itself.",
    ],
    "Write a BankAccount class with deposit and withdraw.": [
      "Defines a `BankAccount` class.",
      "Runs when a new account is created; `balance` starts at 0 unless a different amount is supplied.",
      "Stores the account owner's name.",
      "Stores the balance as an internal attribute.",
      "Defines the deposit method.",
      "Rejects a zero or negative deposit.",
      "Raises an error when the deposit amount is invalid.",
      "Adds a valid amount to the balance.",
      "Defines the withdraw method.",
      "Checks whether the requested amount exceeds the balance.",
      "Raises an error if there is not enough money.",
      "Subtracts an allowed withdrawal from the balance.",
      "Makes `balance` readable like an attribute.",
      "Defines the getter that runs when the balance property is read.",
      "Returns the current stored balance.",
    ],
    "How do you swap two variables in Python?": [
      "Swaps the values of `a` and `b` in one assignment. Python evaluates the right side first, then assigns both values.",
    ],
  };

  // Add a short walkthrough to every supplied practice program.
  function formatPythonQuestionAnswer(item) {
    if (item.category === "practice") {
      const code = typeof item.answer === "string" ? item.answer.trim() : "";
      const explanation = typeof item.explanation === "string" ? item.explanation.trim() : "";
      const output =
        typeof item.output === "string" && item.output.trim()
          ? `\n\n**Output:**\n\`\`\`text\n${item.output.trim()}\n\`\`\``
          : "";
      return `${code ? `\`\`\`python\n${code}\n\`\`\`` : ""}${explanation ? `\n\n${explanation}` : ""}${output}`.trim();
    }

    if (item.category === "lesson") {
      return `\`\`\`python\n${item.answer.trim()}\n\`\`\``;
    }

    if (item.category === "quiz") {
      return `The correct answer is **${item.answer}**.`;
    }

    if (item.category === "programs") {
      const explanation = practiceProgramSteps[item.question];
      const lineNotes = explanation
        ? explanation.map((note, index) => `- Line ${index + 1}: ${note}`).join("\n")
        : "";
      return `\`\`\`python\n${item.answer.trim()}\n\`\`\`${lineNotes ? `\n\n**Line-by-line explanation**\n\n${lineNotes}` : ""}`;
    }

    return item.answer;
  }

  function formatPythonGuideAnswer(section, asksInNepali) {
    // Limit very long guide sections so the chat remains usable on a phone.
    const sourceExcerpt = section.content
      .slice(0, 5000)
      .replace(/\n---\s*$/, "")
      .trim();
    const intro = asksInNepali
      ? `तपाईंले पठाउनुभएको Python guide मा **${section.title}** बारे यस्तो सामग्री छ। (मूल व्याख्या English मा छ।)`
      : `From your supplied Python guide: **${section.title}**`;
    return `${intro}\n\n${sourceExcerpt}`;
  }

  function getPythonGuideAnswer(question) {
    const text = question.toLowerCase();
    // Text replies stay in English; Nepali is accepted only through voice input.
    const asksInNepali = false;
    const asksForFullTheory =
      /\b(all|complete|full|entire|everything|theory|details?)\b/.test(text) ||
      /\b(sabai|sabbai|sampurna|pura)\b/.test(text) ||
      /सबै|सम्पूर्ण|पूरा|विस्तृत/.test(text);

    // Answer portfolio questions using the details supplied by Sukundra.
    if (
      /who is sukundra|about sukundra|sukundra puj|sukundra.*ko ho|who are you|तपाईं को|को हुन्/.test(
        text,
      )
    ) {
      return asksInNepali
        ? "सुकुन्द्र पुजारा Softwarica College of IT & E-Commerce मा Coventry University सँगको सहकार्यमा Computer Science and Artificial Intelligence पढ्दै हुनुहुन्छ। उहाँ full-stack development, Python, Django, JavaScript, React र MySQL मा रुचि राख्नुहुन्छ, साथै AI, Machine Learning र Data Science सिक्दै हुनुहुन्छ। उहाँ projects बनाएर अभ्यास गर्न र आफ्नो problem-solving तथा coding skills निरन्तर सुधार गर्न मन पराउनुहुन्छ।"
        : "Sukundra Pujara is a Computer Science and Artificial Intelligence student at Softwarica College of IT & E-Commerce, in collaboration with Coventry University. He is interested in full-stack development and is developing his skills in Python, Django, JavaScript, React, and MySQL while exploring AI, machine learning, and data science. He enjoys learning by building practical projects and improving his problem-solving and coding skills.";
    }

    // Career goal and current learning interests.
    if (
      /career goal|professional goal|aspir|future.*(job|career)|what.*(want|hope).*become|लक्ष्य|भविष्य.*(काम|करियर)/.test(
        text,
      )
    ) {
      return asksInNepali
        ? "उहाँ Python Developer हुनुहुन्छ र Python development, software development, web technologies, AI तथा Machine Learning मा रुचि राख्नुहुन्छ।"
        : "He is a Python Developer interested in Python and software development, web technologies, AI, and Machine Learning.";
    }

    // Skills and programming languages.
    if (/skill|technology|programming language|what language|कुन.*(भाषा|सीप)|सीप/.test(text)) {
      return asksInNepali
        ? "उहाँका सीप तथा सिकाइका क्षेत्रहरू Python, Django, HTML5, CSS3, JavaScript, MySQL, AI fundamentals, Machine Learning fundamentals, Data Science, Git, GitHub र web तथा app development हुन्। Python उहाँको मुख्य programming language हो।"
        : "His skills and learning areas include Python, Django, HTML5, CSS3, JavaScript, MySQL, AI fundamentals, Machine Learning fundamentals, Data Science, Git, GitHub, and web and app development. Python is his main programming language.";
    }

    // Education details.
    if (/education|study|college|degree|educational background|शिक्षा|कलेज|पढ/.test(text)) {
      return asksInNepali
        ? "उहाँ Softwarica College of IT and E-Commerce मा Coventry University, UK सँगको सहकार्यमा Computer Science with Artificial Intelligence पढ्दै हुनुहुन्छ। उहाँले Kathmandu Model Secondary School (KMC) मा Management faculty अन्तर्गत Class 11 सन् 2024 मा GPA 3.66 र Class 12 सन् 2025 मा GPA 3.08 सहित पूरा गर्नुभयो। मुख्य विषय Computer Science र Social Studies थिए। उहाँले Shree Surma Secondary School बाट 2023 मा GPA 3.00 सहित SEE पास गर्नुभयो। उहाँलाई Python development, AI र Data Science मा रुचि छ।"
        : "He studies Computer Science with Artificial Intelligence at Softwarica College of IT and E-Commerce, in collaboration with Coventry University, UK. He completed Class 11 at Kathmandu Model Secondary School (KMC) in 2024 with a GPA of 3.66 and Class 12 in 2025 with a GPA of 3.08, in the Management faculty. His major subjects were Computer Science and Social Studies. He passed the SEE at Shree Surma Secondary School in 2023 with a GPA of 3.00. His career interests include Python development, AI, and data science.";
    }

    // Internship interest, contact details, and projects.
    if (/intern|job|career|काम|इन्टर्न/.test(text)) {
      return asksInNepali
        ? "उहाँको internship अनुभव Softwarica College of IT and E-Commerce, #LetsLearn, र India को IqraSec Academy सँग छ। Softwarica मा सिकेका क्षेत्रहरू Web Development, Software Development, AI, Data Science, Machine Learning Fundamentals, Freelancing र Robotics हुन्।"
        : "His internship experience includes Softwarica College of IT and E-Commerce, #LetsLearn, and IqraSec Academy in India. His learning areas at Softwarica include web development, software development, AI, data science, machine learning fundamentals, freelancing, and robotics.";
    }

    if (/contact|email|github|सम्पर्क|इमेल/.test(text)) {
      return asksInNepali
        ? "उहाँलाई sukundrapujara61@gmail.com मा email गर्न सक्नुहुन्छ। उहाँको public GitHub: https://github.com/Sukundra1010"
        : "You can email Sukundra at sukundrapujara61@gmail.com or view his public GitHub profile at https://github.com/Sukundra1010.";
    }

    if (/project|projects|प्रोजेक्ट/.test(text)) {
      return asksInNepali
        ? "Portfolio मा Tail Trader Platform, Snapora Social Media Application र Receipt Generator नामका projects उल्लेख छन्। थप जानकारीका लागि उपलब्ध project links हेर्नुहोस्।"
        : "Projects named in the portfolio include Tail Trader Platform, Snapora Social Media Application, and Receipt Generator. See the available project links for more information.";
    }

    // Explain f-strings line by line instead of returning a general string lesson.
    if (/f[- ]?string|formatted string/.test(text)) {
      return asksInNepali
        ? 'F-string ले string भित्र variable को value राख्न मद्दत गर्छ। यो उदाहरण हेरौँ:\n\n```python\nname = "Ram"\ngreeting = f"Hello {name}"\nprint(greeting)\n```\n\n- Line 1: `"Ram"` text लाई `name` variable मा राख्छ।\n- Line 2: `f` ले Python लाई यो formatted string हो भनेर बताउँछ। `{name}` भित्रको variable को value यहाँ राखिन्छ, त्यसैले `greeting` मा `Hello Ram` हुन्छ।\n- Line 3: `greeting` को value देखाउँछ।\n\nOutput: `Hello Ram`'
        : 'An f-string lets you place a variable\'s value inside text. Here is the example one line at a time:\n\n```python\nname = "Ram"\ngreeting = f"Hello {name}"\nprint(greeting)\n```\n\n- Line 1 stores the text `"Ram"` in the variable `name`.\n- Line 2: The `f` before the quote tells Python to format this string. Python replaces `{name}` with the value of `name`, so `greeting` becomes `Hello Ram`.\n- Line 3 prints the value stored in `greeting`.\n\nOutput: `Hello Ram`';
    }

    // Find a matching lesson in the supplied Python guide.
    const referenceSection = findPythonGuideSection(question);
    if (asksForFullTheory && referenceSection) {
      return formatPythonGuideAnswer(referenceSection, asksInNepali);
    }

    // Use the supplied question bank before broad topic fallbacks.
    if (!/line by line|step by step|लाइन बाइ लाइन|चरणबद्ध/.test(text)) {
      const questionAnswer = findPythonQuestionAnswer(question);
      if (questionAnswer) return formatPythonQuestionAnswer(questionAnswer);
    }

    // Give a learning path when the visitor asks where to begin.
    if (
      /roadmap|learning path|basic(?:s)? to advanced|beginner to advanced|where.*start.*python|start.*python.*learn|पाइथन.*(सिक|शुरु)/.test(
        text,
      )
    ) {
      return asksInNepali
        ? 'Python लाई क्रमसँग सिक्ने बाटो:\n\n1. **Basics:** `print`, variables, data types, input र operators\n2. **Control flow:** `if`/`else`, `for`/`while` loops\n3. **Collections:** strings, lists, tuples, sets र dictionaries\n4. **Functions:** parameters, `return`, scope र recursion\n5. **Practical Python:** exceptions, files, modules र packages\n6. **OOP:** classes, objects, inheritance र methods\n7. **Advanced:** comprehensions, iterators, generators, decorators, testing, concurrency र `asyncio`\n8. **Build projects:** साना programs बाट सुरु गरेर database/API जोड्नुहोस्\n\nपहिलो उदाहरण:\n\n```python\nname = input("Your name: ")\nprint(f"Hello, {name}!")\n```\n\n- Line 1: `input()` ले प्रयोगकर्ताबाट text लिन्छ र त्यसलाई `name` मा राख्छ।\n- Line 2: f-string ले `name` को value greeting भित्र राखेर देखाउँछ।\n\nएकपटकमा एउटा topic सोध्नुहोस्—जस्तै `list comprehension line by line`—म मिल्दो guide section देखाउँछु।'
        : 'A sensible Python learning path is:\n\n1. **Basics:** `print`, variables, data types, input, and operators\n2. **Control flow:** `if`/`else`, `for`/`while` loops\n3. **Collections:** strings, lists, tuples, sets, and dictionaries\n4. **Functions:** parameters, `return`, scope, and recursion\n5. **Practical Python:** exceptions, files, modules, and packages\n6. **OOP:** classes, objects, inheritance, and methods\n7. **Advanced:** comprehensions, iterators, generators, decorators, testing, concurrency, and `asyncio`\n8. **Build projects:** start with small programs, then add a database or API\n\nStart with this example:\n\n```python\nname = input("Your name: ")\nprint(f"Hello, {name}!")\n```\n\n- Line 1: `input()` reads text from the user and assigns it to `name`.\n- Line 2: The f-string inserts the value of `name` into the greeting and prints it.\n\nAsk about one topic at a time, such as `list comprehension line by line`, for a focused answer from the supplied guide.';
    }

    // Show the matching section for advanced Python topics.
    if (
      referenceSection &&
      /dataclass|\boop\b|class|object|constructor|\bself\b|class.?method|static.?method|property|inheritance|polymorphism|encapsulation|abstraction|composition|aggregation|mixin|dunder|overrid|overload|method resolution order|\bmro\b|super|decorat|generat|iterat|closure|context.?manager|shallow copy|deep copy|regular expression|regex|multiprocessing|asyncio|\bgil\b|memory management|garbage collection|testing|debugging|recursion|comprehension|lambda|tuple|set|\bargs\b|\bkwargs\b/.test(
        text,
      )
    ) {
      return formatPythonGuideAnswer(referenceSection, asksInNepali);
    }

    if (/loop|for loop|while loop|लूप|दोहोरो/.test(text)) {
      return asksInNepali
        ? "Python मा loop ले code पटक-पटक चलाउँछ:\n\n```python\nfor number in range(1, 4):\n    print(number)\n```\n\n- Line 1: `range(1, 4)` ले 1, 2, 3 दिन्छ; हरेक पालोमा एउटा value `number` मा आउँछ।\n- Line 2: indent भएको `print()` हरेक पालोमा चल्छ र हालको `number` देखाउँछ।"
        : "A loop repeats a block of code. This `for` loop prints 1, 2, and 3:\n\n```python\nfor number in range(1, 4):\n    print(number)\n```\n\n- Line 1: `range(1, 4)` produces 1, 2, and 3 (the stop value 4 is excluded); each value is assigned to `number` in turn.\n- Line 2: The indented `print()` runs once per value and displays the current `number`.";
    }

    if (/variable|भेरिएबल/.test(text)) {
      return asksInNepali
        ? 'Variable भनेको value राख्न प्रयोग गरिने नाम हो:\n\n```python\nstudent_name = "Sukundra"\nprint(student_name)\n```\n\nपहिलो line ले text लाई `student_name` मा राख्छ। दोस्रो line ले त्यो value देखाउँछ।'
        : 'A variable is a name that refers to a value:\n\n```python\nstudent_name = "Sukundra"\nprint(student_name)\n```\n\nThe first line stores text in `student_name`. The second line displays that value.';
    }

    if (/function|फङ्सन|कार्य/.test(text)) {
      return asksInNepali
        ? 'Function नाम दिएर फेरि चलाउन मिल्ने code block हो:\n\n```python\ndef greet(name):\n    return f"Hello, {name}!"\n\nmessage = greet("Sukundra")\nprint(message)\n```\n\n- Line 1: `greet` नामको function बनाउँछ; `name` यसको parameter हो।\n- Line 2: `name` राखेर greeting string फर्काउँछ।\n- Line 4: function चलाउँछ र `"Sukundra"` लाई argument का रूपमा दिन्छ।\n- Line 5: फर्किएको message देखाउँछ。'
        : 'A function is a reusable block of code:\n\n```python\ndef greet(name):\n    return f"Hello, {name}!"\n\nmessage = greet("Sukundra")\nprint(message)\n```\n\n- Line 1 defines `greet`; `name` is its parameter.\n- Line 2 returns a greeting with the current `name` value inserted.\n- Line 4 calls `greet` and passes it the string `"Sukundra"`.\n- Line 5 prints the returned message.';
    }

    if (/class|object|oop|inheritance|क्लास/.test(text)) {
      return asksInNepali
        ? 'Class object बनाउने ढाँचा हो। यो उदाहरणले विद्यार्थी बनाउँछ:\n\n```python\nclass Student:\n    def __init__(self, name):\n        self.name = name\n\nstudent = Student("Sukundra")\nprint(student.name)\n```\n\n- Line 1: `Student` class सुरु गर्छ।\n- Line 2: नयाँ object बनाउँदा चल्ने initializer परिभाषित गर्छ।\n- Line 3: आएको `name` लाई यही object को `self.name` मा राख्छ।\n- Line 5: `Student` बाट object बनाउँछ र नाम दिन्छ।\n- Line 6: object मा राखिएको नाम देखाउँछ।'
        : 'A class is a blueprint for creating objects. This example stores a student\'s name:\n\n```python\nclass Student:\n    def __init__(self, name):\n        self.name = name\n\nstudent = Student("Sukundra")\nprint(student.name)\n```\n\n- Line 1 defines the `Student` class.\n- Line 2 defines the initializer that Python calls when it creates a `Student`.\n- Line 3 stores the supplied `name` on this object; `self` refers to that object.\n- Line 5 creates a `Student` and passes the name `"Sukundra"`.\n- Line 6 reads and prints the object\'s `name` attribute.';
    }

    if (/database|sqlite|sql|डाटाबेस/.test(text)) {
      return asksInNepali
        ? 'SQLite मा अस्थायी, सुरक्षित example:\n\n```python\nimport sqlite3\n\nconnection = sqlite3.connect(":memory:")\nconnection.execute("CREATE TABLE students (name TEXT)")\nconnection.execute(\n    "INSERT INTO students (name) VALUES (?)",\n    ("Sukundra",),\n)\n\nfor row in connection.execute("SELECT name FROM students"):\n    print(row[0])\n\nconnection.close()\n```\n\n`:memory:` ले temporary database बनाउँछ। `?` placeholder ले value सुरक्षित रूपमा पठाउँछ।'
        : 'Here is a small SQLite example using a temporary in-memory database and a parameterized value:\n\n```python\nimport sqlite3\n\nconnection = sqlite3.connect(":memory:")\nconnection.execute("CREATE TABLE students (name TEXT)")\nconnection.execute(\n    "INSERT INTO students (name) VALUES (?)",\n    ("Sukundra",),\n)\n\nfor row in connection.execute("SELECT name FROM students"):\n    print(row[0])\n\nconnection.close()\n```\n\n`:memory:` creates a temporary database. The `?` placeholder safely passes the value.';
    }

    if (referenceSection) {
      return formatPythonGuideAnswer(referenceSection, asksInNepali);
    }

    // Handle greetings and thanks before showing the general fallback.
    if (/hello|hi\b|hey\b|namaste|नमस्ते|नमस्कार/.test(text)) {
      return asksInNepali
        ? "नमस्ते! म Sukundra AI हुँ। म portfolio सम्बन्धी जानकारी र आधारभूत Python, HTML, CSS तथा JavaScript बुझाउन सक्छु। कुन विषयमा मद्दत चाहियो?"
        : "Hello! I’m Sukundra AI. I can answer portfolio questions and explain beginner Python, HTML, CSS, and JavaScript. What would you like to learn?";
    }

    if (/thank|धन्यवाद/.test(text)) {
      return asksInNepali
        ? "स्वागत छ! अर्को Python वा portfolio सम्बन्धी प्रश्न भए सोध्नुहोस्।"
        : "You’re welcome! Ask me another Python or portfolio question whenever you’re ready.";
    }

    // Answer common Python basics with short, readable examples.
    if (/if statement|condition|conditional|if else|condition|conditionals|सर्त/.test(text)) {
      return asksInNepali
        ? 'Condition ले कुनै अवस्था जाँच्छ:\n\n```python\nage = 18\n\nif age >= 18:\n    print("Adult")\nelse:\n    print("Under 18")\n```\n\n- Line 1: `age` मा `18` राख्छ।\n- Line 3: `age` कम्तीमा 18 छ कि जाँच्छ; सत्य भए line 4 चल्छ।\n- Line 5: condition गलत भए वैकल्पिक block सुरु गर्छ; line 6 चल्छ।'
        : 'An `if` statement runs code only when a condition is true:\n\n```python\nage = 18\n\nif age >= 18:\n    print("Adult")\nelse:\n    print("Under 18")\n```\n\n- Line 1 stores the integer `18` in `age`.\n- Line 3 compares `age` with `18`; the indented line 4 runs if the comparison is true.\n- Line 5 is the alternative branch; its indented line 6 runs when the condition is false.';
    }

    if (/list|tuple|set\b|सूची|लिस्ट/.test(text)) {
      return asksInNepali
        ? 'Python list ले धेरै value क्रमसँग राख्छ:\n\n```python\nskills = ["Python", "HTML", "CSS"]\nprint(skills[0])\nskills.append("JavaScript")\nprint(skills)\n```\n\n- Line 1: तीनवटा text भएको list बनाउँछ।\n- Line 2: index `0` को पहिलो item देखाउँछ।\n- Line 3: list को अन्त्यमा `"JavaScript"` थप्छ।\n- Line 4: परिवर्तन भएको list देखाउँछ।'
        : 'A Python list stores multiple values in order:\n\n```python\nskills = ["Python", "HTML", "CSS"]\nprint(skills[0])\nskills.append("JavaScript")\nprint(skills)\n```\n\n- Line 1 creates a list containing three strings and assigns it to `skills`.\n- Line 2 reads the first item; Python indexes lists starting at `0`.\n- Line 3 appends a new string to the end of the list.\n- Line 4 prints the updated list.';
    }

    if (
      /data type|datatype|type casting|type conversion|boolean|integer|float|स्ट्रिङ|डेटा टाइप/.test(
        text,
      )
    ) {
      return asksInNepali
        ? 'Python मा सामान्य data types:\n\n```python\nstudent_name = "Sukundra"\nage = 20\nheight = 5.7\nis_student = True\n```\n\n- Line 1: `str` अर्थात् text value राख्छ।\n- Line 2: `int` अर्थात् पूर्ण संख्या राख्छ।\n- Line 3: `float` अर्थात् decimal संख्या राख्छ।\n- Line 4: `bool` अर्थात् `True` वा `False` राख्छ।'
        : 'Python has several common data types:\n\n```python\nstudent_name = "Sukundra"  # str: text\nage = 20  # int: whole number\nheight = 5.7  # float: decimal\nis_student = True  # bool: True or False\n\nprint(type(age))\n```\n\n`str` stores text, `int` stores whole numbers, `float` stores decimals, and `bool` stores `True` or `False`.';
    }

    if (/dictionary|dict\b|key.?value|शब्दकोश/.test(text)) {
      return asksInNepali
        ? 'Dictionary ले key र value जोडीमा data राख्छ:\n\n```python\nstudent = {\n    "name": "Sukundra",\n    "course": "Computer Science with AI",\n}\n\nprint(student["name"])\nstudent["year"] = 1\n```\n\nKey बाट value पढ्न सकिन्छ, र नयाँ key/value जोड्न सकिन्छ।'
        : 'A dictionary stores data as key-value pairs:\n\n```python\nstudent = {\n    "name": "Sukundra",\n    "course": "Computer Science with AI",\n}\n\nprint(student["name"])\nstudent["year"] = 1\n```\n\n- Line 1 starts a dictionary and assigns it to `student`.\n- Lines 2–3 add the `name` and `course` keys with their values; line 4 closes the dictionary.\n- Line 6 looks up and prints the value stored under `name`.\n- Line 7 adds or replaces the `year` key.';
    }

    if (/string|text|स्ट्रिङ/.test(text)) {
      return asksInNepali
        ? 'String भनेको text हो:\n\n```python\nname = "Sukundra"\ngreeting = f"Hello, {name}!"\nprint(greeting)\n```\n\n- Line 1: text लाई `name` मा राख्छ।\n- Line 2: f-string ले `name` को value greeting भित्र राख्छ।\n- Line 3: तयार भएको greeting देखाउँछ।'
        : 'A string is text in a program:\n\n```python\nname = "Sukundra"\ngreeting = f"Hello, {name}!"\nprint(greeting)\n```\n\nAn f-string inserts the value of `name` where `{name}` appears.';
    }

    if (/error|exception|try except|त्रुटि/.test(text)) {
      return asksInNepali
        ? 'Exception handling ले सम्भावित error लाई सम्हाल्छ:\n\n```python\ntry:\n    number = int("12")\n    print(number)\nexcept ValueError:\n    print("कृपया संख्या दिनुहोस्")\n```\n\n`try` मा सम्भावित error हुने code राखिन्छ र मिल्ने error आए `except` चल्छ।'
        : 'Exception handling lets a program respond to expected errors:\n\n```python\ntry:\n    number = int("12")\n    print(number)\nexcept ValueError:\n    print("Please enter a number")\n```\n\nPython runs the `try` block. If converting the value raises `ValueError`, it runs `except`.';
    }

    // Prefer accurate, short examples for frequently asked beginner topics.
    if (
      /python guide|learn python|teach.*python|python.*(basic|beginner|advanced|roadmap|guide)|पाइथन.*(गाइड|सिक|शुरु|बाट)/.test(
        text,
      )
    ) {
      return asksInNepali
        ? 'Python Basic देखि Advanced सम्म सिक्ने roadmap:\n\n1. **Basics:** print, variables, data types, input, operators\n2. **Conditions:** if, elif, else र comparison\n3. **Loops:** for, while, range, break र continue\n4. **Collections:** string, list, tuple, set र dictionary\n5. **Functions:** parameters, return, scope र recursion\n6. **OOP:** class, object, inheritance र methods\n7. **Practical Python:** errors, files, modules, packages र virtual environment\n8. **Advanced:** comprehensions, decorators, generators, iterators, testing, APIs र databases\n9. **Projects:** calculator, guessing game, to-do list, अनि एउटा सानो web/API project\n\nसुरुवातका लागि यो चलाएर हेर्नुहोस्:\n\n```python\nname = input("Your name: ")\nprint("Hello,", name)\n```\n\nपहिलो line ले नाम सोध्छ। दोस्रोले greeting देखाउँछ। हरेक topic मा code आफैँ type गरेर चलाउनुहोस्। कुन level बाट सुरु गर्ने?'
        : 'Here is a beginner-to-advanced Python roadmap:\n\n1. **Basics:** print, variables, data types, input, and operators\n2. **Conditions:** if, elif, else, and comparisons\n3. **Loops:** for, while, range, break, and continue\n4. **Collections:** strings, lists, tuples, sets, and dictionaries\n5. **Functions:** parameters, return values, scope, and recursion\n6. **OOP:** classes, objects, methods, and inheritance\n7. **Practical Python:** errors, files, modules, packages, and virtual environments\n8. **Advanced:** comprehensions, decorators, generators, iterators, tests, APIs, and databases\n9. **Projects:** calculator, guessing game, to-do list, then a small web/API project\n\nStart with this small program:\n\n```python\nname = input("Your name: ")\nprint("Hello,", name)\n```\n\nThe first line asks for a name. The second prints a greeting. Type and run each example yourself. Which level would you like to study first?';
    }

    if (/python|programming|पाइथन|प्रोग्रामिङ/.test(text)) {
      return asksInNepali
        ? "Python एउटा पढ्न सजिलो programming language हो। सिकाइको राम्रो क्रम: variables र data types, conditions, loops, lists र dictionaries, functions, OOP, exceptions, files, databases, अनि projects। कुन topic बाट सुरु गर्ने?"
        : "Python is a readable programming language. A useful learning order is variables and data types, conditions, loops, lists and dictionaries, functions, OOP, exceptions, files, databases, and projects. Which topic would you like to start with?";
    }

    if (asksForFullTheory) {
      return asksInNepali
        ? "तपाईंलाई कुन Python topic को पूरा theory चाहिन्छ? जस्तै: variables, data types, operators, strings, loops, lists, dictionaries, functions, OOP, decorators, वा asyncio। एउटा topic लेख्नुहोस्; म उपलब्ध Python guide को सम्बन्धित पूरा section देखाउँछु।"
        : "Which Python topic would you like the complete theory for? Try variables, data types, operators, strings, loops, lists, dictionaries, functions, OOP, decorators, or asyncio. Name one topic and I’ll show its matching section from the supplied Python guide.";
    }

    return asksInNepali
      ? "म SUKUNDRA AI PRO हुँ। म Python theory, उदाहरण, code को static जाँच र Sukundra को verified portfolio जानकारीमा मद्दत गर्छु। Code चलाउने सुविधा छैन। Python roadmap, variables, loops, functions, OOP, debugging वा interview practice बारे सोध्नुहोस्।"
      : "I’m SUKUNDRA AI PRO. I can explain Python topics, provide a few guided code starters, review snippets for common text-level issues, and answer verified portfolio questions. Code is not executed here. Ask about a Python topic, debugging, line-by-line explanation, or interview practice.";
  }

  async function sendMessage(rawMessage, readAloud = false, voiceOnly = false) {
    if (sending) return;

    // Ignore blank messages and show a notice for unusually long questions.
    const message = rawMessage.trim();
    if (!message) return;
    if (message.length > maxMessageLength) {
      if (voiceOnly) {
        voiceStatus.textContent = "Please keep the voice question shorter and try again.";
      } else {
        showError(`Please keep your message under ${maxMessageLength} characters.`);
      }
      return;
    }

    if (!voiceOnly) {
      const userMessage = {
        role: "user",
        content: message,
        timestamp: new Date().toISOString(),
      };
      conversation.push(userMessage);
      conversation = conversation.slice(-maxStoredMessages);
      saveConversation();

      if (conversation.length === 1) messagesElement.replaceChildren();
      appendMessage(userMessage);
      input.value = "";
      input.style.height = "";
    }

    // Keep the controls disabled while the browser prepares an answer.
    sending = true;
    showTyping(true);
    requestAiReply(message, readAloud, voiceOnly);
  }

  function openPanel() {
    window.clearTimeout(closeTimer);
    panel.hidden = false;
    launcher.setAttribute("aria-expanded", "true");
    window.requestAnimationFrame(() => panel.classList.add("is-open"));
    input.focus();
    scrollToLatest();
  }

  if (window.location.hash === "#sukundra-ai") {
    openPanel();
  }

  window.addEventListener("hashchange", () => {
    if (window.location.hash === "#sukundra-ai" && !panel.classList.contains("is-open")) {
      openPanel();
    }
  });

  // Hide the chat after its closing animation finishes.
  function closePanel() {
    if (panel.classList.contains("is-listening")) voiceRecognition?.stop();
    if (window.speechSynthesis?.speaking) window.speechSynthesis.cancel();
    panel.classList.remove("is-speaking");
    panel.classList.remove("is-open", "is-maximized");
    launcher.setAttribute("aria-expanded", "false");
    closeTimer = window.setTimeout(() => {
      if (!panel.classList.contains("is-open")) panel.hidden = true;
    }, 190);
    launcher.focus();
  }

  // Connect the visible buttons and keyboard shortcuts to their actions.
  launcher.addEventListener("click", () => {
    if (!panel.classList.contains("is-open")) openPanel();
    else {
      closePanel();
    }
  });
  const minimizeButton = panel.querySelector("[data-chat-minimize]");
  const closeButton = panel.querySelector("[data-chat-close]");
  const maximizeButton = panel.querySelector("[data-chat-maximize]");
  const clearButton = panel.querySelector("[data-chat-clear]");

  minimizeButton.addEventListener("click", closePanel);
  closeButton.addEventListener("click", closePanel);
  maximizeButton.addEventListener("click", () => {
    panel.classList.toggle("is-maximized");
    const maximized = panel.classList.contains("is-maximized");
    const buttonLabel = maximized ? "Restore chat size" : "Maximize chat";
    const buttonTitle = maximized ? "Restore size" : "Maximize";

    maximizeButton.setAttribute("aria-label", buttonLabel);
    maximizeButton.title = buttonTitle;
  });
  clearButton.addEventListener("click", () => {
    conversation = [];
    saveConversation();
    renderConversation();
    activityList.replaceChildren();
    logActivity("Workspace ready", "complete");
    logActivity("Waiting for a question", "pending");
  });

  panel.querySelectorAll("[data-chat-prompt]").forEach((button) => {
    button.addEventListener("click", () => {
      panel.querySelectorAll("[data-chat-prompt]").forEach((item) => {
        const selected = item === button;
        item.classList.toggle("is-active", selected);
        item.setAttribute("aria-pressed", String(selected));
      });
      sendMessage(button.dataset.chatPrompt);
    });
  });

  // Send the message when the visitor submits the form.
  form.addEventListener("submit", (event) => {
    event.preventDefault();
    sendMessage(input.value);
  });

  // Enter sends a message; Shift + Enter adds a new line.
  input.addEventListener("keydown", (event) => {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      form.requestSubmit();
    }
  });

  // Grow the input until it reaches its CSS height limit.
  input.addEventListener("input", () => {
    input.style.height = "auto";
    input.style.height = `${Math.min(input.scrollHeight, 120)}px`;
  });

  // Escape closes the chat window.
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && !panel.hidden) closePanel();
  });

  // Show the saved conversation or the welcome screen on page load.
  setupVoiceInput();
  renderConversation();
  setStatus("Browser Q&A · Ready", "online");
  if (!historyAvailable) setStatus("Chat history unavailable in this browser session", "error");
})();
