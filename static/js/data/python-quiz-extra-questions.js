(function addIntermediateQuestionBank() {
  const baseQuestions = window.PYTHON_MCQ_QUESTIONS;
  const extraQuestions = [];
  const values = Array.from({ length: 10 }, (_, index) => index + 2);

  function addQuestion(topic, question, correctAnswer, distractors, explanation, code) {
    const correct = String(correctAnswer);
    const wrongOptions = [...new Set(distractors.map(String))].filter(
      (option) => option !== correct,
    );
    if (wrongOptions.length < 3) {
      throw new Error(`Question has fewer than three unique distractors: ${question}`);
    }

    const answerIndex = extraQuestions.length % 4;
    const options = wrongOptions.slice(0, 3);
    options.splice(answerIndex, 0, correct);
    const item = { topic, question, options, answerIndex, explanation };
    if (code) item.code = code;
    extraQuestions.push(item);
  }

  values.forEach((n) => {
    const result = 2 + n * 3;
    addQuestion(
      "Python Fundamentals",
      `What does 2 + ${n} * 3 evaluate to?`,
      result,
      [result + 1, result - 1, n * 3],
      "Multiplication has higher precedence than addition, so Python multiplies first and then adds 2.",
      `result = 2 + ${n} * 3`,
    );

    addQuestion(
      "Python Fundamentals",
      `What is (${n} * ${n} + 1) % ${n}?`,
      1,
      [0, n, -1],
      `The product ${n} * ${n} is divisible by ${n}, leaving a remainder of 1 after adding 1.`,
    );

    const quotient = Math.floor((7 * n) / 3);
    addQuestion(
      "Python Fundamentals",
      `What integer does (${n} * 7) // 3 produce?`,
      quotient,
      [quotient + 1, quotient - 1, n * 7],
      "For positive operands, // returns the quotient rounded down to the nearest integer.",
    );

    const isEvenAndAboveTwo = n > 2 && n % 2 === 0;
    addQuestion(
      "Python Fundamentals",
      `What is the result of (${n} > 2) and (${n} % 2 == 0)?`,
      isEvenAndAboveTwo ? "True" : "False",
      [isEvenAndAboveTwo ? "False" : "True", "0", "None"],
      "The and expression is true only when both the greater-than and even-number conditions are true.",
    );

    const formattedHalf = (n / 2).toFixed(1);
    addQuestion(
      "Python Fundamentals",
      `What string does f"{${n} / 2:.1f}" produce?`,
      formattedHalf,
      [n.toFixed(1), (n / 2 + 0.2).toFixed(1), (n + 1).toFixed(1)],
      "The .1f format specifier displays the value with one digit after the decimal point.",
    );
  });

  values.forEach((n) => {
    addQuestion(
      "Data Types and Variables",
      `What value does int("${n}0") return?`,
      n * 10,
      [n, n * 100, n * 10 + 1],
      "int() parses every digit in the string as one decimal integer.",
    );

    addQuestion(
      "Data Types and Variables",
      `What is the length of "py" * ${n}?`,
      2 * n,
      [n, 2 * n + 1, 2 * n - 1],
      "Multiplying a string repeats its contents; the two-character string is repeated n times.",
    );

    const character = String.fromCharCode(64 + n);
    addQuestion(
      "Data Types and Variables",
      `What character does chr(64 + ${n}) return?`,
      character,
      [String.fromCharCode(63 + n), String.fromCharCode(65 + n), String.fromCharCode(66 + n)],
      "chr() converts the supplied Unicode code point to its corresponding character.",
    );

    addQuestion(
      "Data Types and Variables",
      `What does isinstance(${n}, float) return?`,
      "False",
      ["True", "None", "0"],
      "The literal n is an int, not a float, so isinstance returns False.",
    );

    addQuestion(
      "Data Types and Variables",
      `How many items are in middle after unpacking a range of ${n} values?`,
      n - 2,
      [n - 1, n, n + 1],
      "The first and last values go to separate variables; the starred middle variable receives the other n - 2 values.",
      `first, *middle, last = range(${n})`,
    );
  });

  values.forEach((n) => {
    const squares = Array.from({ length: n }, (_, index) => index * index);
    const multiples = Array.from({ length: n }, (_, index) => index * 3);
    const consecutive = Array.from({ length: n }, (_, index) => index + 1);
    const shiftedSquares = Array.from({ length: n }, (_, index) => (index + 1) ** 2);
    addQuestion(
      "Lists, Tuples, Sets and Dictionaries",
      `What list is created by [x * x for x in range(${n})]?`,
      `[${squares.join(", ")}]`,
      [
        `[${multiples.join(", ")}]`,
        `[${consecutive.join(", ")}]`,
        `[${shiftedSquares.join(", ")}]`,
      ],
      "The comprehension visits each integer from 0 up to n - 1 and stores its square.",
    );

    addQuestion(
      "Lists, Tuples, Sets and Dictionaries",
      `What is len(dict.fromkeys(range(${n}), 0))?`,
      n,
      [n - 1, n + 1, n * 2],
      "dict.fromkeys creates one dictionary entry for each distinct key in range(n).",
    );

    addQuestion(
      "Lists, Tuples, Sets and Dictionaries",
      `How many values are in set(range(${n})) & set(range(1, ${n + 1}))?`,
      n - 1,
      [n, n - 2, n + 1],
      "The two ranges share the integers 1 through n - 1, which is n - 1 values.",
    );

    addQuestion(
      "Lists, Tuples, Sets and Dictionaries",
      `What list does list(range(${2 * n}))[::${n}] produce?`,
      `[0, ${n}]`,
      [`[0, ${n - 1}]`, `[${n}]`, `[0, ${n}, ${2 * n - 1}]`],
      `The slice takes every ${n}th item, starting at index 0, from a range containing 0 through ${2 * n - 1}.`,
    );

    addQuestion(
      "Lists, Tuples, Sets and Dictionaries",
      `What value does values.pop() return for values = list(range(${n}))?`,
      n - 1,
      [n, n + 1, -1],
      "Calling pop() without an index removes and returns the last list item.",
    );
  });

  values.forEach((n) => {
    const rangeSum = (n * (n - 1)) / 2;
    addQuestion(
      "Loops and Conditional Statements",
      `What does sum(range(${n})) return?`,
      rangeSum,
      [rangeSum + 1, rangeSum - 1, n * n],
      "range(n) contains 0 through n - 1, whose sum is n * (n - 1) / 2.",
    );

    addQuestion(
      "Loops and Conditional Statements",
      `What index is assigned to the first item by enumerate(items, start=${n})?`,
      n,
      [n - 1, n + 1, 0],
      "enumerate's start argument sets the index of the first item.",
    );

    addQuestion(
      "Loops and Conditional Statements",
      `How many pairs does zip(range(${n}), range(${n - 2})) produce?`,
      n - 2,
      [n - 1, n, n + 1],
      "zip stops when its shortest input is exhausted; the second range has n - 2 items.",
    );

    const evenCount = Math.ceil(n / 2);
    const evenSum = evenCount * (evenCount - 1);
    addQuestion(
      "Loops and Conditional Statements",
      `What is sum(range(0, ${n}, 2))?`,
      evenSum,
      [evenSum + 1, n * 100 + 17, -1],
      "The range contains the even values below n; adding 0, 2, 4, and so on gives k * (k - 1), where k is their count.",
    );

    const iterations = Math.ceil(n / 2);
    addQuestion(
      "Loops and Conditional Statements",
      `How many iterations occur before i reaches or exceeds ${n}?`,
      iterations,
      [Math.floor(n / 2) - 1, n, n + 1],
      "Starting at 0 and adding 2 each time takes ceil(n / 2) iterations to reach or pass n.",
      `i = 0\nturns = 0\nwhile i < ${n}:\n    i += 2\n    turns += 1`,
    );
  });

  values.forEach((n) => {
    const sumArguments = n + (n * (n - 1)) / 2;
    addQuestion(
      "Functions and Modules",
      `What does sum(${n}, *range(${n})) return?`,
      sumArguments,
      [sumArguments + 1, sumArguments - 1, n * n + 10],
      "The starred range expands into positional arguments; sum adds those values and the initial n.",
    );

    addQuestion(
      "Functions and Modules",
      `What does add(1) return when offset defaults to ${n}?`,
      n + 1,
      [n, n + 2, n + 10],
      "The default offset is n, so the call adds 1 and n.",
      `def add(value, offset=${n}):\n    return value + offset`,
    );

    addQuestion(
      "Functions and Modules",
      `What does scale(2) return if its keyword-only factor defaults to ${n}?`,
      2 * n,
      [2 * n + 1, n, 2 * n - 1],
      "The keyword-only factor has a default value of n, so scale multiplies 2 by n.",
      `def scale(value, *, factor=${n}):\n    return value * factor`,
    );

    const factorialInput = n + 2;
    const factorial = (value) => (value <= 1 ? 1 : value * factorial(value - 1));
    addQuestion(
      "Functions and Modules",
      `What value does factorial(${factorialInput}) return?`,
      factorial(factorialInput),
      [factorial(factorialInput - 1), factorialInput ** 2, factorialInput * 2],
      "The recursive function multiplies each positive integer from the input down to 1.",
      `def factorial(value):\n    return 1 if value <= 1 else value * factorial(value - 1)`,
    );

    const mapped = `[${n}, ${n + 1}, ${n + 2}]`;
    addQuestion(
      "Functions and Modules",
      `What list does list(map(lambda value: value + ${n}, range(3))) return?`,
      mapped,
      [`[${n - 1}, ${n}, ${n + 1}]`, `[${n + 1}, ${n + 2}, ${n + 3}]`, `[${n}, ${n + 2}]`],
      "map applies the lambda to 0, 1, and 2, adding n to each value.",
    );
  });

  values.forEach((n) => {
    addQuestion(
      "Object-Oriented Programming",
      `What is (meter.value, Meter.value) after increasing the instance value from ${n}?`,
      `(${n + 1}, ${n})`,
      [`(${n}, ${n})`, `(${n + 1}, ${n + 1})`, `(${n}, ${n + 1})`],
      "Augmented assignment creates an instance attribute that shadows the unchanged class attribute.",
      `class Meter:\n    value = ${n}\n\nmeter = Meter()\nmeter.value += 1`,
    );

    addQuestion(
      "Object-Oriented Programming",
      `What value does a validated score property keep after assigning ${n * 8}?`,
      n * 8,
      [n * 8 + 1, n * 8 - 1, n * 8 + 2],
      "The setter accepts values from 0 through 100 and stores the accepted value in _score.",
      `class Score:\n    def __init__(self):\n        self._score = 0\n\n    @property\n    def score(self):\n        return self._score\n\n    @score.setter\n    def score(self, value):\n        if 0 <= value <= 100:\n            self._score = value\n\nresult = Score()\nresult.score = ${n * 8}\nanswer = result.score`,
    );

    const baseName = `Base${n}`;
    const childName = `Child${n}`;
    addQuestion(
      "Object-Oriented Programming",
      `What does ${childName}().label() return after the child overrides label()?`,
      `child-${n}`,
      [`base-${n}`, `parent-${n}`, "None"],
      "Method lookup uses the runtime class, so the child's override is called.",
      `class ${baseName}:\n    def label(self):\n        return "base-${n}"\n\nclass ${childName}(${baseName}):\n    def label(self):\n        return "child-${n}"`,
    );

    addQuestion(
      "Object-Oriented Programming",
      `What pair does Child${n}(${n}).values() return after reusing the parent initializer with super()?`,
      `(${n}, ${n + 1})`,
      [`(${n + 1}, ${n})`, `(${n}, ${n})`, `(${n + 1}, ${n + 1})`],
      "super().__init__(value) stores the first value in the parent, while the child stores its own extra value.",
      `class Parent${n}:\n    def __init__(self, value):\n        self.value = value\n\nclass Child${n}(Parent${n}):\n    def __init__(self, value, extra):\n        super().__init__(value)\n        self.extra = extra\n\n    def values(self):\n        return self.value, self.extra\n\nresult = Child${n}(${n}, ${n + 1}).values()`,
    );

    addQuestion(
      "Object-Oriented Programming",
      `What does hasattr(item, "__code") return when Token${n} stores self.__code?`,
      "False",
      ["True", "None", "AttributeError"],
      "A double-leading-underscore attribute is name-mangled with the class name, so it is not stored under the literal name __code.",
      `class Token${n}:\n    def __init__(self):\n        self.__code = ${n}\n\nitem = Token${n}()\nresult = hasattr(item, "__code")`,
    );
  });

  values.forEach((n) => {
    addQuestion(
      "Exception Handling",
      `What does result contain after int("bad${n}") is handled as a ValueError?`,
      "invalid",
      ["0", "None", "ValueError"],
      'Converting a non-numeric string raises ValueError, so the matching except block assigns "invalid".',
      `try:\n    result = int("bad${n}")\nexcept ValueError:\n    result = "invalid"`,
    );

    addQuestion(
      "Exception Handling",
      `What value is assigned after ${n} // 0 raises ZeroDivisionError?`,
      n,
      [n + 1, 0, n - 1],
      "The except handler for ZeroDivisionError runs and assigns n to the result.",
      `try:\n    result = ${n} // 0\nexcept ZeroDivisionError:\n    result = ${n}`,
    );

    addQuestion(
      "Exception Handling",
      `What message is assigned by the try/except else clause when ${n} + 1 succeeds?`,
      "success",
      ["failure", "exception", "None"],
      "The else suite runs only when the try suite completes without an exception.",
      `try:\n    value = ${n} + 1\nexcept Exception:\n    message = "failure"\nelse:\n    message = "success"`,
    );

    addQuestion(
      "Exception Handling",
      `What is status after finally adds ${n} to its starting value ${n}?`,
      2 * n,
      [n, n + 1, n * 3],
      "The finally suite runs after the try/except handling and performs the addition.",
      `status = ${n}\ntry:\n    raise RuntimeError("test")\nexcept RuntimeError:\n    pass\nfinally:\n    status += ${n}`,
    );

    addQuestion(
      "Exception Handling",
      `What happens when assert ${n} > 0 is evaluated?`,
      "No exception is raised",
      ["AssertionError is raised", "ValueError is raised", "The assertion returns None"],
      "The condition is true for every generated positive n, so the assertion passes.",
    );
  });

  const fileModes = [
    ["r", "Reads an existing text file and fails if it is absent."],
    ["rb", "Reads an existing file as bytes."],
    ["w", "Writes text, creating the file or truncating it if it exists."],
    ["wb", "Writes bytes, creating the file or truncating it if it exists."],
    ["a", "Appends text and creates the file if it is absent."],
    ["ab", "Appends bytes and creates the file if it is absent."],
    ["x", "Creates a new text file and fails if the path already exists."],
    ["xb", "Creates a new binary file and fails if the path already exists."],
    ["r+", "Reads and writes an existing file without truncating it."],
    ["a+", "Reads and appends, creating the file if it is absent."],
  ];
  const fileModeDescriptions = fileModes.map(([, description]) => description);
  fileModes.forEach(([mode, description], index) => {
    const distractors = fileModeDescriptions.filter((option) => option !== description).slice(0, 3);
    addQuestion(
      "File Handling",
      `What does opening report${index + 2}.txt with mode "${mode}" do?`,
      description,
      distractors,
      `The "${mode}" mode controls whether the stream reads, writes, appends, creates exclusively, or handles bytes.`,
      `with open("report${index + 2}.txt", "${mode}") as stream:\n    pass`,
    );
  });

  values.forEach((n) => {
    const readLength = Math.floor(n / 2);
    addQuestion(
      "File Handling",
      `What is len(stream.read(${readLength})) for an in-memory text stream containing ${n} characters?`,
      readLength,
      [n + 2, readLength + 2, -1],
      "read(size) returns up to size characters from a text stream; the requested size is smaller than the available text.",
      `import io\nstream = io.StringIO("x" * ${n})\ncontent = stream.read(${readLength})`,
    );

    const position = Math.floor(n / 2);
    addQuestion(
      "File Handling",
      `For a stream containing ${n} characters, what does tell() return after seeking to offset ${position}?`,
      position,
      [position + 1, n + 1, -1],
      "tell() reports the current stream position, which is the offset just selected by seek().",
      `import io\nstream = io.StringIO("x" * ${n})\nstream.seek(${position})`,
    );

    addQuestion(
      "File Handling",
      `What JSON string does json.dumps({"count": ${n}}) produce with default separators?`,
      `{"count": ${n}}`,
      [`{"count": ${n + 1}}`, `{"value": ${n}}`, `{"count": ${n * 2}}`],
      "json.dumps serializes the dictionary using JSON syntax and includes a space after the colon by default.",
    );

    addQuestion(
      "File Handling",
      `What does readlines() return after a file-like stream has ${n} newline-terminated lines?`,
      "A list containing the remaining lines",
      [
        "A single string containing all lines",
        "The number of lines as an integer",
        "A dictionary keyed by line number",
      ],
      "readlines() returns the unread lines as a list of strings.",
      `with open("lines${n}.txt", encoding="utf-8") as stream:\n    lines = stream.readlines()`,
    );
  });

  values.forEach((n) => {
    addQuestion(
      "Advanced Python Concepts",
      `What does next(iterator, "done") return after ${n} items have been consumed?`,
      "done",
      ["None", "StopIteration", "0"],
      "When an iterator is exhausted, next() returns its supplied default instead of raising StopIteration.",
      `iterator = iter(range(${n}))\nfor _ in range(${n}):\n    next(iterator)\nresult = next(iterator, "done")`,
    );

    const squareSum = (n * (n - 1) * (2 * n - 1)) / 6;
    addQuestion(
      "Advanced Python Concepts",
      `What does sum(value * value for value in range(${n})) return?`,
      squareSum,
      [squareSum + 1, squareSum + 2, n * n + 10],
      "The generator expression yields each square from 0 through (n - 1) squared, and sum adds them.",
    );

    addQuestion(
      "Advanced Python Concepts",
      `What does the first increment() call return when the counter starts at ${n}?`,
      n + 1,
      [n, n + 2, 0],
      "The nested function uses nonlocal to update the enclosing count, then returns its incremented value.",
      `def make_counter(start):\n    count = start\n    def increment():\n        nonlocal count\n        count += 1\n        return count\n    return increment\ncounter = make_counter(${n})\nresult = counter()`,
    );

    addQuestion(
      "Advanced Python Concepts",
      `What is original[0] after shallow-copying [[${n}]] and appending 99 to its nested list?`,
      `[${n}, 99]`,
      [`[${n}]`, "[99]", `[${n}, 99, 99]`],
      "copy.copy duplicates only the outer list, so the nested list is shared by original and clone.",
      `import copy\noriginal = [[${n}]]\nclone = copy.copy(original)\nclone[0].append(99)`,
    );

    const managerName = `Suppressor${n}`;
    addQuestion(
      "Advanced Python Concepts",
      `What message is reached after ${managerName} suppresses a ValueError?`,
      "continued",
      ["ValueError", "finally", "None"],
      "A context manager suppresses an exception when __exit__ returns a truthy value.",
      `class ${managerName}:\n    def __enter__(self):\n        return self\n    def __exit__(self, exc_type, exc_value, traceback):\n        return True\nwith ${managerName}():\n    raise ValueError("handled")\nmessage = "continued"`,
    );
  });

  values.forEach((n) => {
    const outer = `outer${n}`;
    const inner = `inner${n}`;
    addQuestion(
      "Decorators, Generators and Lambda Functions",
      `How are @${outer} above @${inner} applied to function work?`,
      `${outer}(${inner}(work))`,
      [`${inner}(${outer}(work))`, `${outer}(work)`, `${inner}(work)`],
      "Decorators are applied from the innermost decorator outward, so inner transforms work first.",
      `@${outer}\n@${inner}\ndef work():\n    pass`,
    );

    const originalName = `original${n}`;
    addQuestion(
      "Decorators, Generators and Lambda Functions",
      `What is wrapper.__name__ after functools.wraps copies metadata from ${originalName}?`,
      originalName,
      [`wrapper${n}`, "wraps", "None"],
      "functools.wraps copies the wrapped function's name and other metadata onto the wrapper.",
      `from functools import wraps\n\ndef ${originalName}():\n    pass\n\ndef wrapper${n}():\n    pass\nwrapper${n} = wraps(${originalName})(wrapper${n})\nresult = wrapper${n}.__name__`,
    );

    addQuestion(
      "Decorators, Generators and Lambda Functions",
      `What value is yielded after send(${n}) resumes a generator suspended at yield ${n}?`,
      2 * n,
      [n, n + 1, 2 * n + 1],
      "send(n) becomes the result of the suspended yield expression, and the generator then adds n.",
      `def generate():\n    received = yield ${n}\n    yield received + ${n}\nstream = generate()\nnext(stream)\nresult = stream.send(${n})`,
    );

    const lambdaValues = `[${n}, ${n + 1}]`;
    addQuestion(
      "Decorators, Generators and Lambda Functions",
      `What list is returned when lambdas bind their default values from ${n} and ${n + 1}?`,
      lambdaValues,
      [`[${n + 1}, ${n + 1}]`, `[${n}, ${n}]`, `[${n - 1}, ${n}]`],
      "Using a default argument captures each loop value when its lambda is created.",
      `functions = [lambda value=value: value for value in range(${n}, ${n + 2})]\nresult = [function() for function in functions]`,
    );

    const yieldedValues = `[${Array.from({ length: n }, (_, index) => index).join(", ")}]`;
    const shiftedValues = `[${Array.from({ length: n }, (_, index) => index + 1).join(", ")}]`;
    const shorterValues = `[${Array.from({ length: n - 1 }, (_, index) => index).join(", ")}]`;
    addQuestion(
      "Decorators, Generators and Lambda Functions",
      `What list is collected from yield from range(${n})?`,
      yieldedValues,
      [shiftedValues, shorterValues, `range(${n})`],
      "yield from delegates to range(n), so iterating the generator produces every integer from 0 through n - 1.",
      `def values():\n    yield from range(${n})\nresult = list(values())`,
    );
  });

  const allQuestions = [...baseQuestions, ...extraQuestions];
  const questionCounts = new Map();
  allQuestions.forEach((item) => {
    questionCounts.set(item.question, (questionCounts.get(item.question) || 0) + 1);
  });
  const duplicateQuestions = [...questionCounts]
    .filter(([, count]) => count > 1)
    .map(([question]) => question);
  const uniqueQuestionCount = questionCounts.size;
  if (
    !Array.isArray(baseQuestions) ||
    baseQuestions.length !== 100 ||
    extraQuestions.length !== 500 ||
    allQuestions.length !== 600 ||
    uniqueQuestionCount !== allQuestions.length
  ) {
    throw new Error(
      `Python MCQ bank must contain 600 unique questions (100 original and 500 additional). Got ${baseQuestions.length} base, ${extraQuestions.length} additional, ${duplicateQuestions.length} duplicates: ${duplicateQuestions.join(" | ")}`,
    );
  }

  window.PYTHON_MCQ_EXTRA_QUESTIONS = extraQuestions;
  window.PYTHON_MCQ_QUESTIONS = allQuestions;
})();
