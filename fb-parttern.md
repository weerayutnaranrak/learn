## ---

**📝 Code Review: Level 1 RSS Processor \- Group Activity**

### **1\. Logic & Readability**

### **2\. Safety & Resource Integrity**

### **3\. Resilience (The "Cruel World" Test)**

### **4\. Scalability & Performance**

 

### **5\. Testing & Maintainability**

### **Logic & Readability=\> Testing & Maintainability  \=\> Safety & Resource Integrity \=\> Resilience \=\> Scalability & Performance**

## 

## 

## 

## 

## 

## **📝 Code Review: Level 1 RSS Processor**

### **1\. Logic & Readability**

* **The Good:** The code is very easy to follow. A developer can read this from top to bottom and understand the exact sequence of events.  
* **The Concern:** Using a do-while loop with a manual index (var i) in formatRssItems is highly prone to **Off-by-one errors**. In Scala, we typically prefer functional combinators like .map or .foreach to eliminate manual state management.

### **2\. Safety & Resource Integrity**

* **Blocking I/O:** Source.fromURL and Files.write are **blocking operations**. They stop the execution thread entirely while waiting for the network or disk. If the network is slow, your application's "heartbeat" stops.  
* **Manual Lifecycle:** You are using try-finally for source.close(). While correct here, it scales poorly. If you had three resources to manage (Network, Database, File), the nested try-finally blocks would become a "Pyramid of Doom."									

### **3\. Resilience (The "Cruel World" Test)**

* **Zero Fault Tolerance:** There is no **Timeout** mechanism. If the BBC server accepts the connection but never sends data, this program will hang indefinitely.  
* **No Self-Healing:** If a fetch fails due to a temporary WiFi blip, the program simply prints an error and moves on. There is no **Retry** strategy to handle transient issues.

### **4\. Scalability & Performance**

* **Sequential Bottleneck:** The feeds are processed one by one. If you have 10 feeds and each takes 2 seconds, the program takes 20 seconds. This doesn't take advantage of modern multi-core processors.  
* **Memory Risk:** source.mkString loads the **entire** XML into memory at once. For very large feeds, this risks an OutOfMemoryError.

### **5\. Testing & Maintainability**

* **Hard-Wired Side Effects:** The logic is "hard-coded" to the real network and real disk. To test this code, you *must* have an internet connection and a file system. This makes unit testing impossible without doing "Integration Testing."

Creating code that is both **concise** (clean/short) and **trustworthy** (reliable/predictable) is the "Holy Grail" of software engineering. Whether you are using Scala, Kotlin, or Java, these characteristics usually boil down to four main pillars:

## ---

**1\. Determinism (Pure Functions)**

A trustworthy program is predictable. If you give a function the same input, it should *always* return the same output without changing the world around it (like updating a global variable or writing to a database hidden in the logic).

* **Conciseness:** You don't need setup/teardown code or "mocks" for complex global states.  
* **Trust:** You can test the logic in isolation. If the math works once, it works forever.

## **2\. Strong, Expressive Typing**

Trustworthy programs use the type system to make "illegal states unrepresentable." Instead of using a String for an email address (which could be any text), you use an Email type.

* **Conciseness:** You don't need 50 if (email \!= null && email.contains("@")) checks everywhere; the type itself guarantees the data is valid.  
* **Trust:** The compiler acts as your first line of defense. If the code compiles, a large category of "dumb" bugs (like NullPointerExceptions) are mathematically impossible.

## **3\. Declarative Logic (The "What," Not the "How")**

Concise programs focus on the intent of the code rather than the manual steps to get there. This is why the for-comprehensions in Scala or either { ... } in Arrow are so popular.

* **Conciseness:** You replace messy loops and nested if-else blocks with high-level operators like map, filter, and retry.  
* **Trust:** Because you are using standard library operators that are already battle-tested, there is less room for "off-by-one" errors or manual logic mistakes.

## **4\. Total Error Handling**

Trustworthy programs treat errors as **values**, not as "explosions" (Exceptions). Instead of a function randomly crashing, it returns an Either\<Error, Result\>.

* **Conciseness:** You handle errors in a unified pipeline rather than wrapping every single line in a try-catch block.  
* **Trust:** The person reading your code can see exactly what can go wrong just by looking at the function signature. There are no "hidden" surprises.

### ---

**Comparison: Trustworthy vs. "Quick & Dirty"**

| Feature | Trustworthy (Functional) | "Quick & Dirty" (Imperative) |
| :---- | :---- | :---- |
| **State** | Immutable (Val/Final) | Mutable (Var/Global) |
| **Errors** | Returned as data | Thrown as exceptions |
| **Side Effects** | Controlled and isolated | Scattered everywhere |
| **Testing** | Easy (Input \-\> Output) | Hard (Requires complex Mocks) |

### **Summary Checklist**

If you want your code to be elite, ask yourself these three questions before you finish a feature:

* **Can I delete this?** (Conciseness: Removing boilerplate).  
* **Does this function lie?** (Trust: Does it do things it doesn't say in its name?).  
* **What happens if this fails?** (Trust: Is the error path explicitly handled?).

To move from Level 1 (Imperative) to Level 2 (Modular), the goal is to stop "telling the computer how to move memory" and start "describing transformations."

identify **The Three Pillars of any Program**:

1. **Pure Logic** (Math: XML → String)  
2. **Impure Effects** (Actions: Fetch, Save)  
3. **Orchestration** (The Story: Do this, then that) 

"A function that does 'one thing' is a function you can **trust**. When you can trust every small piece of your system, you can build complex architecture without fear of it collapsing like a house of cards."

### **Practice 1** 

| def run(filePath: String): Unit \=  println("🚀 Word count (Level 2 \-- small functions)...")  val rawText     \= readFile(filePath)                    *// Effect: read*  val text        \= normalize(rawText)                    *// Pure Logic*  val wordList    \= words(text)                           *//*   val totalWords  \= wordList.size                         *//*   val uniqueCount \= wordList.distinct.size                *//*   val counts      \= countByWord(wordList)                 *//*   val top5        \= topN(5)(counts)                       *//*   val report      \= formatReport(filePath, totalWords, uniqueCount, top5)  *//*   println(report)   *//*  println("✅ Done.") |
| :---- |
|  |
|  |

### **Practice 2**

| def run(filePath: String, keyword: String): Unit \=  println("🚀 Log stats (Level 2 \-- small functions)...")  val rawLines   \= readFileLines(filePath)             *//*   val lineList   \= nonEmptyTrimmed(rawLines)           *//*   val totalLines \= lineList.size                       *//*   val matchCount \= countContaining(lineList, keyword)  *//*   val maxLen     \= maxLineLength(lineList)             *//*   val firstLine  \= lineList.headOption.getOrElse("--") *//*   val lastLine   \= lineList.lastOption.getOrElse("--") *//*  val report     \= formatReport(...)  *//*   println(report)   *// Effect: print*  println("✅ Done.") |
| :---- |

The "7 Levels of Functional Programming" (often referred to as the **FP Learning Ladder**) was popularized by **John A. De Goes**, a prominent figure in the Scala community and the creator of the ZIO library. He introduced this hierarchy to help developers navigate the learning curve of functional programming, moving from basic concepts to high-level abstract algebra.

## 

## ---

**The 7 Levels of FP**

De Goes structured these levels to show how a programmer's mindset shifts from "doing things" (imperative) to "describing things" (declarative).

**Level 1: Functions & Immutability**

Basics: Using val instead of var, pure functions, and avoiding side effects.

**Level 2: Higher-Order Functions**

Treating functions as data: map, filter, fold, and flatMap.

**Level 3: Algebraic Data Types (ADTs)**

Modeling data using sealed traits and case classes (Sum and Product types).

**Level 4: Error Handling & Functional Effects**

Using types like Option, Either, and basic IO wrappers to manage failure and side effects.

**Level 5: Abstracting over Execution (Typeclasses)**

Polymorphism via typeclasses (e.g., Show, Eq, Functor). This is where "Category Theory" begins to peek in.

**Level 6: Compositional Design**

Using Monoids, Applicatives, and Monads to compose complex systems from simple parts.

**Level 7: High-Level Abstractions**

Advanced concepts like Tagless Final, Free Monads, and Recursion Schemes.

## ---

## 

## 

## 

## 

## **Why this hierarchy exists**

The goal of defining these levels was to address the "intimidation factor" of FP. By breaking it down, a developer can master **Level 3** (Data Modeling) without feeling like they failed because they don't yet understand **Level 7** (Category Theory abstractions).

In the Scala ecosystem, libraries like **Cats** and **ZIO** are often categorized by which "level" they primarily target, helping teams decide how much complexity they are willing to adopt.

---

### **✅ The 7 Levels of FP Explained (De Goes' Framework)**

This framework maps a programmer's growth from imperative "how" thinking to declarative "what" thinking. Each level builds on the previous one.

---

#### **🔹 Level 1: Functions & Immutability**

*The Foundation*

* Goal: Shift from mutable state to immutable data.  
* Key Concepts:  
  * `val` instead of `var`.  
  * Pure functions (no side effects, deterministic output).  
  * Avoiding `var` entirely (e.g., `val counter = 0` instead of `var counter = 0`).  
* Why it matters:  
  * Eliminates race conditions.  
  * Makes code easier to test and reason about.

Example:  
 scala

| *// Imperative (Level 0\)*var count \= 0count \+= 1*// Level 1 (Immutable)*val count \= 0val newCount \= count \+ 1*// Imperative (Level 0\)*var count \= 0count \+= 1*// Level 1 (Immutable)*val count \= 0val newCount \= count \+ 1 |
| :---- |

* 

---

#### **🔹 Level 2: Higher-Order Functions**

*Data Transformation*

* Goal: Treat functions as data to transform collections.  
* Key Concepts:  
  * `map`, `filter`, `fold`, `flatMap`.  
  * Function composition (e.g., `filter` \+ `map` \+ `reduce`).  
* Why it matters:  
  * Express transformations concisely.  
  * Avoid explicit loops.

Example:  
 scala

| val numbers \= List(1, 2, 3)val squared \= numbers.map(\_ \* \_)val evenSquares \= numbers.filter(\_ % 2 \== 0).map(\_ \* \_)val numbers \= List(1, 2, 3)val squared \= numbers.map(\_ \* \_)val evenSquares \= numbers.filter(\_ % 2 \== 0).map(\_ \* \_) |
| :---- |

---

#### **🔹 Level 3: Algebraic Data Types (ADTs)**

*Modeling Domain Logic*

* Goal: Encode domain rules using sealed traits and case classes.  
* Key Concepts:  
  * Sum types (e.g., `sealed trait PaymentMethod` with `CreditCard`, `PayPal`).  
  * Product types (e.g., `case class User(name: String, age: Int)`).  
* Why it matters:  
  * Compile-time safety for domain logic.  
  * Prevent invalid states (e.g., a `User` can't have negative age).

Example:

| sealed trait PaymentMethodcase class CreditCard(cardNumber: String) extends PaymentMethodcase class PayPal(email: String) extends Paymentsealed trait PaymentMethodcase class CreditCard(cardNumber: String) extends PaymentMethodcase class PayPal(email: String) extends Payment |
| :---- |

---

#### **🔹 Level 4: Error Handling & Functional Effects**

*Managing Failure Without Exceptions*

* Goal: Use types to represent failure and side effects.  
* Key Concepts:  
  * `Either[Error, Result]` for failure.  
  * `IO[A]` for side effects (e.g., `IO[Exception, User]`).  
* Why it matters:  
  * Avoid exception-spreading chaos.  
  * Make errors explicit in the type system.

Example:

| def getUser(id: String): Either\[String, User\] \=   if (id \== "1") Right(User("Alice", 25))   else Left("Invalid ID")def getUser(id: String): Either\[String, User\] \=   if (id \== "1") Right(User("Alice", 25))   else Left("Invalid ID") |
| :---- |

---

#### **🔹 Level 5: Abstracting over Execution (Typeclasses)**

*Generic Operations*

* Goal: Write code that works for *any* type (e.g., `show`, `parse`).  
* Key Concepts:  
  * Typeclasses like `Show`, `Equal`, `Functor`.  
  * Implicit parameters to enable polymorphism.  
* Why it matters:  
  * Avoid boilerplate for common operations.  
  * Build generic libraries.

Example:

|  scalatrait Show\[A\] {  def show(a: A): String}implicit val showInt \= new Show\[Int\] { def show(i: Int) \= i.toString }trait Show\[A\] {  def show(a: A): String}implicit val showInt \= new Show\[Int\] { def show(i: Int) \= i.toString } |
| :---- |

---

#### **🔹 Level 6: Compositional Design**

*Building Complex Systems from Simple Pieces*

* Goal: Compose effects (e.g., `IO`, `Either`) into pipelines.  
* Key Concepts:  
  * `flatMap`, `map`, `zip` for composing functions.  
  * Monad transformers (e.g., `EitherT[IO, Error, User]`).  
* Why it matters:  
  * Scale code without loss of abstraction.  
  * Decouple business logic from infrastructure.

|  scaladef readUser(id: String): IO\[Either\[String, User\]\] \=   IO.pure(getUser(id))def saveUser(user: User): IO\[Either\[String, Unit\]\] \=   IO.pure(Right(()))*// Chain effects*readUser("1") flatMap { user \=\>   saveUser(user) }def readUser(id: String): IO\[Either\[String, User\]\] \=   IO.pure(getUser(id))def saveUser(user: User): IO\[Either\[String, Unit\]\] \=   IO.pure(Right(()))readUser("1") flatMap { user \=\>   saveUser(user) } |
| :---- |

---

#### **🔹 Level 7: High-Level Abstractions**

*Meta-Abstraction*

* Goal: Design systems with zero assumptions about implementation.  
* Key Concepts:  
  * Tagless Final: Define abstract syntax without concrete types.  
  * Free Monads: Build DSLs for business logic.  
  * Recursion Schemes: Process data structures generically.  
* Why it matters:  
  * Write highly flexible, maintainable code.  
  * Decouple interfaces from implementation.

| *// Tagless Final: Define a DSL without tying to a specific monad*trait UserAPI\[F\[\_\]\] {  def createUser(name: String): F\[User\]  def updateUser(user: User, age: Int): F\[User\]}*// Implement for IO*implicit val ioUserAPI: UserAPI\[IO\] \= new UserAPI\[IO\] {  def createUser(name: String): IO\[User\] \= IO.pure(User(name, 25))}*// Tagless Final: Define a DSL without tying to a specific monad*trait UserAPI\[F\[\_\]\] {  def createUser(name: String): F\[User\]  def updateUser(user: User, age: Int): F\[User\]}*// Implement for IO*implicit val ioUserAPI: UserAPI\[IO\] \= new UserAPI\[IO\] {  def createUser(name: String): IO\[User\] \= IO.pure(User(name, 25))} |
| :---- |

In Scala, functions are first-class citizens, meaning they can be assigned to variables, passed as arguments, and returned from other functions. Depending on your needs, you can define them using the def keyword (methods) or as anonymous functions (lambdas).

## ---

**1\. Basic Function Definition (def)**

The most common way to define a function is using the def keyword. The syntax follows a logical flow: name, parameters, return type, and body.

|  def add(a: Int, b: Int): Int \= {  a \+ b} |
| :---- |

### **Key Components:**

* **def**: The keyword used to start a function definition.  
* **Parameters**: Must be explicitly typed (e.g., a: Int).  
* **Return Type**: While Scala can often infer the return type, it is best practice to declare it for public APIs.  
* **The \= Sign**: This separates the signature from the body. If you omit it, the function is treated as a procedure returning Unit (like void in Java).  
* **No return Keyword**: Scala automatically returns the value of the last expression evaluated in the block.

## ---

## 

## 

## 

## 

## 

## **2\. One-Liners**

If your function body consists of a single expression, you can omit the curly braces for a cleaner look:

| def multiply(x: Int, y: Int): Int \= x \* y |
| :---- |

## 

## **3\. Anonymous Functions (Function Literals)**

Sometimes you don't need to name a function, especially when passing logic to higher-order functions like map or filter.

| *// Assigning a function to a variable*val square \= (x: Int) \=\> x \* x*// Using it in a list*val nums \= List(1, 2, 3)val squaredNums \= nums.map(x \=\> x \* x) |
| :---- |

## **4\. Advanced Features**

Scala functions offer significant flexibility for complex logic:

| Feature | Example | Description |
| :---- | :---- | :---- |
| **Default Params** | def greet(name: String \= "Guest") | Allows calling the function without all arguments. |
| **Named Args** | greet(name \= "Alice") | Increases readability when calling functions with many parameters. |
| **Varargs** | def sum(args: Int\*) | Accepts a variable number of arguments (repeated parameters). |
| **Higher-Order** | def exec(f: Int \=\> Int, v: Int) | A function that takes another function as a parameter. |

## ---

**5\. Multiple Parameter Lists (Currying)**

Scala allows you to define functions with multiple sets of parentheses. This is often used for creating DSLs or for implicit parameters.

| def calculate(factor: Int)(value: Int): Int \= factor \* valueval triple \= calculate(3) \_ *// Partially applied function*val result \= triple(10)     *// Result is 30* |
| :---- |

the first "clean up" step every developer should master: **Separation of Concerns.**

Here is how you can guide them to break down the "One Big Method" into three clear responsibilities.

---

### **1\. Extract the "Translator" (The Logic)**

This is a pure function. It doesn't care where the XML came from or where the file is going. It just does the math of converting XML to a String.

| *// Responsibility: XML \-\> String*def formatRssItems(xml: scala.xml.Elem): String \= {  *// We use .map because it's safer and cleaner than a while loop*  val itemStrings \= (xml \\\\ "item").map { item \=\>    val title \= (item \\ "title").text.trim    val link  \= (item \\ "link").text.trim    s"Title: $title\\nLink: $link\\n---\\n"  }  itemStrings.mkString} |
| :---- |
|  |

## **Step 1: Add unit tests first (Red phase)**

Create a new test class, e.g. src/test/scala/Level1ProcessorSuite.scala (or `FormatRssItemsSuite.scala`), that tests `Level1Processor.formatRssItems(xml)`.

**Test data**: Build `scala.xml.Elem` with `XML.loadString(...)` from minimal RSS strings so tests stay in-memory and fast.

|  test("extractItems returns multiple items with title and link") {    val xml \= XML.loadString(      """\<?xml version="1.0"?\>\<rss version="2.0"\>\<channel\>        |  \<item\>\<title\>First\</title\>\<link\>https://example.com/1\</link\>\</item\>        |  \<item\>\<title\>Second\</title\>\<link\>https://example.com/2\</link\>\</item\>        |\</channel\>\</rss\>""".stripMargin    )    val result \= processor.extractItems(xml)    assert(result \== List(("First", "https://example.com/1"), ("Second", "https://example.com/2")))  } |
| :---- |

**Focus this area of code**

|      val items \= new ListBuffer\[(String, String)\]      var i \= 0      while i \< itemNodes.size do        val item \= itemNodes(i)        val title \= (item \\ "title").text.trim        val link \= (item \\ "link").text.trim        val item: (String, String) \= (title, link)        items.append(item) |
| :---- |

Focus this part \- quite interesting

|      val sb \= new StringBuilder      while i \< items.size do        val item \= items(i)        val title \= item.\_1        val link \= item.\_2        sb.append(s"Title: $title\\nLink: $link\\n---\\n")        i \+= 1 |
| :---- |

Tell computer how to move memory but not show your intension

Transform all element in list with this format  (s"Title: $title\\nLink: $link\\n---\\n")

# **Level 2**

In Scala, recursion is the go-to alternative for loops, aligning with the functional programming philosophy of immutability. However, there is a massive performance difference between "standard" recursion and "tail" recursion.

## **1\. Standard Recursion**

In standard recursion, the recursive call is **not** the last action. The program must "remember" where it left off to perform a final operation (like addition or multiplication) after the recursive call returns.

| def factorial(n: Int): Int \= {  if (n \<= 1) 1  else n \* factorial(n \- 1) *// The multiplication happens AFTER the call*} |
| :---- |

**The Risk:** Each call adds a new "frame" to the call stack. If n is too large (e.g., 10,000), you will run out of memory and trigger a StackOverflowError.

## **2\. Tail Recursion**

Tail recursion occurs when the recursive call is the **absolute last thing** the function does. There is no pending work left.

To implement this, we usually use an **accumulator** to pass the intermediate result forward.

| import scala.annotation.tailrecdef factorial(n: Int): Int \= {  @tailrec  def iter(current: Int, accumulator: Int): Int \= {    if (current \<= 1) accumulator    else iter(current \- 1, current \* accumulator) *// Last action is the call itself*  }    iter(n, 1)} |
| :---- |

### 

### **Why it matters:**

* **Optimization:** The Scala compiler detects tail recursion and transforms it into a simple while loop under the hood.  
* **Efficiency:** It uses a single stack frame regardless of the number of iterations.  
* **Safety:** It prevents StackOverflowError.

## ---

## **3\. The @tailrec Annotation**

It is a best practice in Scala to use the @tailrec annotation (from scala.annotation.tailrec). It doesn't *make* the function tail-recursive, but it tells the compiler: *"I expect this to be tail-recursive. If it's not, throw a compilation error."* This acts as a safety net during refactoring.

**Pro-Tip:** If you're struggling to make a function tail-recursive, try moving the logic into a "helper" function inside the main function (as seen in the iter example above).

In the **7 Levels of Functional Programming**, **Level 2** is all about **Higher-Order Functions (HOFs)**. This is the stage where you stop treating functions as just "routines" and start treating them as **values** that can be passed around.

Using **Extension Methods** is a fantastic way to explain this because it allows us to take a plain data structure and "teach" it how to accept logic as an argument.

## ---

**1\. Moving from Level 1 to Level 2**

In **Level 1**, you use pure functions and immutable values. In **Level 2**, you write functions that take *other* functions as parameters.

Let's look at how we can implement a custom map-like behavior (Level 2\) using an Extension Method (which makes it look like a built-in feature).

| *// An extension adding Level 2 capabilities to a List*extension \[A\](list: List\[A\])    *// This is a Higher-Order Function (Level 2\)*  *// It takes a function 'f' (A \=\> B) as a parameter*  def transform(f: A \=\> B): List\[B\] \= ???  *// Another HOF: It takes a predicate 'p' (A \=\> Boolean)*  def keepOnly(p: A \=\> Boolean): List\[A\] \= ??? |
| :---- |

## **2\. Why this is Level 2**

The code above demonstrates the two core pillars of Level 2:

### **A. Functions as Parameters**

Notice the parameter f: A \=\> B. We aren't passing a number or a string; we are passing **logic**. The transform method doesn't know *what* it is doing to the data—it only knows *how* to apply the logic you provide.

### **B. Abstraction over Action**

In Level 1, you might write def double(list: List\[Int\]).

In Level 2, you write def transform(f: Int \=\> Int).

You have abstracted away the specific action (doubling) and made the method capable of performing **any** transformation.

## **3\. The "Mental Shift"**

At Level 2, you start thinking in terms of **pipelines**. Instead of telling the computer *how* to loop (imperative), you tell it *what* transformation to apply to the collection (declarative).

| *// Level 2 in action:*val numbers \= List(1, 2, 3)val result \= numbers  .transform(x \=\> x \+ 10)  *// Pass logic: add 10*  .keepOnly(x \=\> x % 2 \== 0) *// Pass logic: keep even* |
| :---- |

## 

## 

## 

## 

## 

## **Function that return function**

To explain **Currying**, it is best to think of it as a **"Function Factory."** Instead of a function that takes all its arguments at once and gives you a result, a curried function takes **one** argument and returns a **new function** that is waiting for the next argument.

## ---

**1\. The Transformation**

In a standard function, you provide all the data to get the answer. In a curried function, you provide data in **stages**.

### **Standard Function (Level 1\)**

One function, two inputs, one result.

| $$f(x, y) \= x \+ y$$ |
| :---- |

### **Curried Function (Level 2\)**

One function, one input, returns **another function**.

| $$f(x) \= g$$...where $g(y) \= x \+ y$ |
| :---- |

## ---

**2\. Scala Implementation**

In Scala, you can see this "function returning a function" structure clearly when you use the arrow \=\> syntax.

| *// A function that returns a function**// (x: Int) is the first input**// \=\> (y: Int) \=\> x \+ y is the RETURNED function*val addCurried: Int \=\> (Int \=\> Int) \=   x \=\> (y \=\> x \+ y)*// Step 1: Call the first function**// This returns a function that "remembers" that x is 5*val addFive \= addCurried(5) *// Step 2: Call the second function*val result \= addFive(10) *// Returns 15* |
| :---- |

### **The "Syntax Sugar" version**

Scala provides a more concise way to write this using multiple parameter lists, but under the hood, it behaves exactly like the "function returning a function" model above.

| def add(x: Int)(y: Int): Int \= x \+ y |
| :---- |

## **3\. Why is this useful? (Partial Application)**

The power of a function returning a function is that you can **pre-configure** logic. You can create specialized versions of a general function and pass them around.

Imagine a logging function:

| def log(level: String)(message: String): Unit \=   println(s"\[$level\] $message")*// Create specialized "returned" functions*val infoLog  \= log("INFO")val errorLog \= log("ERROR")*// Use them later in the code*infoLog("System started")  *// \[INFO\] System started*errorLog("Kernel panic\!")   *// \[ERROR\] Kernel panic\!* |
| :---- |

## **4\. Mental Model: The Assembly Line**

* **Non-curried:** You put the car frame and the engine on the belt at the same time; the machine builds the car and gives it to you.  
* **Curried:** You put the car frame on the belt. The machine gives you a **new machine** that is now specifically designed to only fit engines into that specific frame.

| Feature | Standard (Uncurried) | Curried |
| :---- | :---- | :---- |
| **Return Type** | The final value | A **Function** (until the last arg) |
| **Flexibility** | All or nothing | Can be partially applied |
| **Structure** | (A, B) \=\> C | A \=\> (B \=\> C) |

In Scala, an Extension Method allows you to add new functionality to existing types (like String, Int, or even IO) without modifying their original source code or using inheritance.

In the functional world, this is how we create the Concise Syntax we’ve been discussing. It’s how we turn a standard IO blueprint into something that can .retryN(3) or .logTime.

1\. The Modern Syntax (Scala 3\)

Scala 3 introduced the extension keyword, making it incredibly readable.

| *// 1\. Define the extension*extension (s: String)  def shout: String \= s.toUpperCase \+ "\!\!\!"  def isEmail: Boolean \= s.contains("@")*// 2\. Use it as if it were a native method*val greeting \= "hello".shout  *// Result: "HELLO\!\!\!"*val check \= "me@home.com".isEmail *// Result: true* |
| :---- |

Exercise

Write compose function that take 2 functions and return function 

| val composedFunction \= compose(double, addOne) |
| :---- |

Write function that transform element in List

| //def transformTest(list, f): List\[String\] \= ??? // def keepOnlyTest(list, c): List\[String\] \= ??? val students1 \= List("Alice", "Bob", "Charlie", "David", "Eve") val transformedStudent \= List("Title: Alice", "Title: Bob", "Title: Charlie", "Title: David", "Title: Eve")val scores1 \= List(100, 90, 80, 70, 60) Val transformedScore \= List(110, 100, 90, 80, 70\)  |
| :---- |

Solution

| def transformTest(list: List\[String\], f: String \=\> String): List\[String\] \=  if list.isEmpty then Nil  else f(list.head) :: transformTest(list.tail, f)def keepOnlyTest(list: List\[Int\], c: Int \=\> Boolean): List\[Int\] \=  if list.isEmpty then Nil  else if c(list.head) then list.head :: keepOnlyTest(list.tail, c)  else keepOnlyTest(list.tail, c) |
| :---- |

# **Level 3**

# 

The core tool of Level 3 is the **Algebraic Data Type (ADT)**. This is where you stop using primitive types (like null, String for errors, or \-1 for missing data) and start designing types that perfectly model the reality of your business domain.

## ---

**1\. The Core Philosophy: "Make Illegal States Unrepresentable"**

In Level 1 or 2, you might use a String to represent a user's status: "pending", "active", or "deleted". But what happens if the string is "apple"? Your code breaks.

In **Level 3**, you define a structure that **only** allows valid states.

### **The Two Building Blocks:**

* **Product Types (AND):** Combining multiple values. A User is a Name **AND** an Age. (In Scala: case class).  
* **Sum Types (OR):** Choosing between variants. A Result is a Success **OR** a Failure. (In Scala: enum or sealed trait).

In Functional Programming, **Algebraic Data Types (ADTs)** are the fundamental building blocks used to model data. Think of them as the "Lego bricks" of your domain.

The name "Algebraic" sounds intimidating, but it simply refers to two basic ways we can combine types: **Addition (Sum Types)** and **Multiplication (Product Types)**.

### ---

**Product Types (The "AND")**

A Product Type represents data that contains multiple fields. It is an **AND** relationship.

* **Logic:** To make a User, I need a Name **AND** an Email.  
* **Math:** If a Name has $n$ possibilities and an Email has $m$ possibilities, the total combinations are $n \\times m$ (The Product).  
* **Scala 3 Implementation:**

| case class Ingredient(name: String, quantity: Int) // Product Type |
| :---- |

### **Sum Types (The "OR")**

A Sum Type represents a choice between different variants. It is an **OR** relationship. This is where ADTs get their real power.

* **Logic:** A Payment can be a CreditCard **OR** PayPal **OR** Cash. It cannot be all three at once.  
* **Math:** The total possibilities are $n \+ m \+ p$ (The Sum).  
* **Scala 3 Implementation:**

| enum PaymentMethod:  case CreditCard(number: String, expiration: String)  case PayPal(email: String)  case Cash |
| :---- |

3\. Why ADTs are so important  
In Level 1 (Imperative), we often use "Stringly-typed" data or generic objects. In Level 3 (ADTs), we use types to **make illegal states unrepresentable.**

| Feature | Imperative Approach | ADT Approach |
| :---- | :---- | :---- |
| **Invalid Data** | Check for null or empty strings at runtime. | Illegal states cannot even be compiled. |
| **Completeness** | If you add a new payment type, you might forget a switch case. | The compiler **forces** you to handle the new case (Exhaustiveness). |
| **Readability** | Data logic is buried in if/else blocks. | The domain is clearly defined in the data structure itself. |

### ---

**4\. The Power of Pattern Matching**

Because the compiler knows every possible "variant" of a Sum Type, it becomes your best friend when you use match.

| def processPayment(method: PaymentMethod): String \= method match  case PaymentMethod.CreditCard(n, \_) \=\> s"Charging card ending in ${n.takeRight(4)}"  case PaymentMethod.PayPal(e)        \=\> s"Redirecting to PayPal for $e"  case PaymentMethod.Cash             \=\> "Please pay at the counter"  *// No 'default' or 'else' needed\! The compiler knows we are finished.* |
| :---- |

### ---

**ADTs in your RSS Project**

In your RSS aggregator, you are currently using (String, String) (a Tuple) to represent items. That is a simple Product Type. To "Level Up" to Level 3, you would transform that into a proper ADT:

| *// Level 3 Modeling*enum FeedResult:  case Success(items: List\[RssItem\])  case PartialFailure(items: List\[RssItem\], error: String)  case TotalFailure(reason: String)case class RssItem(title: String, link: String) |
| :---- |

This exercise is designed to move you from **Level 1** (using Strings and Nulls) to **Level 3** (making illegal states unrepresentable using Algebraic Data Types).

### **The Challenge: The "Smart Vending Machine"**

You are designing the software for a high-end vending machine. Unlike old machines that just say "Error," this machine needs to track exactly why a transaction failed or what the state of a product is.

### ---

**Step 1: Define the "Product" (Product Type)**

We use a **Case Class** to group related data together. This is the "Product" part of ADT (A *and* B *and* C).

**Task:** Create a Product that has a name (String), a price (Double), and a category.

| case class Product(name: String, price: Double, category: Category) |
| :---- |

### **Step 2: Define the "Category" (Sum Type)**

A product can only be a Drink, Snack, or FreshFood. This is the "Sum" part of ADT (A *or* B *or* C).

**Task:** Use a Scala 3 enum to define these categories.

| enum Category:  case Drink, Snack, FreshFood |
| :---- |

### 

### **Step 3: Define the "Machine State" (The Complex ADT)**

This is where ADTs shine. The machine can be in one of four states:

* **Idle**: Waiting for a user.  
* **Selecting**: A user has picked a product, but hasn't paid yet. (Needs the Product).  
* **Processing**: Payment is being verified. (Needs the Product and the AmountInserted).  
* **Dispensing**: Dropping the item. (Needs the Product).

**Exercise:** Model this using an enum where some cases carry data.

| enum MachineState:  case Idle  case Selecting(item: Product)  case Processing(item: Product, inserted: Double)  case Dispensing(item: Product) |
| :---- |

### **Step 4: Logic with Pattern Matching**

Now, write a function that decides what to show on the machine's screen based on the state.

**Task:** Complete the displayMessage function.

| def displayMessage(state: MachineState): String \= state match  case MachineState.Idle \=\>     "Welcome\! Please select an item."  case MachineState.Selecting(p) \=\>     s"Selected ${p.name}. Please insert ${p.price} THB."  case MachineState.Processing(p, inserted) \=\>     if (inserted \< p.price) s"Insufficient funds: ${p.price \- inserted} remaining."    else "Payment verified. Preparing your item..."  case MachineState.Dispensing(p) \=\>     s"Enjoy your ${p.name}\!" |
| :---- |

### ---

**Why this is a "Level 3" Win**

* **No Nulls:** You never have to check if item is null. If the state is Idle, there is no item variable to even look at. The compiler prevents you from making that mistake.  
* **Exhaustivity:** If you add a new state (e.g., OutOfOrder), the Scala compiler will warn you that your displayMessage function is missing a case.  
* **Data Integrity:** You cannot be in the Processing state without both a Product and an Amount. The structure of the data enforces the rules of the business.

### ---

**💡 Advanced Bonus Task**

Can you add a Failure state to the MachineState enum that carries a specific ErrorReason (another enum)? This would allow the machine to say exactly why it failed (e.g., SoldOut, ChangeNotAvailable, or HardwareJam).

**Would you like me to show you how to move this ADT model into Level 4 by wrapping the "Dispensing" action in an $IO$ blueprint?** Concluding the response by providing a clear next step.

# 

# **Level 4**

# 

To help your participants truly "get" Level 4, you have to shift their mindset from being **Code Authors** to being **System Architects**.

In Levels 1-3, they were focused on **Logic** (the "What"). In Level 4, we introduce **Management** (the "How").

### ---

**1\. The Core Concept: The "Blueprint" Strategy**

The single biggest shift in Level 4 is moving from **Eager Execution** to **Lazy Description**.

* **Level 1-3 (Eager):** When you call a function, it *happens*. It's like a live performance. If you mess up, the show is ruined.  
* **Level 4 (Lazy):** When you call a function, it returns a **Blueprint** ($IO$). It's like a movie script. You can read the script, edit it, copy it, or decide not to film it at all.

### ---

**2\. The "Clean Room" and the "Dirty Room"**

Level 4 introduces a strict architectural boundary. We divide the world into two spaces:

| The Clean Room (Logic) | The Dirty Room (Effects) |
| :---- | :---- |
| Contains Levels 1, 2, and 3\. | Contains the **$IO$ Monad**. |
| Pure functions (Math-like). | Talking to the Internet, Disk, or Database. |
| **Predictable**: Same input \= Same output. | **Unpredictable**: Can fail, timeout, or lag. |
| No side effects. | Managed side effects. |

**The Goal of Level 4:** Keep the "Clean Room" as large as possible and wrap the "Dirty Room" in a safety suit ($IO$).

### ---

**3\. The 3 Superpowers of Level 4**

Why do we bother with the complexity of $IO$? Because it gives us "God Mode" over our program:

#### **A. Failure as Data**

Instead of the program "crashing" (an exception), failure becomes a **Value** (Option or Either). You can pass an error around just like you pass a number.

#### **B. Time Control**

Because we have a "Blueprint," we can add rules about time. We can say: *"Run this script, but if it takes more than 5 seconds, stop and tell me"* (.timeout). Or, *"If it fails, wait 1 second and try again"* (.retry).

#### **C. Concurrency (Fibers)**

In Level 4, we stop using heavy "System Threads" and start using **Fibers**. These are lightweight "Assistant Chefs." You can have 100,000 of them running on a single laptop without breaking a sweat.

### ---

**4\. The "Final Boundary" (The End of the World)**

In a Level 4 program, the logic is "Safe" until the very last millisecond.

* We build a giant "Master Blueprint" of the whole app.  
* We only "execute" it at the very edge of the program (usually in Main or IOApp).

### ---

**💡 The "Big Picture" Pitch for Participants**

"Up until now, you've been writing code that **is** the action. In Level 4, you're going to write code that **describes** the action.

This feels like extra work at first, but it's the difference between a **Line Cook** who can only make one egg at a time, and an **Executive Chef** who can manage 50 cooks, handle missing ingredients, and guarantee every meal is perfect."

# **Level 5**

In Scala, a **Type Class** is a functional programming pattern that allows you to add new functionality to existing classes without modifying their source code and without using traditional inheritance.

Think of it as **ad-hoc polymorphism**: you define a "concept" (like being able to serialize to JSON) and then provide implementations for different types (Int, String, or even your own custom classes).

## ---

**The Three Components of a Type Class**

A type class in Scala consists of three distinct parts. Since Scala 3, this pattern has been refined with specific keywords like trait, given, and using.

### **1\. The Type Class (The Interface)**

This is a trait with at least one type parameter. It defines the behavior.

| *// The concept: something that can be "summarized"*trait Summarizable\[A\] {  def summarize(value: A): String} |
| :---- |

### **2\. Type Class Instances (The Implementations)**

You provide concrete logic for specific types. In Scala 3, we use the given keyword.

| given Summarizable\[Int\] with {  def summarize(value: Int): String \= s"The number is $value"}given Summarizable\[String\] with {  def summarize(value: String): String \= s"The text says: '$value'"} |
| :---- |

### **3\. The Interface Surface (The Usage)**

This is where you use the type class. You define a method that requires an instance of the type class to be available in the implicit scope using the using keyword.

| def printSummary\[A\](item: A)(using s: Summarizable\[A\]): Unit \= {  println(s.summarize(item))}*// Usage*printSummary(42)           *// Output: The number is 42*printSummary("Hello Type") *// Output: The text says: 'Hello Type'* |
| :---- |

Why Use Type Classes Instead of Inheritance?  
Traditional inheritance (Subtyping) has limits. If you want to make java.util.Date "Summarizable," you can't, because you don't own that code.

| Feature | Inheritance (Subtyping) | Type Classes (Ad-hoc) |
| :---- | :---- | :---- |
| **Retroactive** | No (Must modify original class) | **Yes** (Add behavior to any type) |
| **Decoupling** | Tight (Data and logic are mixed) | **Loose** (Data and logic are separate) |
| **Multiple Logic** | One implementation per class | Multiple "givens" can exist for one type |
| **Static Safety** | High | High (Checked at compile time) |

## ---

**Context Bounds: A Shorter Syntax**

Because the (using s: Summarizable\[A\]) pattern is so common, Scala provides a shorthand called a **Context Bound**:

| def printSummary\[A : Summarizable\](item: A): Unit \= {  val s \= summon\[Summarizable\[A\]\] *// "summon" finds the given instance*  println(s.summarize(item))} |
| :---- |

## **Real-World Examples**

You encounter type classes everywhere in the Scala ecosystem:

* **Numeric\[T\]**: Allows a function to perform math on any type (Int, Double, BigDecimal).  
* **Ordering\[T\]**: Defines how to sort a collection of type T.  
* **Encoder/Decoder**: Used in libraries like Circe to convert objects to JSON.

