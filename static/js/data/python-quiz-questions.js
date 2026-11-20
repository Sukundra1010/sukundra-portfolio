window.PYTHON_MCQ_QUESTIONS = [
  {
    topic: "Python Fundamentals",
    question: "What does 3 ** 2 ** 2 evaluate to?",
    options: ["36", "81", "729", "18"],
    answerIndex: 1,
    explanation: "Exponentiation is evaluated from right to left: 3 ** (2 ** 2) is 3 ** 4, or 81.",
  },
  {
    topic: "Python Fundamentals",
    question: "What is the result of -7 // 3?",
    options: ["-2", "-3", "-2.333...", "2"],
    answerIndex: 1,
    explanation: "Floor division rounds down toward negative infinity, so -7 // 3 is -3.",
  },
  {
    topic: "Python Fundamentals",
    question: "What does divmod(17, 5) return?",
    options: ["(3, 2)", "(2, 3)", "[3, 2]", "3.4"],
    answerIndex: 0,
    explanation: "divmod(a, b) returns the quotient and remainder as a tuple: (17 // 5, 17 % 5).",
  },
  {
    topic: "Python Fundamentals",
    question: "What value does 0 or 12 evaluate to?",
    options: ["0", "True", "12", "None"],
    answerIndex: 2,
    explanation: "The or operator returns one of its operands. Since 0 is falsey, it returns 12.",
  },
  {
    topic: "Python Fundamentals",
    question: "What is the result of not (2 < 5)?",
    options: ["True", "False", "2", "A TypeError"],
    answerIndex: 1,
    explanation: "The comparison 2 < 5 is True, and not reverses that Boolean value to False.",
  },
  {
    topic: "Python Fundamentals",
    question: "What does the chained comparison 1 < 2 <= 2 evaluate to?",
    options: ["True", "False", "2", "A SyntaxError"],
    answerIndex: 0,
    explanation: "Python checks both comparisons, 1 < 2 and 2 <= 2. Both are true.",
  },
  {
    topic: "Python Fundamentals",
    question: "What is bool([0])?",
    options: [
      "False, because its only item is zero",
      "True, because the list is not empty",
      "0",
      "A TypeError",
    ],
    answerIndex: 1,
    explanation:
      "Containers are truthy when non-empty, regardless of whether their contents are falsey.",
  },
  {
    topic: "Python Fundamentals",
    question: "What does all([1, 2, 0]) return?",
    options: ["True", "False", "0", "None"],
    answerIndex: 1,
    explanation: "all() is true only when every item is truthy; 0 is falsey.",
  },
  {
    topic: "Python Fundamentals",
    question: 'What does any([0, "", 3]) return?',
    options: ["False", "True", "3", "An empty list"],
    answerIndex: 1,
    explanation: "any() is true when at least one item is truthy; 3 is truthy.",
  },
  {
    topic: "Python Fundamentals",
    question: 'What string is produced by f"{3.14159:.2f}"?',
    options: ["3.14", "3.1", "3.14159", "3.15"],
    answerIndex: 0,
    explanation:
      "The .2f format specifier displays a floating-point value rounded to two decimal places.",
  },
  {
    topic: "Data Types and Variables",
    question: "What does isinstance(True, int) return?",
    options: ["False", "True", "None", "A TypeError"],
    answerIndex: 1,
    explanation: "bool is a subclass of int in Python, so True is an instance of int.",
  },
  {
    topic: "Data Types and Variables",
    question: 'What is the value of int("101", 2)?',
    options: ["101", "5", "2", "A ValueError"],
    answerIndex: 1,
    explanation:
      "The second argument selects base 2, so the binary string 101 represents decimal 5.",
  },
  {
    topic: "Data Types and Variables",
    question: 'What value does float("3.50") produce?',
    options: ['The string "3.50"', "3.5", "350", "A ValueError"],
    answerIndex: 1,
    explanation:
      "float() converts the numeric string to a floating-point value; trailing zeroes do not change its value.",
  },
  {
    topic: "Data Types and Variables",
    question: "What does str(12) + str(3) evaluate to?",
    options: ["15", '"123"', '"12 3"', "A TypeError"],
    answerIndex: 1,
    explanation:
      "Both operands are strings, so + concatenates them rather than adding them numerically.",
  },
  {
    topic: "Data Types and Variables",
    question: "After this code, what is a?",
    code: "a = [1, 2]\nb = a\nb += [3]",
    options: ["[1, 2]", "[3]", "[1, 2, 3]", "A new tuple"],
    answerIndex: 2,
    explanation: "a and b refer to the same list, and list += mutates that list in place.",
  },
  {
    topic: "Data Types and Variables",
    question: "After this unpacking, what is middle?",
    code: "first, *middle, last = (1, 2, 3, 4)",
    options: ["(2, 3)", "[2, 3]", "[1, 2, 3]", "3"],
    answerIndex: 1,
    explanation: "Starred assignment collects the remaining values into a new list.",
  },
  {
    topic: "Data Types and Variables",
    question: 'What does "10" * 2 produce?',
    options: ["20", '"1010"', '"10 10"', "A TypeError"],
    answerIndex: 1,
    explanation: "Multiplying a string by an integer repeats the string that many times.",
  },
  {
    topic: "Data Types and Variables",
    question: "What does int(-3.9) return?",
    options: ["-4", "-3", "3", "A ValueError"],
    answerIndex: 1,
    explanation: "int() truncates a float toward zero; it does not round down.",
  },
  {
    topic: "Data Types and Variables",
    question: "What is the result of True + 2?",
    options: ["True", "2", "3", "A TypeError"],
    answerIndex: 2,
    explanation: "Because bool is a subclass of int, True behaves like 1 in arithmetic.",
  },
  {
    topic: "Data Types and Variables",
    question: 'What does list("cat") return?',
    options: ['["cat"]', '["c", "a", "t"]', '("c", "a", "t")', "A set of characters"],
    answerIndex: 1,
    explanation: "A string is iterable, so list() creates a list containing each character.",
  },
  {
    topic: "Lists, Tuples, Sets and Dictionaries",
    question: 'What does settings.get("theme", "dark") return when settings has no "theme" key?',
    options: ["None", '"dark"', "KeyError", "False"],
    answerIndex: 1,
    explanation: "dict.get() returns its second argument when the requested key is absent.",
  },
  {
    topic: "Lists, Tuples, Sets and Dictionaries",
    question: "What dictionary is created by {n: n * n for n in range(3)}?",
    options: ["{0: 0, 1: 1, 2: 4}", "[0, 1, 4]", "{1: 1, 2: 4, 3: 9}", "{0, 1, 4}"],
    answerIndex: 0,
    explanation:
      "The comprehension uses each number from 0 through 2 as a key and its square as the value.",
  },
  {
    topic: "Lists, Tuples, Sets and Dictionaries",
    question: 'After right.update(left), which value does right["mode"] have?',
    code: 'left = {"mode": "fast"}\nright = {"mode": "safe", "retry": 2}\nright.update(left)',
    options: ['"safe"', '"fast"', "None", "KeyError"],
    answerIndex: 1,
    explanation:
      "update() copies keys from left into right and replaces values for keys that already exist.",
  },
  {
    topic: "Lists, Tuples, Sets and Dictionaries",
    question: "What is the length of {1, 2} ^ {2, 3}?",
    options: ["1", "2", "3", "4"],
    answerIndex: 1,
    explanation: "Set symmetric difference keeps values in exactly one set, giving {1, 3}.",
  },
  {
    topic: "Lists, Tuples, Sets and Dictionaries",
    question: "What does sorted(set([3, 1, 3])) return?",
    options: ["[3, 1, 3]", "[1, 3]", "{1, 3}", "[1, 1, 3]"],
    answerIndex: 1,
    explanation:
      "The set removes duplicates, and sorted() returns the remaining values in a new list.",
  },
  {
    topic: "Lists, Tuples, Sets and Dictionaries",
    question: "What value does values.pop(1) return?",
    code: "values = [10, 20, 30]",
    options: ["10", "20", "30", "[20]"],
    answerIndex: 1,
    explanation: "pop(index) removes and returns the item at that zero-based index.",
  },
  {
    topic: "Lists, Tuples, Sets and Dictionaries",
    question: "What is values after this slice assignment?",
    code: "values = [1, 2, 3, 4]\nvalues[1:3] = [8]",
    options: ["[1, 8, 4]", "[1, 8, 3, 4]", "[8, 1, 4]", "[1, 2, 8, 4]"],
    answerIndex: 0,
    explanation:
      "Slice assignment replaces the two selected items, 2 and 3, with the single item 8.",
  },
  {
    topic: "Lists, Tuples, Sets and Dictionaries",
    question: "After this code, what is rows?",
    code: "rows = [[1], [2]]\ncopy = rows.copy()\ncopy[0].append(9)",
    options: ["[[1], [2]]", "[[1, 9], [2]]", "[[9], [2]]", "A copy error"],
    answerIndex: 1,
    explanation:
      "list.copy() is shallow: the outer list is copied, but its nested lists are shared.",
  },
  {
    topic: "Lists, Tuples, Sets and Dictionaries",
    question: "What is the value of item after this code?",
    code: "item = (1, [2])\nitem[1].append(3)",
    options: ["(1, [2])", "(1, [2, 3])", "A TypeError", "(1, 3)"],
    answerIndex: 1,
    explanation: "The tuple cannot be reassigned, but the list stored inside it remains mutable.",
  },
  {
    topic: "Lists, Tuples, Sets and Dictionaries",
    question: "What does dict.items() return?",
    options: [
      "A dynamic view of key-value pairs",
      "A sorted list of keys",
      "A copy of the dictionary",
      "Only the dictionary values",
    ],
    answerIndex: 0,
    explanation:
      "items() returns a view that reflects the dictionary's key-value pairs, not a separate list copy.",
  },
  {
    topic: "Loops and Conditional Statements",
    question: "What list is produced by list(range(2, 11, 3))?",
    options: ["[2, 5, 8]", "[2, 5, 8, 11]", "[3, 6, 9]", "[2, 3, 4, 5, 6, 7, 8, 9, 10]"],
    answerIndex: 0,
    explanation: "range(start, stop, step) includes 2, 5, and 8; the stop value 11 is excluded.",
  },
  {
    topic: "Loops and Conditional Statements",
    question: "What index does the first item receive here?",
    code: 'for index, value in enumerate(["a", "b"], start=1):\n    ...',
    options: ["0", "1", '"a"', "None"],
    answerIndex: 1,
    explanation: "The start argument sets enumerate()'s initial index to 1.",
  },
  {
    topic: "Loops and Conditional Statements",
    question: 'How many pairs does list(zip([1, 2, 3], ["a", "b"])) contain?',
    options: ["0", "1", "2", "3"],
    answerIndex: 2,
    explanation: "zip() stops when its shortest input is exhausted, so it produces two pairs.",
  },
  {
    topic: "Loops and Conditional Statements",
    question: "When does a loop's else block run?",
    options: [
      "Only if the loop executes at least once",
      "When the loop finishes without being stopped by break",
      "Only when break is executed",
      "Only when the loop condition is initially false",
    ],
    answerIndex: 1,
    explanation:
      "A loop else block runs after normal completion, including zero iterations, but not after break.",
  },
  {
    topic: "Loops and Conditional Statements",
    question: "What does total become?",
    code: "total = 0\nfor n in range(5):\n    if n == 2:\n        continue\n    total += n",
    options: ["10", "8", "7", "2"],
    answerIndex: 1,
    explanation: "continue skips adding 2, so total is 0 + 1 + 3 + 4, which is 8.",
  },
  {
    topic: "Loops and Conditional Statements",
    question: "What value does result have?",
    code: 'score = 72\nresult = "pass" if score >= 60 else "retry"',
    options: ['"retry"', '"pass"', "72", "None"],
    answerIndex: 1,
    explanation: 'The conditional expression selects "pass" because 72 is at least 60.',
  },
  {
    topic: "Loops and Conditional Statements",
    question: "What does a for loop use by default when iterating over a dictionary?",
    options: ["Values", "Key-value tuples", "Keys", "Sorted keys"],
    answerIndex: 2,
    explanation: "Iterating over a dictionary directly yields its keys.",
  },
  {
    topic: "Loops and Conditional Statements",
    question: "How many times does this loop print a number?",
    code: "count = 0\nwhile count < 3:\n    print(count)\n    count += 1",
    options: ["2", "3", "4", "It never stops"],
    answerIndex: 1,
    explanation: "The loop prints 0, 1, and 2, then stops when count reaches 3.",
  },
  {
    topic: "Loops and Conditional Statements",
    question: "What does the condition x is None test?",
    options: [
      "Whether x is equal to zero",
      "Whether x is the singleton None object",
      "Whether x is an empty container",
      "Whether x is undefined",
    ],
    answerIndex: 1,
    explanation:
      "is checks object identity; None is a singleton, so x is None is the idiomatic check.",
  },
  {
    topic: "Loops and Conditional Statements",
    question: "What is printed?",
    code: 'for n in range(4):\n    if n == 2:\n        break\nelse:\n    print("done")\nprint("end")',
    options: ["done then end", "end only", "2 then end", "Nothing"],
    answerIndex: 1,
    explanation: "break exits the loop, so its else block is skipped; the final print still runs.",
  },
  {
    topic: "Functions and Modules",
    question: "What is the main risk of using a mutable default argument?",
    code: "def add_item(item, items=[]):\n    items.append(item)\n    return items",
    options: [
      "A new list is created for every call",
      "The same default list is reused across calls",
      "The function cannot return a list",
      "Python converts the list to a tuple",
    ],
    answerIndex: 1,
    explanation:
      "Default expressions are evaluated once when the function is defined, so calls can share the same list.",
  },
  {
    topic: "Functions and Modules",
    question: "How must b be passed to this function?",
    code: "def combine(a, *, b):\n    return a + b",
    options: [
      "Only positionally",
      "As a keyword argument",
      "As the first argument",
      "It cannot be passed",
    ],
    answerIndex: 1,
    explanation: "Parameters after * are keyword-only, so callers must write b=value.",
  },
  {
    topic: "Functions and Modules",
    question: "In def show(value, /), how may value be passed?",
    options: [
      "Only as a keyword argument",
      "Only positionally",
      "Either positionally or by keyword",
      "It must use *args",
    ],
    answerIndex: 1,
    explanation: "The slash marks preceding parameters as positional-only.",
  },
  {
    topic: "Functions and Modules",
    question: "Inside def collect(*args), what type is args?",
    options: ["A tuple", "A dictionary", "A generator", "A set"],
    answerIndex: 0,
    explanation: "*args gathers extra positional arguments into a tuple.",
  },
  {
    topic: "Functions and Modules",
    question: "Inside def collect(**kwargs), what type is kwargs?",
    options: ["A tuple", "A dictionary", "A list", "A function"],
    answerIndex: 1,
    explanation: "**kwargs gathers extra keyword arguments into a dictionary.",
  },
  {
    topic: "Functions and Modules",
    question: "What does make_multiplier(3)(4) return?",
    code: "def make_multiplier(factor):\n    return lambda value: factor * value",
    options: ["7", "12", "3", "A TypeError"],
    answerIndex: 1,
    explanation:
      "make_multiplier(3) returns a function that multiplies its input by 3; passing 4 returns 12.",
  },
  {
    topic: "Functions and Modules",
    question: "What does nonlocal total refer to inside a nested function?",
    options: [
      "A variable in the nearest enclosing function scope",
      "A variable in the builtins module",
      "A local variable in the current function only",
      "A class attribute",
    ],
    answerIndex: 0,
    explanation:
      "nonlocal binds to an existing name in an enclosing function scope, not the global scope.",
  },
  {
    topic: "Functions and Modules",
    question: "What does map(str, [1, 2]) return in Python 3?",
    options: ["A list containing strings", "A map iterator", "A dictionary", 'The string "12"'],
    answerIndex: 1,
    explanation:
      "In Python 3, map() returns a lazy iterator; use list(map(...)) to materialize its values.",
  },
  {
    topic: "Functions and Modules",
    question: "What does list(filter(lambda n: n % 2, range(5))) return?",
    options: ["[0, 2, 4]", "[1, 3]", "[1, 2, 3, 4]", "[0, 1, 2, 3, 4]"],
    answerIndex: 1,
    explanation: "The predicate is truthy for odd numbers, so filter keeps 1 and 3.",
  },
  {
    topic: "Functions and Modules",
    question: "After from math import sqrt as root, what does root(16) return?",
    options: ["4", "4.0", "16", "A NameError"],
    answerIndex: 1,
    explanation:
      "The imported function is available under the alias root, and math.sqrt returns a float.",
  },
  {
    topic: "Object-Oriented Programming",
    question: "After this code, what are (first.value, second.value)?",
    code: "class Box:\n    value = 1\n\nfirst = Box()\nsecond = Box()\nfirst.value = 5",
    options: ["(5, 5)", "(5, 1)", "(1, 5)", "(1, 1)"],
    answerIndex: 1,
    explanation:
      "Assigning first.value creates an instance attribute that shadows the class attribute only for first.",
  },
  {
    topic: "Object-Oriented Programming",
    question: "How is a method decorated with @property normally accessed?",
    options: [
      "As an attribute, without parentheses",
      "Only as a class method",
      "By calling property()",
      "As a dictionary key",
    ],
    answerIndex: 0,
    explanation: "A property exposes a method through attribute access, such as object.name.",
  },
  {
    topic: "Object-Oriented Programming",
    question: "What is the usual purpose of __repr__?",
    options: [
      "Provide a developer-oriented representation of an object",
      "Initialize the parent class",
      "Prevent an object from being printed",
      "Convert every attribute to JSON",
    ],
    answerIndex: 0,
    explanation: "__repr__ aims to provide an unambiguous, useful representation for debugging.",
  },
  {
    topic: "Object-Oriented Programming",
    question: "Which implementation is called when a subclass overrides a method?",
    options: [
      "Always the base-class implementation",
      "The implementation selected by the object's runtime type",
      "Both implementations automatically",
      "Neither; overriding is not supported",
    ],
    answerIndex: 1,
    explanation:
      "Python uses dynamic method dispatch and looks up the method using the instance's class MRO.",
  },
  {
    topic: "Object-Oriented Programming",
    question: "If Child inherits from Parent, what does isinstance(Child(), Parent) return?",
    options: ["True", "False", "None", "A TypeError"],
    answerIndex: 0,
    explanation: "Instances of a subclass are also instances of their base classes.",
  },
  {
    topic: "Object-Oriented Programming",
    question: "What does @dataclass generate by default for a simple class with annotated fields?",
    options: [
      "Methods such as __init__ and __repr__",
      "A database table",
      "A property for every method",
      "Only a custom __str__ method",
    ],
    answerIndex: 0,
    explanation:
      "The dataclass decorator generates common methods, including __init__ and __repr__, from annotated fields.",
  },
  {
    topic: "Object-Oriented Programming",
    question: "A Car object that stores an Engine object is an example of which relationship?",
    options: ["Composition", "Multiple inheritance", "Operator overloading", "Metaclass creation"],
    answerIndex: 0,
    explanation:
      "Composition models a has-a relationship: the car contains or uses an engine object.",
  },
  {
    topic: "Object-Oriented Programming",
    question: "What is ClassName.__mro__?",
    options: [
      "The tuple of classes Python searches for attribute and method lookup",
      "A list of every instance of the class",
      "The class's constructor arguments",
      "A dictionary of overridden methods only",
    ],
    answerIndex: 0,
    explanation:
      "__mro__ is the method resolution order that Python follows when looking up attributes.",
  },
  {
    topic: "Object-Oriented Programming",
    question: "In cooperative multiple inheritance, what does super() follow?",
    options: [
      "The method resolution order",
      "Only the textually nearest parent",
      "Alphabetical class-name order",
      "The order instances were created",
    ],
    answerIndex: 0,
    explanation:
      "super() continues lookup through the class's MRO, enabling cooperative multiple inheritance.",
  },
  {
    topic: "Object-Oriented Programming",
    question:
      'For a class with no base classes, what is a common effect of defining __slots__ = ("name",) without __dict__?',
    options: [
      "Instances cannot gain arbitrary new attributes",
      "The class cannot be inherited",
      "All methods become static",
      "The class becomes immutable",
    ],
    answerIndex: 0,
    explanation:
      "__slots__ declares permitted instance attributes and, without __dict__, prevents arbitrary extra attributes.",
  },
  {
    topic: "Exception Handling",
    question: "Why should except FileNotFoundError usually appear before except OSError?",
    options: [
      "FileNotFoundError is a subclass of OSError",
      "OSError is a subclass of FileNotFoundError",
      "Python requires alphabetical exception order",
      "The two exceptions cannot be handled together",
    ],
    answerIndex: 0,
    explanation:
      "A broad base-class handler first would also catch FileNotFoundError, making the specific handler unreachable.",
  },
  {
    topic: "Exception Handling",
    question: "Which exception is caught by except (ValueError, TypeError)?",
    options: [
      "Either ValueError or TypeError",
      "Only ValueError",
      "Only TypeError if ValueError was caught first",
      "Every exception derived from BaseException",
    ],
    answerIndex: 0,
    explanation: "An exception tuple lets one handler catch any listed exception type.",
  },
  {
    topic: "Exception Handling",
    question: "When does the else block of try/except run?",
    options: [
      "When the try block completes without raising an exception",
      "Only when an exception is handled",
      "Before the try block starts",
      "Only when finally is absent",
    ],
    answerIndex: 0,
    explanation: "The try/except else block runs only if the try suite raised no exception.",
  },
  {
    topic: "Exception Handling",
    question: "If a return statement runs inside try, what happens to finally?",
    options: [
      "finally runs before the function returns",
      "finally is skipped",
      "finally runs only if the return value is None",
      "Python raises SyntaxError",
    ],
    answerIndex: 0,
    explanation:
      "Python executes finally while unwinding control flow, including before completing a return.",
  },
  {
    topic: "Exception Handling",
    question: "How should a custom exception named InvalidRecord usually be declared?",
    options: [
      "class InvalidRecord(Exception): pass",
      "def InvalidRecord(Exception): pass",
      "raise InvalidRecord = Exception",
      "import InvalidRecord from Exception",
    ],
    answerIndex: 0,
    explanation: "Custom exceptions are classes, typically subclasses of Exception.",
  },
  {
    topic: "Exception Handling",
    question: 'What does raise ValueError("bad input") do?',
    options: [
      "Creates and raises a ValueError",
      "Returns a ValueError object without raising it",
      "Prints a warning and continues",
      "Catches the next ValueError",
    ],
    answerIndex: 0,
    explanation: "raise begins exception propagation using the supplied exception instance.",
  },
  {
    topic: "Exception Handling",
    question: 'What is the effect of raise RuntimeError("failed") from exc?',
    options: [
      "Sets exc as the explicit cause of the new exception",
      "Suppresses both exceptions",
      "Retries the failed statement",
      "Converts exc into a warning",
    ],
    answerIndex: 0,
    explanation:
      "The from clause records an explicit exception cause, which Python displays in the traceback.",
  },
  {
    topic: "Exception Handling",
    question: "Which exception is not caught by except Exception?",
    options: ["ValueError", "RuntimeError", "KeyboardInterrupt", "LookupError"],
    answerIndex: 2,
    explanation:
      "KeyboardInterrupt inherits directly from BaseException, not Exception, so normal application handlers do not swallow it.",
  },
  {
    topic: "Exception Handling",
    question: "What happens when assert condition is false during normal Python execution?",
    options: [
      "An AssertionError is raised",
      "The condition is silently ignored",
      "A ValueError is raised",
      "The program restarts",
    ],
    answerIndex: 0,
    explanation:
      "A failed assert raises AssertionError; assertions are intended for internal debugging checks.",
  },
  {
    topic: "Exception Handling",
    question: "Which try statement is valid even without an except block?",
    options: [
      "try with a finally block",
      "try with an else block only",
      "try with no except, else, or finally",
      "None; every try requires except",
    ],
    answerIndex: 0,
    explanation: "A try statement may use finally without except, which is useful for cleanup.",
  },
  {
    topic: "File Handling",
    question: "What does a with block ensure when used with open()?",
    options: [
      "The file is closed when the block exits",
      "The file is deleted when the block exits",
      "The file is always opened in binary mode",
      "The file's contents are automatically backed up",
    ],
    answerIndex: 0,
    explanation:
      "The file object is a context manager that closes the file when its with block exits.",
  },
  {
    topic: "File Handling",
    question: 'What does opening a file with mode "a" do?',
    options: [
      "Appends writes and creates the file if needed",
      "Reads only and fails if the file is absent",
      "Truncates the file before writing",
      "Creates the file only if it already exists",
    ],
    answerIndex: 0,
    explanation: "Append mode writes at the end and creates the file if it does not exist.",
  },
  {
    topic: "File Handling",
    question: 'What happens when open(path, "x") targets an existing file?',
    options: [
      "The existing file is truncated",
      "The file is opened for reading",
      "FileExistsError is raised",
      "The new content is appended",
    ],
    answerIndex: 2,
    explanation: "Exclusive creation mode fails rather than overwriting an existing path.",
  },
  {
    topic: "File Handling",
    question: "What does file.readlines() return?",
    options: [
      "A list of lines read from the file",
      "A single integer containing the file size",
      "A file handle positioned at the end",
      "A dictionary of line numbers",
    ],
    answerIndex: 0,
    explanation: "readlines() reads the remaining lines and returns them as a list of strings.",
  },
  {
    topic: "File Handling",
    question: "In text mode, what does file.read(4) request?",
    options: [
      "Up to four characters",
      "Exactly four lines",
      "Four bytes regardless of encoding",
      "The fourth line only",
    ],
    answerIndex: 0,
    explanation:
      "In text mode, the size argument is a character count; fewer characters may be returned at end-of-file.",
  },
  {
    topic: "File Handling",
    question: "What does file.seek(0) do?",
    options: [
      "Moves the file position to the beginning",
      "Reads the first line",
      "Closes the file",
      "Returns the file's byte count",
    ],
    answerIndex: 0,
    explanation: "Seeking to offset 0 from the beginning resets the stream position to the start.",
  },
  {
    topic: "File Handling",
    question: "What information does file.tell() provide?",
    options: [
      "The current stream position",
      "The number of lines in the file",
      "The file's extension",
      "Whether the file is writable",
    ],
    answerIndex: 0,
    explanation: "tell() reports the current position in the file stream.",
  },
  {
    topic: "File Handling",
    question: 'Why is encoding="utf-8" often specified when opening a text file?',
    options: [
      "To make text decoding and encoding explicit and consistent",
      "To compress the file automatically",
      "To switch the file into binary mode",
      "To prevent the file from being closed",
    ],
    answerIndex: 0,
    explanation: "Specifying UTF-8 avoids relying on machine-dependent default text encodings.",
  },
  {
    topic: "File Handling",
    question: "What does json.dump(data, file) do?",
    options: [
      "Serializes data as JSON into the open file",
      "Loads JSON from the file into data",
      "Deletes the file after serialization",
      "Converts the file object into a dictionary",
    ],
    answerIndex: 0,
    explanation: "json.dump writes a JSON representation of a Python object to a file-like object.",
  },
  {
    topic: "File Handling",
    question: 'What type of object should be written to a file opened with "wb"?',
    options: ["bytes", "str", "dict", "A text-mode file"],
    answerIndex: 0,
    explanation:
      "Binary mode expects bytes-like data; encode text first if it must be written as bytes.",
  },
  {
    topic: "Advanced Python Concepts",
    question: "What does iter(iterable) return?",
    options: [
      "An iterator for the iterable",
      "A list copy of the iterable",
      "The iterable's length",
      "A generator function",
    ],
    answerIndex: 0,
    explanation: "iter() obtains an iterator, which produces values one at a time.",
  },
  {
    topic: "Advanced Python Concepts",
    question: 'What does next(iterator, "done") return after the iterator is exhausted?',
    options: ["It raises StopIteration", '"done"', "None", "The last item again"],
    answerIndex: 1,
    explanation: "When a default is supplied, next() returns it instead of raising StopIteration.",
  },
  {
    topic: "Advanced Python Concepts",
    question: "When does the body of this generator function begin executing?",
    code: 'def values():\n    print("start")\n    yield 1\n\ngenerator = values()',
    options: [
      "When values() is called",
      "When the generator is first advanced",
      "When the function is defined",
      "It executes twice",
    ],
    answerIndex: 1,
    explanation:
      "Calling a generator function creates a generator; its body begins when next(), a loop, or similar operation advances it.",
  },
  {
    topic: "Advanced Python Concepts",
    question: "What does yield from another_iterator do?",
    options: [
      "Delegates iteration to another iterator or iterable",
      "Copies all values into a tuple immediately",
      "Defines a nested class",
      "Raises StopIteration before iteration",
    ],
    answerIndex: 0,
    explanation:
      "yield from forwards values from a sub-iterator and delegates parts of the generator protocol.",
  },
  {
    topic: "Advanced Python Concepts",
    question: "Which scope does global name refer to inside a function?",
    options: [
      "The module's global namespace",
      "The nearest enclosing function",
      "The current class instance",
      "The builtins namespace only",
    ],
    answerIndex: 0,
    explanation:
      "A global declaration makes assignments to that name target the module-level binding.",
  },
  {
    topic: "Advanced Python Concepts",
    question: "What does copy.copy() make of a nested list?",
    options: [
      "A shallow outer copy that still shares nested objects",
      "A recursive copy of every nested object",
      "An immutable tuple",
      "A serialized JSON string",
    ],
    answerIndex: 0,
    explanation:
      "copy.copy duplicates only the outer object; use copy.deepcopy for recursive copying.",
  },
  {
    topic: "Advanced Python Concepts",
    question: "What is the purpose of copy.deepcopy()?",
    options: [
      "Recursively copy an object and its nested contents",
      "Create only a new outer container",
      "Freeze an object so it cannot change",
      "Convert an object to a generator",
    ],
    answerIndex: 0,
    explanation:
      "deepcopy recursively copies nested objects when possible, avoiding shared nested references.",
  },
  {
    topic: "Advanced Python Concepts",
    question: "Which methods form the basic synchronous context manager protocol?",
    options: [
      "__enter__ and __exit__",
      "__iter__ and __next__",
      "__get__ and __set__",
      "__open__ and __close__",
    ],
    answerIndex: 0,
    explanation:
      "A context manager implements __enter__ and __exit__ to support the with statement.",
  },
  {
    topic: "Advanced Python Concepts",
    question: "What can a context manager's __exit__ return value do?",
    options: [
      "Suppress an exception by returning a truthy value",
      "Restart the with block",
      "Change every local variable to global",
      "Prevent __enter__ from running",
    ],
    answerIndex: 0,
    explanation:
      "If __exit__ returns truthy while an exception is active, that exception is suppressed.",
  },
  {
    topic: "Advanced Python Concepts",
    question: "What does calling an async def function produce before it is awaited?",
    options: ["A coroutine object", "A running thread", "A completed result", "A generator list"],
    answerIndex: 0,
    explanation:
      "Calling an async function creates a coroutine object; it must be awaited or scheduled to run.",
  },
  {
    topic: "Decorators, Generators and Lambda Functions",
    question: "What is the effect of @decorator above a function definition?",
    options: [
      "It assigns decorator(function) back to the function name",
      "It runs the function once and stores its result",
      "It converts the function into a class",
      "It prevents the function from being called",
    ],
    answerIndex: 0,
    explanation:
      "Decorator syntax is equivalent to defining the function and then rebinding its name to decorator(function).",
  },
  {
    topic: "Decorators, Generators and Lambda Functions",
    question: "Why use functools.wraps inside a decorator wrapper?",
    options: [
      "To preserve useful metadata from the wrapped function",
      "To make every function asynchronous",
      "To cache all return values",
      "To turn positional arguments into keywords",
    ],
    answerIndex: 0,
    explanation:
      "wraps copies metadata such as __name__ and __doc__ and sets __wrapped__ on the wrapper.",
  },
  {
    topic: "Decorators, Generators and Lambda Functions",
    question:
      "For a decorator that accepts arguments, what does the outermost call usually return?",
    options: [
      "A decorator function that will receive the target function",
      "The target function's final result",
      "A generator object",
      "A class instance for every function call",
    ],
    answerIndex: 0,
    explanation:
      "A parameterized decorator typically has an outer factory that returns the actual decorator.",
  },
  {
    topic: "Decorators, Generators and Lambda Functions",
    question: "After a generator is primed, what does generator.send(5) do?",
    options: [
      "Sends 5 as the result of the suspended yield expression",
      "Adds 5 to every future yielded value",
      "Restarts the generator",
      "Closes the generator immediately",
    ],
    answerIndex: 0,
    explanation:
      "send(value) resumes a suspended generator, making value the result of its current yield expression.",
  },
  {
    topic: "Decorators, Generators and Lambda Functions",
    question: "What value is available as StopIteration.value when this generator finishes?",
    code: "def result():\n    yield 1\n    return 9",
    options: ["1", "9", "None", "A list containing 1 and 9"],
    answerIndex: 1,
    explanation:
      "A generator's return value is carried in StopIteration.value; it is not yielded as another item.",
  },
  {
    topic: "Decorators, Generators and Lambda Functions",
    question: "Which operation is allowed in a lambda expression?",
    options: [
      "A single expression whose value is returned",
      "Several statements separated by semicolons",
      "A for loop with a break statement",
      "A try/except statement",
    ],
    answerIndex: 0,
    explanation: "A lambda body is an expression, not a block of statements.",
  },
  {
    topic: "Decorators, Generators and Lambda Functions",
    question: "What values are returned by the functions in results?",
    code: "functions = [lambda: n for n in range(3)]\nresults = [fn() for fn in functions]",
    options: ["[0, 1, 2]", "[2, 2, 2]", "[0, 0, 0]", "A NameError"],
    answerIndex: 1,
    explanation:
      "The lambdas look up n when called, after the loop has finished, so each sees the final value 2.",
  },
  {
    topic: "Decorators, Generators and Lambda Functions",
    question: "What does sorted(words, key=str.lower) use to compare each word?",
    options: [
      "A lowercase version of each word",
      "The length of each word",
      "The original list index",
      "The reverse of each word",
    ],
    answerIndex: 0,
    explanation:
      "The key function is called for each item, so str.lower provides case-normalized sort keys.",
  },
  {
    topic: "Decorators, Generators and Lambda Functions",
    question: "What does (n * n for n in range(3)) create?",
    options: [
      "A generator expression",
      "A list containing [0, 1, 4]",
      "A tuple containing (0, 1, 4)",
      "A dictionary with three entries",
    ],
    answerIndex: 0,
    explanation:
      "Parentheses around a comprehension create a lazy generator expression, not a materialized list.",
  },
  {
    topic: "Decorators, Generators and Lambda Functions",
    question: "What list does this expression produce?",
    code: "functions = [lambda n=n: n for n in range(3)]\nresults = [fn() for fn in functions]",
    options: ["[0, 1, 2]", "[2, 2, 2]", "[1, 2, 3]", "A TypeError"],
    answerIndex: 0,
    explanation:
      "The default argument captures each current value of n when its lambda is created.",
  },
];
