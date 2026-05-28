/* content.js -----------------------------------------------------------------
 * Lesson data for the CP2 Java syllabus. Each entry follows:
 *   id, session, title, tag, objectives[], sections[ {type, ...} ], pitfalls[],
 *   takeaways[], miniQuiz[]
 * sections types:  'p' (paragraph), 'h' (heading), 'code' (java), 'list', 'table'
 * --------------------------------------------------------------------------- */
'use strict';
window.LESSONS = [

/* ===================================================================== */
{
  id: 'intro', session: '01', title: 'Introduction to Java',
  tag: 'Foundations',
  objectives: [
    'Understand what Java is and the JVM model.',
    'Distinguish JDK, JRE and JVM.',
    'Write, compile and run a first Java program.',
  ],
  sections: [
    { type: 'p', text: 'Java is a class-based, statically-typed, object-oriented language designed by James Gosling at Sun in 1995. Source code is compiled to platform-neutral <em>bytecode</em> (a <code>.class</code> file) and run by the <strong>JVM</strong> — the Java Virtual Machine.' },
    { type: 'h', text: 'JDK vs JRE vs JVM' },
    { type: 'table', headers: ['Component', 'What it contains', 'Used for'], rows: [
      ['JVM', 'Bytecode interpreter + JIT compiler', 'Running .class files'],
      ['JRE', 'JVM + standard library', 'Running a Java app'],
      ['JDK', 'JRE + javac, jar, javadoc, jshell', 'Developing Java apps'],
    ]},
    { type: 'h', text: 'The minimal program' },
    { type: 'code', code:
`public class Hello {
    public static void main(String[] args) {
        System.out.println("Hello, world!");
    }
}` },
    { type: 'p', text: 'Save as <code>Hello.java</code>, then in a terminal:' },
    { type: 'code', code:
`# Compile to bytecode
$ javac Hello.java        # produces Hello.class

# Run on the JVM
$ java Hello              # → Hello, world!` },
    { type: 'p', text: 'The file name <strong>must</strong> match the public class name. <code>main</code> is the entry point — its exact signature is <code>public static void main(String[] args)</code>.' },
  ],
  pitfalls: [
    'Running <code>java Hello.class</code> — pass the class name, not the file name.',
    'Capitalisation matters: <code>String</code>, not <code>string</code>; <code>System</code>, not <code>system</code>.',
  ],
  takeaways: [
    'Source files compile to bytecode, bytecode runs on the JVM — that is what makes Java portable.',
    'The JDK is what you install to write code; the JRE is what you ship to a user (mostly bundled into the app today).',
  ],
  miniQuiz: [
    { q: 'Which component is required to run a compiled Java program?', options: ['JDK', 'JRE', 'IDE', 'A compiler'], answer: 1,
      explain: 'The JRE bundles the JVM and standard library — enough to execute bytecode.' },
    { q: 'What does javac produce?', options: ['Machine code', 'A native executable', '.class bytecode', 'Source code'], answer: 2,
      explain: 'javac compiles .java into .class bytecode, which is platform-independent.' },
  ],
},

/* ===================================================================== */
{
  id: 'tools', session: '02', title: 'Java Tools and Environment',
  tag: 'Foundations',
  objectives: [
    'Know the layout of a Java project and where source / output go.',
    'Use packages and the classpath correctly.',
    'Be comfortable with an IDE (IntelliJ / VS Code) at a basic level.',
  ],
  sections: [
    { type: 'h', text: 'Project layout (Maven-style)' },
    { type: 'code', code:
`my-project/
├── pom.xml                       <- build config (Maven)
└── src/
    ├── main/
    │   ├── java/                 <- production .java
    │   │   └── com/example/App.java
    │   └── resources/            <- non-code (CSS, FXML, sql)
    └── test/
        └── java/                 <- unit tests` },
    { type: 'h', text: 'Packages' },
    { type: 'p', text: 'A <strong>package</strong> is a namespace that maps onto a directory. Declare it as the very first line of the file:' },
    { type: 'code', code:
`package com.example.gallery;

public class Painting { /* ... */ }` },
    { type: 'p', text: 'The file <code>Painting.java</code> must live under <code>com/example/gallery/Painting.java</code>. Other code uses it as <code>com.example.gallery.Painting</code> or with an <code>import</code>.' },
    { type: 'h', text: 'Classpath' },
    { type: 'p', text: 'The JVM finds classes via the <strong>classpath</strong>. With Maven you rarely set it by hand — <code>mvn exec:java</code> wires it up. Manually:' },
    { type: 'code', code:
`$ javac -d out src/main/java/com/example/*.java
$ java -cp out com.example.App` },
  ],
  pitfalls: [
    'Package declaration and folder path must match exactly — case sensitive on macOS/Linux.',
    'Forgetting <code>import</code> for a class from another package gives "cannot find symbol".',
  ],
  takeaways: [
    'Packages are mandatory in non-trivial projects; the folder tree mirrors the package name.',
    'Maven removes the manual classpath gymnastics — get comfortable with it early.',
  ],
  miniQuiz: [
    { q: 'A class declared <code>package com.x;</code> must live in which directory?', options: ['x/', 'com/x/', 'src/x/', 'Anywhere; the compiler figures it out'], answer: 1,
      explain: 'The package name maps directly to the folder path: com.x → com/x/.' },
  ],
},

/* ===================================================================== */
{
  id: 'elementary-1', session: '03', title: 'Elementary Programming I',
  tag: 'Basics',
  objectives: [
    'Use Java\'s primitive types and the rules for literals.',
    'Read input with Scanner and write output with println / printf.',
    'Understand operator precedence and integer vs floating-point division.',
  ],
  sections: [
    { type: 'h', text: 'Primitive types' },
    { type: 'table', headers: ['Type', 'Size', 'Range / value'], rows: [
      ['byte', '8-bit', '-128 to 127'],
      ['short', '16-bit', '-32 768 to 32 767'],
      ['int', '32-bit', '~ ±2.1 × 10⁹'],
      ['long', '64-bit', '~ ±9.2 × 10¹⁸ — literal: 100L'],
      ['float', '32-bit IEEE-754', '7 decimal digits — literal: 3.14f'],
      ['double', '64-bit IEEE-754', '15 decimal digits (default for fractions)'],
      ['char', '16-bit Unicode', "'A', '\\n', '\\u00e9'"],
      ['boolean', '1 bit (logical)', 'true / false'],
    ]},
    { type: 'h', text: 'Declaring variables' },
    { type: 'code', code:
`int    count    = 0;
double price    = 19.99;
char   initial  = 'P';
boolean isReady = true;
final int MAX  = 100;   // constant — cannot be reassigned

// Java 10+ "var" infers the type from the initialiser
var name = "Pelusa";    // → String` },
    { type: 'h', text: 'Input / output' },
    { type: 'code', code:
`import java.util.Scanner;

Scanner in = new Scanner(System.in);
System.out.print("Your name? ");
String name = in.nextLine();
System.out.printf("Hello, %s — %d-letter name%n", name, name.length());` },
    { type: 'h', text: 'Integer vs floating division' },
    { type: 'code', code:
`int    a = 7 / 2;        // → 3   (integer division, truncates)
double b = 7 / 2;        // → 3.0 (still int division — RHS is int!)
double c = 7 / 2.0;      // → 3.5
double d = (double) 7 / 2; // → 3.5` },
    { type: 'p', text: 'If either operand of <code>/</code> is floating point, the result is floating point. If both are integers the result is an integer.' },
  ],
  pitfalls: [
    'A bare <code>3.14</code> is a <code>double</code>; assigning to a <code>float</code> needs the <code>f</code> suffix.',
    '<code>7 / 2</code> is integer 3, not 3.5 — cast first.',
    '<code>==</code> on <code>String</code> compares references, not content. Use <code>.equals()</code>.',
  ],
  takeaways: [
    'Pick the widest sensible type: <code>int</code> for counters, <code>double</code> for measurements.',
    'Constants get <code>final</code> and <code>SCREAMING_SNAKE_CASE</code>.',
  ],
  miniQuiz: [
    { q: 'What is the value of <code>5 / 2 + 0.5</code>?', options: ['2.5', '3.0', '3', '2'], answer: 1,
      explain: '5/2 is integer division (2). 2 + 0.5 promotes to 2.5 — wait, careful: 2 + 0.5 = 2.5, then again — depends on context. Actually 5/2 = 2, and 2 + 0.5 = 2.5. The closest option is 2.5.' },
    { q: 'Which is a valid <code>long</code> literal?', options: ['1000000000000', '1_000_000_000_000', '1000000000000L', 'All of the above'], answer: 3,
      explain: 'Underscores are allowed for readability since Java 7; the L suffix forces a long; values that fit in int can still be assigned to long.' },
  ],
},

/* ===================================================================== */
{
  id: 'elementary-2', session: '04', title: 'Elementary Programming II — Strings & Formatting',
  tag: 'Basics',
  objectives: [
    'Use String methods for everyday text work.',
    'Format numbers and text with printf / String.format.',
    'Know what String immutability means and when to use StringBuilder.',
  ],
  sections: [
    { type: 'h', text: 'Strings are objects, but feel like primitives' },
    { type: 'code', code:
`String name = "Pelusa";
int    len  = name.length();
String up   = name.toUpperCase();    // "PELUSA"
boolean has = name.contains("lus");  // true
String sub  = name.substring(0, 3);  // "Pel"
String trim = "  hi  ".strip();      // "hi"  (Java 11+)
String[] parts = "a,b,c".split(",");` },
    { type: 'h', text: 'String comparison' },
    { type: 'code', code:
`String a = "java";
String b = "java";
String c = new String("java");

a == b               // true — string-pool interning
a == c               // FALSE — c is a separate object
a.equals(c)          // true  — always use .equals for content
a.equalsIgnoreCase("JAVA")` },
    { type: 'h', text: 'Formatting with printf' },
    { type: 'code', code:
`System.out.printf("%-10s %6.2f %n", "Acrylic", 540.5);
//                | label   | price |
//   -10s = string padded right, width 10
//   6.2f = float, total width 6, 2 decimals
//   %n   = platform line separator` },
    { type: 'p', text: '<code>String.format</code> uses the same syntax but returns a string instead of printing.' },
    { type: 'h', text: 'Immutability + StringBuilder' },
    { type: 'p', text: 'Strings are <strong>immutable</strong>. Each "modification" creates a new object — so concatenating in a loop is O(n²):' },
    { type: 'code', code:
`// BAD — quadratic
String r = "";
for (String w : words) r = r + w;

// GOOD — linear
StringBuilder sb = new StringBuilder();
for (String w : words) sb.append(w);
String r = sb.toString();` },
  ],
  pitfalls: [
    '<code>==</code> compares references — works on literals due to interning, breaks on <code>new String("...")</code>.',
    '<code>"5" + 1</code> is <code>"51"</code>; <code>1 + "5"</code> is also <code>"15"</code> — concatenation, not addition.',
    'A printf placeholder that does not match the argument type throws <code>IllegalFormatException</code>.',
  ],
  takeaways: [
    'Strings are immutable; use <code>StringBuilder</code> when you mutate inside loops.',
    'Always use <code>.equals()</code> for string equality.',
  ],
  miniQuiz: [
    { q: 'What does <code>"4" + 2 + 1</code> evaluate to?', options: ['"421"', '"43"', '7', '"7"'], answer: 0,
      explain: 'Evaluated left-to-right: "4"+2 → "42" (concat), "42"+1 → "421".' },
    { q: 'Why is <code>StringBuilder</code> preferred in loops?', options: ['It is shorter to type', 'It avoids creating a new String each iteration', 'It is thread-safe', 'Strings cannot be concatenated in loops'], answer: 1,
      explain: 'String concatenation in a loop is O(n²) because each + creates a new immutable string.' },
  ],
},

/* ===================================================================== */
{
  id: 'control-flow', session: '05', title: 'Control Flow',
  tag: 'Basics',
  objectives: [
    'Choose between if / switch / loops correctly.',
    'Use Java 14+ switch expressions and pattern matching.',
    'Avoid the common bugs around boundaries and off-by-one.',
  ],
  sections: [
    { type: 'h', text: 'if / else if / else' },
    { type: 'code', code:
`int score = 87;
String grade;
if      (score >= 90) grade = "A";
else if (score >= 80) grade = "B";
else if (score >= 70) grade = "C";
else                  grade = "F";` },
    { type: 'h', text: 'switch — classic and expression form' },
    { type: 'code', code:
`// Classic statement (fall-through risk)
switch (day) {
    case 1: case 7: kind = "weekend"; break;
    case 2: case 3: case 4: case 5: case 6: kind = "weekday"; break;
    default:        kind = "invalid";
}

// Java 14+ switch expression — no fall-through, returns a value
String kind = switch (day) {
    case 1, 7        -> "weekend";
    case 2, 3, 4, 5, 6 -> "weekday";
    default          -> "invalid";
};` },
    { type: 'h', text: 'Loops' },
    { type: 'code', code:
`// while  — pre-test
int i = 0;
while (i < n) { ... i++; }

// do-while — post-test, runs at least once
do { read(); } while (more());

// for — counted
for (int j = 0; j < items.length; j++) process(items[j]);

// enhanced for — iterate
for (String s : items) process(s);` },
    { type: 'h', text: 'break, continue, labels' },
    { type: 'code', code:
`outer:
for (int r = 0; r < grid.length; r++) {
    for (int c = 0; c < grid[r].length; c++) {
        if (grid[r][c] == target) {
            System.out.println("found");
            break outer;       // breaks both loops
        }
    }
}` },
  ],
  pitfalls: [
    'Forgetting <code>break</code> in a classic switch — execution falls through to the next case.',
    'Off-by-one: <code>i &lt;= n</code> vs <code>i &lt; n</code> when looping over an array (use length, never hard-code).',
    'Modifying a collection while iterating with enhanced-for → <code>ConcurrentModificationException</code>.',
  ],
  takeaways: [
    'Prefer the new switch-expression form when you can — no fall-through, returns a value.',
    'Enhanced-for is the default for "iterate over"; use classic <code>for</code> only when you need the index.',
  ],
  miniQuiz: [
    { q: 'In the classic switch (with <code>:</code>), what happens if you omit <code>break</code>?', options: ['Compile error', 'Falls through to the next case', 'Ignores everything below', 'Runs only the matching case'], answer: 1,
      explain: 'The classic statement form falls through to the next case body, which is the source of many bugs.' },
    { q: 'Which loop runs the body at least once?', options: ['while', 'for', 'do-while', 'enhanced-for'], answer: 2,
      explain: 'do-while tests the condition AFTER running the body, guaranteeing one iteration.' },
  ],
},

/* ===================================================================== */
{
  id: 'arrays', session: '06', title: 'Arrays',
  tag: 'Basics',
  objectives: [
    'Declare, initialise and iterate over arrays.',
    'Understand reference semantics for objects in arrays.',
    'Use 2D arrays and common utilities.',
  ],
  sections: [
    { type: 'h', text: 'Declaration & initialisation' },
    { type: 'code', code:
`int[] xs = new int[5];                // length 5, zero-filled
int[] ys = { 1, 2, 3, 4, 5 };          // literal
String[] names = new String[3];        // null-filled

xs.length;     // 5
xs[0] = 42;    // index from 0` },
    { type: 'h', text: '2D arrays' },
    { type: 'code', code:
`int[][] grid = new int[3][4];      // 3 rows, 4 cols
int[][] table = {
    { 1, 2, 3 },
    { 4, 5, 6 },
};
table.length;        // 2 (rows)
table[0].length;     // 3 (cols of row 0)
// rows can have different lengths — "jagged" arrays` },
    { type: 'h', text: 'Iterate' },
    { type: 'code', code:
`for (int i = 0; i < xs.length; i++) {
    System.out.println(i + ": " + xs[i]);
}

// when you don't need the index
for (int x : xs) sum += x;` },
    { type: 'h', text: 'Arrays utility class' },
    { type: 'code', code:
`import java.util.Arrays;

int[] a = { 3, 1, 4, 1, 5 };
Arrays.sort(a);                  // mutates: { 1, 1, 3, 4, 5 }
int idx = Arrays.binarySearch(a, 4);
int[] copy = Arrays.copyOf(a, 10);   // length 10, padded with 0
Arrays.fill(copy, 5, 10, -1);        // fill range with -1
String s = Arrays.toString(a);       // "[1, 1, 3, 4, 5]"` },
  ],
  pitfalls: [
    'Out-of-range access throws <code>ArrayIndexOutOfBoundsException</code>, not a compile error.',
    'Arrays are objects → assignment shares the same array. Use <code>copyOf</code> for a real copy.',
    '<code>arr.length</code> is a field (no parentheses); <code>str.length()</code> is a method (with).',
  ],
  takeaways: [
    'Arrays have fixed length once created; reach for <code>ArrayList</code> if size changes.',
    '<code>Arrays.toString</code> is the only sane way to print an array — <code>println(arr)</code> shows garbage.',
  ],
  miniQuiz: [
    { q: 'What is printed by <code>System.out.println(new int[]{1,2,3});</code>?', options: ['[1, 2, 3]', 'A hash-code style string like [I@1540e19d', '1 2 3', 'Compile error'], answer: 1,
      explain: 'Arrays inherit Object.toString — they print their class-and-hash. Use Arrays.toString to get the contents.' },
  ],
},

/* ===================================================================== */
{
  id: 'oop-thinking', session: '12', title: 'Object-Oriented Thinking',
  tag: 'OOP',
  objectives: [
    'Tell the difference between a class and an object.',
    'Identify state, behaviour and identity in a real entity.',
    'Pick fields vs methods deliberately.',
  ],
  sections: [
    { type: 'p', text: 'A <strong>class</strong> is a blueprint; an <strong>object</strong> is a concrete instance. Every object has <em>state</em> (its field values), <em>behaviour</em> (the methods you can call on it) and <em>identity</em> (it occupies its own memory).' },
    { type: 'code', code:
`public class Painting {
    // ----- state
    private String title;
    private int    year;

    // ----- constructor: how an object is created
    public Painting(String title, int year) {
        this.title = title;
        this.year  = year;
    }

    // ----- behaviour
    public String displayLabel() {
        return title + " (" + year + ")";
    }
}

// elsewhere — create two distinct objects from one class
Painting a = new Painting("Caracas", 2026);
Painting b = new Painting("Tokyo",   2023);` },
    { type: 'h', text: 'Identity vs equality' },
    { type: 'code', code:
`Painting x = new Painting("Caracas", 2026);
Painting y = new Painting("Caracas", 2026);

x == y          // false — different objects, different identity
x.equals(y)     // true only if Painting overrides equals()` },
    { type: 'p', text: 'When you design a class, ask: <em>what does an object of this type remember (fields) and what can it do (methods)?</em> The answer to "do" usually involves the state.' },
  ],
  pitfalls: [
    'Conflating class and object — a class is a recipe, not a thing in memory.',
    'Putting "do everything" methods on one class — split responsibilities.',
  ],
  takeaways: [
    'Model real things as objects with state + behaviour, not procedures on data.',
    'Field = noun, method = verb. If you find yourself naming a method <code>data</code>, it should probably be a field.',
  ],
  miniQuiz: [
    { q: 'How many objects are created here? <pre><code>Painting a = new Painting("A", 1);\nPainting b = a;</code></pre>', options: ['0', '1', '2', 'Depends on the JVM'], answer: 1,
      explain: 'Only one Painting object exists. b is a second reference to the same object.' },
  ],
},

/* ===================================================================== */
{
  id: 'classes', session: '10-11', title: 'Classes and Objects',
  tag: 'OOP',
  objectives: [
    'Write a class with fields, constructors, methods and visibility modifiers.',
    'Use <code>this</code> and method overloading correctly.',
    'Know what <code>static</code> means.',
  ],
  sections: [
    { type: 'h', text: 'Anatomy of a class' },
    { type: 'code', code:
`public class Painting {

    // ----- fields (state)
    private String title;
    private int    year;
    public  static int totalCreated = 0;   // class-level, shared

    // ----- constructors
    public Painting(String title, int year) {
        this.title = title;
        this.year  = year;
        totalCreated++;                     // static field accessed via class
    }

    public Painting() { this("Untitled", 2026); }  // delegating constructor

    // ----- instance methods (behaviour)
    public String getTitle()        { return title; }
    public void   setTitle(String t) { this.title = t; }

    // ----- static method — utility, no instance needed
    public static Painting blank() { return new Painting(); }
}` },
    { type: 'h', text: 'Visibility modifiers' },
    { type: 'table', headers: ['Modifier', 'Visible to'], rows: [
      ['public',      'Everyone'],
      ['protected',   'Same package + subclasses'],
      ['(default)',   'Same package only'],
      ['private',     'This class only'],
    ]},
    { type: 'h', text: 'Overloading' },
    { type: 'code', code:
`public class Calc {
    public int    add(int a, int b)       { return a + b; }
    public double add(double a, double b) { return a + b; }
    public int    add(int a, int b, int c){ return a + b + c; }
}
// Java picks the right one by argument types/count at compile time.` },
    { type: 'h', text: 'this' },
    { type: 'p', text: '<code>this</code> refers to the current object. Use it to disambiguate when a parameter has the same name as a field (<code>this.title = title;</code>) and to call another constructor (<code>this(...)</code>).' },
  ],
  pitfalls: [
    'A static method cannot use <code>this</code> or any instance field — it has no instance.',
    'Public fields break encapsulation. Default to private + accessors.',
    'Overloading by return type alone is illegal — Java only looks at parameters.',
  ],
  takeaways: [
    'Constructors initialise state — give every field a sensible starting value.',
    '<code>static</code> belongs to the class; instance members belong to each object.',
  ],
  miniQuiz: [
    { q: 'Which of these is a valid overload of <code>public int sum(int a, int b)</code>?',
      options: ['<code>public double sum(int a, int b)</code>', '<code>public int sum(int a, double b)</code>', '<code>public int sum(int a, int b) throws IOException</code>', 'None of the above'],
      answer: 1,
      explain: 'Only a difference in parameter types/count creates a valid overload.' },
  ],
},

/* ===================================================================== */
{
  id: 'encapsulation', session: '13', title: 'Encapsulation',
  tag: 'OOP',
  objectives: [
    'Hide fields behind accessors and validate writes.',
    'Use <code>final</code> for invariants.',
    'Recognise the cost of leaky abstractions.',
  ],
  sections: [
    { type: 'p', text: 'Encapsulation = <strong>protecting internal state from invalid changes</strong>. Make fields <code>private</code>, expose them through methods that can validate and update consistently.' },
    { type: 'code', code:
`public class Artwork {
    private String title;
    private int    year;
    private double price;

    public Artwork(String title, int year, double price) {
        setTitle(title);
        setYear(year);
        setPrice(price);
    }

    public String getTitle() { return title; }
    public void setTitle(String t) {
        if (t == null || t.isBlank())
            throw new IllegalArgumentException("Title required");
        if (t.length() > 80)
            throw new IllegalArgumentException("Title too long");
        this.title = t.strip();
    }

    public int getYear() { return year; }
    public void setYear(int y) {
        int current = java.time.Year.now().getValue();
        if (y < 1900 || y > current + 1)
            throw new IllegalArgumentException("Year out of range");
        this.year = y;
    }

    public double getPrice() { return price; }
    public void setPrice(double p) {
        if (p < 0)
            throw new IllegalArgumentException("Price must be ≥ 0");
        this.price = Math.round(p * 100.0) / 100.0;
    }
}` },
    { type: 'h', text: 'Why this beats public fields' },
    { type: 'list', items: [
      'You can add validation later without breaking callers.',
      'You can change the internal representation (e.g. store price as cents).',
      'You can log, audit or guard concurrent access in one place.',
    ]},
    { type: 'h', text: 'Immutable objects' },
    { type: 'code', code:
`public final class Color {              // final class → no subclasses
    private final int r, g, b;           // final fields → set once
    public Color(int r, int g, int b) {
        this.r = r; this.g = g; this.b = b;
    }
    public int red()   { return r; }
    public int green() { return g; }
    public int blue()  { return b; }
}
// No setters → fully immutable. Safe to share without copying.` },
  ],
  pitfalls: [
    'Returning a mutable field directly (e.g. an internal <code>List</code>) lets callers mutate your state. Return an unmodifiable view or a copy.',
    'Adding setters by reflex — sometimes a constructor + immutability is cleaner.',
  ],
  takeaways: [
    'Default to <code>private final</code>, only widen when needed.',
    'Encapsulation is a property of the API surface — it survives only if you maintain it.',
  ],
  miniQuiz: [
    { q: 'What is the main practical advantage of encapsulation?', options: ['Code runs faster', 'Internal representation can change without breaking callers', 'You write less code', 'It is required by the compiler'], answer: 1,
      explain: 'The whole point of accessors + private fields is that you can refactor the internals without changing the API.' },
  ],
},

/* ===================================================================== */
{
  id: 'inheritance', session: '14', title: 'Inheritance',
  tag: 'OOP',
  objectives: [
    'Extend a class and call <code>super</code> in constructors / methods.',
    'Use <code>protected</code> and <code>final</code> intentionally.',
    'Recognise when composition beats inheritance.',
  ],
  sections: [
    { type: 'p', text: 'Inheritance lets a subclass reuse, override and extend a superclass. Java has <strong>single inheritance</strong> for classes — at most one <code>extends</code> — but many <code>implements</code> for interfaces.' },
    { type: 'code', code:
`public abstract class User {
    protected final String username;
    protected User(String username) { this.username = username; }
    public String getUsername() { return username; }
    public abstract String describePrivileges();   // subclass must implement
}

public class Admin extends User {
    public Admin(String username) { super(username); }   // call super constructor
    @Override
    public String describePrivileges() {
        return "Full access: manage everything.";
    }
}

public class Curator extends User {
    private final int departmentId;
    public Curator(String username, int dept) {
        super(username);
        this.departmentId = dept;
    }
    @Override
    public String describePrivileges() {
        return "Manage artworks in department " + departmentId;
    }
}` },
    { type: 'h', text: 'The Object class' },
    { type: 'p', text: 'Every class implicitly extends <code>java.lang.Object</code>, which provides <code>toString()</code>, <code>equals()</code> and <code>hashCode()</code>. You almost always want to override <code>toString</code> for readable logging:' },
    { type: 'code', code:
`@Override
public String toString() {
    return "Admin{username='" + username + "'}";
}` },
    { type: 'h', text: 'final classes / methods' },
    { type: 'p', text: '<code>final class</code> cannot be subclassed (e.g. <code>String</code>). <code>final</code> on a method blocks override. Use both deliberately when an invariant must be preserved.' },
    { type: 'h', text: 'When NOT to use inheritance' },
    { type: 'p', text: 'Inheritance is a tight coupling. If you really mean "this thing <em>has</em> one of those" rather than "this thing <em>is</em> one of those", prefer composition.' },
    { type: 'code', code:
`// Inheritance — Stack IS-A Vector (a classic mistake)
public class Stack extends Vector { ... }

// Composition — Stack HAS-A list (better)
public class Stack {
    private final List<Object> items = new ArrayList<>();
    public void push(Object o) { items.add(o); }
    public Object pop() { return items.remove(items.size() - 1); }
}` },
  ],
  pitfalls: [
    'Forgetting <code>@Override</code> — a typo in the method name silently creates a new method.',
    'Calling overridable methods from a constructor — the subclass override runs before subclass fields are initialised.',
    'Extending a class just to reuse one method instead of composing.',
  ],
  takeaways: [
    'Prefer composition; use inheritance only for genuine "is-a" relationships.',
    '<code>@Override</code> on every override — the compiler will catch typos.',
  ],
  miniQuiz: [
    { q: 'How many superclasses can a Java class extend?', options: ['Zero', 'Exactly one', 'Up to two', 'Any number'], answer: 1,
      explain: 'Java has single inheritance for classes — exactly one extends. Multiple inheritance is only for interfaces.' },
    { q: 'Which keyword prevents a class from being subclassed?', options: ['static', 'final', 'private', 'sealed'], answer: 1,
      explain: 'final on a class makes it impossible to extend (String is the classic example). sealed exists but limits, not prevents.' },
  ],
},

/* ===================================================================== */
{
  id: 'polymorphism', session: '15', title: 'Polymorphism & Dynamic Binding',
  tag: 'OOP',
  objectives: [
    'Use a superclass / interface reference to hold any concrete subclass.',
    'Predict which override runs at runtime.',
    'Recognise the limits — static methods and fields are not polymorphic.',
  ],
  sections: [
    { type: 'p', text: '<strong>Dynamic binding</strong>: when you call <code>obj.method()</code>, the JVM picks the method of <em>obj\'s actual class</em> at runtime, not the declared type of the reference. This is what makes polymorphism work.' },
    { type: 'code', code:
`public class Artwork {
    public String category() { return "artwork"; }
}
public class Painting extends Artwork {
    @Override public String category() { return "painting"; }
}
public class Sketch extends Artwork {
    @Override public String category() { return "sketch"; }
}

Artwork[] catalog = {
    new Painting(),
    new Sketch(),
    new Artwork(),
};

for (Artwork a : catalog) {
    System.out.println(a.category());     // painting, sketch, artwork
}` },
    { type: 'p', text: 'The reference type is <code>Artwork</code>, but the JVM still calls each concrete subclass\'s <code>category()</code>. That is dynamic binding.' },
    { type: 'h', text: 'Casts and instanceof' },
    { type: 'code', code:
`for (Artwork a : catalog) {
    if (a instanceof Painting p) {     // Java 16+ pattern matching
        // 'p' is auto-cast to Painting in this branch
        p.applyVarnish();
    }
}` },
    { type: 'h', text: 'What is NOT polymorphic' },
    { type: 'list', items: [
      'Static methods — they are bound at compile time by reference type.',
      'Fields — same reason. <code>parent.x</code> reads the parent\'s field even if the runtime object is a subclass.',
      'Private methods — invisible to subclasses, so they cannot be overridden.',
    ]},
    { type: 'code', code:
`public class A { public static String label() { return "A"; } public int x = 1; }
public class B extends A { public static String label() { return "B"; } public int x = 2; }

A a = new B();
System.out.println(a.label());  // → "A"  (static, by reference type)
System.out.println(a.x);        // → 1    (field, by reference type)` },
  ],
  pitfalls: [
    'Trying to "override" a static method — you are <em>hiding</em> it, not overriding.',
    'Casting without checking — <code>ClassCastException</code> at runtime.',
  ],
  takeaways: [
    'Polymorphism = "write to the abstraction, run the concrete behaviour".',
    'Only <em>instance methods</em> are polymorphic. Statics and fields are not.',
  ],
  miniQuiz: [
    { q: 'Given <code>Animal a = new Dog();</code>, calling <code>a.sound()</code> runs which version?',
      options: ['Animal.sound()', 'Dog.sound()', 'Whichever was declared first', 'Compile error'], answer: 1,
      explain: 'Instance methods dispatch by the runtime type. The reference is Animal but the object is a Dog.' },
  ],
},

/* ===================================================================== */
{
  id: 'interfaces', session: '16', title: 'Interfaces and Abstract Classes',
  tag: 'OOP',
  objectives: [
    'Declare an interface and implement it from multiple classes.',
    'Use default and static methods on interfaces (Java 8+).',
    'Pick between interface and abstract class.',
  ],
  sections: [
    { type: 'h', text: 'Interfaces' },
    { type: 'code', code:
`public interface CsvSerializable {
    String toCsvRow();                       // implicitly public abstract

    static String csvEscape(String v) {      // utility
        return v.contains(",") ? "\\"" + v.replace("\\"", "\\"\\"") + "\\"" : v;
    }

    default String fileExtension() {         // default method (Java 8+)
        return ".csv";
    }
}

public class Painting implements CsvSerializable {
    @Override
    public String toCsvRow() {
        return CsvSerializable.csvEscape(title) + "," + year;
    }
}` },
    { type: 'p', text: 'A class can implement <strong>many</strong> interfaces — comma-separated after <code>implements</code>. This is how Java sidesteps multiple inheritance.' },
    { type: 'h', text: 'Abstract classes' },
    { type: 'code', code:
`public abstract class AcademicEntity {
    protected final int id;
    protected AcademicEntity(int id) { this.id = id; }

    public final int getId() { return id; }  // shared, final

    public abstract String displayLabel();   // each subclass must implement
}` },
    { type: 'h', text: 'Interface vs abstract class' },
    { type: 'table', headers: ['Question', 'Interface', 'Abstract class'], rows: [
      ['Can hold state (fields)?', 'No (constants only)', 'Yes'],
      ['Constructors?', 'No', 'Yes (protected)'],
      ['Multiple inheritance?', 'Yes — implement many', 'No — extend one'],
      ['Common code?', 'default methods only', 'Any instance methods'],
      ['Typical use', 'A capability ("can be sold")', 'Common skeleton ("a thing in this family")'],
    ]},
    { type: 'p', text: 'Rule of thumb: model a <em>capability</em> as an interface (<code>Comparable</code>, <code>Iterable</code>, <code>CsvSerializable</code>) and a shared <em>identity / partial implementation</em> as an abstract class.' },
  ],
  pitfalls: [
    'Adding a non-default method to an interface breaks every implementer — design carefully.',
    'Using an abstract class only because you want shared fields when an interface + composition would do.',
  ],
  takeaways: [
    'Interfaces describe what an object can do; abstract classes describe what it partially is.',
    'Since Java 8 the line is blurry — interfaces can carry behaviour. Use them more often.',
  ],
  miniQuiz: [
    { q: 'How many interfaces can a class implement?', options: ['One', 'Up to three', 'As many as you list', 'Only if it does not extend a class'], answer: 2,
      explain: 'Java allows implementing any number of interfaces, in addition to extending one class.' },
    { q: 'What CANNOT an interface declare?', options: ['A default method', 'A static method', 'An abstract method', 'An instance field with state'], answer: 3,
      explain: 'Interfaces only allow constants (public static final), not instance state.' },
  ],
},

/* ===================================================================== */
{
  id: 'exceptions', session: '18', title: 'Exception Handling',
  tag: 'Errors & I/O',
  objectives: [
    'Distinguish checked vs unchecked exceptions.',
    'Use try / catch / finally and try-with-resources.',
    'Design your own exception hierarchy.',
  ],
  sections: [
    { type: 'h', text: 'The exception family tree' },
    { type: 'code', code:
`Throwable
├── Error               (JVM-level — do not catch)
└── Exception           (checked by default)
    ├── IOException     (checked)
    └── RuntimeException (unchecked)
        ├── NullPointerException
        ├── IllegalArgumentException
        └── ...` },
    { type: 'p', text: '<strong>Checked</strong> exceptions must be either caught or declared with <code>throws</code>. <strong>Unchecked</strong> (subclasses of <code>RuntimeException</code>) propagate silently — used for programmer errors.' },
    { type: 'h', text: 'try / catch / finally' },
    { type: 'code', code:
`try {
    String line = readFirstLine(path);
    process(line);
} catch (FileNotFoundException e) {
    System.err.println("No such file: " + path);
} catch (IOException e) {
    System.err.println("I/O failed: " + e.getMessage());
} finally {
    System.out.println("Done.");
}` },
    { type: 'p', text: 'You can catch multiple exception types in one block:' },
    { type: 'code', code:
`try { ... }
catch (IOException | NumberFormatException e) {
    log.error("Bad input", e);
}` },
    { type: 'h', text: 'try-with-resources' },
    { type: 'p', text: 'Anything implementing <code>AutoCloseable</code> can be opened in the resource declaration and is closed automatically — no <code>finally</code> needed:' },
    { type: 'code', code:
`try (BufferedReader br = Files.newBufferedReader(path)) {
    return br.readLine();
}   // br.close() is called automatically, even on exception` },
    { type: 'h', text: 'Custom exception hierarchy' },
    { type: 'code', code:
`public class GalleryException extends Exception {                 // checked
    public GalleryException(String msg)              { super(msg); }
    public GalleryException(String msg, Throwable c) { super(msg, c); }
}

public class AuthenticationException extends GalleryException {
    public AuthenticationException(String msg) { super(msg); }
}

public class NotFoundException extends GalleryException {
    public NotFoundException(String entity, String id) {
        super(entity + " " + id + " not found");
    }
}` },
    { type: 'p', text: 'A custom hierarchy lets the UI write one catch per layer (<code>catch (GalleryException e)</code>) while still being able to discriminate by subtype when needed.' },
  ],
  pitfalls: [
    '<code>catch (Exception e) { }</code> — swallowing every error is the textbook bug.',
    'Throwing a generic <code>Exception</code> — callers cannot react meaningfully.',
    'Forgetting to chain the cause: <code>throw new MyEx("msg", e)</code> preserves the stack trace.',
  ],
  takeaways: [
    'Checked for recoverable / boundary failures, unchecked for programming bugs.',
    'try-with-resources is the default for any I/O — it cannot be forgotten.',
    'A small custom exception family makes services dramatically easier to test.',
  ],
  miniQuiz: [
    { q: 'Which is the right way to read a file safely in Java 7+?',
      options: ['<code>try { open(); read(); } finally { close(); }</code>',
                '<code>try (var r = open()) { read(); }</code>',
                'Just call <code>open()</code> and <code>read()</code> — Java handles it',
                'Use <code>System.exit</code> on errors'], answer: 1,
      explain: 'try-with-resources auto-closes any AutoCloseable, even on exception.' },
    { q: 'Which exception is unchecked?',
      options: ['IOException', 'SQLException', 'NullPointerException', 'ClassNotFoundException'], answer: 2,
      explain: 'NullPointerException is a RuntimeException — unchecked. The other three are checked.' },
  ],
},

/* ===================================================================== */
{
  id: 'text-io', session: '14ch', title: 'File I/O — Text and CSV',
  tag: 'Errors & I/O',
  objectives: [
    'Read and write text files with the java.nio.file API.',
    'Parse CSV with proper quoted-field handling.',
    'Always use try-with-resources for streams.',
  ],
  sections: [
    { type: 'h', text: 'Reading a whole file' },
    { type: 'code', code:
`import java.nio.file.*;
import java.io.IOException;
import java.util.List;

Path path = Path.of("catalog.csv");

// Whole file as one string
String text = Files.readString(path);

// Line-by-line
List<String> lines = Files.readAllLines(path);

// Stream — for huge files
try (var stream = Files.lines(path)) {
    long count = stream.filter(l -> l.startsWith("painting,")).count();
}` },
    { type: 'h', text: 'Writing' },
    { type: 'code', code:
`Files.writeString(path, "title,year\\n");
Files.writeString(path, "Caracas,2026\\n", StandardOpenOption.APPEND);

try (var w = Files.newBufferedWriter(path)) {
    w.write("title,year");
    w.newLine();
    for (Painting p : catalog) {
        w.write(p.toCsvRow());
        w.newLine();
    }
}` },
    { type: 'h', text: 'RFC-4180 CSV parsing (the right way)' },
    { type: 'p', text: 'A naive <code>line.split(",")</code> breaks the moment a field contains a comma or a quote. Real CSV needs a small state machine:' },
    { type: 'code', code:
`public static List<String[]> parseCsv(String text) {
    List<String[]> rows = new ArrayList<>();
    List<String>   row  = new ArrayList<>();
    StringBuilder  field= new StringBuilder();
    boolean inQuotes = false;
    for (int i = 0; i < text.length(); i++) {
        char c = text.charAt(i);
        if (inQuotes) {
            if (c == '"' && i + 1 < text.length() && text.charAt(i+1) == '"') {
                field.append('"'); i++;            // doubled "" inside a quoted field
            } else if (c == '"') {
                inQuotes = false;
            } else {
                field.append(c);
            }
        } else {
            if (c == '"')           inQuotes = true;
            else if (c == ',')      { row.add(field.toString()); field.setLength(0); }
            else if (c == '\\n')    { row.add(field.toString()); rows.add(row.toArray(new String[0]));
                                      row = new ArrayList<>(); field.setLength(0); }
            else if (c != '\\r')    field.append(c);
        }
    }
    if (field.length() > 0 || !row.isEmpty()) {
        row.add(field.toString());
        rows.add(row.toArray(new String[0]));
    }
    return rows;
}` },
    { type: 'h', text: 'Escaping a value back into CSV' },
    { type: 'code', code:
`public static String csvEscape(String v) {
    if (v == null) return "";
    if (v.contains(",") || v.contains("\\"") || v.contains("\\n"))
        return "\\"" + v.replace("\\"", "\\"\\"") + "\\"";
    return v;
}` },
  ],
  pitfalls: [
    '<code>split(",")</code> on CSV — silently corrupts data with commas inside fields.',
    'Forgetting <code>StandardCharsets.UTF_8</code> on Windows — defaults vary by locale.',
    'Reading <em>all</em> lines of a huge file into memory — use a stream instead.',
  ],
  takeaways: [
    'Prefer <code>Files</code> / <code>Path</code> (java.nio.file) over the old <code>FileReader</code> API.',
    'Always use try-with-resources for streams.',
    'CSV is harder than it looks — write the small parser once, reuse it.',
  ],
  miniQuiz: [
    { q: 'Why is <code>line.split(",")</code> unsafe for CSV?',
      options: ['It is slow', 'It breaks fields that contain commas, quotes or newlines', 'It does not handle UTF-8', 'It only returns the first value'], answer: 1,
      explain: 'Real CSV allows commas inside quoted fields — a naive split breaks those rows.' },
  ],
},

/* ===================================================================== */
{
  id: 'collections', session: '17', title: 'Collections — List, Map, Set',
  tag: 'Standard library',
  objectives: [
    'Pick the right collection for the job.',
    'Iterate, transform and aggregate collections.',
    'Know the basic Stream API operations.',
  ],
  sections: [
    { type: 'h', text: 'The big three' },
    { type: 'table', headers: ['Interface', 'Common impl', 'When'], rows: [
      ['List<T>', 'ArrayList', 'Ordered, indexed, duplicates allowed'],
      ['Set<T>',  'HashSet (LinkedHashSet for order)', 'Uniqueness, no order needed'],
      ['Map<K,V>', 'HashMap (LinkedHashMap for order, TreeMap sorted)', 'Key→value lookup'],
    ]},
    { type: 'h', text: 'Everyday operations' },
    { type: 'code', code:
`import java.util.*;

List<String> names = new ArrayList<>();
names.add("Pelusa");
names.add("Andrea");
names.contains("Pelusa");    // true
names.remove("Andrea");

// Initialise inline
List<Integer> primes = List.of(2, 3, 5, 7, 11);   // immutable

Map<String, Integer> counts = new HashMap<>();
counts.put("acrylic", 12);
counts.merge("acrylic", 1, Integer::sum);   // counts.put += 1

Set<String> mediums = new LinkedHashSet<>();
mediums.add("acrylic");
mediums.add("oil");
mediums.add("acrylic");     // no-op (duplicate)` },
    { type: 'h', text: 'Streams' },
    { type: 'code', code:
`import java.util.stream.*;

List<Painting> heavy = catalog.stream()
    .filter(p -> p.getYear() >= 2024)
    .sorted(Comparator.comparing(Painting::getTitle))
    .collect(Collectors.toList());

Map<String, Long> byMedium = catalog.stream()
    .collect(Collectors.groupingBy(Painting::getMedium, Collectors.counting()));

double avgPrice = catalog.stream()
    .mapToDouble(Painting::getPrice).average().orElse(0);` },
  ],
  pitfalls: [
    'Using <code>HashSet</code> when iteration order matters — its order is not predictable.',
    'Mutating a collection while iterating with enhanced-for → <code>ConcurrentModificationException</code>.',
    'Putting mutable keys in a <code>HashMap</code> — if the key\'s hash changes, lookup breaks.',
  ],
  takeaways: [
    'Code to interfaces (<code>List</code>, not <code>ArrayList</code>) so you can swap implementations.',
    'Streams keep transformation code linear and readable.',
  ],
  miniQuiz: [
    { q: 'Which collection guarantees no duplicates AND keeps insertion order?',
      options: ['ArrayList', 'HashSet', 'LinkedHashSet', 'TreeSet'], answer: 2,
      explain: 'LinkedHashSet combines Set\'s uniqueness with iteration in insertion order.' },
  ],
},

/* ===================================================================== */
{
  id: 'generics', session: '17b', title: 'Generics',
  tag: 'Standard library',
  objectives: [
    'Read and write generic class signatures.',
    'Know what <code>? extends T</code> and <code>? super T</code> mean.',
    'Avoid raw types.',
  ],
  sections: [
    { type: 'h', text: 'Why generics' },
    { type: 'code', code:
`// Pre-generics — runtime cast, no compile-time safety
List names = new ArrayList();
names.add("Pelusa");
names.add(42);                     // compiles, surprises later
String s = (String) names.get(1);  // ClassCastException at runtime

// With generics — checked at compile time
List<String> names = new ArrayList<>();
names.add("Pelusa");
names.add(42);                     // COMPILE ERROR ✓` },
    { type: 'h', text: 'Generic class' },
    { type: 'code', code:
`public interface Dao<T, ID> {
    Optional<T> findById(ID id);
    List<T>     findAll();
    T           save(T entity);
    void        delete(ID id);
}

public class PaintingDao implements Dao<Painting, Long> { /* ... */ }` },
    { type: 'h', text: 'Bounded wildcards (PECS — Producer Extends, Consumer Super)' },
    { type: 'code', code:
`// Producer — give me Numbers (or any subtype). Read-only for the method.
double sum(List<? extends Number> xs) {
    double s = 0;
    for (Number n : xs) s += n.doubleValue();
    return s;
}

// Consumer — give me a sink that accepts Integer (or any supertype).
void fill(List<? super Integer> sink) {
    for (int i = 0; i < 10; i++) sink.add(i);
}` },
    { type: 'p', text: 'Mnemonic: <strong>P</strong>roducer → <code>extends</code> (you read from it), <strong>C</strong>onsumer → <code>super</code> (you write into it).' },
  ],
  pitfalls: [
    'Using raw types (<code>List</code> without <code>&lt;...&gt;</code>) — defeats the whole point.',
    'You cannot create an array of a generic type: <code>new T[10]</code> is illegal. Use <code>ArrayList&lt;T&gt;</code> instead.',
  ],
  takeaways: [
    'Use generics everywhere you build a container or DAO.',
    'PECS: read-only → <code>extends</code>, write-only → <code>super</code>.',
  ],
  miniQuiz: [
    { q: 'What is the main benefit of generics?',
      options: ['Faster runtime', 'Compile-time type safety + no casts', 'Lower memory use', 'Automatic threading'], answer: 1,
      explain: 'Generics enforce types at compile time and eliminate explicit casts — no runtime speed-up.' },
  ],
},

/* ===================================================================== */
{
  id: 'javafx', session: '20', title: 'JavaFX — GUI in Java',
  tag: 'GUI',
  objectives: [
    'Bootstrap a JavaFX app with an FXML scene.',
    'Wire a controller to UI elements.',
    'Understand the single-threaded application thread.',
  ],
  sections: [
    { type: 'p', text: 'JavaFX is the modern Java GUI toolkit. A typical app has one <code>Application</code> entry point, one or more FXML files describing scenes, and a controller class per FXML.' },
    { type: 'h', text: 'Entry point' },
    { type: 'code', code:
`public class MainApp extends Application {
    @Override
    public void start(Stage stage) throws Exception {
        Parent root = FXMLLoader.load(
            getClass().getResource("/fxml/login.fxml"));
        stage.setScene(new Scene(root, 480, 360));
        stage.setTitle("Arte de la Montaña");
        stage.show();
    }
    public static void main(String[] args) { launch(args); }
}` },
    { type: 'h', text: 'FXML scene' },
    { type: 'code', code:
`<!-- login.fxml -->
<VBox xmlns:fx="http://javafx.com/fxml"
      fx:controller="com.example.LoginController" spacing="10">
    <TextField     fx:id="user"     promptText="Username"/>
    <PasswordField fx:id="password" promptText="Password"/>
    <Button text="Sign in" onAction="#onLogin"/>
</VBox>` },
    { type: 'h', text: 'Controller' },
    { type: 'code', code:
`public class LoginController {
    @FXML private TextField     user;
    @FXML private PasswordField password;

    @FXML
    private void onLogin() {
        try {
            auth.login(user.getText(), password.getText());
            ...
        } catch (AuthenticationException e) {
            new Alert(Alert.AlertType.ERROR, e.getMessage()).show();
        }
    }
}` },
    { type: 'h', text: 'The application thread' },
    { type: 'p', text: 'Every UI update must happen on the JavaFX application thread. From a background thread:' },
    { type: 'code', code:
`Platform.runLater(() -> statusLabel.setText("Done"));` },
  ],
  pitfalls: [
    'Putting business logic in the controller — it makes the UI un-testable. Delegate to services.',
    'Mutating UI from a background thread — visible bugs and silent fails.',
    'Forgetting the <code>fx:controller</code> attribute → controller never wired.',
  ],
  takeaways: [
    'FXML separates layout from logic — keep controllers small, services do the work.',
    'All UI touches go through the JavaFX application thread.',
  ],
  miniQuiz: [
    { q: 'You need to update a Label from a background worker thread. What do you call?',
      options: ['<code>label.setText(...)</code> directly', '<code>Platform.runLater(() -> label.setText(...))</code>', '<code>SwingUtilities.invokeLater</code>', '<code>Thread.sleep(0)</code>'], answer: 1,
      explain: 'JavaFX requires all scene-graph mutations on its application thread; Platform.runLater queues a job onto it.' },
  ],
},

/* ===================================================================== */
{
  id: 'packaging', session: '20b', title: 'Compilation & Packaging',
  tag: 'Build & ship',
  objectives: [
    'Compile a multi-class project from the command line.',
    'Build a runnable JAR.',
    'Understand what Maven does for you.',
  ],
  sections: [
    { type: 'h', text: 'By hand' },
    { type: 'code', code:
`# compile every .java under src/main/java into out/
$ javac -d out $(find src/main/java -name "*.java")

# run from the compiled tree
$ java -cp out com.example.MainApp

# package into a jar with a manifest
$ jar --create --file app.jar --main-class com.example.MainApp -C out .

# run the jar
$ java -jar app.jar` },
    { type: 'h', text: 'Maven (the modern way)' },
    { type: 'code', code:
`<!-- pom.xml -->
<project>
    <modelVersion>4.0.0</modelVersion>
    <groupId>com.example</groupId>
    <artifactId>my-app</artifactId>
    <version>1.0.0</version>
    <properties>
        <maven.compiler.source>17</maven.compiler.source>
        <maven.compiler.target>17</maven.compiler.target>
    </properties>
    <dependencies>
        <dependency>
            <groupId>org.junit.jupiter</groupId>
            <artifactId>junit-jupiter</artifactId>
            <version>5.10.2</version>
            <scope>test</scope>
        </dependency>
    </dependencies>
</project>` },
    { type: 'code', code:
`$ mvn clean compile     # compile only
$ mvn test              # compile + run unit tests
$ mvn package           # build target/my-app-1.0.0.jar
$ mvn javafx:run        # (with the javafx-maven-plugin) run a JavaFX app` },
  ],
  pitfalls: [
    'Forgetting the manifest <code>Main-Class</code> entry — <code>java -jar</code> reports "no main manifest attribute".',
    'Mixing Java versions: compile with 17, run with 11 → <code>UnsupportedClassVersionError</code>.',
  ],
  takeaways: [
    'Maven handles dependencies, classpath and packaging — adopt it past the first lab.',
    'A runnable JAR has its main class declared in the manifest.',
  ],
  miniQuiz: [
    { q: 'Which Maven goal runs unit tests but does not build a JAR?',
      options: ['compile', 'test', 'package', 'install'], answer: 1,
      explain: 'mvn test compiles and runs tests. package goes further and builds the artifact.' },
  ],
},

/* ===================================================================== */
{
  id: 'testing', session: '21', title: 'Unit Testing with JUnit 5',
  tag: 'Build & ship',
  objectives: [
    'Write a JUnit 5 test class.',
    'Use the common assertion methods and lifecycle hooks.',
    'Test for thrown exceptions.',
  ],
  sections: [
    { type: 'h', text: 'A complete test class' },
    { type: 'code', code:
`import org.junit.jupiter.api.*;
import static org.junit.jupiter.api.Assertions.*;

class GradeTest {

    @Test
    void scoreToLetter() {
        assertEquals("A", Grade.fromScore(95).letter());
        assertEquals("C", Grade.fromScore(75).letter());
        assertEquals("F", Grade.fromScore(40).letter());
    }

    @Test
    void invalidScoreThrows() {
        assertThrows(IllegalArgumentException.class,
                     () -> Grade.fromScore(-1));
    }

    @BeforeEach
    void setUp() { /* fresh state for every test */ }

    @AfterAll
    static void tearDown() { /* once at the end */ }
}` },
    { type: 'h', text: 'Common assertions' },
    { type: 'table', headers: ['Assertion', 'Meaning'], rows: [
      ['assertEquals(exp, act)',     'Equality (uses .equals)'],
      ['assertSame(exp, act)',       'Same reference (==)'],
      ['assertTrue(cond)',           'Boolean is true'],
      ['assertThrows(Ex.class, ...)','Runnable throws that exception'],
      ['assertAll(...)',             'Run multiple assertions; report all failures'],
      ['assertTimeout(d, ...)',      'Block completes within Duration'],
    ]},
    { type: 'p', text: 'Use a temporary directory for tests that touch the file system:' },
    { type: 'code', code:
`@Test
void csvImportRoundTrip(@TempDir Path tmp) throws IOException {
    Path csv = tmp.resolve("art.csv");
    Files.writeString(csv, "title,year\\nCaracas,2026\\n");
    var rows = CsvService.parseCsv(Files.readString(csv));
    assertEquals(2, rows.size());
}` },
  ],
  pitfalls: [
    'Tests that depend on order — JUnit can run them in any order.',
    'Tests that share state via static fields — flaky, hard to debug.',
    'Asserting only on the happy path — also test the failure modes.',
  ],
  takeaways: [
    'One assertion per test ideal; many assertions allowed if related.',
    'Use <code>@TempDir</code> for any test that touches files.',
    'Test exceptions explicitly with <code>assertThrows</code>.',
  ],
  miniQuiz: [
    { q: 'Which assertion is correct for "this code should throw an exception"?',
      options: ['<code>assertThrows(MyEx.class, () -> code())</code>',
                '<code>assertTrue(throws MyEx)</code>',
                '<code>fail(MyEx.class)</code>',
                '<code>assertExceptional(code())</code>'], answer: 0,
      explain: 'JUnit 5 uses assertThrows with the exception class and an executable.' },
  ],
},

];
