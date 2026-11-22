const app = document.querySelector("[data-nexora-app]");

if (app) {
  const historyList = app.querySelector("[data-chat-history]");
  const historyEmpty = app.querySelector("[data-history-empty]");
  const emptyState = app.querySelector("[data-empty-state]");
  const chatThread = app.querySelector("[data-chat-thread]");
  const composer = app.querySelector("[data-composer]");
  const promptInput = app.querySelector("[data-prompt]");
  const sendButton = app.querySelector("[data-send]");
  const attachButton = app.querySelector("[data-attach]");
  const voiceButton = app.querySelector("[data-voice-input]");
  const imageInput = app.querySelector("[data-image-input]");
  const attachmentPreview = app.querySelector("[data-attachment-preview]");
  const clearButton = app.querySelector("[data-clear-chat]");
  const apiStatus = app.querySelector("[data-api-status]");
  const apiStatusLabel = app.querySelector("[data-api-status-label]");
  const toast = app.querySelector("[data-toast]");
  const editingIndicator = app.querySelector("[data-editing-indicator]");
  const sidebarBackdrop = app.querySelector("[data-sidebar-backdrop]");
  const themeToggle = app.querySelector("[data-theme-toggle]");
  const themeLabel = app.querySelector("[data-theme-label]");
  const storageKey = "nexora-ai-conversations-v1";
  const themeStorageKey = "nexora-ai-theme";
  const maxImageBytes = 4 * 1024 * 1024;
  const maxHistoryMessages = 20;
  const configuredApiBase =
    document.querySelector('meta[name="nexora-api-base-url"]')?.content.trim() || "";
  const isLocalStaticServer =
    ["localhost", "127.0.0.1"].includes(window.location.hostname) &&
    window.location.port !== "8888";
  const apiBase = (
    configuredApiBase || (isLocalStaticServer ? "http://localhost:3000" : "")
  ).replace(/\/+$/, "");

  let conversations = loadConversations();
  let activeConversationId = conversations[0]?.id || "";
  let pendingImage = null;
  let editingMessageId = "";
  let isSending = false;
  let voiceRecognition = null;
  let isVoiceActive = false;
  let voiceDraft = "";
  let requestError = "";
  let toastTimeout = 0;

  if (!activeConversationId) {
    createConversation(false);
  } else {
    render();
  }

  applySavedTheme();
  checkBackend();
  initializeVoiceInput();

  function makeId() {
    return (
      globalThis.crypto?.randomUUID?.() || `${Date.now()}-${Math.random().toString(16).slice(2)}`
    );
  }

  function showToast(message) {
    toast.textContent = message;
    toast.classList.add("is-visible");
    window.clearTimeout(toastTimeout);
    toastTimeout = window.setTimeout(() => toast.classList.remove("is-visible"), 3600);
  }

  function loadConversations() {
    try {
      const saved = JSON.parse(window.localStorage.getItem(storageKey) || "[]");
      if (!Array.isArray(saved)) {
        throw new TypeError("Saved conversations are not a list.");
      }

      return saved
        .filter(
          (conversation) =>
            conversation &&
            typeof conversation.id === "string" &&
            typeof conversation.title === "string" &&
            Array.isArray(conversation.messages),
        )
        .map((conversation) => ({
          id: conversation.id,
          title: conversation.title,
          updatedAt: Number.isFinite(conversation.updatedAt) ? conversation.updatedAt : 0,
          messages: conversation.messages
            .filter(
              (message) =>
                message &&
                (message.role === "user" || message.role === "assistant") &&
                typeof message.content === "string",
            )
            .map((message) => ({
              id: typeof message.id === "string" ? message.id : makeId(),
              role: message.role,
              content: message.content,
              imageName: typeof message.imageName === "string" ? message.imageName : "",
            })),
        }))
        .sort((left, right) => (right.updatedAt || 0) - (left.updatedAt || 0));
    } catch (error) {
      console.error("Could not restore Nexora AI conversation history.", error);
      window.setTimeout(
        () => showToast("Saved chat history could not be read. You can continue with a new chat."),
        0,
      );
      return [];
    }
  }

  function persistConversations() {
    try {
      const saved = conversations.map((conversation) => ({
        id: conversation.id,
        title: conversation.title,
        updatedAt: conversation.updatedAt || Date.now(),
        messages: conversation.messages.map((message) => ({
          id: message.id,
          role: message.role,
          content: message.content,
          imageName: message.imageName || "",
        })),
      }));
      window.localStorage.setItem(storageKey, JSON.stringify(saved));
      return true;
    } catch (error) {
      console.error("Could not save Nexora AI conversation history.", error);
      showToast("Chat is available, but this conversation could not be saved in this browser.");
      return false;
    }
  }

  function currentConversation() {
    return conversations.find((conversation) => conversation.id === activeConversationId) || null;
  }

  function createConversation(focusPrompt = true) {
    promptInput.value = "";
    resizePrompt();
    clearPendingImage();
    const conversation = {
      id: makeId(),
      title: "New conversation",
      messages: [],
      updatedAt: Date.now(),
    };
    conversations.unshift(conversation);
    activeConversationId = conversation.id;
    requestError = "";
    exitEditMode();
    persistConversations();
    render();
    closeSidebar();
    if (focusPrompt) promptInput.focus();
  }

  function activateConversation(id) {
    if (!conversations.some((conversation) => conversation.id === id)) return;
    activeConversationId = id;
    requestError = "";
    exitEditMode();
    render();
    closeSidebar();
  }

  function render() {
    renderHistory();
    renderMessages();
  }

  function renderHistory() {
    historyList.replaceChildren();
    historyEmpty.hidden = conversations.length > 0;

    conversations.forEach((conversation) => {
      const button = document.createElement("button");
      button.type = "button";
      button.className = "nexora-history-item";
      button.setAttribute("aria-current", String(conversation.id === activeConversationId));
      button.title = conversation.title;

      const icon = document.createElementNS("http://www.w3.org/2000/svg", "svg");
      icon.setAttribute("viewBox", "0 0 24 24");
      icon.setAttribute("aria-hidden", "true");
      const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
      path.setAttribute("d", "M4 5h16v12H8l-4 3V5Z");
      icon.append(path);

      const label = document.createElement("span");
      label.textContent = conversation.title;
      button.append(icon, label);
      button.addEventListener("click", () => activateConversation(conversation.id));
      historyList.append(button);
    });
  }

  function renderMessages() {
    const conversation = currentConversation();
    const hasMessages = Boolean(conversation?.messages.length);
    emptyState.hidden = hasMessages;
    chatThread.hidden = !hasMessages;
    clearButton.disabled = !hasMessages || isSending;

    if (!hasMessages) {
      chatThread.replaceChildren();
      return;
    }

    const list = document.createElement("div");
    list.className = "nexora-message-list";

    conversation.messages.forEach((message, index) => {
      list.append(renderMessage(message, index, conversation.messages));
    });

    if (isSending) {
      list.append(renderTypingIndicator());
    }

    if (requestError) {
      list.append(renderRequestError(requestError));
    }

    chatThread.replaceChildren(list);
    requestAnimationFrame(() => {
      chatThread.scrollTop = chatThread.scrollHeight;
    });
  }

  function renderMessage(message, index, messages) {
    const article = document.createElement("article");
    article.className = "nexora-message";
    article.dataset.role = message.role;
    article.dataset.messageId = message.id;

    const avatar = document.createElement("div");
    avatar.className = "nexora-message-avatar";
    avatar.setAttribute("aria-hidden", "true");
    avatar.textContent = message.role === "assistant" ? "N" : "Y";

    const body = document.createElement("div");
    body.className = "nexora-message-body";

    const heading = document.createElement("div");
    heading.className = "nexora-message-heading";
    heading.textContent = message.role === "assistant" ? "Nexora AI" : "You";
    body.append(heading);

    const content = document.createElement("div");
    content.className = "nexora-message-content";

    if (message.imageDataUrl) {
      const image = document.createElement("img");
      image.className = "nexora-message-image";
      image.src = message.imageDataUrl;
      image.alt = message.imageName ? `Attached image: ${message.imageName}` : "Attached image";
      content.append(image);
    } else if (message.imageName) {
      const imageNote = document.createElement("p");
      imageNote.className = "nexora-image-not-saved";
      imageNote.textContent = `Image attachment “${message.imageName}” is not stored in local chat history.`;
      content.append(imageNote);
    }

    if (message.role === "assistant") {
      renderMarkdown(message.content, content);
    } else {
      const paragraph = document.createElement("p");
      paragraph.textContent = message.content;
      content.append(paragraph);
    }

    body.append(content);

    const actions = document.createElement("div");
    actions.className = "nexora-message-actions";

    if (message.role === "assistant") {
      actions.append(
        createActionButton("Copy", "copy-message", message.id),
        createActionButton("Regenerate", "regenerate", message.id, index !== messages.length - 1),
      );
    } else {
      actions.append(createActionButton("Edit", "edit-message", message.id));
    }

    body.append(actions);
    article.append(avatar, body);
    return article;
  }

  function createActionButton(label, action, id, disabled = false) {
    const button = document.createElement("button");
    button.type = "button";
    button.dataset.action = action;
    button.dataset.messageId = id;
    button.textContent = label;
    button.disabled = disabled || isSending;
    return button;
  }

  function renderTypingIndicator() {
    const article = document.createElement("article");
    article.className = "nexora-message";
    article.dataset.role = "assistant";

    const avatar = document.createElement("div");
    avatar.className = "nexora-message-avatar";
    avatar.setAttribute("aria-hidden", "true");
    avatar.textContent = "N";

    const body = document.createElement("div");
    body.className = "nexora-message-body";
    const heading = document.createElement("div");
    heading.className = "nexora-message-heading";
    heading.textContent = "Nexora AI";
    const indicator = document.createElement("div");
    indicator.className = "nexora-loading-indicator";
    indicator.setAttribute("aria-label", "Nexora AI is generating a response");
    for (let dot = 0; dot < 3; dot += 1) indicator.append(document.createElement("i"));
    body.append(heading, indicator);
    article.append(avatar, body);
    return article;
  }

  function renderRequestError(message) {
    const container = document.createElement("div");
    container.className = "nexora-error-message";
    container.setAttribute("role", "alert");
    const text = document.createElement("span");
    text.textContent = message;
    const retry = document.createElement("button");
    retry.type = "button";
    retry.dataset.action = "retry";
    retry.textContent = "Retry";
    container.append(text, retry);
    return container;
  }

  function renderMarkdown(markdown, container) {
    const lines = markdown.replace(/\r\n?/g, "\n").split("\n");
    let index = 0;

    while (index < lines.length) {
      const line = lines[index];
      if (!line.trim()) {
        index += 1;
        continue;
      }

      const fence = line.match(/^```([\w.+-]*)\s*$/);
      if (fence) {
        const codeLines = [];
        index += 1;
        while (index < lines.length && !/^```\s*$/.test(lines[index])) {
          codeLines.push(lines[index]);
          index += 1;
        }
        if (index < lines.length) index += 1;
        container.append(createCodeBlock(codeLines.join("\n"), fence[1]));
        continue;
      }

      const heading = line.match(/^(#{1,3})\s+(.+)$/);
      if (heading) {
        const node = document.createElement(`h${heading[1].length}`);
        appendInlineMarkdown(node, heading[2]);
        container.append(node);
        index += 1;
        continue;
      }

      if (/^\s*[-*+]\s+/.test(line)) {
        const list = document.createElement("ul");
        while (index < lines.length && /^\s*[-*+]\s+/.test(lines[index])) {
          const item = document.createElement("li");
          appendInlineMarkdown(item, lines[index].replace(/^\s*[-*+]\s+/, ""));
          list.append(item);
          index += 1;
        }
        container.append(list);
        continue;
      }

      if (/^\s*\d+[.)]\s+/.test(line)) {
        const list = document.createElement("ol");
        while (index < lines.length && /^\s*\d+[.)]\s+/.test(lines[index])) {
          const item = document.createElement("li");
          appendInlineMarkdown(item, lines[index].replace(/^\s*\d+[.)]\s+/, ""));
          list.append(item);
          index += 1;
        }
        container.append(list);
        continue;
      }

      if (/^\s*>\s?/.test(line)) {
        const quote = document.createElement("blockquote");
        while (index < lines.length && /^\s*>\s?/.test(lines[index])) {
          const paragraph = document.createElement("p");
          appendInlineMarkdown(paragraph, lines[index].replace(/^\s*>\s?/, ""));
          quote.append(paragraph);
          index += 1;
        }
        container.append(quote);
        continue;
      }

      const paragraphLines = [line];
      index += 1;
      while (
        index < lines.length &&
        lines[index].trim() &&
        !/^```/.test(lines[index]) &&
        !/^(#{1,3})\s+/.test(lines[index]) &&
        !/^\s*[-*+]\s+/.test(lines[index]) &&
        !/^\s*\d+[.)]\s+/.test(lines[index]) &&
        !/^\s*>\s?/.test(lines[index])
      ) {
        paragraphLines.push(lines[index]);
        index += 1;
      }
      const paragraph = document.createElement("p");
      paragraphLines.forEach((part, partIndex) => {
        if (partIndex) paragraph.append(document.createElement("br"));
        appendInlineMarkdown(paragraph, part);
      });
      container.append(paragraph);
    }
  }

  function appendInlineMarkdown(container, text) {
    const pattern =
      /(`[^`\n]+`|\*\*[^*\n]+\*\*|__[^_\n]+__|\*[^*\n]+\*|_[^_\n]+_|\[([^\]]+)\]\(([^)\s]+)(?:\s+"([^"]*)")?\))/g;
    let lastIndex = 0;
    let match;

    while ((match = pattern.exec(text))) {
      container.append(document.createTextNode(text.slice(lastIndex, match.index)));
      const token = match[0];
      let node;

      if (token.startsWith("`")) {
        node = document.createElement("code");
        node.textContent = token.slice(1, -1);
      } else if (token.startsWith("**") || token.startsWith("__")) {
        node = document.createElement("strong");
        node.textContent = token.slice(2, -2);
      } else if (token.startsWith("*") || token.startsWith("_")) {
        node = document.createElement("em");
        node.textContent = token.slice(1, -1);
      } else {
        const link = safeLink(match[3]);
        if (!link) {
          container.append(document.createTextNode(token));
          lastIndex = pattern.lastIndex;
          continue;
        }
        node = document.createElement("a");
        node.href = link;
        node.target = "_blank";
        node.rel = "noopener noreferrer";
        node.textContent = match[2];
        if (match[4]) node.title = match[4];
      }

      container.append(node);
      lastIndex = pattern.lastIndex;
    }

    container.append(document.createTextNode(text.slice(lastIndex)));
  }

  function safeLink(value) {
    try {
      const url = new URL(value, window.location.origin);
      return ["http:", "https:", "mailto:"].includes(url.protocol) ? url.href : "";
    } catch {
      return "";
    }
  }

  function createCodeBlock(source, language) {
    const wrapper = document.createElement("div");
    wrapper.className = "nexora-code-block";

    const header = document.createElement("div");
    header.className = "nexora-code-block-header";
    const languageLabel = document.createElement("span");
    languageLabel.textContent = language || "code";
    const copy = document.createElement("button");
    copy.type = "button";
    copy.dataset.action = "copy-code";
    copy.textContent = "Copy code";
    header.append(languageLabel, copy);

    const pre = document.createElement("pre");
    const code = document.createElement("code");
    appendHighlightedCode(code, source, language);
    pre.append(code);
    wrapper.append(header, pre);
    return wrapper;
  }

  function appendHighlightedCode(container, source, language = "") {
    const keywords =
      /^(?:const|let|var|function|return|if|else|for|while|class|new|import|from|export|default|async|await|try|catch|throw|true|false|null|undefined|def|elif|in|not|and|or|None|self|print|pass|with|as|yield|public|private|static|void|int|string|boolean)$/;
    const tokenizer =
      /(\/\/[^\n]*|#[^\n]*|\/\*[\s\S]*?\*\/)|("(?:\\.|[^"\\])*"|'(?:\\.|[^'\\])*'|`(?:\\.|[^`\\])*`)|\b(?:\d+(?:\.\d+)?|[A-Za-z_$][\w$]*)\b/g;
    let lastIndex = 0;
    let match;
    const lowerLanguage = language.toLowerCase();

    while ((match = tokenizer.exec(source))) {
      container.append(document.createTextNode(source.slice(lastIndex, match.index)));
      const span = document.createElement("span");
      const token = match[0];
      if (match[1]) {
        span.className = "nexora-token-comment";
      } else if (match[2]) {
        span.className = "nexora-token-string";
      } else if (/^\d/.test(token)) {
        span.className = "nexora-token-number";
      } else if (keywords.test(token) && (!lowerLanguage || lowerLanguage !== "text")) {
        span.className = "nexora-token-keyword";
      }
      span.textContent = token;
      container.append(span);
      lastIndex = tokenizer.lastIndex;
    }
    container.append(document.createTextNode(source.slice(lastIndex)));
  }

  function renderAttachmentPreview() {
    attachmentPreview.replaceChildren();
    attachmentPreview.hidden = !pendingImage;
    if (!pendingImage) return;

    const image = document.createElement("img");
    image.src = pendingImage.objectUrl;
    image.alt = `Preview of ${pendingImage.name}`;
    const name = document.createElement("span");
    name.textContent = pendingImage.name;
    const remove = document.createElement("button");
    remove.type = "button";
    remove.setAttribute("aria-label", "Remove attached image");
    remove.textContent = "×";
    remove.addEventListener("click", clearPendingImage);
    attachmentPreview.append(image, name, remove);
  }

  function clearPendingImage() {
    if (pendingImage?.objectUrl) URL.revokeObjectURL(pendingImage.objectUrl);
    pendingImage = null;
    imageInput.value = "";
    renderAttachmentPreview();
  }

  function readFileAsDataUrl(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.addEventListener("load", () => resolve(String(reader.result)));
      reader.addEventListener("error", () =>
        reject(reader.error || new Error("Image could not be read.")),
      );
      reader.readAsDataURL(file);
    });
  }

  function updateApiStatus(state, label) {
    apiStatus.dataset.state = state;
    apiStatusLabel.textContent = label;
    apiStatus.title = label;
  }

  async function checkBackend() {
    updateApiStatus("checking", "Checking secure backend…");
    try {
      const response = await fetch(`${apiBase}/api/health`, { cache: "no-store" });
      if (!response.ok) throw new Error(`Backend health check returned ${response.status}.`);
      const status = await response.json();
      if (status.configured) {
        updateApiStatus("connected", "Secure AI backend connected");
      } else {
        updateApiStatus("unconfigured", "Backend needs an API key");
      }
    } catch (error) {
      console.warn("Nexora AI backend is not available.", error);
      updateApiStatus("offline", "Backend offline — start Nexora API");
    }
  }

  async function submitPrompt(event) {
    event.preventDefault();
    if (isSending) return;

    const text = promptInput.value.trim();
    if (!text && !pendingImage) {
      promptInput.focus();
      return;
    }

    let conversation = currentConversation();
    if (!conversation) {
      createConversation();
      conversation = currentConversation();
    }

    const editedMessage = editingMessageId
      ? conversation.messages.find((message) => message.id === editingMessageId)
      : null;
    const message = {
      id: makeId(),
      role: "user",
      content: text || "Please describe this image.",
      imageDataUrl: pendingImage?.dataUrl || editedMessage?.imageDataUrl || "",
      imageName: pendingImage?.name || editedMessage?.imageName || "",
    };

    if (editingMessageId) {
      const editIndex = conversation.messages.findIndex((item) => item.id === editingMessageId);
      if (editIndex >= 0) conversation.messages = conversation.messages.slice(0, editIndex);
      conversation.messages.push(message);
      exitEditMode();
    } else {
      conversation.messages.push(message);
    }

    if (conversation.messages.filter((item) => item.role === "user").length === 1) {
      conversation.title = (message.content || "Image question").replace(/\s+/g, " ").slice(0, 42);
      if (message.content.length > 42) conversation.title = `${conversation.title.trimEnd()}…`;
    }

    conversation.updatedAt = Date.now();
    conversations = [conversation, ...conversations.filter((item) => item.id !== conversation.id)];
    promptInput.value = "";
    resizePrompt();
    clearPendingImage();
    requestError = "";
    persistConversations();
    render();
    await requestAssistantReply(conversation);
  }

  async function requestAssistantReply(conversation) {
    if (!conversation?.messages.length || isSending) return;
    isSending = true;
    requestError = "";
    updateApiStatus("checking", "Waiting for AI response…");
    renderMessages();
    updateComposerState();

    try {
      const recentMessages = conversation.messages.slice(-maxHistoryMessages);
      let latestImageIndex = -1;
      recentMessages.forEach((message, index) => {
        if (message.imageDataUrl) latestImageIndex = index;
      });
      const messages = recentMessages.map((message, index) => ({
        role: message.role,
        content: message.content,
        ...(index === latestImageIndex ? { image: message.imageDataUrl } : {}),
      }));
      const response = await fetch(`${apiBase}/api/chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages }),
      });
      const result = await response.json();
      if (!response.ok) {
        throw new Error(result.error || `The AI service returned status ${response.status}.`);
      }
      if (typeof result.reply !== "string" || !result.reply.trim()) {
        throw new Error("The AI service returned an empty response.");
      }

      conversation.messages.push({
        id: makeId(),
        role: "assistant",
        content: result.reply,
      });
      conversation.updatedAt = Date.now();
      conversations = [
        conversation,
        ...conversations.filter((item) => item.id !== conversation.id),
      ];
      persistConversations();
      updateApiStatus("connected", "Secure AI backend connected");
    } catch (error) {
      console.error("Nexora AI could not get a response from its backend.", error);
      requestError =
        error instanceof TypeError
          ? "Could not reach the Nexora backend. Start the server and check its address."
          : error.message ||
            "The AI request failed. Check the backend configuration and try again.";
      updateApiStatus("offline", "AI request failed — check backend");
    } finally {
      isSending = false;
      updateComposerState();
      render();
    }
  }

  function updateComposerState() {
    sendButton.disabled = isSending;
    attachButton.disabled = isSending;
    promptInput.disabled = isSending;
    sendButton.setAttribute("aria-label", isSending ? "Waiting for response" : "Send message");
    clearButton.disabled = isSending || !currentConversation()?.messages.length;
  }

  function clearConversation() {
    const conversation = currentConversation();
    if (!conversation || isSending) return;
    conversation.messages = [];
    conversation.title = "New conversation";
    conversation.updatedAt = Date.now();
    promptInput.value = "";
    resizePrompt();
    clearPendingImage();
    requestError = "";
    exitEditMode();
    persistConversations();
    render();
    showToast("Conversation cleared.");
    promptInput.focus();
  }

  function enterEditMode(messageId) {
    const message = currentConversation()?.messages.find((item) => item.id === messageId);
    if (!message || message.role !== "user" || isSending) return;
    editingMessageId = message.id;
    promptInput.value = message.content;
    resizePrompt();
    editingIndicator.hidden = false;
    promptInput.focus();
  }

  function exitEditMode() {
    editingMessageId = "";
    editingIndicator.hidden = true;
  }

  function regenerate(messageId) {
    const conversation = currentConversation();
    const assistantIndex =
      conversation?.messages.findIndex((message) => message.id === messageId) ?? -1;
    if (!conversation || assistantIndex < 0 || isSending) return;
    let userIndex = -1;
    for (let index = assistantIndex - 1; index >= 0; index -= 1) {
      if (conversation.messages[index].role === "user") {
        userIndex = index;
        break;
      }
    }
    if (userIndex < 0) return;
    conversation.messages = conversation.messages.slice(0, userIndex + 1);
    requestError = "";
    persistConversations();
    render();
    requestAssistantReply(conversation);
  }

  async function copyText(text) {
    try {
      await navigator.clipboard.writeText(text);
      showToast("Copied to clipboard.");
    } catch (error) {
      console.error("Could not copy Nexora AI content.", error);
      showToast("Clipboard access failed. Select and copy the text manually.");
    }
  }

  function applySavedTheme() {
    let theme = "dark";
    try {
      theme = window.localStorage.getItem(themeStorageKey) || "dark";
    } catch (error) {
      console.error("Could not read the Nexora AI theme preference.", error);
      showToast("Theme preference could not be read; using the dark appearance.");
    }
    setTheme(theme === "light" ? "light" : "dark", false);
  }

  function setTheme(theme, save = true) {
    document.body.dataset.theme = theme;
    themeLabel.textContent = theme === "light" ? "Dark appearance" : "Light appearance";
    themeToggle.setAttribute(
      "aria-label",
      `Switch to ${theme === "light" ? "dark" : "light"} appearance`,
    );
    if (!save) return;
    try {
      window.localStorage.setItem(themeStorageKey, theme);
    } catch (error) {
      console.error("Could not save the Nexora AI theme preference.", error);
      showToast("Appearance changed, but the preference could not be saved.");
    }
  }

  function resizePrompt() {
    promptInput.style.height = "auto";
    promptInput.style.height = `${Math.min(promptInput.scrollHeight, 180)}px`;
  }

  function initializeVoiceInput() {
    const Recognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!Recognition) {
      voiceButton.disabled = true;
      voiceButton.setAttribute("aria-label", "Voice input is not supported in this browser");
      voiceButton.title = "Voice input is not supported in this browser";
      return;
    }

    voiceRecognition = new Recognition();
    voiceRecognition.lang = navigator.language || document.documentElement.lang || "en-US";
    voiceRecognition.continuous = false;
    voiceRecognition.interimResults = true;
    voiceRecognition.maxAlternatives = 1;
    voiceRecognition.addEventListener("result", (event) => {
      const transcript = Array.from(event.results, (result) => result[0]?.transcript || "")
        .join("")
        .trim();
      if (!transcript) return;

      promptInput.value = [voiceDraft, transcript].filter(Boolean).join(" ");
      resizePrompt();
    });
    voiceRecognition.addEventListener("error", (event) => {
      if (event.error === "aborted") return;
      const errorMessages = {
        "audio-capture": "No microphone was found. Connect a microphone and try again.",
        "not-allowed":
          "Microphone permission was denied. Allow microphone access to use voice input.",
        "service-not-allowed":
          "Microphone permission was denied. Allow microphone access to use voice input.",
        "no-speech": "No speech was detected. Try voice input again.",
        network: "The speech service is unavailable. Check your connection and try again.",
      };
      console.warn("Nexora voice input failed.", event.error);
      showToast(errorMessages[event.error] || "Voice input failed. Please try again.");
    });
    voiceRecognition.addEventListener("end", () => setVoiceInputActive(false));

    voiceButton.addEventListener("click", () => {
      if (isVoiceActive) {
        try {
          voiceRecognition.stop();
        } catch (error) {
          setVoiceInputActive(false);
          console.error("Could not stop Nexora voice input.", error);
          showToast("Voice input could not be stopped. Please try again.");
        }
        return;
      }

      voiceDraft = promptInput.value.trim();
      setVoiceInputActive(true);
      try {
        voiceRecognition.start();
      } catch (error) {
        setVoiceInputActive(false);
        console.error("Could not start Nexora voice input.", error);
        showToast("Voice input could not be started. Please try again.");
      }
    });

    window.addEventListener("pagehide", () => {
      if (isVoiceActive) voiceRecognition.abort();
    });

    function setVoiceInputActive(active) {
      isVoiceActive = active;
      voiceButton.classList.toggle("is-listening", active);
      voiceButton.setAttribute("aria-pressed", String(active));
      const label = active ? "Stop voice input" : "Start voice input";
      voiceButton.setAttribute("aria-label", label);
      voiceButton.title = label;
    }
  }

  function openSidebar() {
    app.classList.add("is-sidebar-open");
    sidebarBackdrop.hidden = false;
    app.querySelector("[data-sidebar-toggle]").setAttribute("aria-expanded", "true");
  }

  function closeSidebar() {
    app.classList.remove("is-sidebar-open");
    sidebarBackdrop.hidden = true;
    app.querySelector("[data-sidebar-toggle]").setAttribute("aria-expanded", "false");
  }

  composer.addEventListener("submit", submitPrompt);
  promptInput.addEventListener("input", resizePrompt);
  promptInput.addEventListener("keydown", (event) => {
    if (event.key === "Enter" && !event.shiftKey && !event.isComposing) {
      event.preventDefault();
      composer.requestSubmit();
    }
  });

  app.querySelectorAll("[data-new-chat]").forEach((button) => {
    button.addEventListener("click", createConversation);
  });
  app.querySelector("[data-clear-chat]").addEventListener("click", clearConversation);
  app.querySelector("[data-get-started]").addEventListener("click", () => promptInput.focus());
  app.querySelector("[data-attach]").addEventListener("click", () => imageInput.click());
  app.querySelector("[data-sidebar-toggle]").addEventListener("click", () => {
    if (app.classList.contains("is-sidebar-open")) closeSidebar();
    else openSidebar();
  });
  sidebarBackdrop.addEventListener("click", closeSidebar);
  themeToggle.addEventListener("click", () => {
    setTheme(document.body.dataset.theme === "light" ? "dark" : "light");
  });
  app.querySelector("[data-cancel-edit]").addEventListener("click", () => {
    exitEditMode();
    promptInput.value = "";
    resizePrompt();
    promptInput.focus();
  });

  app.querySelectorAll("[data-suggestion]").forEach((button) => {
    button.addEventListener("click", () => {
      promptInput.value = button.dataset.suggestion;
      resizePrompt();
      promptInput.focus();
    });
  });

  imageInput.addEventListener("change", async () => {
    const file = imageInput.files?.[0];
    if (!file) return;
    if (!["image/jpeg", "image/png", "image/webp", "image/gif"].includes(file.type)) {
      showToast("Choose a JPEG, PNG, WebP, or GIF image.");
      imageInput.value = "";
      return;
    }
    if (file.size > maxImageBytes) {
      showToast("Images must be 4 MB or smaller.");
      imageInput.value = "";
      return;
    }

    try {
      clearPendingImage();
      pendingImage = {
        name: file.name,
        dataUrl: await readFileAsDataUrl(file),
        objectUrl: URL.createObjectURL(file),
      };
      renderAttachmentPreview();
      promptInput.focus();
    } catch (error) {
      console.error("Could not load the selected Nexora AI image.", error);
      showToast("The selected image could not be read.");
      imageInput.value = "";
    }
  });

  chatThread.addEventListener("click", async (event) => {
    const button = event.target.closest("[data-action]");
    if (!button || isSending) return;
    const { action, messageId } = button.dataset;

    if (action === "retry") {
      requestError = "";
      requestAssistantReply(currentConversation());
      return;
    }
    if (action === "edit-message") {
      enterEditMode(messageId);
      return;
    }
    if (action === "regenerate") {
      regenerate(messageId);
      return;
    }
    if (action === "copy-message") {
      const message = currentConversation()?.messages.find((item) => item.id === messageId);
      if (message) await copyText(message.content);
      return;
    }
    if (action === "copy-code") {
      const code = button.closest(".nexora-code-block")?.querySelector("pre code")?.textContent;
      if (code) await copyText(code);
    }
  });

  document.addEventListener("keydown", (event) => {
    if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === "k") {
      event.preventDefault();
      createConversation();
    }
    if (event.key === "Escape" && app.classList.contains("is-sidebar-open")) closeSidebar();
  });
}
