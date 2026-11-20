document.addEventListener("DOMContentLoaded", () => {
  const totalQuestions = 600;
  const durationMs = 300 * 60 * 1000;
  const passThreshold = 60;
  const storageKey = "pythonIntermediateQuiz:v2";
  const letters = ["A", "B", "C", "D"];
  const questions = window.PYTHON_MCQ_QUESTIONS;
  const $ = (selector) => document.querySelector(selector);
  const intro = $("#quiz-intro");
  const workspace = $("#quiz-workspace");
  const results = $("#quiz-results");
  const dataError = $("#quiz-data-error");
  const storageNotice = $("#quiz-storage-notice");
  const answerOptions = $("#answer-options");
  const questionGrid = $("#question-number-grid");
  const submitDialog = $("#submit-dialog");
  const restartDialog = $("#restart-dialog");
  const answerLegend = answerOptions.querySelector("legend");
  let timerInterval = null;
  let activeReviewFilter = "all";
  let state = createFreshState();

  function createFreshState() {
    return {
      version: 2,
      started: false,
      startedAt: null,
      deadlineAt: null,
      currentIndex: 0,
      answers: Array(totalQuestions).fill(null),
      submitted: false,
      finishedAt: null,
    };
  }

  function isValidQuestion(item) {
    return (
      item &&
      typeof item.topic === "string" &&
      typeof item.question === "string" &&
      typeof item.explanation === "string" &&
      Array.isArray(item.options) &&
      item.options.length === 4 &&
      item.options.every((option) => typeof option === "string") &&
      Number.isInteger(item.answerIndex) &&
      item.answerIndex >= 0 &&
      item.answerIndex < 4
    );
  }

  function isValidSavedState(saved) {
    return (
      saved &&
      saved.version === 2 &&
      saved.started === true &&
      Number.isFinite(saved.startedAt) &&
      Number.isFinite(saved.deadlineAt) &&
      saved.deadlineAt - saved.startedAt === durationMs &&
      Number.isInteger(saved.currentIndex) &&
      saved.currentIndex >= 0 &&
      saved.currentIndex < totalQuestions &&
      Array.isArray(saved.answers) &&
      saved.answers.length === totalQuestions &&
      saved.answers.every(
        (answer) => answer === null || (Number.isInteger(answer) && answer >= 0 && answer < 4),
      ) &&
      typeof saved.submitted === "boolean" &&
      (!saved.submitted || Number.isFinite(saved.finishedAt))
    );
  }

  function showStorageNotice(message) {
    storageNotice.textContent = message;
    storageNotice.hidden = false;
  }

  function saveProgress() {
    try {
      localStorage.setItem(storageKey, JSON.stringify(state));
    } catch (error) {
      console.error("Could not save Python quiz progress.", error);
      showStorageNotice(
        "Progress is available for this visit, but this browser could not save it.",
      );
    }
  }

  function loadSavedProgress() {
    let savedValue;
    try {
      savedValue = localStorage.getItem(storageKey);
    } catch (error) {
      console.error("Could not read Python quiz progress.", error);
      showStorageNotice(
        "Progress saving is unavailable in this browser. You can still take the quiz.",
      );
      return null;
    }
    if (!savedValue) return null;

    try {
      const saved = JSON.parse(savedValue);
      if (isValidSavedState(saved)) return saved;
      console.error("Saved Python quiz progress has an invalid format.");
      showStorageNotice("Saved progress could not be restored. Start a new attempt to continue.");
    } catch (error) {
      console.error("Saved Python quiz progress could not be parsed.", error);
      showStorageNotice("Saved progress could not be restored. Start a new attempt to continue.");
    }
    return null;
  }

  function formatClock(totalSeconds) {
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
  }

  function remainingSeconds() {
    return Math.max(0, Math.ceil((state.deadlineAt - Date.now()) / 1000));
  }

  function updateTimer() {
    const seconds = remainingSeconds();
    $("#quiz-timer").textContent = formatClock(seconds);
    $(".quiz-timer").classList.toggle("is-low", seconds <= 5 * 60);
    if (seconds === 0) finishQuiz(true);
  }

  function startTimer() {
    window.clearInterval(timerInterval);
    updateTimer();
    if (!state.submitted) timerInterval = window.setInterval(updateTimer, 1000);
  }

  function updateProgress() {
    const answered = state.answers.filter((answer) => answer !== null).length;
    const percentage = Math.round((answered / totalQuestions) * 100);
    $("#answered-count").textContent = `${answered} of ${totalQuestions} answered`;
    $("#map-count").textContent = `${answered} / ${totalQuestions}`;
    $("#progress-percent").textContent = `${percentage}%`;
    $("#quiz-progress-track").setAttribute("aria-valuenow", String(answered));
    $("#quiz-progress-fill").style.width = `${percentage}%`;
  }

  function updateQuestionMap() {
    questionGrid.querySelectorAll(".question-number").forEach((button, index) => {
      const answered = state.answers[index] !== null;
      const current = index === state.currentIndex;
      button.classList.toggle("is-answered", answered);
      button.classList.toggle("is-current", current);
      button.setAttribute(
        "aria-label",
        `Question ${index + 1}${answered ? ", answered" : ", unanswered"}${current ? ", current question" : ""}`,
      );
      if (current) button.setAttribute("aria-current", "step");
      else button.removeAttribute("aria-current");
    });
  }

  function buildQuestionMap() {
    const fragment = document.createDocumentFragment();
    questions.forEach((question, index) => {
      const button = document.createElement("button");
      button.type = "button";
      button.className = "question-number";
      button.textContent = String(index + 1);
      button.setAttribute("aria-controls", "question-text");
      button.addEventListener("click", () => {
        state.currentIndex = index;
        saveProgress();
        renderQuestion();
      });
      fragment.append(button);
    });
    questionGrid.replaceChildren(fragment);
    updateQuestionMap();
  }

  function renderQuestion() {
    const question = questions[state.currentIndex];
    $("#question-number").textContent = `QUESTION ${state.currentIndex + 1} OF ${totalQuestions}`;
    $("#question-topic").textContent = question.topic;
    $("#question-text").textContent = question.question;
    const codeBlock = $("#question-code");
    codeBlock.hidden = !question.code;
    codeBlock.querySelector("code").textContent = question.code || "";

    const fragment = document.createDocumentFragment();
    fragment.append(answerLegend);
    question.options.forEach((option, optionIndex) => {
      const label = document.createElement("label");
      label.className = "answer-choice";
      const input = document.createElement("input");
      input.type = "radio";
      input.name = `question-${state.currentIndex}`;
      input.value = String(optionIndex);
      input.checked = state.answers[state.currentIndex] === optionIndex;
      input.addEventListener("change", () => {
        state.answers[state.currentIndex] = optionIndex;
        saveProgress();
        updateProgress();
        updateQuestionMap();
      });

      const letter = document.createElement("span");
      letter.className = "choice-letter";
      letter.textContent = letters[optionIndex];
      const text = document.createElement("span");
      text.className = "choice-text";
      text.textContent = option;
      label.append(input, letter, text);
      fragment.append(label);
    });
    answerOptions.replaceChildren(fragment);

    $("#previous-question").disabled = state.currentIndex === 0;
    $("#next-question").disabled = state.currentIndex === totalQuestions - 1;
    updateProgress();
    updateQuestionMap();
  }

  function startQuiz() {
    if (!state.started) {
      state.started = true;
      state.startedAt = Date.now();
      state.deadlineAt = state.startedAt + durationMs;
      saveProgress();
    }
    intro.hidden = true;
    results.hidden = true;
    workspace.hidden = false;
    buildQuestionMap();
    renderQuestion();
    startTimer();
    const questionHeading = $("#question-text");
    questionHeading.focus({ preventScroll: true });
    questionHeading.scrollIntoView({
      behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches
        ? "auto"
        : "smooth",
      block: "center",
    });
  }

  function scoreQuiz() {
    let correct = 0;
    state.answers.forEach((answer, index) => {
      if (answer === questions[index].answerIndex) correct += 1;
    });
    const attempted = state.answers.filter((answer) => answer !== null).length;
    return {
      correct,
      incorrect: attempted - correct,
      unattempted: totalQuestions - attempted,
      percentage: Number(((correct / totalQuestions) * 100).toFixed(1)),
    };
  }

  function gradeFor(percentage) {
    if (percentage >= 90) return { grade: "A+", caption: "Excellent command" };
    if (percentage >= 80) return { grade: "A", caption: "Strong understanding" };
    if (percentage >= 70) return { grade: "B", caption: "Good progress" };
    if (percentage >= passThreshold) return { grade: "C", caption: "Passing grade" };
    return { grade: "—", caption: "Below the 60% pass mark" };
  }

  function finishQuiz(timeExpired = false) {
    if (!state.started || state.submitted) return;
    state.submitted = true;
    state.finishedAt = timeExpired ? state.deadlineAt : Date.now();
    saveProgress();
    window.clearInterval(timerInterval);
    renderResults();
  }

  function makeReviewItem(question, index, result) {
    const item = document.createElement("details");
    item.className = `review-item is-${result}`;
    item.dataset.reviewStatus = result;

    const summary = document.createElement("summary");
    const status = document.createElement("span");
    status.className = "review-status";
    status.textContent =
      result === "correct" ? "CORRECT" : result === "incorrect" ? "INCORRECT" : "UNANSWERED";
    const title = document.createElement("span");
    title.className = "review-question-title";
    title.textContent = `Q${index + 1}. ${question.question}`;
    const topic = document.createElement("span");
    topic.className = "review-topic";
    topic.textContent = question.topic;
    summary.append(status, title, topic);

    const content = document.createElement("div");
    content.className = "review-content";
    const prompt = document.createElement("p");
    prompt.textContent = question.question;
    content.append(prompt);

    if (question.code) {
      const codeBlock = document.createElement("pre");
      codeBlock.className = "review-code";
      const code = document.createElement("code");
      code.textContent = question.code;
      codeBlock.append(code);
      content.append(codeBlock);
    }

    const optionList = document.createElement("div");
    optionList.className = "review-options";
    question.options.forEach((option, optionIndex) => {
      const row = document.createElement("div");
      const isCorrect = optionIndex === question.answerIndex;
      const isSelected = state.answers[index] === optionIndex;
      row.className = `review-option${isCorrect ? " is-correct" : ""}${isSelected ? " is-selected" : ""}`;
      const letter = document.createElement("span");
      letter.className = "review-option-letter";
      letter.textContent = letters[optionIndex];
      const text = document.createElement("span");
      text.textContent = option;
      row.append(letter, text);
      if (isCorrect || isSelected) {
        const note = document.createElement("span");
        note.className = "review-option-note";
        note.textContent =
          isCorrect && isSelected
            ? "Your answer · Correct"
            : isCorrect
              ? "Correct answer"
              : "Your answer";
        row.append(note);
      }
      optionList.append(row);
    });
    content.append(optionList);

    const explanation = document.createElement("p");
    explanation.className = "review-explanation";
    explanation.textContent = question.explanation;
    content.append(explanation);
    item.append(summary, content);
    return item;
  }

  function renderReview(filter = activeReviewFilter) {
    activeReviewFilter = filter;
    const fragment = document.createDocumentFragment();
    questions.forEach((question, index) => {
      const answer = state.answers[index];
      const result =
        answer === question.answerIndex ? "correct" : answer === null ? "unanswered" : "incorrect";
      const item = makeReviewItem(question, index, result);
      item.hidden = filter !== "all" && result !== filter;
      fragment.append(item);
    });
    $("#review-list").replaceChildren(fragment);
    document.querySelectorAll("[data-review-filter]").forEach((button) => {
      const active = button.dataset.reviewFilter === filter;
      button.classList.toggle("is-active", active);
      button.setAttribute("aria-pressed", String(active));
    });
  }

  function renderResults() {
    const score = scoreQuiz();
    const grade = gradeFor(score.percentage);
    const passed = score.percentage >= passThreshold;
    const durationSeconds = Math.min(
      durationMs / 1000,
      Math.max(0, Math.floor((state.finishedAt - state.startedAt) / 1000)),
    );
    const minutes = Math.floor(durationSeconds / 60);
    const seconds = durationSeconds % 60;

    intro.hidden = true;
    workspace.hidden = true;
    results.hidden = false;
    const outcome = $("#result-outcome");
    outcome.classList.toggle("is-pass", passed);
    outcome.classList.toggle("is-fail", !passed);
    $("#result-outcome-title").textContent = passed
      ? "Congratulations! You passed the MCQ exam."
      : "You did not pass this attempt.";
    $("#result-outcome-message").textContent = passed
      ? `You earned Grade ${grade.grade} with ${score.percentage}%. The passing mark is 60%.`
      : `Your score was ${score.percentage}%. You need at least 60% to pass and receive Grade C or higher.`;
    $("#result-outcome-grade").textContent = grade.grade;
    $("#results-summary").textContent =
      score.unattempted === 0
        ? `You answered all ${totalQuestions} questions and scored ${score.correct} out of ${totalQuestions}.`
        : `You scored ${score.correct} out of ${totalQuestions}; ${score.unattempted} questions were left unanswered.`;
    $("#result-score").textContent = `${score.correct} / ${totalQuestions}`;
    $("#result-correct").textContent = String(score.correct);
    $("#result-incorrect").textContent = String(score.incorrect);
    $("#result-unattempted").textContent = String(score.unattempted);
    $("#result-percentage").textContent = `${score.percentage}%`;
    $("#result-grade").textContent = grade.grade;
    $("#result-grade-caption").textContent = grade.caption;
    $("#result-time").textContent = formatClock(minutes * 60 + seconds);
    $("#review-all-count").textContent = String(totalQuestions);
    $("#review-incorrect-count").textContent = String(score.incorrect);
    $("#review-unanswered-count").textContent = String(score.unattempted);
    renderReview("all");
  }

  function openSubmitDialog() {
    const unanswered = totalQuestions - state.answers.filter((answer) => answer !== null).length;
    $("#submit-dialog-message").textContent =
      unanswered > 0
        ? `You still have ${unanswered} unanswered ${unanswered === 1 ? "question" : "questions"}. You can return to them or submit now.`
        : "All questions have an answer. Submit to calculate your score and review every explanation.";
    submitDialog.showModal();
  }

  function openRestartDialog() {
    restartDialog.showModal();
  }

  function confirmRestart() {
    window.clearInterval(timerInterval);
    try {
      localStorage.removeItem(storageKey);
    } catch (error) {
      console.error("Could not clear the saved Python quiz progress.", error);
      showStorageNotice("The old saved attempt could not be removed from this browser.");
    }
    state = createFreshState();
    activeReviewFilter = "all";
    restartDialog.close();
    startQuiz();
  }

  function restoreProgress() {
    const saved = loadSavedProgress();
    if (!saved) return;
    state = saved;
    if (state.submitted) {
      renderResults();
      return;
    }
    if (state.deadlineAt <= Date.now()) {
      finishQuiz(true);
      return;
    }
    startQuiz();
  }

  if (
    !Array.isArray(questions) ||
    questions.length !== totalQuestions ||
    new Set(questions.map((question) => question.question)).size !== totalQuestions ||
    questions.some((question) => !isValidQuestion(question))
  ) {
    console.error("Python quiz data must contain exactly 600 unique valid four-option questions.");
    dataError.hidden = false;
    $("#start-quiz").disabled = true;
    return;
  }

  $("#start-quiz").addEventListener("click", startQuiz);
  $("#previous-question").addEventListener("click", () => {
    if (state.currentIndex === 0) return;
    state.currentIndex -= 1;
    saveProgress();
    renderQuestion();
  });
  $("#next-question").addEventListener("click", () => {
    if (state.currentIndex >= totalQuestions - 1) return;
    state.currentIndex += 1;
    saveProgress();
    renderQuestion();
  });
  $("#open-submit-dialog").addEventListener("click", openSubmitDialog);
  $("#map-submit").addEventListener("click", openSubmitDialog);
  $("#continue-quiz").addEventListener("click", () => submitDialog.close());
  $("#confirm-submit").addEventListener("click", () => {
    submitDialog.close();
    finishQuiz();
  });
  $("#restart-quiz").addEventListener("click", openRestartDialog);
  $("#results-restart").addEventListener("click", openRestartDialog);
  $("#cancel-restart").addEventListener("click", () => restartDialog.close());
  $("#confirm-restart").addEventListener("click", confirmRestart);
  document.querySelectorAll("[data-review-filter]").forEach((button) => {
    button.addEventListener("click", () => renderReview(button.dataset.reviewFilter));
  });

  restoreProgress();
});
