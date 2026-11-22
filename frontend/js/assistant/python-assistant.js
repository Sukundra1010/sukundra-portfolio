/*
 * Browser-only Python coding helpers. Submitted Python is inspected as text
 * and is never executed by this assistant.
 */
(() => {
  let activeQuiz = null;
  const notice =
    "\n\n*Browser-only note:* This is a guided example/static review. Submitted Python is not executed, and the checks cannot replace running it in a trusted local environment.";

  function extractCode(message) {
    const fenced = message.match(/```(?:python|py)?\s*\n([\s\S]*?)```/i);
    if (fenced) return fenced[1].trim();

    const separator = message.match(/(?:code|कोड)\s*:\s*([\s\S]+)/i);
    if (separator) return separator[1].trim();

    return null;
  }

  function explainLine(line) {
    const code = line.trim();
    if (!code || code.startsWith("#")) return "Blank line or comment; it does not run.";
    if (/^(from|import)\s/.test(code))
      return "Imports a module or selected names for use in this file.";
    if (/^class\s/.test(code)) return "Defines a class, a reusable blueprint for creating objects.";
    if (/^def\s/.test(code)) return "Defines a function and its parameters.";
    if (/^async\s+def\s/.test(code)) return "Defines an asynchronous function.";
    if (/^(if|elif|else|for|while|try|except|finally|with)\b/.test(code)) {
      return "Starts a control-flow block; its indented lines belong to this block.";
    }
    if (/^return\b/.test(code)) return "Returns a value from the current function.";
    if (/^(break|continue|pass)\b/.test(code))
      return "Changes or skips the current control-flow step.";
    if (/\bprint\s*\(/.test(code)) return "Displays a value in the terminal.";
    if (/\binput\s*\(/.test(code)) return "Reads text entered by the user.";
    if (/^[\w.]+\s*=\s*[^=]/.test(code)) return "Assigns a value to a variable or attribute.";
    if (/^[\w.]+\s*\(/.test(code)) return "Calls a function or method.";
    return "Evaluates this statement or expression; check the names and values it uses.";
  }

  function explainCode(code) {
    const lines = code.split(/\r?\n/);
    if (lines.length > 80) {
      return "Please submit 80 lines or fewer at a time so I can explain the snippet clearly.";
    }
    const explanation = lines
      .map((line, index) => `${index + 1}. \`${line || " "}\` — ${explainLine(line)}`)
      .join("\n");
    return `**Line-by-line walkthrough**\n\n${explanation}${notice}`;
  }

  function inspectCode(code) {
    const findings = [];
    const lines = code.split(/\r?\n/);
    const stack = [];
    let quote = "";
    let escaped = false;

    lines.forEach((line, index) => {
      const number = index + 1;
      if (/\t/.test(line)) {
        findings.push(`Line ${number}: contains a tab; use consistent spaces for indentation.`);
      }
      if (
        /^\s*(if|elif|else|for|while|def|class|try|except|finally|with)\b[^#]*[^:]\s*(?:#.*)?$/.test(
          line,
        )
      ) {
        findings.push(`Line ${number}: this block header may be missing its ending colon.`);
      }
      if (/^\s*if\b.*(?<![=!<>])=(?!=)/.test(line)) {
        findings.push(
          `Line ${number}: a single \`=\` assigns a value; use \`==\` for equality checks.`,
        );
      }
    });

    for (let index = 0; index < code.length; index += 1) {
      const character = code[index];
      if (quote) {
        if (escaped) escaped = false;
        else if (character === "\\") escaped = true;
        else if (character === quote) quote = "";
        continue;
      }
      if (character === "#") {
        while (index < code.length && code[index] !== "\n") index += 1;
        continue;
      }
      if (character === "'" || character === '"') {
        if (code.slice(index, index + 3) === character.repeat(3)) {
          const end = code.indexOf(character.repeat(3), index + 3);
          if (end === -1) findings.push("The snippet may have an unclosed triple-quoted string.");
          else index = end + 2;
        } else {
          quote = character;
        }
        continue;
      }
      if ("([{".includes(character)) stack.push({ character, index });
      if (")]}".includes(character)) {
        const opening = stack.pop();
        const expected = { ")": "(", "]": "[", "}": "{" }[character];
        if (!opening || opening.character !== expected) {
          findings.push(
            `Line ${code.slice(0, index).split("\n").length}: closing \`${character}\` has no matching opener.`,
          );
        }
      }
    }

    if (quote) findings.push("The snippet may contain an unclosed string.");
    if (stack.length) {
      const opening = stack[stack.length - 1];
      findings.push(
        `Line ${code.slice(0, opening.index).split("\n").length}: \`${opening.character}\` may not be closed.`,
      );
    }
    if (!findings.length) {
      return `**Static review:** I did not find these common text-level issues: missing block colons, tabs, simple \`=\` in an \`if\`, unclosed strings, or unmatched brackets.\n\nThis does not prove the program is correct. Python syntax, names, types, and runtime behavior are not fully checked here.${notice}`;
    }
    return `**Possible issues to check**\n\n${[...new Set(findings)].map((item) => `- ${item}`).join("\n")}${notice}`;
  }

  function getStarter(message) {
    const text = message.toLowerCase();
    if (/calculator|क्यालकुलेटर/.test(text)) {
      return {
        title: "Command-line calculator starter",
        code: `def calculate(first, operator, second):
    if operator == "+":
        return first + second
    if operator == "-":
        return first - second
    if operator == "*":
        return first * second
    if operator == "/" and second != 0:
        return first / second
    raise ValueError("Unsupported operator or division by zero")

try:
    first = float(input("First number: "))
    operator = input("Operator (+, -, *, /): ")
    second = float(input("Second number: "))
    print("Result:", calculate(first, operator, second))
except ValueError as error:
    print("Please check your numbers and operator:", error)`,
        explanation:
          "The calculation logic is kept in a function, division by zero is rejected, and invalid input is handled with a clear message.",
      };
    }
    if (/student|विद्यार्थी/.test(text)) {
      return {
        title: "Student record manager starter",
        code: `students = {}

def add_student(name, grade):
    students[name] = grade

def show_students():
    if not students:
        print("No student records yet.")
        return
    for name, grade in students.items():
        print(f"{name}: {grade}")

add_student("Asha", "A")
add_student("Ravi", "B+")
show_students()`,
        explanation:
          "This small in-memory example separates adding a record from displaying records. It does not save data after the program exits.",
      };
    }
    if (/todo|to-do|task list|टु.?डु/.test(text)) {
      return {
        title: "To-do list starter",
        code: `tasks = []

def add_task(task):
    tasks.append({"title": task, "done": False})

def show_tasks():
    for number, task in enumerate(tasks, start=1):
        state = "done" if task["done"] else "not done"
        print(f"{number}. {task['title']} ({state})")

add_task("Practise Python")
add_task("Review functions")
show_tasks()`,
        explanation:
          "The list stores task dictionaries, and the functions provide a simple way to add and display them.",
      };
    }
    if (/library|पुस्तकालय/.test(text)) {
      return {
        title: "Library book tracker starter",
        code: `books = {"Python Basics": True, "Clean Code": True}

def borrow_book(title):
    if title not in books:
        print("Book not found.")
    elif not books[title]:
        print("That book is already borrowed.")
    else:
        books[title] = False
        print(f"Borrowed: {title}")

def show_available_books():
    for title, available in books.items():
        if available:
            print(title)

borrow_book("Python Basics")
show_available_books()`,
        explanation:
          "A dictionary tracks each title and its availability. This in-memory starter does not persist data or manage real library accounts.",
      };
    }
    if (/inventory|stock|सामान/.test(text)) {
      return {
        title: "Inventory tracker starter",
        code: `inventory = {"notebook": 12, "pen": 25}

def add_stock(item, quantity):
    if quantity <= 0:
        raise ValueError("Quantity must be positive")
    inventory[item] = inventory.get(item, 0) + quantity

def show_inventory():
    for item, quantity in inventory.items():
        print(f"{item}: {quantity}")

add_stock("notebook", 5)
show_inventory()`,
        explanation:
          "The dictionary stores item counts, and `get()` lets the program add a new item or increase existing stock.",
      };
    }
    if (/bank|banking|बैंक/.test(text)) {
      return {
        title: "Practice-only bank account starter",
        code: `account = {"owner": "Asha", "balance": 100.0}

def deposit(amount):
    if amount <= 0:
        raise ValueError("Deposit must be positive")
    account["balance"] += amount

def withdraw(amount):
    if amount <= 0 or amount > account["balance"]:
        raise ValueError("Invalid amount or insufficient funds")
    account["balance"] -= amount

deposit(25.0)
withdraw(10.0)
print(f"Balance: {account['balance']:.2f}")`,
        explanation:
          "This is an in-memory programming exercise only—not a real banking system and not suitable for handling money or account data.",
      };
    }
    return null;
  }

  function getDataStructureReply(text) {
    if (/binary search/.test(text)) {
      return `Binary search checks a **sorted** list by repeatedly halving the search range.\n\n\`\`\`python\ndef binary_search(values, target):\n    left, right = 0, len(values) - 1\n    while left <= right:\n        middle = (left + right) // 2\n        if values[middle] == target:\n            return middle\n        if values[middle] < target:\n            left = middle + 1\n        else:\n            right = middle - 1\n    return -1\n\nprint(binary_search([2, 4, 7, 9], 7))\n\`\`\`\n\nIt returns index 2. Time complexity is **O(log n)**; the input must already be sorted.${notice}`;
    }
    if (/\bstack\b/.test(text)) {
      return `A stack is last-in, first-out (LIFO). Python lists provide \`append()\` and \`pop()\`:\n\n\`\`\`python\nstack = []\nstack.append("first")\nstack.append("second")\nprint(stack.pop())  # second\n\`\`\`\n\nAppending and popping at the end of a list are typically O(1).${notice}`;
    }
    if (/\bqueue\b/.test(text)) {
      return `A queue is first-in, first-out (FIFO). Use \`collections.deque\` for efficient removal from the front:\n\n\`\`\`python\nfrom collections import deque\n\nqueue = deque(["first", "second"])\nqueue.append("third")\nprint(queue.popleft())  # first\n\`\`\`${notice}`;
    }
    if (/recursion|factorial/.test(text)) {
      return `Recursion is when a function calls itself. A base case stops the calls:\n\n\`\`\`python\ndef factorial(number):\n    if number < 0:\n        raise ValueError("Use a non-negative integer")\n    if number <= 1:\n        return 1\n    return number * factorial(number - 1)\n\nprint(factorial(5))  # 120\n\`\`\`\n\nEach call reduces the number until the base case. For large inputs, an iterative solution avoids Python's recursion limit.${notice}`;
    }
    if (/sort|sorting/.test(text)) {
      return `For everyday Python, use the built-in sort rather than implementing a sort yourself:\n\n\`\`\`python\nscores = [8, 3, 10, 4]\nordered_scores = sorted(scores)\nprint(ordered_scores)\n\`\`\`\n\n\`sorted()\` returns a new list; \`.sort()\` changes a list in place. Python's sorting is O(n log n) in the average and worst case.${notice}`;
    }
    return "I can help with stacks, queues, binary search, sorting, recursion, and Big-O. Ask for one topic, such as `explain binary search`, and I’ll show a small example.";
  }

  function askQuizQuestion() {
    const questions = [
      {
        question: "What does this return: `len([4, 8, 12])`?",
        choices: ["2", "3", "12"],
        answer: "3",
        reason: "The list contains three items.",
      },
      {
        question: "Which keyword defines a function in Python?",
        choices: ["func", "def", "function"],
        answer: "def",
        reason: "`def` introduces a function definition.",
      },
      {
        question: "What is the result of `7 // 2`?",
        choices: ["3", "3.5", "1"],
        answer: "3",
        reason: "`//` is floor division for these positive numbers.",
      },
    ];
    const item = questions[Math.floor(Math.random() * questions.length)];
    activeQuiz = item;
    return `**Python practice question**\n\n${item.question}\n\n${item.choices.map((choice, index) => `${index + 1}. ${choice}`).join("\n")}\n\nReply with the number or answer and I’ll explain it.`;
  }

  function checkQuizAnswer(message) {
    if (!activeQuiz || message.length > 30) return null;
    const answer = message.trim().toLowerCase().replace(/[.)]/g, "");
    if (!/^(?:[1-3]|[a-c])$/.test(answer)) return null;
    const index = Number(answer) - 1;
    const choice =
      index >= 0 ? activeQuiz.choices[index] : activeQuiz.choices[answer.charCodeAt(0) - 97];
    if (!choice) return null;
    const isCorrect = choice === activeQuiz.answer;
    const response = isCorrect
      ? `**Correct!** ${activeQuiz.reason}`
      : `Not quite. The correct answer is **${activeQuiz.answer}**. ${activeQuiz.reason}`;
    activeQuiz = null;
    return response;
  }

  function getReply(message) {
    const code = extractCode(message);
    const text = message.toLowerCase();
    const quizReply = checkQuizAnswer(message);
    if (quizReply) return quizReply;
    if (code && /debug|fix|error|bug|त्रुटि|मिलाइ/.test(text)) return inspectCode(code);
    if (code && /explain|line by line|walk.?through|बुझाइ|व्याख्या/.test(text))
      return explainCode(code);

    if (/quiz|interview question|practice question|प्रश्न सोध/.test(text)) return askQuizQuestion();

    const starter = getStarter(message);
    if (starter && /generate|write|create|build|code|program|बनाइ|लेख/.test(text)) {
      return `**${starter.title}**\n\n${starter.explanation}\n\n\`\`\`python\n${starter.code}\n\`\`\`\n\nAsk me to explain any part or paste your edited version for a static review.${notice}`;
    }

    if (code && /debug|fix|error|bug|त्रुटि|मिलाइ/.test(text)) return inspectCode(code);
    if (code && /explain|line by line|walk.?through|बुझाइ|व्याख्या/.test(text))
      return explainCode(code);

    if (
      /debug|check my code|review my code|syntax error|fix my code|कोड.*(जाँच|त्रुटि|मिलाइ)/.test(
        text,
      )
    ) {
      return "Paste your Python snippet in a `python` code block and ask me to debug it. I can check for a few common text-level issues, but I cannot compile or run Python in this browser-only setup.";
    }
    if (
      /generate|create|build|write.*python|python.*(project|program)|प्रोजेक्ट.*(बनाइ|लेख)/.test(
        text,
      )
    ) {
      return "I can provide readable starters for a calculator, student record manager, to-do list, library tracker, inventory tracker, or practice-only bank account. Tell me which project you want. These examples use in-memory data and are not production systems; this local assistant does not generate arbitrary code with an AI model.";
    }
    if (/run|execute|playground|output console/.test(text) && /python|code/.test(text)) {
      return "This browser-only assistant does not run submitted Python. Running arbitrary code safely requires a separately sandboxed execution service, which this site does not have. You can copy the example into a local Python environment and run it there.";
    }
    if (
      /dsa|data structure|algorithm|time complexity|big.?o|binary search|\bstack\b|\bqueue\b|sorting|recursion|factorial/.test(
        text,
      )
    ) {
      return getDataStructureReply(text);
    }
    return null;
  }

  window.SUKKU_PYTHON_ASSISTANT = { getReply };
})();
