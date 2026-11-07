/* Supplied Python questions and answers for the browser-only tutor. */
window.SUKKU_PYTHON_QUESTIONS = [
  {
    level: "basic",
    category: "intro",
    question: "What is Python?",
    answer:
      "Python is a high-level, interpreted, dynamically typed, general-purpose programming language known for its readable syntax. Example: print('Hello, Nepal!')",
  },
  {
    level: "basic",
    category: "intro",
    question: "Who created Python and when?",
    answer: "Python was created by Guido van Rossum and first released in 1991.",
  },
  {
    level: "basic",
    category: "intro",
    question: "Why is Python popular?",
    answer:
      "It has simple readable syntax, a huge standard library, many third-party packages (NumPy, Pandas, Django, Flask, TensorFlow), and is used in web, data science, AI, automation and scripting.",
  },
  {
    level: "basic",
    category: "intro",
    question: "What does interpreted language mean?",
    answer:
      "Python code is executed line by line by the interpreter. It is first compiled to bytecode, which the Python Virtual Machine (PVM) runs.",
  },
  {
    level: "basic",
    category: "intro",
    question: "What is PEP 8?",
    answer:
      "PEP 8 is the official Python style guide. It recommends 4-space indentation, snake_case names for variables and functions, and CamelCase for classes.",
  },
  {
    level: "basic",
    category: "variables",
    question: "What is a variable in Python?",
    answer:
      "A variable is a name that refers to a value in memory. You create it by assignment, with no type declaration. Example: age = 20",
  },
  {
    level: "basic",
    category: "variables",
    question: "What are the naming rules for variables?",
    answer:
      "A name must start with a letter or underscore, can contain letters, digits and underscores, is case-sensitive, and cannot be a keyword such as if, for or class.",
  },
  {
    level: "basic",
    category: "variables",
    question: "What are the built-in data types in Python?",
    answer:
      "int, float, complex, str, bool, list, tuple, set, frozenset, dict, bytes and NoneType.",
  },
  {
    level: "basic",
    category: "variables",
    question: "What is dynamic typing?",
    answer:
      "The type of a variable is decided at runtime and can change. Example: x = 5 then x = 'hello' is allowed.",
  },
  {
    level: "basic",
    category: "variables",
    question: "How do you convert between data types?",
    answer: "Use casting functions: int('42'), float('3.5'), str(100), bool(0), list('abc').",
  },
  {
    level: "basic",
    category: "operators",
    question: "What is the difference between / and // in Python?",
    answer:
      "/ is true division and always returns a float (10 / 3 = 3.333...). // is floor division and returns the integer part (10 // 3 = 3).",
  },
  {
    level: "basic",
    category: "operators",
    question: "What is the difference between == and is?",
    answer:
      "== compares values. is compares identity (whether both names point to the same object in memory). Example: [1,2] == [1,2] is True, but [1,2] is [1,2] is False.",
  },
  {
    level: "basic",
    category: "operators",
    question: "What do the operators %, ** and // do?",
    answer:
      "% gives the remainder (10 % 3 = 1), ** is power (2 ** 3 = 8), // is floor division (10 // 3 = 3).",
  },
  {
    level: "basic",
    category: "operators",
    question: "What are membership operators?",
    answer:
      "in and not in check whether a value exists in a sequence. Example: 3 in [1, 2, 3] is True.",
  },
  {
    level: "basic",
    category: "io",
    question: "How do you take input from the user?",
    answer:
      "Use input(). It always returns a string, so convert it when needed. Example: age = int(input('Enter age: '))",
  },
  {
    level: "basic",
    category: "io",
    question: "What is an f-string?",
    answer:
      "An f-string is a formatted string literal that embeds expressions in braces. Example: name = 'Ram'; print(f'Hello {name}') prints Hello Ram.",
  },
  {
    level: "basic",
    category: "control",
    question: "How does if-elif-else work?",
    answer:
      "Python checks conditions top to bottom and runs the first block whose condition is True. Example: if m >= 80: print('A') elif m >= 60: print('B') else: print('C')",
  },
  {
    level: "basic",
    category: "control",
    question: "What are the types of loops in Python?",
    answer:
      "for loops iterate over a sequence (for i in range(5)). while loops repeat while a condition is True (while n > 0).",
  },
  {
    level: "basic",
    category: "control",
    question: "What do break, continue and pass do?",
    answer:
      "break exits the loop, continue skips to the next iteration, pass does nothing and is used as a placeholder.",
  },
  {
    level: "basic",
    category: "control",
    question: "What is the else clause on a loop?",
    answer: "The else block of a loop runs only if the loop finished without hitting break.",
  },
  {
    level: "basic",
    category: "control",
    question: "What does range() do?",
    answer:
      "range(start, stop, step) generates numbers from start up to but not including stop. range(5) gives 0,1,2,3,4 and range(1, 10, 2) gives 1,3,5,7,9.",
  },
  {
    level: "basic",
    category: "strings",
    question: "Are strings mutable in Python?",
    answer:
      "No. Strings are immutable, so you cannot change a character in place. Create a new string instead: s = 'J' + s[1:]",
  },
  {
    level: "basic",
    category: "strings",
    question: "How do you reverse a string?",
    answer: "Use slicing: 'Python'[::-1] returns 'nohtyP'.",
  },
  {
    level: "basic",
    category: "strings",
    question: "What are common string methods?",
    answer:
      "upper(), lower(), strip(), replace(), split(), join(), find(), count(), startswith(), endswith(), isdigit(), isalpha().",
  },
  {
    level: "basic",
    category: "strings",
    question: "How do you split and join a string?",
    answer:
      "split() breaks a string into a list: 'a,b,c'.split(',') gives ['a','b','c']. join() combines a list: '-'.join(['x','y']) gives 'x-y'.",
  },
  {
    level: "intermediate",
    category: "data-structures",
    question: "What is the difference between list, tuple, set and dictionary?",
    answer:
      "List: ordered, mutable, allows duplicates. Tuple: ordered, immutable, allows duplicates. Set: unordered, mutable, unique items only. Dictionary: key-value pairs with unique keys, ordered since Python 3.7.",
  },
  {
    level: "intermediate",
    category: "data-structures",
    question: "What is the difference between list and tuple?",
    answer:
      "A list is mutable and can be changed after creation. A tuple is immutable, faster, and can be used as a dictionary key.",
  },
  {
    level: "intermediate",
    category: "data-structures",
    question: "What is the difference between append() and extend()?",
    answer:
      "append(x) adds x as one single item. extend(iterable) adds each element of the iterable. [1,2].append([3]) gives [1,2,[3]] but [1,2].extend([3]) gives [1,2,3].",
  },
  {
    level: "intermediate",
    category: "data-structures",
    question: "What is the difference between remove(), pop() and del?",
    answer:
      "remove(value) deletes the first matching value. pop(index) deletes by index and returns the item (last item by default). del deletes by index or slice and returns nothing.",
  },
  {
    level: "intermediate",
    category: "data-structures",
    question: "How do you remove duplicates from a list?",
    answer: "Use a set: list(set(lst)). To keep the original order use list(dict.fromkeys(lst)).",
  },
  {
    level: "intermediate",
    category: "data-structures",
    question: "How do you sort a list?",
    answer:
      "lst.sort() sorts in place. sorted(lst) returns a new sorted list. Both accept reverse=True and key=function.",
  },
  {
    level: "intermediate",
    category: "data-structures",
    question: "What is slicing?",
    answer:
      "Slicing extracts part of a sequence using [start:stop:step]. Example: a[1:4], a[::2], a[::-1] (reverse).",
  },
  {
    level: "intermediate",
    category: "data-structures",
    question: "How do you access, add and delete items in a dictionary?",
    answer:
      "Access: d['key'] or d.get('key'). Add or update: d['key'] = value. Delete: d.pop('key') or del d['key'].",
  },
  {
    level: "intermediate",
    category: "data-structures",
    question: "What is the difference between d['key'] and d.get('key')?",
    answer:
      "d['key'] raises KeyError if the key is missing. d.get('key') returns None (or a default you supply) instead.",
  },
  {
    level: "intermediate",
    category: "data-structures",
    question: "What are set operations?",
    answer: "Union a | b, intersection a & b, difference a - b, symmetric difference a ^ b.",
  },
  {
    level: "intermediate",
    category: "data-structures",
    question: "What is list comprehension?",
    answer:
      "A short way to build a list from an iterable. Example: [x**2 for x in range(5) if x % 2 == 0] gives [0, 4, 16].",
  },
  {
    level: "intermediate",
    category: "data-structures",
    question: "What is a dictionary comprehension?",
    answer:
      "A compact way to build a dictionary. Example: {x: x**2 for x in range(4)} gives {0: 0, 1: 1, 2: 4, 3: 9}.",
  },
  {
    level: "intermediate",
    category: "functions",
    question: "How do you define a function in Python?",
    answer: "Use the def keyword. Example: def add(a, b=0): return a + b",
  },
  {
    level: "intermediate",
    category: "functions",
    question: "What are *args and **kwargs?",
    answer:
      "*args collects extra positional arguments into a tuple. **kwargs collects extra keyword arguments into a dictionary. Example: def f(*args, **kwargs): print(args, kwargs)",
  },
  {
    level: "intermediate",
    category: "functions",
    question: "What is a lambda function?",
    answer:
      "A small anonymous function written in one expression. Example: square = lambda x: x * x",
  },
  {
    level: "intermediate",
    category: "functions",
    question: "What are map(), filter() and reduce()?",
    answer:
      "map applies a function to every item, filter keeps items where the function returns True, reduce (from functools) combines all items into a single value.",
  },
  {
    level: "intermediate",
    category: "functions",
    question: "What is the LEGB rule?",
    answer: "The order Python searches for a name: Local, Enclosing, Global, Built-in.",
  },
  {
    level: "intermediate",
    category: "functions",
    question: "What is the difference between global and nonlocal?",
    answer:
      "global lets a function modify a module-level variable. nonlocal lets an inner function modify a variable of its enclosing function.",
  },
  {
    level: "intermediate",
    category: "functions",
    question: "What is recursion?",
    answer:
      "A function that calls itself. It needs a base case to stop. Example: def fact(n): return 1 if n <= 1 else n * fact(n - 1)",
  },
  {
    level: "intermediate",
    category: "functions",
    question: "What is the mutable default argument problem?",
    answer:
      "A default like def f(x, lst=[]) is created once and shared between calls. Use lst=None and create the list inside the function instead.",
  },
  {
    level: "intermediate",
    category: "functions",
    question: "What is a docstring?",
    answer:
      "A string placed as the first statement in a function, class or module to document it. It can be read through help() or the __doc__ attribute.",
  },
  {
    level: "intermediate",
    category: "errors-files",
    question: "How does exception handling work in Python?",
    answer:
      "Use try for risky code, except to handle errors, else to run when there is no error, finally to always run cleanup code, and raise to throw an exception.",
  },
  {
    level: "intermediate",
    category: "errors-files",
    question: "What are common exceptions in Python?",
    answer:
      "ValueError, TypeError, ZeroDivisionError, IndexError, KeyError, FileNotFoundError, AttributeError and ImportError.",
  },
  {
    level: "intermediate",
    category: "errors-files",
    question: "How do you create a custom exception?",
    answer:
      "Subclass Exception. Example: class MyError(Exception): pass, then raise MyError('message').",
  },
  {
    level: "intermediate",
    category: "errors-files",
    question: "How do you read and write files?",
    answer:
      "Use with open('file.txt', 'w') as f: f.write('text') to write and with open('file.txt') as f: f.read() to read. The with statement closes the file automatically.",
  },
  {
    level: "intermediate",
    category: "errors-files",
    question: "What are the file modes in Python?",
    answer: "r read, w write (overwrites), a append, x create, b binary, + read and write.",
  },
  {
    level: "intermediate",
    category: "errors-files",
    question: "What are modules and packages?",
    answer:
      "A module is a .py file with reusable code. A package is a folder of modules containing an __init__.py file. Install third-party packages with pip install name.",
  },
  {
    level: "intermediate",
    category: "errors-files",
    question: "What does if __name__ == '__main__' do?",
    answer:
      "It runs the code only when the file is executed directly, not when it is imported as a module.",
  },
  {
    level: "intermediate",
    category: "errors-files",
    question: "What is a virtual environment?",
    answer:
      "An isolated Python environment with its own packages. Create it with python -m venv venv, activate it, then use pip install inside it.",
  },
  {
    level: "advanced",
    category: "oop",
    question: "What is a class and an object?",
    answer:
      "A class is a blueprint. An object is an instance created from that class. Example: class Student: ... then s = Student().",
  },
  {
    level: "advanced",
    category: "oop",
    question: "What is __init__ and self?",
    answer:
      "__init__ is the constructor, called automatically when an object is created. self refers to the current object instance.",
  },
  {
    level: "advanced",
    category: "oop",
    question: "What is the difference between instance variables and class variables?",
    answer:
      "Instance variables belong to each object (self.name). Class variables are shared by all objects of the class and are defined in the class body.",
  },
  {
    level: "advanced",
    category: "oop",
    question: "What is inheritance?",
    answer:
      "A child class reuses and extends a parent class. Example: class Dog(Animal). super() calls the parent's methods.",
  },
  {
    level: "advanced",
    category: "oop",
    question: "What are the four pillars of OOP?",
    answer:
      "Encapsulation (bundle data and methods, hide details), Inheritance (reuse parent class), Polymorphism (same method name, different behavior), Abstraction (hide implementation, expose essentials).",
  },
  {
    level: "advanced",
    category: "oop",
    question: "What is polymorphism?",
    answer:
      "The same method name behaves differently in different classes. Example: Dog.speak() returns Woof and Cat.speak() returns Meow.",
  },
  {
    level: "advanced",
    category: "oop",
    question: "What is encapsulation and how are private attributes made?",
    answer:
      "Encapsulation hides internal data. Prefix a name with double underscore (self.__balance) to make it private through name mangling, and a single underscore (_x) by convention for protected.",
  },
  {
    level: "advanced",
    category: "oop",
    question: "What is abstraction and how is it done?",
    answer:
      "Abstraction hides implementation details. Use the abc module: subclass ABC and mark methods with @abstractmethod. An abstract class cannot be instantiated.",
  },
  {
    level: "advanced",
    category: "oop",
    question: "What is method overriding and overloading?",
    answer:
      "Overriding: a child class redefines a parent's method. Python has no true overloading; use default arguments or *args instead.",
  },
  {
    level: "advanced",
    category: "oop",
    question: "What are dunder (magic) methods?",
    answer:
      "Special methods with double underscores that customize behavior: __init__, __str__, __repr__, __len__, __add__, __eq__, __getitem__, __call__.",
  },
  {
    level: "advanced",
    category: "oop",
    question: "What is the difference between __str__ and __repr__?",
    answer:
      "__str__ returns a readable string for users (used by print). __repr__ returns an unambiguous developer-oriented string, ideally one that could recreate the object.",
  },
  {
    level: "advanced",
    category: "oop",
    question: "What is the difference between @classmethod, @staticmethod and @property?",
    answer:
      "@classmethod receives the class (cls) and is often an alternative constructor. @staticmethod receives neither self nor cls. @property makes a method accessible like an attribute.",
  },
  {
    level: "advanced",
    category: "oop",
    question: "What is MRO?",
    answer:
      "Method Resolution Order is the order in which Python searches parent classes for a method, especially with multiple inheritance. View it with ClassName.__mro__.",
  },
  {
    level: "advanced",
    category: "oop",
    question: "What is a dataclass?",
    answer:
      "A decorator (from dataclasses import dataclass) that auto-generates __init__, __repr__ and __eq__ from annotated fields.",
  },
  {
    level: "advanced",
    category: "advanced",
    question: "What is a generator?",
    answer:
      "A function that uses yield to produce values one at a time lazily, saving memory. Example: def count(n): i = 1; while i <= n: yield i; i += 1",
  },
  {
    level: "advanced",
    category: "advanced",
    question: "What is the difference between an iterator and a generator?",
    answer:
      "An iterator is any object with __iter__ and __next__. A generator is a simple way to create an iterator using yield, without writing those methods by hand.",
  },
  {
    level: "advanced",
    category: "advanced",
    question: "What is a decorator?",
    answer:
      "A function that takes another function and returns a new function with added behavior, applied with @name above the definition. Use functools.wraps to keep the original name.",
  },
  {
    level: "advanced",
    category: "advanced",
    question: "What is a closure?",
    answer:
      "An inner function that remembers variables from its enclosing function even after the outer function has returned.",
  },
  {
    level: "advanced",
    category: "advanced",
    question: "What is a context manager?",
    answer:
      "An object used with the with statement that handles setup and cleanup. It defines __enter__ and __exit__, or is built with contextlib.contextmanager.",
  },
  {
    level: "advanced",
    category: "advanced",
    question: "What is the difference between shallow copy and deep copy?",
    answer:
      "A shallow copy (copy.copy) copies the outer object but shares inner objects. A deep copy (copy.deepcopy) copies everything recursively, so the copy is fully independent.",
  },
  {
    level: "advanced",
    category: "advanced",
    question: "What is the GIL?",
    answer:
      "The Global Interpreter Lock lets only one thread execute Python bytecode at a time in CPython. Threads suit I/O-bound work; use multiprocessing for CPU-bound work.",
  },
  {
    level: "advanced",
    category: "advanced",
    question: "What is the difference between threading and multiprocessing?",
    answer:
      "Threading runs multiple threads in one process (limited by the GIL, good for I/O). Multiprocessing runs separate processes with their own memory (good for CPU-heavy tasks).",
  },
  {
    level: "advanced",
    category: "advanced",
    question: "What is asyncio?",
    answer:
      "A library for single-threaded concurrency using async def and await. Tasks pause while waiting for I/O so others can run. Example: await asyncio.gather(task1(), task2())",
  },
  {
    level: "advanced",
    category: "advanced",
    question: "What are type hints?",
    answer:
      "Annotations that document expected types, such as def greet(name: str) -> str. They are not enforced at runtime but help tools and readers.",
  },
  {
    level: "advanced",
    category: "advanced",
    question: "How does memory management work in Python?",
    answer:
      "Python uses reference counting: an object is freed when its count reaches zero. A cyclic garbage collector (gc module) handles reference cycles.",
  },
  {
    level: "advanced",
    category: "advanced",
    question: "What is the difference between mutable and immutable types?",
    answer:
      "Mutable objects can change after creation (list, dict, set). Immutable objects cannot (int, float, str, tuple, frozenset).",
  },
  {
    level: "advanced",
    category: "advanced",
    question: "What is the difference between __new__ and __init__?",
    answer:
      "__new__ creates the object and returns it. __init__ initializes the already-created object.",
  },
  {
    level: "advanced",
    category: "advanced",
    question: "What are regular expressions?",
    answer:
      "Patterns for matching text, used through the re module. Example: re.findall(r'\\d+', 'abc 12 def 345') returns ['12', '345'].",
  },
  {
    level: "advanced",
    category: "advanced",
    question: "What is the Counter class?",
    answer:
      "collections.Counter counts items in an iterable. Counter('banana') gives Counter({'a': 3, 'n': 2, 'b': 1}) and most_common(1) returns [('a', 3)].",
  },
  {
    level: "advanced",
    category: "advanced",
    question: "What is pickling?",
    answer:
      "Serializing a Python object to bytes with the pickle module (pickle.dump) and restoring it later (pickle.load).",
  },
  {
    level: "advanced",
    category: "advanced",
    question: "How do you write unit tests in Python?",
    answer:
      "Use the unittest module (subclass unittest.TestCase and use assertEqual) or pytest (write functions starting with test_ and use plain assert).",
  },
  {
    level: "practice",
    category: "programs",
    question: "Write a program to check if a number is prime.",
    answer:
      "def is_prime(n):\r\n    if n < 2:\r\n        return False\r\n    for i in range(2, int(n ** 0.5) + 1):\r\n        if n % i == 0:\r\n            return False\r\n    return True",
  },
  {
    level: "practice",
    category: "programs",
    question: "Write a program to check if a string is a palindrome.",
    answer:
      "def is_palindrome(s):\r\n    s = s.lower().replace(' ', '')\r\n    return s == s[::-1]",
  },
  {
    level: "practice",
    category: "programs",
    question: "Write a program to print the Fibonacci series.",
    answer:
      "def fib_series(n):\r\n    a, b = 0, 1\r\n    for _ in range(n):\r\n        print(a, end=' ')\r\n        a, b = b, a + b",
  },
  {
    level: "practice",
    category: "programs",
    question: "Write a program to find the factorial of a number.",
    answer: "def factorial(n):\r\n    return 1 if n <= 1 else n * factorial(n - 1)",
  },
  {
    level: "practice",
    category: "programs",
    question: "Write a program to count word frequency in a text.",
    answer:
      "from collections import Counter\r\ntext = 'the cat and the hat'\r\nprint(Counter(text.split()).most_common())",
  },
  {
    level: "practice",
    category: "programs",
    question: "Write a program to check if two strings are anagrams.",
    answer: "def is_anagram(a, b):\r\n    return sorted(a.lower()) == sorted(b.lower())",
  },
  {
    level: "practice",
    category: "programs",
    question: "Write a program to find the second largest number in a list.",
    answer:
      "def second_largest(nums):\r\n    unique = sorted(set(nums))\r\n    return unique[-2] if len(unique) > 1 else None",
  },
  {
    level: "practice",
    category: "programs",
    question: "Write FizzBuzz in Python.",
    answer:
      "for i in range(1, 16):\r\n    if i % 15 == 0: print('FizzBuzz')\r\n    elif i % 3 == 0: print('Fizz')\r\n    elif i % 5 == 0: print('Buzz')\r\n    else: print(i)",
  },
  {
    level: "practice",
    category: "programs",
    question: "Write a BankAccount class with deposit and withdraw.",
    answer:
      "class BankAccount:\r\n    def __init__(self, owner, balance=0):\r\n        self.owner = owner\r\n        self.__balance = balance\r\n    def deposit(self, amount):\r\n        if amount <= 0:\r\n            raise ValueError('Invalid amount')\r\n        self.__balance += amount\r\n    def withdraw(self, amount):\r\n        if amount > self.__balance:\r\n            raise ValueError('Insufficient funds')\r\n        self.__balance -= amount\r\n    @property\r\n    def balance(self):\r\n        return self.__balance",
  },
  {
    level: "practice",
    category: "programs",
    question: "How do you swap two variables in Python?",
    answer: "a, b = b, a",
  },
];
